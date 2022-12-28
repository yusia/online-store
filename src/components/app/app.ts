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
import BinService from '../../global/services/bin.service';

export default class App {
  private dataService: DataService | undefined;
  private productsService!: ProductsService;
  private binService!: BinService;
  
  public async start() {
    this.dataService = new DataService('https://dummyjson.com/products');
    this.productsService = new ProductsService(this.dataService);
    await this.productsService.getProducts();
    await this.productsService.getFilterData();
    this.binService = new BinService(this.productsService);
    this.setBinCount();
    const router = new Router([
      new Route('bin', new BinController(new BinView(), this.productsService, this.binService)),
      new Route(
        'product',
        new ProductController(new ProductView(), this.productsService,this.binService, )
      ),
      new Route(
        'catalog',
        new CatalogController(new CatalogView(), this.productsService,this.binService, ),
        true
      ),
    ]);
    router.init();
    window.addEventListener('binchanged', this.setBinCount.bind(this));
  }

  private setBinCount() {
    const bin = document.getElementById('bin') as HTMLElement;
    bin.innerText = this.binService.getCountAllProductInBin().toString();

    const binTotal = document.getElementById('bin-total') as HTMLElement;
    binTotal.innerText = this.binService.getBinTotalPrice().toString();
  }
}
