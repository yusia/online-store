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

    this.changeCountBindListener(products);
  }

  private changeCountBindListener(products: SelectedProductViewInterface[]): void { //todo refactoring! use delegation
    products.forEach((productBin: SelectedProductViewInterface) => {
      document.getElementById(`prod-count-${productBin.product?.id}`)?.addEventListener('input', (e) => {

        const count = (e.target as HTMLInputElement).value;

        window.dispatchEvent(new CustomEvent("bincountchanged", {
          detail: { productId: productBin.product?.id, count: count }
        }));
      });
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
}
