import Router from "../router/router";
import Route from "../router/route";
import ProductView from "../views/product/product.view";
import ProductController from '../views/product/product.controller';
import DataService from "./../../global/services/dataService";
import ProductsService from "./../../global/services/products.service";
import CatalogView from '../views/catalog/catalog.view';
import CatalogController from '../views/catalog/catalog.controller';
import Bin from '../views/bin/bin.view'
import BinController from '../views/bin/bin.controller';

import ProductInterface from '../../global/interfaces/product.interface';
import ProductResponseInterface from '../../global/interfaces/productResponse.inteface';

export default class App {
  private dataService: DataService;
  private productService: ProductsService;
  public start(): void {
    this.dataService = new DataService('https://dummyjson.com/products');
    this.productService = new ProductsService(this.dataService);
    const router = new Router([
      new Route('bin', 'bin', new BinController(new Bin())),
      new Route('product', 'product', new ProductController(new ProductView(),this.productService)),
      new Route('catalog', 'catalog', new CatalogController(new CatalogView()), true),
    ]);
    router.init();

    this.dataService.getResp(showInfo);

    function showInfo(data: Response) {
      const productResponse = data as ProductResponseInterface;
      productResponse.products.forEach((value) => {
        const product = value as ProductInterface;
        console.log(
          `Title: ${product.title}, price: ${product.price}`,
          product.brand
        );
      });
    }
  }
}
