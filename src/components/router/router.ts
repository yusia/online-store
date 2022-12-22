import Route from './route';
import NotFoundPageView from '../views/404page/notFoundPage.view'
import NotFoundController from '../views/404page/notFound.controller'
import ControllerInterface from "../../global/interfaces/controller.interface";

export default class Router {
  rootElemId: string;
  constructor(private routes: Route[]) {
    this.rootElemId = 'app';
  }

  init() {
    window.addEventListener('hashchange', () => {
        this.hasChanged();
 });
    window.addEventListener('routechanged',()=>{ this.goToRoute(new NotFoundController(new NotFoundPageView()));});
    this.hasChanged();
  }

  hasChanged() {
    let routeInstance: ControllerInterface = new NotFoundController(new NotFoundPageView());
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
  }

  getRouteName(fullPath: string): string {
    return fullPath.split('?').length > 0 ? fullPath.split('?')[0] : fullPath;
  }
}
