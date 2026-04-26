// v1.0 - servicio shopify
// avance: 95%
// líneas: ~40

import axios from "axios";

const SHOP = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;

export async function obtenerProductos() {
  try {
    const res = await axios.get(
      `https://${SHOP}/admin/api/2024-01/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.products || [];
  } catch (error) {
    console.error("❌ Error Shopify:", error.response?.data || error.message);
    return [];
  }
}
