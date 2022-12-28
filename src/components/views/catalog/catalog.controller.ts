import ControllerInterface from '../../../global/interfaces/controller.interface';
import ProductsService from '../../../global/services/products.service';
import CatalogView from './catalog.view';
import FilterParametersInterface from '../../../global/interfaces/filterParameters.interface';
import ProductInterface from '../../../global/interfaces/product.interface';
import BinService from '../../../global/services/bin.service';

export default class CatalogController implements ControllerInterface {
  constructor(
    private viewInstance: CatalogView,
    private prodService: ProductsService,
    private binService: BinService

  ) {
    window.addEventListener('hashchange', ((event: HashChangeEvent) => {
      this.prodService.updateFilterByUrl(event.newURL);
    }) as EventListener);
  }

  updateUrl(filterParam: string, value: string | { min: number; max: number }) {
    this.prodService.updateFilter(filterParam, value);
  }

  getFilterParameters(): FilterParametersInterface {
    return {
      categories: this.prodService.categories.map((value) => {
        return {
          name: value,
          totalCount: this.prodService.getCountByCategoty(value),
          filteredCount: this.prodService.getCountByCategotyFiltered(value),
          chacked: this.prodService.isCategiryInFilter(value),
        };
      }),
      brands: this.prodService.brands.map((value) => {
        return {
          name: value,
          totalCount: this.prodService.getCountByBrand(value),
          filteredCount: this.prodService.getCountByBrandFiltered(value),
          chacked: this.prodService.isBrandInFilter(value),
        };
      }),
      minPrice: {
        start: this.prodService.minPrice,
        current:
          this.prodService.getPriceFromFilter().min ||
          this.prodService.minPrice,
      },
      maxPrice: {
        start: this.prodService.maxPrice,
        current:
          this.prodService.getPriceFromFilter().max ||
          this.prodService.maxPrice,
      },
      minStock: {
        start: this.prodService.minStock,
        current:
          this.prodService.getStockFromFilter().min ||
          this.prodService.minStock,
      },
      maxStock: {
        start: this.prodService.maxStock,
        current:
          this.prodService.getStockFromFilter().max ||
          this.prodService.maxStock,
      },
    };
  }

  getProducts(products: ProductInterface[]) {
    return products.map((value) => {
      return {
        product: value,
        isAddedToBin: this.binService.countInBin(value.id) > 0,
      };
    });
  }
  initView() {
    this.prodService.updateFileredProducts(this.prodService.products);
    this.viewInstance.loadContent(
      'app',
      this.getProducts(this.prodService.productsFiltered),
      this.getFilterParameters(),
      this.updateUrl.bind(this)
    );
  }
}
