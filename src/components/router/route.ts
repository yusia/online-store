import View from "../../global/interfaces/view.interface";

export default class Route {
  default: boolean | undefined = false;
  constructor(
    private name: string,
    public htmlName: string,
    public instance: View,
    defaultRoute?: boolean
  ) {
    this.default = defaultRoute;
  }
  isActiveRoute(hashedPath: string) {
    return hashedPath.replace("#", "") === this.name;
  }
}
