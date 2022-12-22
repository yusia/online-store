import ProductInterface from '../interfaces/product.interface';
import DataService from './dataService';
export default class ProductsService {
  private _products: ProductInterface[] = [];
  private bin: number[] = [];

  constructor(private dataService: DataService) {}

  async getProducts() {
    this._products = await this.dataService.getProducts();
  }

  get products() {
    return this._products;
  }

  getProductById(id: number): ProductInterface | null {
    const prod = this._products.filter((p) => p.id === id)[0];
    return prod ?? null;
  }

  addToBin(productId: number) {
    //  this.bin.push(productId);
    console.log('item added:', productId);
  }
  deleteFromBin(productId: number) {
    console.log('item deleted:', productId);
    //  this.bin.(productId);
  }
  countInBin(productId: number): number {
    return this.bin.filter((p) => p === productId).length;
  }
}
