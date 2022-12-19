import catalog from '../catalog/catalog.html';
import View from '../../../global/view.interface'

export default class CatalogView implements View{

  loadContent(rootElem:string): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = catalog;
  }
}