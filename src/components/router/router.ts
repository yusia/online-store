import Route from './route';
// import NotFoundPageView from '../views/404page/notFoundPage.view'
// import View from '../../global/interfaces/view.interface';
import ControllerInterface from "../../global/interfaces/controller.interface";

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
    // let routeInstance = new NotFoundPageView();
    let routeInstance = null;
    if (window.location.hash.length > 0) {
      routeInstance = this.routes.filter((r) => r.isActiveRoute(this.getRouteName(window.location.hash.slice(1))))[0]?.controller ?? routeInstance;
    } else {
      routeInstance = this.routes.filter((r) => r.default)[0]?.controller;
    }
    this.goToRoute(routeInstance);
  }
  goToRoute(controller: ControllerInterface) {
    const url = `?${window.location.href.split('?')[1]}`;
    const params = new URLSearchParams(url);
    controller.initView(params);
    // if (params.get('productId')) console.log("id: ", (params.get('productId')));
    // view.loadContent('app', [2]);
  }

  getRouteName(fullPath: string): string {
    return fullPath.split('?').length > 0 ? fullPath.split('?')[0] : fullPath;
  }
}
