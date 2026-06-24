import { getCategories, getProducts, mapApiProduct, mapApiCategory } from "@/lib/api";
import { mockProducts, mockCategories } from "@/data/mock";
import CategoryClient from "./CategoryClient";
import type { Product, ProductCategory } from "@/types";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category: ProductCategory | null = mockCategories.find(c => c.slug === slug) ?? null;
  let products: Product[] = mockProducts.filter(
    p => p.category.toLowerCase().replace(/\s+/g, "-") === slug ||
         p.category.toLowerCase() === (category?.categoryName ?? "").toLowerCase()
  );

  try {
    const [apiCategories, apiProducts] = await Promise.all([
      getCategories({ pageSize: 100 }),
      getProducts({ pageSize: 300 }),
    ]);

    if (apiCategories.length > 0) {
      const mapped = apiCategories.map(mapApiCategory);
      category = mapped.find(c => c.slug === slug) ?? category;
    }

    if (apiProducts.length > 0) {
      const categoryMap = new Map(apiCategories.map(c => [c.categoryId ?? c.id ?? 0, c.categoryName]));
      const allMapped = apiProducts.map(p => mapApiProduct(p, categoryMap));
      // Filter by matching category name or slug
      const catName = (category?.categoryName ?? "").toLowerCase();
      let filtered = allMapped.filter(p =>
        p.category.toLowerCase() === catName ||
        p.category.toLowerCase().replace(/\s+/g, "-") === slug
      );
      // Fallback: if nothing matches exactly, show all products (API categories may differ from slugs)
      if (filtered.length === 0) filtered = allMapped;
      products = filtered;
    }
  } catch { /* fallback to mock */ }

  return <CategoryClient slug={slug} category={category} initialProducts={products} />;
}
