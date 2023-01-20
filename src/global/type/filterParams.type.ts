export type filterParams = {
  [key: string]: string;
}
export type FilterType = {
  categories: string[],
  brands: string[],
  minPrice: number,
  maxPrice: number,
  minStock: number,
  maxStock: number,
  searchText: string
}