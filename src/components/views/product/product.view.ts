
import ProductInterface from '../../../global/interfaces/product.interface';

export default class ProductView {

  loadContent(rootElem: string, product: ProductInterface): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = `<div id="product-id">id:${product.id} </div> <div id="product-name">brand:${product.brand} </div>`;
  }
}