const baseURL =
  import.meta.env.VITE_SERVER_URL ||
  "https://wdd330-backend-osp8.onrender.com/";

async function convertToJson(response) {
  if (response.ok) {
    return response.json();
  }

  throw new Error(`Bad Response: ${response.status}`);
}

export default class ProductData {
  // W03 category listing endpoint. The backend compares Category with the
  // supplied value exactly, so keep the category value lowercase.
  async getData(category) {
    const query = encodeURIComponent(category.trim().toLowerCase());
    const response = await fetch(`${baseURL}products/search/${query}`);
    const data = await convertToJson(response);

    if (Array.isArray(data.Result)) {
      return data.Result;
    }

    if (data.Result === "No products found") {
      return [];
    }

    console.error("Unexpected category API response:", data);
    throw new Error("The product API returned an unexpected response format.");
  }

  // The course backend's /products/search/:query route is a CATEGORY lookup,
  // not a free-text product-name search. For the optional Product Search task,
  // get the products from the API and filter product fields client-side so a
  // search such as "Tent" or "Marmot" works as users expect.
  async searchProducts(searchTerm) {
    const response = await fetch(`${baseURL}products`);
    const products = await convertToJson(response);

    if (!Array.isArray(products)) {
      console.error("Unexpected products API response:", products);
      throw new Error("The product API returned an unexpected response format.");
    }

    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = [
        product.Id,
        product.Category,
        product.Name,
        product.NameWithoutBrand,
        product.Brand?.Name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(term);
    });
  }

  async findProductById(id) {
    const productId = encodeURIComponent(id);
    const response = await fetch(`${baseURL}product/${productId}`);
    const data = await convertToJson(response);

    if (data.Result && typeof data.Result === "object") {
      return data.Result;
    }

    console.error("Unexpected product-detail API response:", data);
    throw new Error("Product not found.");
  }
}
