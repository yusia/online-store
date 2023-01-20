import ProductInterface from "./product.interface";

export interface SelectedProductViewInterface {
  product: ProductInterface | null;
  totalCount: number;
  totalPrice: number;
}
export interface BinStorageType {
  id: number;
  count: number
}