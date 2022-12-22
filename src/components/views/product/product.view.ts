
import ProductInterface from '../../../global/interfaces/product.interface';
import prodViewTemplate from '../product/product.html';

export default class ProductView {
  private isAddedToBin = false;
  private fillTemplate(product: ProductInterface): string {
    let template = prodViewTemplate;
    const entries = Object.entries(product);
    for (const [key, value] of entries) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
    }
    return template;
  }

  private deleteFromCart(productId: number): void {
    window.dispatchEvent(new CustomEvent("bindeleted", {
      detail: { productId: productId }
    }));
    this.isAddedToBin = false;
    this.setBinBtnText(this.isAddedToBin);
  }

  private addToCart(productId: number): void {
    window.dispatchEvent(new CustomEvent("binadded", {
      detail: { productId: productId }
    }));
    this.isAddedToBin = true;
    this.setBinBtnText(this.isAddedToBin);
  }

  private setBinBtnText(isAddedToBin: boolean): HTMLButtonElement {
    const buttonAdd = document.getElementById("prod-add-cart") as HTMLButtonElement;
    buttonAdd.textContent = isAddedToBin ? "Delete from cart" : "Add to cart";
    return buttonAdd;
  }

  loadContent(rootElem: string, product: ProductInterface, isAddedToBin: boolean): void {
    this.isAddedToBin = isAddedToBin;
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = "";

    rootElemHtml.innerHTML = this.fillTemplate(product);
    const buttonBuy = document.getElementById("prod-buy-btn") as HTMLButtonElement;
    const buttonAdd = this.setBinBtnText(isAddedToBin);

    buttonBuy?.addEventListener('click', () => { console.log("prod-buy-now") })
    buttonAdd?.addEventListener('click', () => {
      if (this.isAddedToBin) {
        this.deleteFromCart(product.id);
      }
      else {
        this.addToCart(product.id);
      }
    });
  }
}