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
  private _filter: {
    categories: string[];
    brands: string[];
    minPrice: number;
    maxPrice: number;
    minStock: number;
    maxStock: number;
    searchText: string;
  };

  constructor(private dataService: DataService) {
    this._filter = {
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 0,
      minStock: 0,
      maxStock: 0,
      searchText: '',
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
    const searchParams = new URLSearchParams(`?${url.split('?')[1]}`);
    this._filter.categories = searchParams.getAll('category');
    this._filter.brands = searchParams.getAll('brand');
    if (searchParams.has('price')) {
      this._filter.minPrice = Number(searchParams.get('price')?.split('↕')[0]);
      this._filter.maxPrice = Number(searchParams.get('price')?.split('↕')[1]);
    }

    if (searchParams.has('stock')) {
      this._filter.minStock = Number(searchParams.get('stock')?.split('↕')[0]);
      this._filter.maxStock = Number(searchParams.get('stock')?.split('↕')[1]);
    }

    this._filter.searchText = searchParams.get('search') as string;
    console.log(this._filter);
  }

  isCategiryInFilter(category: string): boolean {
    return this._filter.categories.includes(category);
  }

  isBrandInFilter(brand: string): boolean {
    return this._filter.brands.includes(brand);
  }

  getPriceFromFilter(): { min: number; max: number } {
    return {
      min:
        this._filter.minPrice >
        Math.min(...this._productsFiltered.map((product) => product.price))
          ? this._filter.minPrice
          : Math.min(...this._productsFiltered.map((product) => product.price)),
      max:
        this._filter.maxPrice <
        Math.max(...this._productsFiltered.map((product) => product.price))
          ? this._filter.maxPrice
          : Math.max(...this._productsFiltered.map((product) => product.price)),
    };
  }

  getStockFromFilter(): { min: number; max: number } {
    return {
      min:
        this._filter.minStock >
        Math.min(...this._productsFiltered.map((product) => product.stock))
          ? this._filter.minStock
          : Math.min(...this._productsFiltered.map((product) => product.stock)),
      max:
        this._filter.maxStock <
        Math.max(...this._productsFiltered.map((product) => product.stock))
          ? this._filter.maxStock
          : Math.max(...this._productsFiltered.map((product) => product.stock)),
    };
  }

  getSearchText(): string {
    return this._filter.searchText;
  }

  updateFileredProducts(products: ProductInterface[]) {
    this._productsFiltered = this.filterProductsByCategory(products);
    this._productsFiltered = this.filterProductsByBrand(this._productsFiltered);
    this._productsFiltered = this.filterProductsByPrice(this._productsFiltered);
    this._productsFiltered = this.filterProductsByStock(this._productsFiltered);
    this._productsFiltered = this.filterProductsBySearch(
      this._productsFiltered
    );
  }

  filterProductsBySearch(products: ProductInterface[]): ProductInterface[] {
    if (!this._filter.searchText) return products;
    return products.filter((product) => {
      return (
        product.title
          .toLowerCase()
          .includes(this._filter.searchText.toLocaleLowerCase()) ||
        product.brand
          .toLowerCase()
          .includes(this._filter.searchText.toLocaleLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(this._filter.searchText.toLocaleLowerCase()) ||
        product.price
          .toString()
          .toLowerCase()
          .includes(this._filter.searchText.toLocaleLowerCase()) ||
        product.rating
          .toString()
          .toLowerCase()
          .includes(this._filter.searchText.toLocaleLowerCase()) ||
        product.stock
          .toString()
          .toLowerCase()
          .includes(this._filter.searchText.toLocaleLowerCase())
      );
    });
  }

  filterProductsByCategory(products: ProductInterface[]): ProductInterface[] {
    if (this._filter.categories.length == 0) {
      return products;
    } else {
      return products.filter((product) =>
        this._filter.categories.includes(product.category)
      );
    }
  }

  filterProductsByBrand(products: ProductInterface[]): ProductInterface[] {
    if (this._filter.brands.length == 0) {
      return products;
    } else {
      return products.filter((product) =>
        this._filter.brands.includes(product.brand)
      );
    }
  }

  filterProductsByPrice(products: ProductInterface[]): ProductInterface[] {
    let result = products;
    if (this._filter.minPrice)
      result = result.filter(
        (product) => product.price >= this._filter.minPrice
      );
    if (this._filter.maxPrice)
      result = result.filter(
        (product) => product.price <= this._filter.maxPrice
      );
    return result;
  }

  filterProductsByStock(products: ProductInterface[]): ProductInterface[] {
    let result = products;
    if (this._filter.minStock)
      result = result.filter(
        (product) => product.stock >= this._filter.minStock
      );
    if (this._filter.maxStock)
      result = result.filter(
        (product) => product.stock <= this._filter.maxStock
      );
    return result;
  }

  updateUrl() {
    const searchParams = new URLSearchParams(
      `?${window.location.href.split('?')[1]}`
    );

    const newUrl = new URL(window.location.href);

    searchParams.delete('category');
    this._filter.categories.forEach((value) =>
      searchParams.append('category', value)
    );
    searchParams.delete('brand');
    this._filter.brands.forEach((value) => searchParams.append('brand', value));
    searchParams.delete('price');
    if (this._filter.minPrice && this._filter.maxPrice) {
      searchParams.set(
        'price',
        `${this._filter.minPrice}↕${this._filter.maxPrice}`
      );
    }
    searchParams.delete('stock');
    if (this._filter.minStock && this._filter.maxStock) {
      searchParams.set(
        'stock',
        `${this._filter.minStock}↕${this._filter.maxStock}`
      );
    }
    searchParams.delete('search');
    if (this._filter.searchText) {
      searchParams.set(`search`, `${this._filter.searchText}`);
    }
    newUrl.hash = '';
    newUrl.pathname += '#catalog';
    newUrl.search = searchParams.toString();

    window.location.replace(newUrl.href.replace(`%23`, `#`));
  }

  updateFilter(
    filterParam: string,
    value: string | { min: number; max: number }
  ) {
    switch (filterParam) {
      case 'category': {
        if (!this._filter.categories.includes(value as string)) {
          this._filter.categories.push(value as string);
        } else
          this._filter.categories = this._filter.categories.filter(
            (category) => category != value
          );
        break;
      }
      case 'brand': {
        if (!this._filter.brands.includes(value as string)) {
          this._filter.brands.push(value as string);
        } else
          this._filter.brands = this._filter.brands.filter(
            (brand) => brand != value
          );
        break;
      }

      case 'price': {
        this._filter.minPrice = (value as { min: number; max: number }).min;
        this._filter.maxPrice = (value as { min: number; max: number }).max;
        break;
      }
      case 'stock': {
        this._filter.minStock = (value as { min: number; max: number }).min;
        this._filter.maxStock = (value as { min: number; max: number }).max;
        break;
      }
      case 'search': {
        this._filter.searchText = value as string;
        break;
      }
    }
    this.updateUrl();
  }

  resetFilter() {
    this._filter = {
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 0,
      minStock: 0,
      maxStock: 0,
      searchText: '',
    };
    this.updateUrl();
  }
}
