import ControllerInterface from '../../../global/interfaces/controller.interface';
import ProductsService from '../../../global/services/products.service';
import CatalogView from './catalog.view';

export default class CatalogController implements ControllerInterface {
  constructor(
    private viewInstance: CatalogView,
    private prodService: ProductsService
  ) {}

  initView() {
    const products = this.prodService.getAllProducts();
    this.viewInstance.loadContent('app', products);
  }
}
