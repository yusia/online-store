import ProductInterface from "./product.interface";

export  interface SelectedProductViewInterface {
  product: ProductInterface | null;
  total: number;
}
export  interface BinStorageType {
  id: number;
  count: number
}