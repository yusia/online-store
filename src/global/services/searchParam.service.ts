import { SearchParams } from '../../global/searchParams.enum';
import {FilterType} from '../../global/type/filterParams.type'
export default class SearchParamService {

  updateUrl(_filter: FilterType): void {
    const searchParams = new URLSearchParams(
      `?${window.location.href.split('?')[1] || ''}`
    );

    this.setParam(searchParams, SearchParams.Category, _filter.categories);
    this.setParam(searchParams, SearchParams.Brand, _filter.brands);



    searchParams.delete(SearchParams.Price);
    if (_filter.minPrice && _filter.maxPrice) {
      searchParams.set(SearchParams.Price, `${_filter.minPrice}↕${_filter.maxPrice}`);
    }
    searchParams.delete(SearchParams.Stock);
    if (_filter.minStock && _filter.maxStock) {
      searchParams.set(SearchParams.Stock, `${_filter.minStock}↕${_filter.maxStock}`);
    }
    searchParams.delete(SearchParams.Search);
    if (_filter.searchText) {
      searchParams.set(SearchParams.Search, _filter.searchText);
    }
    this.updateCatalogUrl(searchParams);
  }

  updateCatalogUrl(searchParams: URLSearchParams) {
    const newUrl = new URL(window.location.href);
    newUrl.hash = '';
    newUrl.pathname += '#catalog';
    newUrl.search = searchParams.toString();

    window.location.replace(newUrl.href.replace(`%23`, `#`));
  }

  setSortParam(field: string, direction: string): void {
    const urlParamsPart = window.location.href.split('?')[1] ?? "";
    let params = new URLSearchParams(`?${urlParamsPart}`);

    params = this.setParam(params, SearchParams.SortField, [field]);
    params = this.setParam(params, SearchParams.SortDir, [direction]);

    this.updateCatalogUrl(params);
  }

  setParam(params: URLSearchParams, newParam: string, newValues: string[]): URLSearchParams {
    if (params.has(newParam)) {
      params.delete(newParam);
    }
    newValues.forEach(value => {
      if (value) {
        params.append(newParam, value);
      }
    })

    return params;
  }

}