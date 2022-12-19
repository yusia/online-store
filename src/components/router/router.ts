import Route from "./route";
import about from '../views/about.html';
import home from '../views/home.html';
import catalog from '../views/catalog/catalog.html';
import notFounded from '../views/notFound.html';

type r = {
  [index: string]: string;
};
const routesInner: r = {
  "about": about,
  "home": home,
  "catalog": catalog,
  notFounded: notFounded,
}

export default class Router {
  rootElem: HTMLElement;
  constructor(private routes: Route[]) {
    this.rootElem = document.getElementById('app') as HTMLElement;
    this.init();
  }

  public setContent(responseText: string) {
    this.rootElem.innerHTML = responseText;
  }
  private onHashChange() {
    var r = this.routes;
    this.hasChanged();
  }

  init() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
    this.hasChanged();
  }

  hasChanged() {
    const r = this.routes;
    if (window.location.hash.length > 0) {
      for (let i = 0, length = r.length; i < length; i++) {
        const route = r[i];
        if (route.isActiveRoute(window.location.hash.substr(1))) {
          this.goToRoute(route.htmlName);
          break;
        }else{
          this.goToRoute("notFounded");
        }
      }
    } else {
      for (var i = 0, length = r.length; i < length; i++) {
        var route = r[i];
        if (route.default) {
          this.goToRoute(route.htmlName);
        }
      }
    }
  }
  goToRoute(htmlName: string) {
    this.setContent(routesInner[htmlName]);

  }
};