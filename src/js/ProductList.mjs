import { renderListWithTemplate } from "./utils.mjs";

function getDiscountPercent(product) {
  const finalPrice = Number(product.FinalPrice);
  const suggestedRetailPrice = Number(product.SuggestedRetailPrice);

  if (
    !Number.isFinite(finalPrice) ||
    !Number.isFinite(suggestedRetailPrice) ||
    suggestedRetailPrice <= 0 ||
    finalPrice >= suggestedRetailPrice
  ) {
    return null;
  }

  return Math.round(
    ((suggestedRetailPrice - finalPrice) / suggestedRetailPrice) * 100,
  );
}

function discountIndicatorTemplate(product) {
  const discountPercent = getDiscountPercent(product);

  if (discountPercent === null) {
    return "";
  }

  return `<span class="product-card__discount" aria-label="${discountPercent} percent off">${discountPercent}% OFF</span>`;
}

function getProductImage(product) {
  return product.Images?.PrimaryMedium || product.Image || "";
}

function getBrandName(product) {
  return product.Brand?.Name || product.Brand || "";
}

function productCardTemplate(product) {
  return `<li class="product-card">
    ${discountIndicatorTemplate(product)}
    <a href="/product_pages/index.html?product=${encodeURIComponent(product.Id)}">
      <img
        src="${getProductImage(product)}"
        alt="Image of ${product.Name}"
      />
      <h3 class="card__brand">${getBrandName(product)}</h3>
      <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(query, dataSource, listElement, isSearch = false) {
    this.query = query;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.isSearch = isSearch;
  }

  async init() {
    try {
      const list = this.isSearch
        ? await this.dataSource.searchProducts(this.query)
        : await this.dataSource.getData(this.query);
      this.renderList(list);
    } catch (error) {
      console.error(error);
      this.listElement.innerHTML =
        '<li class="product-list__message">Unable to load products. Please try again.</li>';
    }
  }

  renderList(list) {
    if (!Array.isArray(list)) {
      console.error("ProductList expected an array but received:", list);
      this.listElement.innerHTML =
        '<li class="product-list__message">Unable to load products. Please try again.</li>';
      return;
    }

    if (list.length === 0) {
      this.listElement.innerHTML =
        '<li class="product-list__message">No products found.</li>';
      return;
    }

    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
