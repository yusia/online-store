import BaseController from '../../../global/classes/base.controller';
import ControllerInterface from '../../../global/interfaces/controller.interface';
import ProductsService from '../../../global/services/products.service';
import ProductView from './product.view';

export default class ProductController extends BaseController implements ControllerInterface {
  private viewParam = 'prodId';
  constructor(private viewInstance: ProductView, private prodService: ProductsService) {
    super();
    window.addEventListener('binadded', ((e: CustomEvent) => {
      this.prodService.addOneProdToBin(e.detail.productId);
    }) as EventListener);

    window.addEventListener('bindeleted', ((e: CustomEvent) => {
      this.prodService.deleteProdFromBin(e.detail.productId);
    }) as EventListener);
  }
  initView(params: URLSearchParams,) {
    const productId = +(params.get(this.viewParam) as string);//todo looks strange
    const product = this.prodService.getProductById(productId);
    if (product === null) {
      this.goToPageNotFound();
    }
    else {
      const isAddedToBin = this.prodService.countInBin(product.id) > 0;
      this.viewInstance.loadContent('app', product, isAddedToBin);
    }
  }

}