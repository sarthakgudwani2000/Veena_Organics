import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategories, mapApiCategory } from "@/lib/api";
import { mockCategories } from "@/data/mock";

export const metadata = {
  title: "Categories",
  description: "Explore all categories of organic products at Veena Organics",
};

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

export default async function CategoriesPage() {
  let categories = mockCategories;

  try {
    const apiCats = await getCategories({ pageSize: 100 });
    if (apiCats.length > 0) {
      categories = apiCats.map(mapApiCategory);
    }
  } catch {
    // fallback to mock data if API is unreachable
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>
      {/* Hero */}
      <div style={{ background: navy, textAlign: "center" }} className="r-hero-pad">
        <div className="r-container" style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Browse</p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>All Categories</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Explore our complete range of organic products organised by category
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="r-container" style={{ paddingTop: 52, paddingBottom: 64 }}>
        <div className="r-grid-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="category-card">
              <div style={{ position: "relative", aspectRatio: "16/9", background: "#F6F1E8", overflow: "hidden" }}>
                <Image
                  src={cat.categoryImage}
                  alt={cat.categoryName}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div style={{ padding: "18px 20px 20px" }}>
                <h3 style={{ fontFamily: serif, fontWeight: 700, color: navy, fontSize: 16, marginBottom: 8 }}>
                  {cat.categoryName}
                </h3>
                <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {cat.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: gold, fontSize: 13, fontWeight: 700 }}>
                  Shop Now <ArrowRight style={{ width: 14, height: 14 }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
