"use client";

import React, { useState, useEffect } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Minus, Plus, Clock, ChevronDown, ChevronUp, Star, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { mockProducts, mockPoojaPackages } from "@/data/mock";
import { useResponsive } from "@/hooks/use-responsive";
import type { Product, WeightVariant } from "@/types";
import { WEIGHT_MULTIPLIERS } from "@/types";

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

const WEIGHTS: WeightVariant[] = ["100g", "250g", "500g", "1kg", "Bulk"];

const DETAIL_SECTIONS = [
  { label: "Botanical Details",     key: "botanicalDetails" },
  { label: "Traditional Uses",      key: "traditionalUses" },
  { label: "Historical Background", key: "historicalBackground" },
  { label: "Packaging & Forms",     key: "availableFormsPackaging" },
  { label: "Storage Instructions",  key: "storageInstructions" },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isMobile, isTablet, cpad } = useResponsive();
  const [selectedWeight, setSelectedWeight] = useState<WeightVariant>("500g");
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [apiProduct, setApiProduct] = useState<Product | null>(null);
  const { addItem, openCart } = useCartStore();
  const { toast } = useToast();

  const mockProduct   = mockProducts.find(p => p.id === id);
  const poojaPackage  = !mockProduct ? mockPoojaPackages.find(p => p.id === id) : null;
  const product       = mockProduct ?? apiProduct;

  // Fetch from API when not found in mock data
  useEffect(() => {
    if (!mockProduct && !poojaPackage) {
      fetch(`/api/products/${id}`)
        .then(r => r.ok ? r.json() : null)
        .then((data: Product | null) => { if (data) setApiProduct(data); })
        .catch(() => {});
    }
  }, [id, mockProduct, poojaPackage]);

  if (!product && !poojaPackage) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F6F1E8", padding: "0 16px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 56, marginBottom: 16 }}>🌿</p>
          <h1 style={{ fontFamily: serif, fontSize: "1.6rem", fontWeight: 700, color: navy, marginBottom: 10 }}>Product Not Found</h1>
          <p style={{ color: "#6B6B6B", marginBottom: 24 }}>This product doesn&apos;t exist or has been removed.</p>
          <Link href="/shop" style={{ background: navy, color: "#fff", padding: "10px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 600 }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  /* ─── Pooja package view ─── */
  if (poojaPackage) {
    return (
      <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: `32px ${cpad.split(" ")[1] ?? "16px"} 80px` }}>
          <Link href="/pooja-special" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B6B6B", marginBottom: 32, textDecoration: "none" }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Pooja Special
          </Link>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 48 }}>
            <div style={{ position: "relative", height: isMobile ? 260 : 500, borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #D4C9B8" }}>
              <Image src={poojaPackage.itemImage} alt={poojaPackage.itemName} fill style={{ objectFit: "cover" }} />
            </div>
            <div>
              <span style={{ display: "inline-block", background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pooja Package</span>
              <h1 style={{ fontFamily: serif, fontSize: "2rem", fontWeight: 700, color: navy, marginBottom: 8, lineHeight: 1.2 }}>{poojaPackage.itemName}</h1>
              <p style={{ fontSize: "1.9rem", fontWeight: 700, color: gold, marginBottom: 20 }}>{formatPrice(poojaPackage.itemPrice)}</p>
              <p style={{ color: "#5A5A5A", lineHeight: 1.75, fontSize: 14, marginBottom: 20 }}>{poojaPackage.itemDescription}</p>
              {poojaPackage.packageDuration && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B6B6B", marginBottom: 20 }}>
                  <Clock style={{ width: 16, height: 16, color: gold }} /> Duration: {poojaPackage.packageDuration}
                </div>
              )}
              {poojaPackage.packageInclusions && (
                <div style={{ background: "#FEF9EC", borderRadius: 12, padding: 16, border: "1px solid #FDE68A", marginBottom: 28 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#92400E", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Package Includes</p>
                  <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.7 }}>{poojaPackage.packageInclusions}</p>
                </div>
              )}
              <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: gold, color: "#fff", border: "none", borderRadius: 14, height: 56, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                <ShoppingCart style={{ width: 20, height: 20 }} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Product view ─── */
  const basePrice    = product!.itemPrice;
  const currentPrice = Math.round(basePrice * WEIGHT_MULTIPLIERS[selectedWeight]);
  const totalPriceAmt = currentPrice * quantity;

  const handleAddToCart = async () => {
    setAdding(true);
    addItem({
      id:           `${product!.id}-${selectedWeight}`,
      productId:    product!.id,
      productName:  product!.itemName,
      productImage: product!.itemImage,
      price:        currentPrice,
      quantity,
      weight:       selectedWeight,
      type:         "product",
    });
    toast({ title: "Added to cart ✓", description: `${product!.itemName} (${selectedWeight}) × ${quantity}` });
    await new Promise(r => setTimeout(r, 800));
    setAdding(false);
    openCart();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `32px ${cpad.split(" ")[1] ?? "16px"} 80px` }}>

        {/* Back link */}
        <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B6B6B", textDecoration: "none", marginBottom: 28, fontWeight: 500 }}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Shop
        </Link>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 56, alignItems: "start" }}>

          {/* ── LEFT: Image ── */}
          <div style={{ position: isMobile ? "static" : "sticky", top: 100 }}>
            <div style={{ position: "relative", height: isMobile ? 280 : isTablet ? 400 : 500, borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #E0D9CE", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>
              <Image src={product!.itemImage} alt={product!.itemName} fill style={{ objectFit: "cover" }} priority sizes="(max-width: 640px) 100vw, 50vw" />
              {product!.isBestSeller && (
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 999 }}>
                    <Star style={{ width: 11, height: 11 }} /> Best Seller
                  </span>
                </div>
              )}
            </div>

            {/* Guarantees strip */}
            <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, border: "1px solid #E0D9CE", padding: "14px 16px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 8 }}>
              {["100% Organic", "Lab Tested", "Free Shipping ₹999+", "Easy Returns"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check style={{ width: 10, height: 10, color: "#16A34A" }} />
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#4A4A4A" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div>
            {/* Category breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: gold }}>{product!.category}</span>
              {product!.subcategory && (
                <>
                  <span style={{ color: "#D4C9B8", fontSize: 12 }}>›</span>
                  <span style={{ fontSize: 12, color: "#9B9B9B" }}>{product!.subcategory}</span>
                </>
              )}
            </div>

            <h1 style={{ fontFamily: serif, fontSize: "clamp(1.6rem, 2.5vw, 2.5rem)", fontWeight: 700, color: navy, lineHeight: 1.2, marginBottom: 14 }}>
              {product!.itemName}
            </h1>

            {product!.dietaryTags && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                {product!.dietaryTags.split(",").map(tag => (
                  <span key={tag} style={{ fontSize: 11, fontWeight: 600, background: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0", borderRadius: 999, padding: "3px 10px" }}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: serif, fontSize: "2.4rem", fontWeight: 700, color: gold, lineHeight: 1 }}>
                {formatPrice(currentPrice)}
              </span>
              <span style={{ fontSize: 13, color: "#9B9B9B", marginLeft: 10 }}>per {selectedWeight}</span>
            </div>

            <p style={{ fontSize: 14, color: "#5A5A5A", lineHeight: 1.8, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #E8E0D0" }}>
              {product!.itemDescription}
            </p>

            {/* Weight selector */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Select Weight</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {WEIGHTS.map(w => {
                  const active = selectedWeight === w;
                  return (
                    <button key={w} onClick={() => setSelectedWeight(w)}
                      style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", textAlign: "center", minWidth: 64,
                        border: `2px solid ${active ? gold : "#D4C9B8"}`,
                        background: active ? "#FDF6EC" : "#fff",
                        color: active ? navy : "#6B6B6B",
                      }}>
                      <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>{w}</span>
                      <span style={{ display: "block", fontSize: 11, marginTop: 2, color: active ? gold : "#9B9B9B" }}>
                        {formatPrice(Math.round(basePrice * WEIGHT_MULTIPLIERS[w]))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", border: "2px solid #D4C9B8", borderRadius: 10, background: "#fff", overflow: "hidden" }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: navy }}>
                    <Minus style={{ width: 15, height: 15 }} />
                  </button>
                  <span style={{ width: 40, textAlign: "center", fontSize: 16, fontWeight: 700, color: navy }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: navy }}>
                    <Plus style={{ width: 15, height: 15 }} />
                  </button>
                </div>
                <span style={{ fontSize: 14, color: "#6B6B6B" }}>
                  Subtotal: <strong style={{ color: navy, fontSize: 16 }}>{formatPrice(totalPriceAmt)}</strong>
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <button onClick={handleAddToCart} disabled={adding}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                background: adding ? "#a07832" : gold, color: "#fff", border: "none",
                borderRadius: 14, height: 58, fontSize: 16, fontWeight: 700, cursor: "pointer",
                marginBottom: product!.stockQuantity <= product!.lowStockThreshold ? 10 : 24,
              }}>
              {adding
                ? <><Check style={{ width: 20, height: 20 }} /> Added to Cart!</>
                : <><ShoppingCart style={{ width: 20, height: 20 }} /> Add to Cart — {formatPrice(totalPriceAmt)}</>
              }
            </button>

            {product!.stockQuantity <= product!.lowStockThreshold && (
              <p style={{ fontSize: 12, color: "#DC2626", fontWeight: 600, marginBottom: 24, textAlign: "center" }}>
                ⚠ Only {product!.stockQuantity} units left in stock
              </p>
            )}

            {/* Expandable sections */}
            <div style={{ borderTop: "1px solid #E8E0D0" }}>
              {DETAIL_SECTIONS.map(({ label, key }) => {
                const value = product![key as keyof typeof product];
                if (!value || typeof value !== "string") return null;
                const isOpen = !!expanded[key];
                return (
                  <div key={key} style={{ borderBottom: "1px solid #E8E0D0" }}>
                    <button onClick={() => setExpanded(e => ({ ...e, [key]: !e[key] }))}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 4px", background: "none", border: "none", cursor: "pointer" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: navy }}>{label}</span>
                      {isOpen
                        ? <ChevronUp style={{ width: 15, height: 15, color: "#9B9B9B", flexShrink: 0 }} />
                        : <ChevronDown style={{ width: 15, height: 15, color: "#9B9B9B", flexShrink: 0 }} />
                      }
                    </button>
                    {isOpen && (
                      <div style={{ padding: "4px 4px 16px" }}>
                        <p style={{ fontSize: 13, color: "#5A5A5A", lineHeight: 1.75 }}>{value}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
