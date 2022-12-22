
import ProductInterface from '../../../global/interfaces/product.interface';
import prodViewTemplate from '../product/product.html';

export default class ProductView {

  private fillTemplate(product: ProductInterface): string {
    let template = prodViewTemplate;
    const entries = Object.entries(product);
    for (const [key, value] of entries) {
      template = template.replace(`{{${key}}}`, value.toString());
    }
    return template;
  }

  loadContent(rootElem: string, product: ProductInterface): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = "";

    rootElemHtml.innerHTML = this.fillTemplate(product);
    const buttonBuy = document.getElementById("prod-buy-btn");
    const buttonAdd = document.getElementById("prod-add-cart");
    
    buttonBuy?.addEventListener('click', () => {console.log("prod-buy-now") })
    buttonAdd?.addEventListener('click', () => {  console.log("prod-add-cart");})
  }

  addToCart(): void {
    console.log("title");
  }
}