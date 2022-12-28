import ControllerInterface from '../../../global/interfaces/controller.interface';
import { SelectedProductViewInterface } from '../../../global/interfaces/selectedProductView.interface';
import ProductsService from '../../../global/services/products.service';
import BinService from '../../../global/services/bin.service';
import BinView from './bin.view';
import BaseController from '../../../global/classes/base.controller'

export default class BinController extends BaseController implements ControllerInterface {
  private viewParam = 'modal';
  constructor(private viewInstance: BinView, private prodService: ProductsService, private binService: BinService) {
    super();

    window.addEventListener('bincountchanged', ((e: CustomEvent) => {
      this.binService.changeCountProdInBin(e.detail.productId, Number(e.detail.count));
    }) as EventListener);
  }
  
  private getBinProductModel(): SelectedProductViewInterface[] {
    const selectedProducts: SelectedProductViewInterface[] = [];
    this.binService.selectedProducts.forEach((value, key) => {
      selectedProducts.push({ product: this.prodService.getProductById(key), total: value })
    });
    return selectedProducts;
  }

  initView(params: URLSearchParams) {
    const showModal = params?.get(this.viewParam) === 'true';
    if (showModal === true || params === undefined) {
      this.viewInstance.loadContent('app', this.getBinProductModel(), { modal: showModal });
    } else {
      this.goToPageNotFound();
    }
  }

}