import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function getProductImage(item) {
  return item.Images?.PrimaryMedium || item.Image || "";
}

function getColorName(item) {
  return item.Colors?.[0]?.ColorName || "Color not listed";
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="/product_pages/index.html?product=${encodeURIComponent(item.Id)}" class="cart-card__image">
    <img
      src="${getProductImage(item)}"
      alt="${item.Name}"
    />
  </a>
  <a href="/product_pages/index.html?product=${encodeURIComponent(item.Id)}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${getColorName(item)}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
