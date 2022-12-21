
import View from '../../../global/interfaces/view.interface'

export default class ProductView implements View {
  
  loadContent(rootElem: string, params?: (string | number)[] | undefined): void {
    const id = params ? +params[0] : 0;
    const name= params ? +params[1] : "error";
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = `<div id="product-id">id:${id} </div> <div id="product-name">name: id:${name} </div>`;
  }
}