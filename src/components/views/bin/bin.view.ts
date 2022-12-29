import { SelectedProductViewInterface } from '../../../global/interfaces/selectedProductView.interface';
import { BinParamsType } from '../../../global/type/binParamsType.type'
import content from '../bin/bin.html';
import { Modal } from 'bootstrap';


export default class BinView {

  loadContent(rootElem: string, products: SelectedProductViewInterface[], params: BinParamsType): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    if (products.length === 0) {
      rootElemHtml.innerHTML = "<div>Cart is Empty</div>";
    } else {
      rootElemHtml.innerHTML = content;
      this.buildProductsList(products, 'bin-products-list', 'bin-item-id');

      this.setTotalSum(products);
      if (params.modal) {
        const myModal = new Modal('#staticBackdrop');
        myModal.show();
      }
    }
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
      this.bindBtnListener(productBin.product?.id);
      this.bindInputListener(productBin.product?.id);
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
  private bindInputListener(productId: number| undefined): void {
    document.getElementById(`prod-count-${productId}`)?.addEventListener('input', (e) => {
      const count = (e.target as HTMLInputElement).value;
      this.dispathEventCountChanged(+count, productId)
    });
  }

  private bindBtnListener(productId: number| undefined): void {
    document.getElementById(`counter-${productId}`)?.addEventListener('click', (e) => {

      const targetBtn = e.target as HTMLButtonElement;
      const countInput = document.getElementById(`prod-count-${productId}`) as HTMLInputElement;
      let count = Number(countInput.value);
      if (targetBtn.id === `min-btn-${productId}`) {
        count--;
      } else if (targetBtn.id === `plus-btn-${productId}`) {
        count++;
      }
      this.dispathEventCountChanged(+count, productId)
    });
  }


  private setTotalSum(products: SelectedProductViewInterface[],): void {
    const sumElem = document.getElementById('bin-sum') as HTMLDivElement;
    let count = 0;

    products.forEach(item => {
      const price = item.product?.price ?? 0;
      count += price * item.totalCount;
    });
    sumElem.innerText = count.toString();
  }
}
