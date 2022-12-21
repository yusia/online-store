import DataService from "./dataService";
export default class ProductsService {
  private products: string[];
  constructor(dataService: DataService) {
    dataService.load((data: Response) => { console.log(data) });
    this.products = ["hh", "ddd", "ijysl"];
  }
  getProductById(id: number): string {
    return this.products[id];
  }
}