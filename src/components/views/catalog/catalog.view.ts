import catalog from '../catalog/catalog.html';
import ProductInterface from '../../../global/interfaces/product.interface';
import FilterParametersInterface from '../../../global/interfaces/filterParameters.interface';

export default class CatalogView {
  loadContent(
    rootElem: string,
    products: Array<ProductInterface>,
    filterParams: FilterParametersInterface
  ): void {
    console.log(filterParams);
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = catalog;

    const templateCard = rootElemHtml.querySelector(
      '#card-template'
    ) as HTMLTemplateElement;

    const containerProductList = rootElemHtml.querySelector('#product-list');

    products.forEach((product) => {
      const cardElement = templateCard?.content.cloneNode(true) as HTMLElement;

      const name = cardElement.querySelector('.card-title') as HTMLElement;
      name.innerHTML = product.title;

      const img = cardElement.querySelector('.thumbnail') as HTMLImageElement;
      img.src = product.thumbnail;

      const description = cardElement.querySelector(
        '.card-text'
      ) as HTMLElement;
      description.innerHTML = product.description;

      const navLink = cardElement.querySelector('.nav-link') as HTMLLinkElement;
      navLink.href = `#product?prodId=${product.id}`;

      containerProductList?.append(cardElement);
    });

    const templateCategoryBrand = rootElemHtml.querySelector(
      '#category-brand-template'
    ) as HTMLTemplateElement;

    const containerCategory = rootElemHtml.querySelector('#category-list');

    filterParams.categories.forEach((category) => {
      const categoryElement = templateCategoryBrand?.content.cloneNode(
        true
      ) as HTMLElement;

      const name = categoryElement.querySelector(
        '.category-brand-label'
      ) as HTMLElement;
      name.innerHTML = ' ' + category.name;

      const count = categoryElement.querySelector('.count') as HTMLElement;
      count.innerHTML = ` (${category.filteredCount}/${category.totalCount})`;

      containerCategory?.append(categoryElement);
    });

    const containerBrand = rootElemHtml.querySelector('#brand-list');

    filterParams.brands.forEach((brand) => {
      const brandElement = templateCategoryBrand?.content.cloneNode(
        true
      ) as HTMLElement;

      const name = brandElement.querySelector(
        '.category-brand-label'
      ) as HTMLElement;
      name.innerHTML = ' ' + brand.name;

      const count = brandElement.querySelector('.count') as HTMLElement;
      count.innerHTML = ` (${brand.filteredCount}/${brand.totalCount})`;

      containerBrand?.append(brandElement);
    });

    const minPrice = rootElemHtml.querySelector('#min-price');
    if (minPrice) minPrice.innerHTML = filterParams.minPrice.toString();

    const maxPrice = rootElemHtml.querySelector('#max-price');
    if (maxPrice) maxPrice.innerHTML = filterParams.maxPrice.toString();

    const minStock = rootElemHtml.querySelector('#min-stock');
    if (minStock) minStock.innerHTML = filterParams.minStock.toString();

    const maxStock = rootElemHtml.querySelector('#max-stock');
    if (maxStock) maxStock.innerHTML = filterParams.maxStock.toString();
  }
}
