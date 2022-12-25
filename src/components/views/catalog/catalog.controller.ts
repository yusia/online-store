import ControllerInterface from '../../../global/interfaces/controller.interface';
import ProductsService from '../../../global/services/products.service';
import CatalogView from './catalog.view';
import FilterParametersInterface from '../../../global/interfaces/filterParameters.interface';
import ProductInterface from '../../../global/interfaces/product.interface';

export default class CatalogController implements ControllerInterface {
  constructor(
    private viewInstance: CatalogView,
    private prodService: ProductsService
  ) {
    window.addEventListener('binadded', ((e: CustomEvent) => {
      console.log('add to cart from catalog');
      this.prodService.addOneProdToBin(e.detail.productId);
    }) as EventListener);

    window.addEventListener('bindeleted', ((e: CustomEvent) => {
      this.prodService.deleteProdFromBin(e.detail.productId);
    }) as EventListener);

    window.addEventListener('hashchange', ((event: HashChangeEvent) => {
      this.prodService.updateFilterByUrl(event.newURL);
    }) as EventListener);
  }

  updateUrl(filterParam: string, value: string | number) {
    console.log(filterParam, value);
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
      minPrice: this.prodService.minPrice,
      maxPrice: this.prodService.maxPrice,
      minStock: this.prodService.minStock,
      maxStock: this.prodService.maxStock,
    };
  }

  getProducts(products: ProductInterface[]) {
    return products.map((value) => {
      return {
        product: value,
        isAddedToBin: this.prodService.countInBin(value.id) > 0,
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
