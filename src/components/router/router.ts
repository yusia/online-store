import Route from "./route";
import NotFoundPageView from '../views/404page/notFoundPage.view'
import View from '../../global/view.interface';

export default class Router {
  rootElemId: string;
  constructor(private routes: Route[]) {
    this.rootElemId = 'app';
  }

  init() {
    window.addEventListener('hashchange', () => this.hasChanged());
    this.hasChanged();
  }

  hasChanged() {
    let routeInstance = new NotFoundPageView();
    if (window.location.hash.length > 0) {
      routeInstance = this.routes.filter((r) => r.isActiveRoute(window.location.hash.substr(1)))[0]?.instance ?? routeInstance;
    } else {
      routeInstance = this.routes.filter((r) => r.default)[0]?.instance;
    }
    this.goToRoute(routeInstance);
  }

  goToRoute(view: View) {
    view.loadContent('app');
  }
}