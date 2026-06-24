"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Leaf, ArrowRight, Star, Shield, Sprout } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useResponsive } from "@/hooks/use-responsive";
import type { Product } from "@/types";

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

const CAROUSEL_BG = [
  "linear-gradient(135deg, #1C2B3A 0%, #2d3e66 100%)",
  "linear-gradient(135deg, #7B3F00 0%, #a0522d 100%)",
  "linear-gradient(135deg, #2E4A1E 0%, #3d6128 100%)",
  "linear-gradient(135deg, #4a1c6b 0%, #7b2d9e 100%)",
  "linear-gradient(135deg, #005a5b 0%, #008080 100%)",
];

const BADGES = [
  { icon: Star,   label: "Hand-Curated", desc: "Every product personally selected" },
  { icon: Shield, label: "Purity Tested", desc: "Lab verified for quality & safety" },
  { icon: Sprout, label: "Farm Sourced",  desc: "Direct from certified organic farms" },
  { icon: Leaf,   label: "100% Natural",  desc: "No additives or preservatives" },
];

const ITEMS_PER_PAGE = 3;

interface Category {
  id: string;
  categoryName: string;
  categoryImage: string;
  description: string;
  slug: string;
  displayOrder: number;
}

function ProductCarousel({
  title,
  subtitle,
  bg,
  products,
  categorySlug,
}: {
  title: string;
  subtitle: string;
  bg: string;
  products: Product[];
  categorySlug: string;
}) {
  const { isMobile, isTablet } = useResponsive();
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const visible = products.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ background: bg, borderRadius: 20, padding: isMobile ? "18px 20px" : "24px 32px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: serif, fontSize: isMobile ? "1.2rem" : "1.5rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{title}</h2>
          {!isMobile && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{subtitle}</p>}
        </div>
        <Link href={`/category/${categorySlug}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
          View All <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 14 : 20 }}>
        {visible.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #D4C9B8", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: page === 0 ? 0.4 : 1 }}>
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>
          <span style={{ fontSize: 12, color: "#9B9B9B" }}>{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
            style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #D4C9B8", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: page === totalPages - 1 ? 0.4 : 1 }}>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}
    </section>
  );
}

export default function VeenaOrganicsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const { isMobile, cpad } = useResponsive();

  // Group products by categoryId, keeping category order from the categories list
  const carousels = categories
    .map((cat, i) => ({
      id: cat.id,
      title: cat.categoryName,
      subtitle: cat.description || "Premium organic products",
      bg: CAROUSEL_BG[i % CAROUSEL_BG.length],
      slug: cat.slug,
      products: products.filter(p => p.category === cat.id),
    }))
    .filter(c => c.products.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${navy} 0%, #243447 50%, #1a3a2a 100%)`, padding: isMobile ? "56px 0 48px" : "88px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 32, right: 48, width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(184,146,58,0.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -48, left: 32, width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(184,146,58,0.1)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: cpad, position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,146,58,0.15)", border: "1px solid rgba(184,146,58,0.3)", color: gold, fontSize: 12, fontWeight: 700, padding: "8px 18px", borderRadius: 999, marginBottom: 24, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <Leaf style={{ width: 14, height: 14 }} /> Premium Collection
          </div>
          <h1 style={{ fontFamily: serif, fontSize: isMobile ? "2rem" : "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            The Veena Organics<br />
            <span style={{ color: gold }}>Signature Range</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.8, maxWidth: 540, margin: "0 auto 36px" }}>
            Our finest curated collections — handpicked from India&apos;s most trusted organic farms.
          </p>
          <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: gold, color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px 28px", borderRadius: 10, textDecoration: "none" }}>
            Shop All Products <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>

      {/* Badges strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E0D0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "20px 16px" : "28px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4, 1fr)", gap: isMobile ? 12 : 0 }}>
            {BADGES.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: isMobile ? "10px 8px" : "0 24px", borderRight: !isMobile && i < 3 ? "1px solid #E8E0D0" : "none" }}>
                <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, borderRadius: 12, background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 18, height: 18, color: gold }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 2 }}>{label}</p>
                  {!isMobile && <p style={{ fontSize: 11, color: "#9B9B9B", lineHeight: 1.4 }}>{desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collections */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `${isMobile ? 36 : 56}px 48px ${isMobile ? 48 : 64}px` }}>
        {carousels.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#9B9B9B" }}>
            <p style={{ fontSize: 15 }}>No products found. Check back soon.</p>
            <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: gold, fontWeight: 600, textDecoration: "none" }}>
              Browse all products <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        ) : (
          carousels.map(c => (
            <ProductCarousel
              key={c.id}
              title={c.title}
              subtitle={c.subtitle}
              bg={c.bg}
              products={c.products}
              categorySlug={c.slug}
            />
          ))
        )}
      </div>
    </div>
  );
}
