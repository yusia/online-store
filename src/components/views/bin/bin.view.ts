import content from "../bin/bin.html";
import View from "../../../global/interfaces/view.interface";

export default class Bin implements View {
  loadContent(rootElem: string): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = content;
  }
}
