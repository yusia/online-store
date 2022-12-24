import ControllerInterface from '../../../global/interfaces/controller.interface';
import ProductsService from '../../../global/services/products.service';
import CatalogView from './catalog.view';
import FilterParametersInterface from '../../../global/interfaces/filterParameters.interface';

export default class CatalogController implements ControllerInterface {
  constructor(
    private viewInstance: CatalogView,
    private prodService: ProductsService
  ) {}

  initView() {
    const filterParams: FilterParametersInterface = {
      categories: this.prodService.categories,
      brands: this.prodService.brands,
      minPrice: this.prodService.minPrice,
      maxPrice: this.prodService.maxPrice,
      minStock: this.prodService.minStock,
      maxStock: this.prodService.maxStock,
    };
    this.viewInstance.loadContent(
      'app',
      this.prodService.products,
      filterParams
    );
  }
}
