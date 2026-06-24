"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, Package } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

const serif = "'Playfair Display', Georgia, serif";
const navy = "#1C2B3A";
const gold = "#B8923A";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  if (!isOpen) return null;

  const total = totalPrice();
  const count = totalItems();

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", right: 0, top: 0, height: "100%", width: "100%", maxWidth: 420,
        zIndex: 51, background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #E8E0D0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart style={{ width: 20, height: 20, color: navy }} />
            <h2 style={{ fontFamily: serif, fontWeight: 700, color: navy, fontSize: 18, margin: 0 }}>
              Your Cart
            </h2>
            {count > 0 && (
              <span style={{ fontSize: 13, color: "#6B6B6B", fontWeight: 400 }}>({count} item{count !== 1 ? "s" : ""})</span>
            )}
          </div>
          <button onClick={closeCart}
            style={{ width: 34, height: 34, borderRadius: 8, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#F6F1E8")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <X style={{ width: 18, height: 18, color: "#6B6B6B" }} />
          </button>
        </div>

        {/* ── Items ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 16, padding: "40px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package style={{ width: 36, height: 36, color: "#D4C9B8" }} />
              </div>
              <div>
                <p style={{ fontFamily: serif, fontWeight: 700, color: navy, fontSize: 17, marginBottom: 6 }}>Your cart is empty</p>
                <p style={{ fontSize: 13, color: "#6B6B6B" }}>Add some products to get started</p>
              </div>
              <Link href="/shop" onClick={closeCart}
                style={{ marginTop: 8, display: "inline-block", background: navy, color: "#fff", padding: "10px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 12, background: "#FAFAF8", borderRadius: 14, padding: 14, border: "1px solid #E8E0D0" }}>
                  {/* Thumbnail */}
                  <div style={{ position: "relative", width: 64, height: 64, borderRadius: 10, overflow: "hidden", background: "#F6F1E8", flexShrink: 0 }}>
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="64px"
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: navy, fontSize: 13, lineHeight: 1.4, marginBottom: 3 }}>
                      {item.productName}
                    </p>
                    {item.weight && (
                      <p style={{ fontSize: 11, color: gold, fontWeight: 600, marginBottom: 10 }}>{item.weight}</p>
                    )}

                    {/* Qty + price row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Qty stepper */}
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #D4C9B8", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: navy }}
                        >
                          <Minus style={{ width: 12, height: 12 }} />
                        </button>
                        <span style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 700, color: navy }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: navy }}
                        >
                          <Plus style={{ width: 12, height: 12 }} />
                        </button>
                      </div>

                      <p style={{ fontWeight: 700, color: navy, fontSize: 14 }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ alignSelf: "flex-start", width: 30, height: 30, borderRadius: 8, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9B9B9B", flexShrink: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9B9B9B"; }}
                  >
                    <Trash2 style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px 24px", borderTop: "1px solid #E8E0D0", background: "#fff", flexShrink: 0 }}>
            {/* Free shipping nudge */}
            {total < 999 && (
              <div style={{ background: "#F6F1E8", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#6B6B6B" }}>
                Add <strong style={{ color: navy }}>{formatPrice(999 - total)}</strong> more for free shipping 🚚
              </div>
            )}

            {/* Subtotal */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: "#6B6B6B" }}>Subtotal</span>
              <span style={{ fontWeight: 700, color: navy, fontSize: 20 }}>{formatPrice(total)}</span>
            </div>
            <p style={{ fontSize: 11, color: "#9B9B9B", marginBottom: 16 }}>Shipping calculated at checkout</p>

            {/* Checkout CTA */}
            <Link href="/checkout" onClick={closeCart} style={{ display: "block", textDecoration: "none", marginBottom: 8 }}>
              <button style={{ width: "100%", height: 50, borderRadius: 12, background: gold, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Proceed to Checkout <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </Link>

            {/* Continue shopping */}
            <button onClick={closeCart}
              style={{ width: "100%", height: 40, borderRadius: 10, background: "none", border: "none", color: "#6B6B6B", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.color = navy)}
              onMouseLeave={e => (e.currentTarget.style.color = "#6B6B6B")}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
