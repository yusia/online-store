import Router from "../router/router";
import Route from "../router/route";

export default class App {
  constructor() {
  }

  public start(): void {
    var router = new Router([
      new Route('home', 'home'),
      new Route('about', 'about'),
      new Route('catalog', 'catalog', true)
    ]);
    console.log("Application started");
  }
}
