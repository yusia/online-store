export default class BaseController {
  protected goToPageNotFound(): void {
    window.dispatchEvent(new CustomEvent('routenotfound'));
  }
}