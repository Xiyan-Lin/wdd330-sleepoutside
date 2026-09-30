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

function productCardTemplate(product) {
  return `<li class="product-card">
    ${discountIndicatorTemplate(product)}
    <a href="product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Image}"
        alt="Image of ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
