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
    window.addEventListener('routenotfound', () => { this.goToRoute(new NotFoundController(new NotFoundPageView())); });
    this.hasChanged();
  }

  hasChanged(): void {
    let routeInstance: ControllerInterface = new NotFoundController(new NotFoundPageView());
    if (window.location.hash.length > 0) {
      routeInstance = this.routes.filter((r) => r.isActiveRoute(this.getRouteName(window.location.hash.slice(1))))[0]?.controller ?? routeInstance;
    } else {
      const defaultRoute = this.routes.filter((r) => r.default)[0]?.name;
      window.location.href = window.location.href + '#' + defaultRoute;
      return;
    }
    this.goToRoute(routeInstance);
  }
  goToRoute(controller: ControllerInterface) {
    const urlParamsPart = window.location.href.split('?')[1];
    const params = urlParamsPart ? new URLSearchParams(`?${window.location.href.split('?')[1]}`) : undefined;
    controller.initView(params);
  }

  getRouteName(fullPath: string): string {
    return fullPath.split('?').length > 0 ? fullPath.split('?')[0] : fullPath;
  }
}
