import ControllerInterface from '../../../global/interfaces/controller.interface';
import NotFoundPageView from './notFoundPage.view';

export default class NotFoundController implements ControllerInterface {
  constructor(private viewInstance: NotFoundPageView, ) {

  }
  
  initView() {
    this.viewInstance.loadContent('app');
  }
}