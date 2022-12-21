import ControllerInterface from '../../../global/interfaces/controller.interface';
import View from '../../../global/interfaces/view.interface'
//import DataService from '../../../global/services/dataService';

export default class CatalogController implements ControllerInterface {
  constructor(private viewInstance: View, ) {

  }
  
  initView() {
    this.viewInstance.loadContent('app',['sd']);
  }
}