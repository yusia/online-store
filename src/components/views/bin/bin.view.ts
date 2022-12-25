import { SelectedProductViewInterface } from '../../../global/interfaces/selectedProductView.interface';
import content from '../bin/bin.html';

export default class BinView {

  loadContent(rootElem: string, products: SelectedProductViewInterface[]): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    if (products.length === 0) {
      rootElemHtml.innerHTML = "<div>Cart is Empty</div>";
    } else {
      let contentTemplate = "";
      products.forEach((productBin: SelectedProductViewInterface) => {
        contentTemplate += this.fillTemplate(productBin, content);


      });
      rootElemHtml.innerHTML = contentTemplate;
      this.changeCountBindListener(products);
    }
  }
  private changeCountBindListener(products: SelectedProductViewInterface[]): void {
    products.forEach((productBin: SelectedProductViewInterface) => {
      document.getElementById(`prod-count-${productBin.product?.id}`)?.addEventListener('input', (e) => {

        const count = (e.target as HTMLInputElement).value;
        console.log(count);
        window.dispatchEvent(new CustomEvent("bincountchanged", {
          detail: { productId: productBin.product?.id, count: count }
        }));
      });
    });
  }
  private fillTemplate(product: object, template: string): string {
    const entries = Object.entries(product);
    for (const [key, value] of entries) {
      const isImages=Array.isArray(value);
      if (typeof value === 'object' && !isImages) template = this.fillTemplate(value, template);
      else {
          template = template.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
        }
    }
    return template;
  }
}
