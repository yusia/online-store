import Router from "../router/router";
import Route from "../router/route";

import CatalogView from '../views/catalog/catalog.view';
import Bin from '../views/bin/bin.view'
export default class App {
  public start(): void {
    const router = new Router([
      new Route('bin', 'bin', new Bin()),
      new Route('catalog', 'catalog',new CatalogView(), true),
    ]);
    router.init();
  }
}
