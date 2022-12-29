import catalog from '../catalog/catalog.html';
import ProductInterface from '../../../global/interfaces/product.interface';
import FilterParametersInterface from '../../../global/interfaces/filterParameters.interface';
import noUiSlider from 'nouislider';

export default class CatalogView {
  private fillProductCatalog(
    rootElem: string,
    products: Array<{ product: ProductInterface; isAddedToBin: boolean }>
  ) {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = catalog;

    const productCountElement = document.getElementById(
      'products-count'
    ) as HTMLElement | null;
    if (productCountElement)
      productCountElement.innerHTML = `Found: ${products.length}`;

    const containerProductList = rootElemHtml.querySelector('#product-list');

    if (!products.length) {
      const infoElement = document.createElement('div');
      infoElement.innerText = 'No products found';
      containerProductList?.append(infoElement);
      return;
    }

    const templateCard = rootElemHtml.querySelector(
      '#card-template'
    ) as HTMLTemplateElement;

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
    filterParams: FilterParametersInterface,
    updateUrl: (
      filterParam: string,
      value: string | { min: number; max: number }
    ) => void
  ): void {
    const rootElemHtml = document.getElementById(rootElem) as HTMLElement;
    rootElemHtml.innerHTML = catalog;

    this.fillProductCatalog(rootElem, products);

    const templateCategoryBrand = rootElemHtml.querySelector(
      '#category-brand-template'
    ) as HTMLTemplateElement;

    const containerCategory = rootElemHtml.querySelector('#category-list');

    filterParams.categories.forEach((category) => {
      const categoryElementNode = templateCategoryBrand?.content.cloneNode(
        true
      ) as HTMLElement;

      const categoryElement = categoryElementNode.querySelector(
        '.category-brand-wrapper'
      ) as HTMLElement;

      categoryElement.addEventListener('click', () =>
        updateUrl('category', category.name)
      );

      const check = categoryElement.querySelector(
        '.category-brand-name'
      ) as HTMLInputElement;
      check.checked = category.chacked;

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
      const brandElementNode = templateCategoryBrand?.content.cloneNode(
        true
      ) as HTMLElement;

      const brandElement = brandElementNode.querySelector(
        '.category-brand-wrapper'
      ) as HTMLElement;

      brandElement.addEventListener('click', () =>
        updateUrl('brand', brand.name)
      );

      const check = brandElement.querySelector(
        '.category-brand-name'
      ) as HTMLInputElement;
      check.checked = brand.chacked;

      const name = brandElement.querySelector(
        '.category-brand-label'
      ) as HTMLElement;
      name.innerHTML = ' ' + brand.name;

      const count = brandElement.querySelector('.count') as HTMLElement;
      count.innerHTML = ` (${brand.filteredCount}/${brand.totalCount})`;

      containerBrand?.append(brandElement);
    });

    const sliderPrice = document.querySelector(
      '.slider-price'
    ) as HTMLElement | null;

    if (sliderPrice) {
      const newSlider = noUiSlider.create(sliderPrice, {
        start: [filterParams.minPrice.current, filterParams.maxPrice.current],
        range: {
          min: [filterParams.minPrice.start],
          max: [filterParams.maxPrice.start],
        },
        behaviour: 'tap-drag',
        tooltips: true,
      });
      newSlider.on('change', (e) =>
        updateUrl('price', { min: +e[0], max: +e[1] })
      );
    }

    const sliderStock = document.querySelector(
      '.slider-stock'
    ) as HTMLElement | null;

    if (sliderStock) {
      const newSlider = noUiSlider.create(sliderStock, {
        start: [filterParams.minStock.current, filterParams.maxStock.current],
        range: {
          min: filterParams.minStock.start,
          max: filterParams.maxStock.start,
        },
        behaviour: 'tap-drag',
        tooltips: true,
      });
      newSlider.on('end', (e) =>
        updateUrl('stock', { min: +e[0], max: +e[1] })
      );
    }

    const serchElement = document.getElementById(
      'search-product'
    ) as HTMLInputElement | null;
    if (serchElement) {
      serchElement.value = filterParams.searchText;
      serchElement.addEventListener('change', (e) => {
        updateUrl('search', (e.target as HTMLInputElement).value);
      });
    }
  }
}
