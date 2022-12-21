import ControllerInterface from '../../../global/interfaces/controller.interface';
import View from '../../../global/interfaces/view.interface'
import ProductsService from '../../../global/services/products.service';
//import DataService from '../../../global/services/dataService';

export default class ProductController implements ControllerInterface {
  private filterParam = 'prodId';
  constructor(private viewInstance: View, private prodService: ProductsService) {

  }

  initView(params: URLSearchParams) {
    const productId = +(params.get(this.filterParam) as string);//todo looks strange
    const name = ProductsService.getProductById(productId);
    this.viewInstance.loadContent('app', [productId, name]);
  }
}