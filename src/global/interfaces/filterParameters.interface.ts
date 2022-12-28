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
  minPrice: { start: number; current: number };
  maxPrice: { start: number; current: number };
  minStock: { start: number; current: number };
  maxStock: { start: number; current: number };
}
