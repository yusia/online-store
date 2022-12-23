import catalog from '../catalog/catalog.html';
import ProductInterface from '../../../global/interfaces/product.interface';
import FilterParametersInterface from '../../../global/interfaces/filterPearameters.interface';

export default class CatalogView {
  loadContent(
    rootElem: string,
    products: Array<ProductInterface>,
    filterParams: FilterParametersInterface
  ): void {
    console.log(filterParams);
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = catalog;

    const template = rootElemHtml.getElementsByTagName('template')[0];

    const container = rootElemHtml.querySelector('.container');

    products.forEach((product) => {
      const cardElement = template.content.cloneNode(true) as HTMLElement;

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

      container?.append(cardElement);
    });
  }
}
