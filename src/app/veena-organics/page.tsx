import { getProducts, getCategories, mapApiProduct, mapApiCategory } from "@/lib/api";
import { mockProducts, mockCategories } from "@/data/mock";
import VeenaOrganicsClient from "./VeenaOrganicsClient";

export const metadata = {
  title: "Premium Collection — Veena Organics",
  description: "Our finest curated collections — handpicked from India's most trusted organic farms.",
};

export default async function VeenaOrganicsPage() {
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

  return <VeenaOrganicsClient products={products} categories={categories} />;
}
