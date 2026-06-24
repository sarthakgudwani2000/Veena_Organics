import { getProducts, getCategories, mapApiProduct, mapApiCategory } from "@/lib/api";
import { mockProducts, mockCategories } from "@/data/mock";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop All Products",
  description: "Premium organic spices, Ayurvedic herbs, dry fruits, and traditional ingredients",
};

export default async function ShopPage() {
  let products = mockProducts;
  let categories = mockCategories;

  try {
    const [apiProducts, apiCategories] = await Promise.all([
      getProducts({ pageSize: 200 }),
      getCategories({ pageSize: 100 }),
    ]);
    if (apiCategories.length > 0) categories = apiCategories.map(mapApiCategory);
    if (apiProducts.length > 0) {
      const categoryMap = new Map(apiCategories.map(c => [c.categoryId ?? c.id ?? 0, c.categoryName]));
      products = apiProducts.map(p => mapApiProduct(p, categoryMap));
    }
  } catch {
    // fallback to mock data
  }

  return <ShopClient initialProducts={products} categories={categories} />;
}
