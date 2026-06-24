import { getProducts, getCategories, mapApiProduct } from "@/lib/api";
import { mockProducts } from "@/data/mock";
import GiftsClient from "./GiftsClient";

export default async function GiftsPage() {
  let products = mockProducts.filter(
    p => p.category === "Dry Fruits & Nuts" || p.category === "Spices & Masalas" || p.category === "Gift Hampers" || p.category === "Ayurvedic Herbs"
  );

  try {
    const [apiProducts, apiCategories] = await Promise.all([
      getProducts({ pageSize: 200 }),
      getCategories({ pageSize: 100 }),
    ]);
    if (apiProducts.length > 0) {
      const categoryMap = new Map(apiCategories.map(c => [c.categoryId ?? c.id ?? 0, c.categoryName]));
      products = apiProducts.map(p => mapApiProduct(p, categoryMap));
    }
  } catch { /* fallback to mock */ }

  return <GiftsClient products={products} />;
}
