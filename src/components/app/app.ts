import Router from '../router/router';
import Route from '../router/route';
import DataService from '../../services/dataService';

import CatalogView from '../views/catalog/catalog.view';
import Bin from '../views/bin/bin.view';

import ProductInterface from '../../global/interfaces/product.interface';
import ProductResponseInterface from '../../global/interfaces/productResponse.inteface';
export default class App {
  public start(): void {
    const router = new Router([
      new Route('bin', 'bin', new Bin()),
      new Route('catalog', 'catalog', new CatalogView(), true),
    ]);
    router.init();

    const ds: DataService = new DataService('https://dummyjson.com/products');

    ds.getResp(showInfo);

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
