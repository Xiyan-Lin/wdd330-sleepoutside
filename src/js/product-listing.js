import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const searchTerm = getParam("search");
const query = (searchTerm || category || "tents").trim();

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const productList = new ProductList(
  query,
  dataSource,
  listElement,
  Boolean(searchTerm),
);

function formatCategory(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const titleElement = document.querySelector("#product-list-title");

if (searchTerm) {
  titleElement.textContent = `Search Results: ${searchTerm}`;
  document.title = `Sleep Outside | Search: ${searchTerm}`;
} else {
  const categoryTitle = formatCategory(category || "tents");
  titleElement.textContent = `Top Products: ${categoryTitle}`;
  document.title = `Sleep Outside | ${categoryTitle}`;
}

productList.init();
