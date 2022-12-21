import View from "./view.interface";
import {filterParams} from '../type/filterParams.type';

export default interface ControllerInterface {
  initView( params: URLSearchParams): void;
}