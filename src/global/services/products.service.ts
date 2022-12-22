import ProductInterface from '../interfaces/product.interface';
import DataService from './dataService';
export default class ProductsService {
  private products: ProductInterface[];
  constructor(private dataService: DataService) {
    this.products = new Array<ProductInterface>();
  }

  async getProducts() {
    this.products = await this.dataService.getProducts();
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(id: number): ProductInterface | null {
    const prod = this.products.filter((p) => p.id === id)[0];
    return prod ?? null;
  }
}
