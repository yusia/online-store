import ControllerInterface from '../../../global/interfaces/controller.interface';
import ProductsService from '../../../global/services/products.service';
import ProductView from './product.view';

export default class ProductController implements ControllerInterface {
  private filterParam = 'prodId';
  constructor(private viewInstance: ProductView, private prodService: ProductsService) {

  }

  initView(params: URLSearchParams,) {
    const productId = +(params.get(this.filterParam) as string);//todo looks strange
    const product = this.prodService.getProductById(productId);
    if (product === null) {
      window.dispatchEvent(new Event('route-changed'));
    }
    else {
      this.viewInstance.loadContent('app', product);

    }
  }
}