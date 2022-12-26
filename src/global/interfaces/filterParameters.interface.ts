export default interface FilterParametersInterface {
  categories: Array<{
    name: string;
    totalCount: number;
    filteredCount: number;
    chacked: boolean;
  }>;
  brands: Array<{
    name: string;
    totalCount: number;
    filteredCount: number;
    chacked: boolean;
  }>;
  minPrice: number;
  maxPrice: number;
  minStock: number;
  maxStock: number;
}
