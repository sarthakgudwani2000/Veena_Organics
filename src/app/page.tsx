import { getProducts, getCategories, mapApiProduct, mapApiCategory } from "@/lib/api";
import { mockProducts, mockCategories } from "@/data/mock";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  let featuredProducts = mockProducts.filter(p => p.isBestSeller).slice(0, 8);
  let categories = mockCategories.slice(0, 5);

  try {
    const [apiProducts, apiCategories] = await Promise.all([
      getProducts({ pageSize: 100 }),
      getCategories({ pageSize: 20 }),
    ]);
    if (apiCategories.length > 0) {
      categories = apiCategories.map(mapApiCategory).slice(0, 5);
    }
    if (apiProducts.length > 0) {
      const categoryMap = new Map(apiCategories.map(c => [c.categoryId ?? c.id ?? 0, c.categoryName]));
      const mapped = apiProducts.map(p => mapApiProduct(p, categoryMap));
      featuredProducts = mapped.filter(p => p.isBestSeller).slice(0, 8);
      if (featuredProducts.length === 0) featuredProducts = mapped.slice(0, 8);
    }
  } catch { /* fallback to mock data */ }

  return <HomeClient featuredProducts={featuredProducts} categories={categories} />;
}
