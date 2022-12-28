import ProductsService from './products.service';
import { BinStorageType } from '../interfaces/selectedProductView.interface';
export default class BinService {
  private storageKey = 'bin';
  private bin: Map<number, number> = new Map();

  constructor(private productService: ProductsService) {
    this.bin = this.getBinFromLocalStrg();
  }
  
  get selectedProducts(): Map<number, number> {
    return this.bin;
  }

  private getBinFromLocalStrg(): Map<number, number> {
    const bin = new Map();
    const binStrgJson = localStorage.getItem(this.storageKey);
    const binStrg: BinStorageType[] = binStrgJson
      ? JSON.parse(binStrgJson)
      : [];
    binStrg.forEach((item) => {
      if (item.count > 0) {
        bin.set(item.id, item.count);
      }
    });
    return bin;
  }

  private saveBinToLocalStrg(): void {
    const binJson: BinStorageType[] = [];
    this.bin.forEach((value, key) => {
      if (value > 0) {
        binJson.push({ id: key, count: value });
      }
    });
    localStorage.setItem('bin', JSON.stringify(binJson));
    window.dispatchEvent(new CustomEvent('binchanged'));
  }

  addOneProdToBin(productId: number): void {
    this.bin.set(productId, 1);
    this.saveBinToLocalStrg();
  }

  deleteProdFromBin(productId: number) {
    this.bin.delete(productId);
    this.saveBinToLocalStrg();
  }

  changeCountProdInBin(productId: number, value: number) {
    this.bin.set(productId, value);
    this.saveBinToLocalStrg();
  }

  countInBin(productId: number): number {
    return this.bin.get(productId) ?? 0;
  }

  getCountAllProductInBin(): number {
    let count = 0;

    this.bin.forEach((value) => {
      count += value;
    });
    return count;
  }

  getBinTotalPrice(): number {
    let count = 0;

    this.bin.forEach((value,key) => {
      const price = this.productService.getProductById(key)?.price ?? 0;
      count += price * value;
    });
    return count;
  }
}
