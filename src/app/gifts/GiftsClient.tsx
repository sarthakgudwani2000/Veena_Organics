"use client";

import React, { useState, useMemo } from "react";
import { Gift, Building2, Heart, Crown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useResponsive } from "@/hooks/use-responsive";
import type { Product } from "@/types";

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

const GIFT_CATEGORIES = [
  { id: "all",       label: "All Gifts",  icon: Gift      },
  { id: "corporate", label: "Corporate",  icon: Building2 },
  { id: "personal",  label: "Personal",   icon: Heart     },
  { id: "wedding",   label: "Wedding",    icon: Crown     },
];

interface Props {
  products: Product[];
}

export default function GiftsClient({ products }: Props) {
  const { isMobile, cpad, cols4 } = useResponsive();
  const [activeCategory, setActiveCategory] = useState("all");

  const giftProducts = useMemo(() => {
    if (products.length === 0) return [];
    const lower = (s: string) => s.toLowerCase();
    // All products are gift-worthy; sub-filter by tab
    if (activeCategory === "corporate") {
      return products.filter(p => lower(p.category).includes("dry fruit") || lower(p.category).includes("nut") || lower(p.category).includes("gift"));
    }
    if (activeCategory === "personal") {
      return products.filter(p => lower(p.category).includes("herb") || lower(p.category).includes("ayurved") || lower(p.category).includes("spice"));
    }
    if (activeCategory === "wedding") {
      return products.filter(p => p.isBestSeller);
    }
    return products;
  }, [activeCategory, products]);

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1C2B3A 0%,#2d3e66 100%)", padding: isMobile ? "48px 0" : "72px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: cpad }}>
          <div style={{ width: 56, height: 56, background: gold, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Gift style={{ width: 26, height: 26, color: "#fff" }} />
          </div>
          <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Thoughtful Giving</p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 700, color: "#fff", marginBottom: 14 }}>Gift Collections</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
            Curated organic gift hampers for every occasion. Corporate, personal, or wedding —
            share the goodness of nature with the people you love.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "32px 16px 64px" : "48px 48px 80px" }}>
        {/* Category Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {GIFT_CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveCategory(id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: `2px solid ${activeCategory === id ? navy : "#D4C9B8"}`, background: activeCategory === id ? navy : "#fff", color: activeCategory === id ? "#fff" : "#6B6B6B", cursor: "pointer" }}>
              <Icon style={{ width: 15, height: 15 }} />
              {label}
            </button>
          ))}
        </div>

        {/* Custom Hamper Banner */}
        <div style={{ background: "rgba(184,146,58,0.1)", border: "1px solid rgba(184,146,58,0.3)", borderRadius: 16, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, background: gold, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Gift style={{ width: 22, height: 22, color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: navy, marginBottom: 3, fontSize: 15 }}>Custom Gift Hampers Available</p>
            <p style={{ fontSize: 13, color: "#6B6B6B" }}>
              Want a personalized gift hamper? Contact us at{" "}
              <a href="mailto:gifts@veenaorganics.com" style={{ color: gold, fontWeight: 600, textDecoration: "none" }}>gifts@veenaorganics.com</a>{" "}
              for corporate and bulk orders.
            </p>
          </div>
        </div>

        {giftProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 8 }}>No products in this category</p>
            <p style={{ color: "#6B6B6B" }}>Check back soon for new additions</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: cols4, gap: isMobile ? 12 : 16 }}>
            {giftProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
