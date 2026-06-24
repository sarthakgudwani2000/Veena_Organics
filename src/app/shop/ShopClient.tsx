"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { similarityScore } from "@/lib/utils";
import { useResponsive } from "@/hooks/use-responsive";
import type { Product, ProductCategory } from "@/types";

const navy = "#1C2B3A";
const gold = "#C6A46C";
const ITEMS_PER_PAGE = 24;

interface ShopClientProps {
  initialProducts: Product[];
  categories: ProductCategory[];
}

export default function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const { isMobile, isTablet, cpad, cols4 } = useResponsive();
  const [search,           setSearch]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange,       setPriceRange]        = useState([0, 10000]);
  const [sortBy,           setSortBy]            = useState("default");
  const [bestSellersOnly,  setBestSellersOnly]   = useState(false);
  const [filtersOpen,      setFiltersOpen]        = useState(false);
  const [page,             setPage]               = useState(1);

  const filtered = useMemo(() => {
    let results = initialProducts;
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(p => {
        const ns = similarityScore(p.itemName.toLowerCase(), q);
        const cs = similarityScore(p.category.toLowerCase(), q);
        return ns >= 0.5 || cs >= 0.5 || p.itemDescription.toLowerCase().includes(q) ||
          p.itemName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      });
    }
    if (selectedCategory !== "all")
      results = results.filter(p => p.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory);
    results = results.filter(p => p.itemPrice >= priceRange[0] && p.itemPrice <= priceRange[1]);
    if (bestSellersOnly) results = results.filter(p => p.isBestSeller);
    switch (sortBy) {
      case "price-low":  results = [...results].sort((a, b) => a.itemPrice - b.itemPrice); break;
      case "price-high": results = [...results].sort((a, b) => b.itemPrice - a.itemPrice); break;
      case "name":       results = [...results].sort((a, b) => a.itemName.localeCompare(b.itemName)); break;
    }
    return results;
  }, [search, selectedCategory, priceRange, sortBy, bestSellersOnly, initialProducts]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch(""); setSelectedCategory("all"); setPriceRange([0, 10000]);
    setSortBy("default"); setBestSellersOnly(false); setPage(1);
  };
  const hasActive = search || selectedCategory !== "all" || priceRange[0] > 0 || priceRange[1] < 10000 || sortBy !== "default" || bestSellersOnly;

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>
      {/* Header */}
      <div style={{ background: navy, padding: isMobile ? "40px 0" : "56px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: cpad, textAlign: "center" }}>
          <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Our Products</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            Shop All Products
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto", fontSize: 15, lineHeight: 1.65 }}>
            Premium organic spices, Ayurvedic herbs, dry fruits, and traditional ingredients
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `32px ${cpad.split(" ")[1] ?? "16px"}` }}>

        {/* Search + Sort */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ position: "relative", flex: 1, width: isMobile ? "100%" : undefined }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9B9B9B" }} />
            <Input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products, categories, herbs..."
              className="bg-white"
              style={{ paddingLeft: 40 }}
            />
          </div>
          <div style={{ display: "flex", gap: 12, width: isMobile ? "100%" : undefined }}>
            <Select value={sortBy} onValueChange={v => { setSortBy(v); setPage(1); }}>
              <SelectTrigger className="bg-white" style={{ width: isMobile ? "100%" : 180 }}>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-white"
              style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
              onClick={() => setFiltersOpen(v => !v)}
            >
              <SlidersHorizontal style={{ width: 16, height: 16 }} />
              {!isMobile && "Filters"}
              {hasActive && <span style={{ width: 8, height: 8, borderRadius: "50%", background: gold, display: "inline-block" }} />}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #D4C9B8", padding: isMobile ? 16 : 24, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, color: navy, fontSize: 15 }}>Filters</h3>
              {hasActive && (
                <Button variant="ghost" size="sm" onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: 4, color: "#E53935", fontSize: 12 }}>
                  <X style={{ width: 12, height: 12 }} /> Clear all
                </Button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 1fr 1fr", gap: isMobile ? 16 : 24 }}>
              {/* Category */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#2B2B2B", marginBottom: 12 }}>Category</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button onClick={() => { setSelectedCategory("all"); setPage(1); }}
                    style={{ padding: "5px 12px", fontSize: 12, borderRadius: 999, border: `1px solid ${selectedCategory === "all" ? navy : "#D4C9B8"}`, background: selectedCategory === "all" ? navy : "#fff", color: selectedCategory === "all" ? "#fff" : "#6B6B6B", fontWeight: 500, cursor: "pointer" }}>
                    All
                  </button>
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                      style={{ padding: "5px 12px", fontSize: 12, borderRadius: 999, border: `1px solid ${selectedCategory === cat.slug ? navy : "#D4C9B8"}`, background: selectedCategory === cat.slug ? navy : "#fff", color: selectedCategory === cat.slug ? "#fff" : "#6B6B6B", fontWeight: 500, cursor: "pointer" }}>
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#2B2B2B", marginBottom: 12 }}>Price: ₹{priceRange[0]} – ₹{priceRange[1]}</p>
                <Slider min={0} max={10000} step={50} value={[priceRange[1]]} onValueChange={v => { setPriceRange([0, v[0]]); setPage(1); }} />
              </div>
              {/* Special */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#2B2B2B", marginBottom: 12 }}>Special Filters</p>
                <button
                  onClick={() => { setBestSellersOnly(v => !v); setPage(1); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, border: `1px solid ${bestSellersOnly ? gold : "#D4C9B8"}`, background: bestSellersOnly ? gold : "#fff", color: bestSellersOnly ? navy : "#6B6B6B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <Star style={{ width: 14, height: 14 }} /> Best Sellers Only
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>
            Showing <strong style={{ color: navy }}>{filtered.length}</strong> products
            {hasActive && (
              <button onClick={clearFilters} style={{ marginLeft: 8, color: "#E53935", fontSize: 12, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                (clear filters)
              </button>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: navy, marginBottom: 8 }}>No products found</p>
            <p style={{ color: "#6B6B6B", marginBottom: 24 }}>Try adjusting your search or filters</p>
            <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: cols4, gap: isMobile ? 12 : 16 }}>
            {paginated.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <ChevronLeft style={{ width: 16, height: 16 }} /> Prev
            </Button>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
              {Array.from({ length: Math.min(isMobile ? 5 : 10, totalPages) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 36, height: 36, borderRadius: 8, fontSize: 13, fontWeight: 500, background: page === p ? navy : "#fff", color: page === p ? "#fff" : "#6B6B6B", border: `1px solid ${page === p ? navy : "#D4C9B8"}`, cursor: "pointer" }}>
                  {p}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              Next <ChevronRight style={{ width: 16, height: 16 }} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
