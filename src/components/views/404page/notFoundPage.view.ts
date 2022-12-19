import content from '../404page/notFound.html';
import View from '../../../global/view.interface'

export default class NotFoundPageView implements View{

  loadContent(rootElem:string): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = content;
  }
}