"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, Eye, Zap, Heart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: "default" | "horizontal" | "minimal";
}

export function ProductCard({ product, className, variant = "default" }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem({
      id: `${product.id}-500g`,
      productId: product.id,
      productName: product.itemName,
      productImage: product.itemImage,
      price: product.itemPrice,
      quantity: 1,
      weight: "500g",
      type: "product",
    });
    toast({
      title: "Added to cart ✓",
      description: `${product.itemName} (500g)`,
    });
    await new Promise((r) => setTimeout(r, 600));
    setAdding(false);
  };

  if (variant === "horizontal") {
    return (
      <Link href={`/product/${product.id}`}
        className={cn("group flex gap-4 bg-white rounded-2xl border border-[#E8DDD0] p-3 hover:border-[#B8923A] hover:shadow-md transition-all duration-300", className)}
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F4EDE0] shrink-0 img-zoom">
          <Image src={product.itemImage} alt={product.itemName} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <p className="text-xs text-[#B8923A] font-semibold uppercase tracking-wide mb-0.5">{product.category}</p>
          <p className="font-semibold text-[#1C2B3A] text-sm leading-tight line-clamp-2 mb-2">{product.itemName}</p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-[#1C2B3A]">{formatPrice(product.itemPrice)}</p>
            <button onClick={handleAddToCart}
              className="w-7 h-7 rounded-lg bg-[#1C2B3A] hover:bg-[#B8923A] text-white flex items-center justify-center transition-colors shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.id}`} className={cn("group block", className)}>
      <div className="relative bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] hover:border-[#B8923A]/40 transition-all duration-400 card-lift"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Image container */}
        <div className="relative aspect-product bg-[#F4EDE0] overflow-hidden img-zoom">
          <Image
            src={product.itemImage}
            alt={product.itemName}
            fill
            className="object-cover transition-transform duration-600"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-[#1C2B3A]/0 group-hover:bg-[#1C2B3A]/20 transition-all duration-400" />

          {/* Quick actions - appear on hover */}
          <div className="absolute inset-x-4 bottom-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200",
                adding
                  ? "bg-[#B8923A] text-white scale-95"
                  : "bg-white hover:bg-[#B8923A] text-[#1C2B3A] hover:text-white shadow-lg"
              )}
            >
              {adding ? (
                <><Zap className="w-3.5 h-3.5" /> Added!</>
              ) : (
                <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
              )}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/product/${product.id}`); }}
              className="w-10 h-10 rounded-xl bg-white hover:bg-[#F4EDE0] text-[#1C2B3A] flex items-center justify-center shadow-lg transition-colors shrink-0"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isBestSeller && (
              <span className="badge-bestseller px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star className="w-2.5 h-2.5 fill-white" />
                Best Seller
              </span>
            )}
            {product.stockQuantity <= product.lowStockThreshold && (
              <span className="text-[10px] font-bold bg-red-500 text-white px-2.5 py-1 rounded-full shadow-sm">
                Low Stock
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWishlisted((v) => !v); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Heart className={cn("w-3.5 h-3.5 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-[#3D3328]")} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "14px 16px 16px" }}>
          {/* Category chip */}
          <p style={{ fontSize: 10, fontWeight: 700, color: "#B8923A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.category}</p>

          {/* Name */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#1C2B3A", lineHeight: 1.35, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.itemName}
          </h3>

          {/* Tags */}
          {product.dietaryTags && (
            <p style={{ fontSize: 10, color: "#7A6E62", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {product.dietaryTags.split(",").slice(0, 2).join(" · ")}
            </p>
          )}

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 10, borderTop: "1px solid #F4EDE0" }}>
            <div>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#1C2B3A" }}>{formatPrice(product.itemPrice)}</span>
              <span style={{ fontSize: 11, color: "#7A6E62", marginLeft: 3 }}>/ 500g</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: adding ? "#B8923A" : "#1C2B3A", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}
            >
              <ShoppingCart style={{ width: 12, height: 12 }} />
              {adding ? "Added" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
