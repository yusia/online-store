import ProductInterface from "./product.interface";

interface ProductResponseInterface extends Response {
  limit: number;
  skip: number;
  total: number;
  products: Array<ProductInterface>;
}

export default ProductResponseInterface;
