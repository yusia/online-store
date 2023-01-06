import { SelectedProductViewInterface } from '../../../global/interfaces/selectedProductView.interface';
import { BinParamsType } from '../../../global/type/binParamsType.type';
import content from '../bin/bin.html';
import checkoutHtml from '../bin/checkout.html';
import { Modal, Toast } from 'bootstrap';
import ProductInterface from '../../../global/interfaces/product.interface';
import PromoInterface from '../../../global/interfaces/promo.interface';

export default class BinView {
  private promoList: PromoInterface[] = [];
  private selectedPromoList: PromoInterface[] = [];
  private modal!: Modal;

  loadContent(
    rootElem: string,
    products: SelectedProductViewInterface[],
    params: BinParamsType,
    promoList: PromoInterface[],
    selectedPromoList: PromoInterface[]
  ): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    if (products.length === 0) {
      rootElemHtml.innerHTML = '<div>Cart is Empty</div>';
    } else {
      rootElemHtml.innerHTML = content;

      const modal = rootElemHtml.querySelector('#infomodal') as HTMLElement;
      modal.innerHTML = checkoutHtml;
      this.bindPayClickListener();
      this.addOpenModalListener();

      this.buildProductsList(products, 'bin-products-list', 'bin-item-id');
      this.bindPromoListener();
      this.bindPromoValueListener();
      this.setTotals(products, selectedPromoList);
      this.setSelectedPromoList(selectedPromoList);
      if (params.modal) {
        this.createModal();
      }

      this.promoList = promoList;
      this.selectedPromoList = selectedPromoList;
    }


  }
  private createModal(): void {
    this.modal = new Modal('#infomodal');
    this.modal.show();
  }
  private bindPromoListener() {
    document.getElementById('promo')?.addEventListener('click', () => {
      const promoInput = document.getElementById(
        'promo-value'
      ) as HTMLInputElement;
      window.dispatchEvent(
        new CustomEvent('promocodeapplied', {
          detail: { productId: promoInput.value },
        })
      );
    });
  }
  private addOpenModalListener() {
    document.getElementById('buy-all')?.addEventListener('click', () => {
      this.createModal();
    });
  }
  private bindPromoValueListener() {
    document
      .getElementById('promo-value')
      ?.addEventListener('input', (e: Event) => {
        this.dispatchPromoValueChanged((e.target as HTMLInputElement).value);
      });
  }

  private buildProductsList(
    products: SelectedProductViewInterface[],
    listId: string,
    itemId: string
  ): void {
    const productList = document.getElementById(listId) as HTMLElement;
    const binItem = document.getElementById(itemId) as HTMLTemplateElement;
    let contentTemplate = '';
    products.forEach((productBin: SelectedProductViewInterface) => {
      contentTemplate += this.fillTemplate(productBin, binItem.innerHTML);
    });
    productList.innerHTML = contentTemplate;

    this.bindCountListener(products);
  }

  private bindCountListener(products: SelectedProductViewInterface[]): void {
    //todo refactoring! use delegation
    products.forEach((productBin: SelectedProductViewInterface) => {
      this.bindBtnListener(productBin.product as ProductInterface);
    });
  }

  private fillTemplate(product: object, template: string): string {
    const entries = Object.entries(product);
    for (const [key, value] of entries) {
      const isImages = Array.isArray(value);
      if (typeof value === 'object' && !isImages)
        template = this.fillTemplate(value, template);
      else {
        template = template.replace(
          new RegExp(`{{${key}}}`, 'g'),
          value.toString()
        );
      }
    }
    return template;
  }
  private dispathEventCountChanged(
    newCount: number,
    prodId: number | undefined
  ): void {
    const countInput = document.getElementById(
      `prod-count-${prodId}`
    ) as HTMLInputElement;
    const prevCount = Number(countInput.value);
    if (prevCount !== newCount) {
      window.dispatchEvent(
        new CustomEvent('bincountchanged', {
          detail: { productId: prodId, count: newCount },
        })
      );
    }
  }

  private dispatchPromoValueChanged(promoValue: string): void {
    const promo = this.promoList.find((x) => x.title === promoValue);
    const foundPromoElement = document.getElementById(
      'found-promo'
    ) as HTMLElement | null;
    if (foundPromoElement) {
      const foundPromoValueElemet = foundPromoElement.querySelector(
        '#found-promo-value'
      ) as HTMLElement | null;
      if (promo) {
        foundPromoElement.classList.remove('hide');
        if (foundPromoValueElemet)
          foundPromoValueElemet.innerHTML = `${promo.title}: ${promo.percent}%`;
        const foundPromoBtnElemet = foundPromoElement.querySelector(
          '#found-promo-btn'
        ) as HTMLElement | null;
        if (foundPromoBtnElemet) {
          if (this.selectedPromoList.map((x) => x.id).includes(promo.id)) {
            foundPromoBtnElemet.classList.add('hide');
          } else {
            foundPromoBtnElemet.classList.remove('hide');
          }
          foundPromoBtnElemet.addEventListener('click', () => {
            window.dispatchEvent(
              new CustomEvent('promoApplyChanged', {
                detail: { promoId: promo?.id, action: 'add' },
              })
            );
          });
        }
      } else {
        foundPromoElement.classList.add('hide');
      }
    }
  }

  private bindBtnListener(product: ProductInterface): void {
    document
      .getElementById(`counter-${product?.id}`)
      ?.addEventListener('click', (e) => {
        const targetBtn = e.target as HTMLButtonElement;
        const countInput = document.getElementById(
          `prod-count-${product?.id}`
        ) as HTMLInputElement;
        let count = Number(countInput.value);

        if (targetBtn.id === `min-btn-${product?.id}`) {
          count--;
        } else if (targetBtn.id === `plus-btn-${product?.id}`) {
          count++;
        }

        if (count > product?.stock) {
          countInput.classList.add('is-invalid');
        } else {
          countInput.classList.remove('is-invalid');
          this.dispathEventCountChanged(+count, product?.id);
        }
      });
  }

  private setTotals(
    products: SelectedProductViewInterface[],
    promos: PromoInterface[]
  ): void {
    let count = 0,
      total = 0,
      withPromo = 0;

    products.forEach((item) => {
      const price = item.product?.price ?? 0;
      total += price * item.totalCount;
      count += item.totalCount;
    });

    if (promos.length !== 0) {
      const percent = promos.reduce((sum, value) => sum + value.percent, 0);
      withPromo = (total * (100 - percent)) / 100;
    }

    this.setCount('bin-sum', total);
    this.setCount('bin-count', count);
    this.setCount('bin-promo', withPromo);
  }

  private setCount(elemId: string, count: number): void {
    const sumElem = document.getElementById(elemId) as HTMLDivElement;
    sumElem.innerText = count.toString();
  }

  private setSelectedPromoList(selectedPromoList: PromoInterface[]): void {
    const selectedPromoListElement = document.getElementById(
      'selected-promo-list'
    ) as HTMLElement | null;
    if (selectedPromoListElement) {
      if (selectedPromoList.length !== 0) {
        selectedPromoListElement.classList.remove('hide');
        selectedPromoList.forEach((x) =>
          this.createPromoElement(x, selectedPromoListElement)
        );
      } else {
        selectedPromoListElement.classList.add('hide');
      }
    }
  }

  private createPromoElement(promo: PromoInterface, container: HTMLElement) {
    const promoContainer = document.createElement('div') as HTMLElement;
    promoContainer.classList.add(
      ...[
        'input-group',
        'd-flex',
        'w-100',
        'justify-content-between',
        'list-group-item',
      ]
    );
    container.append(promoContainer);

    const valueElem = document.createElement('div') as HTMLElement;
    valueElem.innerHTML = `${promo.title}: ${promo.percent}%`;
    valueElem.classList.add('form-control');
    promoContainer.append(valueElem);

    const btn = document.createElement('button') as HTMLInputElement;
    btn.classList.add(...['btn-outline-secondary', 'btn']);
    btn.type = 'button';
    btn.innerHTML = 'Drop';
    btn.addEventListener('click', () => {
      window.dispatchEvent(
        new CustomEvent('promoApplyChanged', {
          detail: { promoId: promo?.id, action: 'drop' },
        })
      );
    });
    promoContainer.append(btn);
  }

  private bindPayClickListener() {
    const payBtn = document.getElementById('pay-btn');
    payBtn?.addEventListener('click', () => {
      const toastLiveExample = document.getElementById('liveToast') as HTMLElement;
      const toast = new Toast(toastLiveExample);
      toast.show();
      this.modal.hide();
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('orderpaid')
        );
      }, 3000);
    });
  }
}
