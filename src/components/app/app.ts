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
import SearchParamService from '../../global/services/searchParam.service';
import PromoService from '../../global/services/promo.service';

export default class App {
  private dataService: DataService | undefined;
  private productsService: ProductsService;
  private binService: BinService;
  private paramService: SearchParamService;
  private promoService: PromoService;

  constructor() {
    this.dataService = new DataService('https://dummyjson.com/products');
    this.productsService = new ProductsService(this.dataService);
    this.binService = new BinService(this.productsService);
    this.paramService = new SearchParamService();
    this.promoService = new PromoService();
  }
  public async start() {
    await this.productsService.getProducts();
    await this.productsService.getFilterData();
    this.setBinCount();
    const router = new Router([
      new Route(
        'bin',
        new BinController(
          new BinView(),
          this.productsService,
          this.binService,
          this.promoService
        )
      ),
      new Route(
        'product',
        new ProductController(
          new ProductView(),
          this.productsService,
          this.binService
        )
      ),
      new Route(
        'catalog',
        new CatalogController(
          new CatalogView(),
          this.productsService,
          this.binService,
          this.paramService
        ),
        true
      ),
    ]);
    router.init();
    this.subscribeBinEvent();
  }

  private subscribeBinEvent() {
    window.addEventListener('binchanged', this.setBinCount.bind(this));

    window.addEventListener('binadded', ((e: CustomEvent) => {
      this.binService.addOneProdToBin(e.detail.productId);
    }) as EventListener);

    window.addEventListener('bindeleted', ((e: CustomEvent) => {
      this.binService.deleteProdFromBin(e.detail.productId);
    }) as EventListener);
  }

  private setBinCount() {
    const bin = document.getElementById('bin') as HTMLElement;
    bin.innerText = this.binService.getCountAllProductInBin().toString();

    const binTotal = document.getElementById('bin-total') as HTMLElement;
    binTotal.innerText = this.binService.getBinTotalPrice().toString();
  }
}
