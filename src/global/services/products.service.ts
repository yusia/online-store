import ProductInterface from '../interfaces/product.interface';
import DataService from './data.service';
import { BinStorageType } from '../interfaces/selectedProductView.interface'
export default class ProductsService {
  private storageKey = 'bin';
  private _products: ProductInterface[] = [];
  private _categories: [] = [];
  private _brands: string[] = [];
  private bin: Map<number, number> = new Map();
  private _minPrice = 0;
  private _maxPrice = 0;
  private _minStock = 0;
  private _maxStock = 0;

  constructor(private dataService: DataService) {
    this.bin = this.getBinFromLocalStrg();
  }
  
  private getBinFromLocalStrg(): Map<number, number> {
    const bin = new Map();
    const binStrgJson = localStorage.getItem(this.storageKey);
    const binStrg: BinStorageType[] = binStrgJson ? JSON.parse(binStrgJson) : [];
    binStrg.forEach((item) => {
      if (item.count > 0) {
        bin.set(item.id, item.count);
      }
    })
    return bin;
  }
  get selectedProducts(): Map<number, number> {
    return this.bin;
  }
  get products() {
    return this._products;
  }

  get categories() {
    return this._categories;
  }

  get brands() {
    return this._brands;
  }

  get minPrice() {
    return this._minPrice;
  }

  get maxPrice() {
    return this._maxPrice;
  }

  get minStock() {
    return this._minStock;
  }

  get maxStock() {
    return this._maxStock;
  }

  async getProducts() {
    this._products = await this.dataService.getProducts();
  }

  async getFilterData() {
    await this.getCategories();
    this.getBrands();
    this.getPrices();
    this.getStocks();
  }

  async getCategories() {
    this._categories = await this.dataService.getCategoties();
  }

  getBrands() {
    this._brands = Array.from(
      new Set(this._products.map((product) => product.brand))
    );
  }

  getPrices() {
    this._minPrice = Math.min(
      ...this._products.map((product) => product.price)
    );
    this._maxPrice = Math.max(
      ...this._products.map((product) => product.price)
    );
  }

  getStocks() {
    this._minStock = Math.min(
      ...this._products.map((product) => product.stock)
    );
    this._maxStock = Math.max(
      ...this._products.map((product) => product.stock)
    );
  }

  getProductById(id: number): ProductInterface | null {
    const prod = this._products.filter((p) => p.id === id)[0];
    return prod ?? null;
  }

  private saveBinToLocalStrg(): void {
    const binJson: BinStorageType[] = [];
    this.bin.forEach((value, key) => {
      if (value > 0) {
        binJson.push({ id: key, count: value });
      }
    });
    localStorage.setItem('bin', JSON.stringify(binJson));
    window.dispatchEvent(new CustomEvent('binchanged'));
  }

  addOneProdToBin(productId: number): void {
    this.bin.set(productId, 1);
    this.saveBinToLocalStrg();
  }

  deleteProdFromBin(productId: number) {
    this.bin.delete(productId);
    this.saveBinToLocalStrg();
  }

  changeCountProdInBin(productId: number, value: number) {
    this.bin.set(productId, value);
    this.saveBinToLocalStrg();
  }

  countInBin(productId: number): number {
    return this.bin.get(productId) ?? 0;
  }

  getCountAllProductInBin(): number {
    let count = 0;

    this.bin.forEach((value) => {
      count += value;
    });
    return count;
  }

  getCountByCategoty(category: string) {
    return this._products.filter((value) => value.category === category).length;
  }

  getCountByBrand(brand: string) {
    return this._products.filter((value) => value.brand === brand).length;
  }
}
