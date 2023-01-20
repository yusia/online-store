import ControllerInterface from "../../global/interfaces/controller.interface";

export default class Route {
  default: boolean | undefined = false;
  constructor(public name: string,
    public controller: ControllerInterface,
    defaultRoute?: boolean) {
    this.default = defaultRoute;
  }
  isActiveRoute(hashedPath: string) {
    return hashedPath.replace('#', '') === this.name;
  }
}
