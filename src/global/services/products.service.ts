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
      images: [
        "https://i.dummyjson.com/data/products/8/1.jpg",
        "https://i.dummyjson.com/data/products/8/2.jpg",
        "https://i.dummyjson.com/data/products/8/3.jpg",
        "https://i.dummyjson.com/data/products/8/4.jpg"
      ],
      price: 33,
      rating: 1,
      stock: 10,
      thumbnail: 'thumbnail',
      title: "title",
    }]
  }
  getProductById(id: number): ProductInterface {
    const tempProd: ProductInterface = {
      brand: "brand tempProd",
      category: "category tempProd",
      description: 'description tempProd',
      discountPercentage: 10,
      id: id,
      images: ["https://i.dummyjson.com/data/products/1/1.jpg", "https://i.dummyjson.com/data/products/1/2.jpg"],
      price: 33,
      rating: 1,
      stock: 10,
      thumbnail: 'thumbnail',
      title: "title",
    };
    const prod = this.products.filter(p => p.id === id)[0];
    return prod ?? tempProd;
  }
}