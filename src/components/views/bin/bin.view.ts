import { SelectedProductViewInterface } from '../../../global/interfaces/selectedProductView.interface';
import { BinParamsType } from '../../../global/type/binParamsType.type'
import content from '../bin/bin.html';
import { Modal } from 'bootstrap';
import ProductInterface from '../../../global/interfaces/product.interface';


export default class BinView {

  loadContent(rootElem: string, products: SelectedProductViewInterface[], params: BinParamsType): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    if (products.length === 0) {
      rootElemHtml.innerHTML = "<div>Cart is Empty</div>";
    } else {
      rootElemHtml.innerHTML = content;
      this.buildProductsList(products, 'bin-products-list', 'bin-item-id');
      this.bindPromoListener();
      this.setTotals(products);
      if (params.modal) {
        const myModal = new Modal('#infomodal');
        myModal.show();
      }
    }
  }

  private bindPromoListener() {
    document.getElementById('promo')?.addEventListener('click', () => {
      const promoInput = document.getElementById('promo-value') as HTMLInputElement;
      window.dispatchEvent(new CustomEvent('promocodeapplied',{
        detail: { productId: promoInput.value },
      }));
    });
  }

  private buildProductsList(products: SelectedProductViewInterface[], listId: string, itemId: string): void {
    const productList = document.getElementById(listId) as HTMLElement;
    const binItem = document.getElementById(itemId) as HTMLTemplateElement;
    let contentTemplate = "";
    products.forEach((productBin: SelectedProductViewInterface) => {
      contentTemplate += this.fillTemplate(productBin, binItem.innerHTML);
    });
    productList.innerHTML = contentTemplate;

    this.bindCountListener(products);
  }

  private bindCountListener(products: SelectedProductViewInterface[]): void { //todo refactoring! use delegation
    products.forEach((productBin: SelectedProductViewInterface) => {
      this.bindBtnListener(productBin.product as ProductInterface);
    });
  }

  private fillTemplate(product: object, template: string): string {
    const entries = Object.entries(product);
    for (const [key, value] of entries) {
      const isImages = Array.isArray(value);
      if (typeof value === 'object' && !isImages) template = this.fillTemplate(value, template);
      else {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
      }
    }
    return template;
  }
  private dispathEventCountChanged(newCount: number, prodId: number | undefined): void {
    const countInput = document.getElementById(`prod-count-${prodId}`) as HTMLInputElement;
    const prevCount = Number(countInput.value);
    if (prevCount !== newCount) {
      window.dispatchEvent(new CustomEvent("bincountchanged", {
        detail: { productId: prodId, count: newCount }
      }));
    }
  }

  private bindBtnListener(product: ProductInterface): void {
    document.getElementById(`counter-${product?.id}`)?.addEventListener('click', (e) => {

      const targetBtn = e.target as HTMLButtonElement;
      const countInput = document.getElementById(`prod-count-${product?.id}`) as HTMLInputElement;
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
        this.dispathEventCountChanged(+count, product?.id)
      }
    });
  }

  private setTotals(products: SelectedProductViewInterface[],): void {
    let count = 0, total = 0;

    products.forEach(item => {
      const price = item.product?.price ?? 0;
      total += price * item.totalCount;
      count += item.totalCount;
    });
    this.setCount('bin-sum', total);
    this.setCount('bin-count', count);
  }

  private setCount(elemId: string, count: number): void {
    const sumElem = document.getElementById(elemId) as HTMLDivElement;
    sumElem.innerText = count.toString();
  }
}
