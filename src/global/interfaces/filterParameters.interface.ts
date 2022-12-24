export default interface FilterParametersInterface {
  categories: Array<{
    name: string;
    totalCount: number;
    filteredCount: number;
  }>;
  brands: Array<{
    name: string;
    totalCount: number;
    filteredCount: number;
  }>;
  minPrice: number;
  maxPrice: number;
  minStock: number;
  maxStock: number;
}
