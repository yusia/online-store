import ProductInterface from "../interfaces/product.interface";
import DataService from "./dataService";
export default class ProductsService {
  private products: ProductInterface[];
  constructor(dataService: DataService) {
    dataService.load((data: Response) => { console.log(data) });
    this.products = [{
      brand: "brand",
      category: "category",
      description: 'description',
      discountPercentage: 10,
      id: 1,
      images: ['images1', 'images2'],
      price: 33,
      rating: 1,
      stock: 10,
      thumbnail: 'thumbnail',
      title: "title",
    }]
  }
  getProductById(id: number): ProductInterface {
    const tempProd: ProductInterface = {
      brand: "brand",
      category: "category",
      description: 'description',
      discountPercentage: 10,
      id: id,
      images: ['images1', 'images2'],
      price: 33,
      rating: 1,
      stock: 10,
      thumbnail: 'thumbnail',
      title: "title",
    };
    const prod=this.products.filter(p => p.id === id)[0];
    return  prod ?? tempProd;
  }
}