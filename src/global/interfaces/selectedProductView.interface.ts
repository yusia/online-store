import ProductInterface from "./product.interface";

export  interface SelectedProductViewInterface {
  product: ProductInterface | null;
  count: number;
}
export  interface BinStorageType {
  id: number;
  count: number
}