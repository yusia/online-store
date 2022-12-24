import ControllerInterface from '../../../global/interfaces/controller.interface';
import {SelectedProductViewInterface} from '../../../global/interfaces/selectedProductView.interface';
import ProductsService from '../../../global/services/products.service';
import BinView from './bin.view';

export default class BinController implements ControllerInterface {
  constructor(private viewInstance: BinView,
    private prodService: ProductsService) {

  }
  private getBinProductModel(): SelectedProductViewInterface[] {
    const selectedProducts: SelectedProductViewInterface[] = [];
    this.prodService.selectedProducts.forEach((value, key) => {
      selectedProducts.push({ product: this.prodService.getProductById(key), count: value })
    });
    return selectedProducts;
  }

  initView() {
    this.viewInstance.loadContent('app', this.getBinProductModel());
  }

}