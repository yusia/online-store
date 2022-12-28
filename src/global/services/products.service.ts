import ProductInterface from '../interfaces/product.interface';
import DataService from './data.service';
export default class ProductsService {
  private _products: ProductInterface[] = [];
  private _productsFiltered: ProductInterface[] = [];
  private _categories: [] = [];
  private _brands: string[] = [];
  private _minPrice = 0;
  private _maxPrice = 0;
  private _minStock = 0;
  private _maxStock = 0;
  private _filter: { categories: string[]; brands: string[] };

  constructor(private dataService: DataService) {
    this._filter = {
      categories: [],
      brands: [],
    };

    this.updateFilterByUrl(window.location.href);
  }

  get products() {
    return this._products;
  }

  get productsFiltered() {
    return this._productsFiltered;
  }

  get categories() {
    return this._categories;
  }

  get brands() {
    return this._brands;
  }

  get minPrice() {
    return this._minPrice;
  }

  get maxPrice() {
    return this._maxPrice;
  }

  get minStock() {
    return this._minStock;
  }

  get maxStock() {
    return this._maxStock;
  }

  async getProducts() {
    this._products = await this.dataService.getProducts();
  }

  async getFilterData() {
    await this.getCategories();
    this.getBrands();
    this.getPrices();
    this.getStocks();
  }

  async getCategories() {
    this._categories = await this.dataService.getCategoties();
  }

  getBrands() {
    this._brands = Array.from(
      new Set(this._products.map((product) => product.brand))
    );
  }

  getPrices() {
    this._minPrice = Math.min(
      ...this._products.map((product) => product.price)
    );
    this._maxPrice = Math.max(
      ...this._products.map((product) => product.price)
    );
  }

  getStocks() {
    this._minStock = Math.min(
      ...this._products.map((product) => product.stock)
    );
    this._maxStock = Math.max(
      ...this._products.map((product) => product.stock)
    );
  }

  getProductById(id: number): ProductInterface | null {
    const prod = this._products.filter((p) => p.id === id)[0];
    return prod ?? null;
  }

  getCountByCategoty(category: string) {
    return this._products.filter((value) => value.category === category).length;
  }

  getCountByCategotyFiltered(category: string) {
    return this._productsFiltered.filter((value) => value.category === category)
      .length;
  }

  getCountByBrand(brand: string) {
    return this._products.filter((value) => value.brand === brand).length;
  }

  getCountByBrandFiltered(brand: string) {
    return this._productsFiltered.filter((value) => value.brand === brand)
      .length;
  }

  updateFilterByCategory(category: string) {
    console.log(category);
  }

  updateFilterByUrl(url: string) {
    const params = new URLSearchParams(`?${url.split('?')[1]}`);
    this._filter.categories = params.getAll('category');
    this._filter.brands = params.getAll('brand');
    console.log(this._filter);
  }

  isCategiryInFilter(category: string): boolean {
    return this._filter.categories.includes(category);
  }

  isBrandInFilter(brand: string): boolean {
    return this._filter.brands.includes(brand);
  }

  updateFileredProducts(products: ProductInterface[]) {
    console.log('update filtered products');
    this._productsFiltered = this.filterProductsByCategory(products);
    this._productsFiltered = this.filterProductsByBrand(this._productsFiltered);
    console.log(this._productsFiltered);
  }

  filterProductsByCategory(products: ProductInterface[]): ProductInterface[] {
    console.log(this._filter.categories);
    if (this._filter.categories.length == 0) {
      return products;
    } else {
      return products.filter((product) =>
        this._filter.categories.includes(product.category)
      );
    }
  }

  filterProductsByBrand(products: ProductInterface[]): ProductInterface[] {
    console.log(this._filter.brands);
    if (this._filter.brands.length == 0) {
      return products;
    } else {
      return products.filter((product) =>
        this._filter.brands.includes(product.brand)
      );
    }
  }

  updateUrl() {
    const paramArray: string[] = [];
    paramArray.push(
      ...this._filter.categories.map((value) => `category=${value}`)
    );
    paramArray.push(...this._filter.brands.map((value) => `brand=${value}`));

    const newUrl =
      window.location.href.split('?')[0] + '?' + paramArray.join('&');

    console.log(newUrl);
    window.location.replace(newUrl);
  }

  updateFilter(filterParam: string, value: string | number) {
    if (filterParam == 'category') {
      if (!this._filter.categories.includes(value as string)) {
        this._filter.categories.push(value as string);
      } else
        this._filter.categories = this._filter.categories.filter(
          (category) => category != value
        );
    }
    if (filterParam == 'brand') {
      if (!this._filter.brands.includes(value as string)) {
        this._filter.brands.push(value as string);
      } else
        this._filter.brands = this._filter.brands.filter(
          (brand) => brand != value
        );
    }

    console.log(this._filter);
    this.updateUrl();
  }
}
