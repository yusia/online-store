import ProductInterface from "./product.interface";

export default interface SelectedProductViewInterface {
  product: ProductInterface | null;
  count: number;
}
