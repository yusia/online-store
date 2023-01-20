import BaseController from '../../../global/classes/base.controller';
import ControllerInterface from '../../../global/interfaces/controller.interface';
import BinService from '../../../global/services/bin.service';
import ProductsService from '../../../global/services/products.service';
import ProductView from './product.view';

export default class ProductController extends BaseController implements ControllerInterface {
  private viewParam = 'prodId';
  constructor(private viewInstance: ProductView, private prodService: ProductsService,
    private binService: BinService) {
    super();
  }
  initView(params: URLSearchParams,) {
    const isAbleParam = params.has(this.viewParam);
    if (isAbleParam) {
      const productId = +(params.get(this.viewParam) as string);
      const product = this.prodService.getProductById(productId);
      if (product === null) {
        this.goToPageNotFound();
      }
      else {
        const isAddedToBin = this.binService.countInBin(product.id) > 0;
        this.viewInstance.loadContent('app', product, isAddedToBin);
      }

    }
  }

}