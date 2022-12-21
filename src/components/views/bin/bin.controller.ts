import ControllerInterface from '../../../global/interfaces/controller.interface';
import BinView from './bin.view';

export default class BinController implements ControllerInterface {
  constructor(private viewInstance: BinView, ) {

  }
  
  initView() {
    this.viewInstance.loadContent('app');
  }
}