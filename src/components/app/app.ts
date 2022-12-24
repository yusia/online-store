import Router from '../router/router';
import Route from '../router/route';
import ProductView from '../views/product/product.view';
import ProductController from '../views/product/product.controller';
import DataService from '../../global/services/data.service';
import ProductsService from './../../global/services/products.service';
import CatalogView from '../views/catalog/catalog.view';
import CatalogController from '../views/catalog/catalog.controller';
import BinView from '../views/bin/bin.view';
import BinController from '../views/bin/bin.controller';

export default class App {
  private dataService: DataService | undefined;
  private productsService!: ProductsService;

  public async start() {
    this.dataService = new DataService('https://dummyjson.com/products');
    this.productsService = new ProductsService(this.dataService);
    await this.productsService.getProducts();
    await this.productsService.getFilterData();
    const router = new Router([
      new Route('bin', 'bin', new BinController(new BinView(), this.productsService)),
      new Route(
        'product',
        'product',
        new ProductController(new ProductView(), this.productsService)
      ),
      new Route(
        'catalog',
        'catalog',
        new CatalogController(new CatalogView(), this.productsService),
        true
      ),
    ]);
    router.init();
    this.setBinCount();
    window.addEventListener('binchanged', this.setBinCount);
  }

  private setBinCount() {
    const bin = document.getElementById('bin') as HTMLElement;
    bin.innerText = this.productsService.getCountAllProductInBin().toString();
  }
}
