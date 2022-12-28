import ProductInterface from '../interfaces/product.interface';
import DataService from './data.service';
import { BinStorageType } from '../interfaces/selectedProductView.interface';
export default class ProductsService {
  private storageKey = 'bin';
  private _products: ProductInterface[] = [];
  private _productsFiltered: ProductInterface[] = [];
  private _categories: [] = [];
  private _brands: string[] = [];
  private bin: Map<number, number> = new Map();
  private _minPrice = 0;
  private _maxPrice = 0;
  private _minStock = 0;
  private _maxStock = 0;
  private _filter: {
    categories: string[];
    brands: string[];
    minPrice: number;
    maxPrice: number;
    minStock: number;
    maxStock: number;
  };

  constructor(private dataService: DataService) {
    this.bin = this.getBinFromLocalStrg();
    this._filter = {
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 0,
      minStock: 0,
      maxStock: 0,
    };

    this.updateFilterByUrl(window.location.href);
  }

  private getBinFromLocalStrg(): Map<number, number> {
    const bin = new Map();
    const binStrgJson = localStorage.getItem(this.storageKey);
    const binStrg: BinStorageType[] = binStrgJson
      ? JSON.parse(binStrgJson)
      : [];
    binStrg.forEach((item) => {
      if (item.count > 0) {
        bin.set(item.id, item.count);
      }
    });
    return bin;
  }
  get selectedProducts(): Map<number, number> {
    return this.bin;
  }
  get products() {
    return this._products;
  }

  get productsFiltered() {
    return this._productsFiltered;
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

  getCountByCategotyFiltered(category: string) {
    return this._productsFiltered.filter((value) => value.category === category)
      .length;
  }

  getCountByBrand(brand: string) {
    return this._products.filter((value) => value.brand === brand).length;
  }

  getCountByBrandFiltered(brand: string) {
    return this._productsFiltered.filter((value) => value.brand === brand)
      .length;
  }

  updateFilterByCategory(category: string) {
    console.log(category);
  }

  updateFilterByUrl(url: string) {
    const params = new URLSearchParams(`?${url.split('?')[1]}`);
    this._filter.categories = params.getAll('category');
    this._filter.brands = params.getAll('brand');
    if (params.get('price')) {
      this._filter.minPrice = Number(params.get('price')?.split('↕')[0]);
      this._filter.maxPrice = Number(params.get('price')?.split('↕')[1]);
    }

    if (params.get('stock')) {
      this._filter.minStock = Number(params.get('stock')?.split('↕')[0]);
      this._filter.maxStock = Number(params.get('stock')?.split('↕')[1]);
    }
  }

  isCategiryInFilter(category: string): boolean {
    return this._filter.categories.includes(category);
  }

  isBrandInFilter(brand: string): boolean {
    return this._filter.brands.includes(brand);
  }

  getPriceFromFilter(): { min: number; max: number } {
    return {
      min:
        this._filter.minPrice >
        Math.min(...this._productsFiltered.map((product) => product.price))
          ? this._filter.minPrice
          : Math.min(...this._productsFiltered.map((product) => product.price)),
      max:
        this._filter.maxPrice <
        Math.max(...this._productsFiltered.map((product) => product.price))
          ? this._filter.maxPrice
          : Math.max(...this._productsFiltered.map((product) => product.price)),
    };
  }

  getStockFromFilter(): { min: number; max: number } {
    return {
      min:
        this._filter.minStock >
        Math.min(...this._productsFiltered.map((product) => product.stock))
          ? this._filter.minStock
          : Math.min(...this._productsFiltered.map((product) => product.stock)),
      max:
        this._filter.maxStock <
        Math.max(...this._productsFiltered.map((product) => product.stock))
          ? this._filter.maxStock
          : Math.max(...this._productsFiltered.map((product) => product.stock)),
    };
  }

  updateFileredProducts(products: ProductInterface[]) {
    console.log('update filtered products');
    this._productsFiltered = this.filterProductsByCategory(products);
    this._productsFiltered = this.filterProductsByBrand(this._productsFiltered);
    this._productsFiltered = this.filterProductsByPrice(this._productsFiltered);
    this._productsFiltered = this.filterProductsByStock(this._productsFiltered);
    console.log(this._productsFiltered);
  }

  filterProductsByCategory(products: ProductInterface[]): ProductInterface[] {
    console.log(this._filter.categories);
    if (this._filter.categories.length == 0) {
      return products;
    } else {
      return products.filter((product) =>
        this._filter.categories.includes(product.category)
      );
    }
  }

  filterProductsByBrand(products: ProductInterface[]): ProductInterface[] {
    console.log(this._filter.brands);
    if (this._filter.brands.length == 0) {
      return products;
    } else {
      return products.filter((product) =>
        this._filter.brands.includes(product.brand)
      );
    }
  }

  filterProductsByPrice(products: ProductInterface[]): ProductInterface[] {
    let result = products;
    if (this._filter.minPrice)
      result = result.filter(
        (product) => product.price >= this._filter.minPrice
      );
    if (this._filter.maxPrice)
      result = result.filter(
        (product) => product.price <= this._filter.maxPrice
      );
    return result;
  }

  filterProductsByStock(products: ProductInterface[]): ProductInterface[] {
    let result = products;
    if (this._filter.minStock)
      result = result.filter(
        (product) => product.stock >= this._filter.minStock
      );
    if (this._filter.maxStock)
      result = result.filter(
        (product) => product.stock <= this._filter.maxStock
      );
    return result;
  }

  updateUrl() {
    const paramArray: string[] = [];
    paramArray.push(
      ...this._filter.categories.map((value) => `category=${value}`)
    );
    paramArray.push(...this._filter.brands.map((value) => `brand=${value}`));
    if (this._filter.minPrice && this._filter.maxPrice) {
      paramArray.push(
        `price=${this._filter.minPrice}↕${this._filter.maxPrice}`
      );
    }
    if (this._filter.minStock && this._filter.maxStock) {
      paramArray.push(
        `stock=${this._filter.minStock}↕${this._filter.maxStock}`
      );
    }

    const newUrl =
      window.location.href.split('?')[0] + '?' + paramArray.join('&');

    window.location.replace(newUrl);
  }

  updateFilter(
    filterParam: string,
    value: string | { min: number; max: number }
  ) {
    switch (filterParam) {
      case 'category': {
        if (!this._filter.categories.includes(value as string)) {
          this._filter.categories.push(value as string);
        } else
          this._filter.categories = this._filter.categories.filter(
            (category) => category != value
          );
        break;
      }
      case 'brand': {
        if (!this._filter.brands.includes(value as string)) {
          this._filter.brands.push(value as string);
        } else
          this._filter.brands = this._filter.brands.filter(
            (brand) => brand != value
          );
        break;
      }

      case 'price': {
        this._filter.minPrice = (value as { min: number; max: number }).min;
        this._filter.maxPrice = (value as { min: number; max: number }).max;
        break;
      }
      case 'stock': {
        this._filter.minStock = (value as { min: number; max: number }).min;
        this._filter.maxStock = (value as { min: number; max: number }).max;
        break;
      }
    }
    this.updateUrl();
  }
}
