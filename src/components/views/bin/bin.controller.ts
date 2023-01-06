import ControllerInterface from '../../../global/interfaces/controller.interface';
import { SelectedProductViewInterface } from '../../../global/interfaces/selectedProductView.interface';
import ProductsService from '../../../global/services/products.service';
import BinService from '../../../global/services/bin.service';
import BinView from './bin.view';
import BaseController from '../../../global/classes/base.controller';
import PromoService from '../../../global/services/promo.service';

export default class BinController
  extends BaseController
  implements ControllerInterface {
  private viewParam = 'modal';
  constructor(private viewInstance: BinView,
    private prodService: ProductsService,
    private binService: BinService,
    private promoService: PromoService
  ) {
    super();
    this.bindCountChangedListener();
    this.binPromoAppliedListener();
    this.bindOrderPaidListener();
  }

  private bindCountChangedListener() {
    window.addEventListener('bincountchanged', ((e: CustomEvent) => {
      this.binService.changeCountProdInBin(e.detail.productId, Number(e.detail.count));
      this.viewInstance.loadContent(
        'app',
        this.getBinProductModel(),
        {
          modal: false,
        },
        this.promoService.getPromoList(),
        this.promoService.getSelectedPromoList()
      );
    }) as EventListener);
  }

  private binPromoAppliedListener() {
    window.addEventListener('promoApplyChanged', ((e: CustomEvent) => {
      console.log(e.detail.action, e.detail.promoId);
      switch (e.detail.action) {
        case 'add': {
          this.promoService.addPromoToSelected(e.detail.promoId);
          break;
        }
        case 'drop': {
          this.promoService.deletePromoFromSelected(e.detail.promoId);
          break;
        }
      }
      this.viewInstance.loadContent(
        'app',
        this.getBinProductModel(),
        {
          modal: false,
        },
        this.promoService.getPromoList(),
        this.promoService.getSelectedPromoList()
      );
    }) as EventListener);
  }

  private bindOrderPaidListener() {
    window.addEventListener('orderpaid', () => {
      this.binService.cleanBin();
      this.promoService.cleanSavedPromo();
      this.goToInitPage();
    });
  }

  private goToInitPage() {
    window.location.href = window.location.origin;
  }

  private getBinProductModel(): SelectedProductViewInterface[] {
    const selectedProducts: SelectedProductViewInterface[] = [];
    this.binService.selectedProducts.forEach((value, key) => {
      const prod = this.prodService.getProductById(key);
      selectedProducts.push({
        product: prod,
        totalCount: value,
        totalPrice: value * (prod?.price ?? 0),
      });
    });
    return selectedProducts;
  }

  initView(params: URLSearchParams) {
    const showModal = params?.get(this.viewParam) === 'true';
    if (showModal === true || params === undefined) {
      this.viewInstance.loadContent(
        'app',
        this.getBinProductModel(),
        {
          modal: showModal,
        },
        this.promoService.getPromoList(),
        this.promoService.getSelectedPromoList()
      );
    } else {
      this.goToPageNotFound();
    }
  }
}
