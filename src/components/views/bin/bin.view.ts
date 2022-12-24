import {SelectedProductViewInterface} from '../../../global/interfaces/selectedProductView.interface';
import content from '../bin/bin.html';

export default class BinView {

  loadContent(rootElem: string, products: SelectedProductViewInterface[]): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    if (products.length === 0) {
      rootElemHtml.innerHTML = "<div>Cart is Empty</div>";
    } else {
      let contentTemplate = "";
      products.forEach((product: SelectedProductViewInterface) => {
        contentTemplate += this.fillTemplate(product, content);
      });
      rootElemHtml.innerHTML = contentTemplate
    }
  }

  private fillTemplate(product: object, template: string): string {
    const entries = Object.entries(product);
    for (const [key, value] of entries) {
      if (typeof value === 'object') template = this.fillTemplate(value, template);
      else{
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
      }
    }
    return template;
  }
}
