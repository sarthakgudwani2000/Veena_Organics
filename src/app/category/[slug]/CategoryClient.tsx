"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, Star } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useResponsive } from "@/hooks/use-responsive";
import type { Product, ProductCategory } from "@/types";

const navy = "#1C2B3A";
const gold = "#B8923A";
const serif = "'Playfair Display', Georgia, serif";

interface Props {
  slug: string;
  category: ProductCategory | null;
  initialProducts: Product[];
}

export default function CategoryClient({ slug, category, initialProducts }: Props) {
  const { isMobile, cols4, cpad } = useResponsive();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [bestSellersOnly, setBestSellersOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const products = useMemo(() => {
    let results = initialProducts.filter(
      p => p.itemPrice >= priceRange[0] && p.itemPrice <= priceRange[1]
    );
    if (bestSellersOnly) results = results.filter(p => p.isBestSeller);
    switch (sortBy) {
      case "price-low":  return [...results].sort((a, b) => a.itemPrice - b.itemPrice);
      case "price-high": return [...results].sort((a, b) => b.itemPrice - a.itemPrice);
      default:           return results;
    }
  }, [initialProducts, priceRange, bestSellersOnly, sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>
      {/* Hero */}
      <div style={{ background: navy, padding: isMobile ? "40px 0" : "56px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: cpad }}>
          <Link href="/categories" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> All Categories
          </Link>
          <h1 style={{ fontFamily: serif, fontSize: isMobile ? "1.8rem" : "clamp(2rem,3vw,2.8rem)", fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            {category?.categoryName ?? slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
          {category?.description && (
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 520, fontSize: 15, lineHeight: 1.65 }}>{category.description}</p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "20px 16px 64px" : "32px 48px 80px" }}>
        {/* Filters */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #D4C9B8", padding: isMobile ? "14px 16px" : "14px 20px", marginBottom: 20, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B6B6B" }}>
            <SlidersHorizontal style={{ width: 15, height: 15 }} />
            <span style={{ fontWeight: 600, color: navy }}>Filters:</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6B6B6B" }}>Max: ₹{priceRange[1]}</span>
            <input type="range" min={0} max={10000} step={100} value={priceRange[1]}
              onChange={e => setPriceRange([0, Number(e.target.value)])}
              style={{ width: 100, accentColor: gold }} />
          </div>

          <button onClick={() => setBestSellersOnly(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1.5px solid ${bestSellersOnly ? gold : "#D4C9B8"}`, background: bestSellersOnly ? gold : "#fff", color: bestSellersOnly ? "#fff" : "#6B6B6B", cursor: "pointer" }}>
            <Star style={{ width: 12, height: 12, fill: bestSellersOnly ? "#fff" : "none" }} /> Best Sellers
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {[{ value: "default", label: "Default" }, { value: "price-low", label: "Price ↑" }, { value: "price-high", label: "Price ↓" }].map(s => (
              <button key={s.value} onClick={() => setSortBy(s.value)}
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: sortBy === s.value ? navy : "#F6F1E8", color: sortBy === s.value ? "#fff" : "#6B6B6B", border: "none", cursor: "pointer" }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, color: navy }}>{products.length}</span> products
        </p>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 8 }}>No products in this category yet</p>
            <Link href="/shop" style={{ textDecoration: "none" }}>
              <button style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Browse All Products
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: cols4, gap: isMobile ? 12 : 16 }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
