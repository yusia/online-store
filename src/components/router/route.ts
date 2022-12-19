export default class Route {
  default: boolean | undefined = false;
  constructor(private name: string, public htmlName: string, defaultRoute?: boolean) {
    this.default = defaultRoute;
  }
  isActiveRoute(hashedPath: string) {
    return hashedPath.replace('#', '') === this.name;
  }
}