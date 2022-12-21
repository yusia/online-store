import DataService from "./dataService";
export default class ProductsService {
  private products: string[];
  constructor(dataService: DataService) {
    dataService.load((data:Response)=>{console.log(data)});
   //this.products = dataService.load();
  }
  static getProductById(id: number): string {
    const productsName = ["hh", "ddd", "ijysl"];
    return productsName[id];
  }
}