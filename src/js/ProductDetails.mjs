import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function getProductImage(product) {
  return (
    product.Images?.PrimaryLarge ||
    product.Images?.PrimaryMedium ||
    product.Image ||
    ""
  );
}

function getBrandName(product) {
  return product.Brand?.Name || product.Brand || "";
}

function getColorName(product) {
  return product.Colors?.[0]?.ColorName || "Color not listed";
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);

      if (!this.product || !this.product.Id) {
        document.querySelector(".product-detail").innerHTML =
          "<p>Product not found.</p>";
        return;
      }

      document.title = `Sleep Outside | ${this.product.Name}`;
      this.renderProductDetails();

      document
        .getElementById("addToCart")
        .addEventListener("click", this.addProductToCart.bind(this));
    } catch (error) {
      console.error(error);
      document.querySelector(".product-detail").innerHTML =
        "<p>Unable to load this product. Please try again.</p>";
    }
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart");

    if (!Array.isArray(cart)) {
      cart = [];
    }

    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  renderProductDetails() {
    const product = this.product;

    document.querySelector(".product-detail").innerHTML = `
      <h3>${getBrandName(product)}</h3>
      <h2 class="divider">${product.NameWithoutBrand || product.Name}</h2>
      <img
        class="divider"
        src="${getProductImage(product)}"
        alt="${product.Name}"
      />
      <p class="product-card__price">$${product.FinalPrice}</p>
      <p class="product__color">${getColorName(product)}</p>
      <div class="product__description">
        ${product.DescriptionHtmlSimple || product.Description || ""}
      </div>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    `;
  }
}
