import catalog from '../catalog/catalog.html';
import ProductInterface from '../../../global/interfaces/product.interface';
import FilterParametersInterface from '../../../global/interfaces/filterParameters.interface';

export default class CatalogView {
  private fillProductCatalog(
    rootElem: string,
    products: Array<{ product: ProductInterface; isAddedToBin: boolean }>
  ) {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = catalog;

    const templateCard = rootElemHtml.querySelector(
      '#card-template'
    ) as HTMLTemplateElement;

    const containerProductList = rootElemHtml.querySelector('#product-list');

    products.forEach((productItem) => {
      const cardElement = templateCard?.content.cloneNode(true) as HTMLElement;
      const cardDiv = cardElement.querySelector('.card') as HTMLElement;
      cardDiv.id = `card${productItem.product.id}`;

      function setBinBtnText(isAddedToBin: boolean): HTMLButtonElement {
        const buttonAdd = cardDiv.querySelector(
          '.prod-add-cart'
        ) as HTMLButtonElement;
        buttonAdd.textContent = isAddedToBin
          ? 'Delete from cart'
          : 'Add to cart';
        return buttonAdd;
      }

      function deleteFromCart(productItem: {
        product: ProductInterface;
        isAddedToBin: boolean;
      }): void {
        window.dispatchEvent(
          new CustomEvent('bindeleted', {
            detail: { productId: productItem.product.id },
          })
        );
        productItem.isAddedToBin = false;
        setBinBtnText(productItem.isAddedToBin);
      }

      function addToCart(productItem: {
        product: ProductInterface;
        isAddedToBin: boolean;
      }): void {
        window.dispatchEvent(
          new CustomEvent('binadded', {
            detail: { productId: productItem.product.id },
          })
        );
        productItem.isAddedToBin = true;
        setBinBtnText(productItem.isAddedToBin);
      }

      const name = cardElement.querySelector('.card-title') as HTMLElement;
      name.innerHTML = productItem.product.title;

      const img = cardElement.querySelector('.thumbnail') as HTMLImageElement;
      img.src = productItem.product.thumbnail;

      const description = cardElement.querySelector(
        '.card-text'
      ) as HTMLElement;
      description.innerHTML = productItem.product.description;

      const navLink = cardElement.querySelector('.nav-link') as HTMLLinkElement;
      navLink.href = `#product?prodId=${productItem.product.id}`;

      const addToBinBtn = setBinBtnText(productItem.isAddedToBin);
      addToBinBtn?.addEventListener('click', () => {
        if (productItem.isAddedToBin) {
          deleteFromCart(productItem);
        } else {
          addToCart(productItem);
        }
      });

      containerProductList?.append(cardElement);
    });
  }

  loadContent(
    rootElem: string,
    products: Array<{ product: ProductInterface; isAddedToBin: boolean }>,
    filterParams: FilterParametersInterface
  ): void {
    console.log(filterParams);

    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = catalog;

    this.fillProductCatalog(rootElem, products);

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
