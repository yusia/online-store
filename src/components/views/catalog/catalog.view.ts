import catalog from '../catalog/catalog.html';
import ProductInterface from '../../../global/interfaces/product.interface';
import FilterParametersInterface from '../../../global/interfaces/filterParameters.interface';
import ViewParametersInterface from '../../../global/interfaces/viewParameters.interface';
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

      cardDiv.addEventListener('click', (e: MouseEvent) => {
        if (e.target != cardDiv.querySelector('.prod-add-cart'))
          window.dispatchEvent(
            new CustomEvent('showproduct', {
              detail: { productId: productItem.product.id },
            })
          );
      });

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

      const img = cardElement.querySelector('#thumbnail') as HTMLImageElement;
      img.src = productItem.product.thumbnail;

      const description = cardElement.querySelector(
        '.card-text'
      ) as HTMLElement | null;
      if (description) description.innerHTML = productItem.product.description;

      const price = cardElement.querySelector(
        '.card-price'
      ) as HTMLElement | null;
      if (price) price.innerHTML = `${productItem.product.price}$`;

      const discount = cardElement.querySelector(
        '.card-discount'
      ) as HTMLElement | null;
      if (discount)
        discount.innerHTML = `${productItem.product.discountPercentage}%`;

      const rating = cardElement.querySelector(
        '.card-rating'
      ) as HTMLElement | null;
      if (rating) rating.innerHTML = `Rating: ${productItem.product.rating}`;

      const stock = cardElement.querySelector(
        '.card-stock'
      ) as HTMLElement | null;
      if (stock) stock.innerHTML = `Stock: ${productItem.product.stock}`;

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
    this.bindSortListener(
      rootElemHtml.querySelector('#sorting') as HTMLElement
    );
  }

  private bindSortListener(dropdownSort: HTMLElement): void {
    dropdownSort.addEventListener('click', (event: MouseEvent) => {
      const sortingByOption = event.target as HTMLElement;
      const field = sortingByOption.getAttribute('data-field');
      const direction = sortingByOption.getAttribute('data-dir');
      window.dispatchEvent(
        new CustomEvent('sortChanged', {
          detail: { sortField: field, sortDirection: direction },
        })
      );
    });
  }

  loadContent(
    rootElem: string,
    products: Array<{ product: ProductInterface; isAddedToBin: boolean }>,
    filterParams: FilterParametersInterface,
    viewParams: ViewParametersInterface,
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

    const radioGrid = document.getElementById(
      'radio-grid'
    ) as HTMLInputElement | null;
    const radioList = document.getElementById(
      'radio-list'
    ) as HTMLInputElement | null;
    if (radioGrid && radioList) {
      const containerProductList = rootElemHtml.querySelector(
        '#product-list'
      ) as HTMLElement | null;

      if (viewParams.viewType == 'grid') {
        radioGrid.checked = true;
        containerProductList?.classList.remove('list');
        containerProductList?.classList.add('grid');
      } else {
        radioList.checked = true;
        containerProductList?.classList.remove('grid');
        containerProductList?.classList.add('list');
      }

      radioGrid.addEventListener('change', () => {
        window.dispatchEvent(
          new CustomEvent('viewparamchanged', {
            detail: { parameter: 'viewtype', value: 'grid' },
          })
        );
      });

      radioList.addEventListener('change', () => {
        window.dispatchEvent(
          new CustomEvent('viewparamchanged', {
            detail: { parameter: 'viewtype', value: 'list' },
          })
        );
      });
    }

    const resetFilterBtn = document.getElementById(
      'reset-filter'
    ) as HTMLButtonElement | null;

    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('resetfilterbtnclicked'));
      });
    }
    const copyLinkBtn = document.getElementById(
      'copy-link'
    ) as HTMLButtonElement | null;
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        copyLinkBtn.innerText = 'link copied';
        setTimeout(() => (copyLinkBtn.innerText = 'copy link'), 5000);
        window.dispatchEvent(new CustomEvent('copylinkbtnclicked'));
      });
    }
  }
}
