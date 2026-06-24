"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Package, LogOut, ChevronRight, Clock, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import { useResponsive } from "@/hooks/use-responsive";
import type { ApiOrder } from "@/lib/api";

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  placed:      { bg: "#FEF9C3", color: "#a16207",  label: "Placed" },
  accepted:    { bg: "#DBEAFE", color: "#1d4ed8",  label: "Accepted" },
  rejected:    { bg: "#FEE2E2", color: "#DC2626",  label: "Rejected" },
  ready:       { bg: "#D1FAE5", color: "#059669",  label: "Ready" },
  new_order:   { bg: "#F3F4F6", color: "#374151",  label: "New" },
  cancelled:   { bg: "#FEE2E2", color: "#DC2626",  label: "Cancelled" },
  completed:   { bg: "#DCFCE7", color: "#16a34a",  label: "Delivered" },
  in_transit:  { bg: "#DBEAFE", color: "#1d4ed8",  label: "In Transit" },
  failed:      { bg: "#FEE2E2", color: "#DC2626",  label: "Failed" },
  PAID:        { bg: "#DCFCE7", color: "#16a34a",  label: "Paid" },
  PENDING:     { bg: "#FEF9C3", color: "#a16207",  label: "Pending" },
  REFUNDED:    { bg: "#F3F4F6", color: "#374151",  label: "Refunded" },
};

function getStatusDisplay(order: ApiOrder) {
  const track = STATUS_STYLE[order.trackOrder];
  if (track) return track;
  const status = STATUS_STYLE[order.orderStatus];
  if (status) return status;
  return { bg: "#F3F4F6", color: "#374151", label: order.orderStatus };
}

interface StoredUser {
  customerId?: number;
  customerName?: string;
  email?: string;
  phoneNumber?: string;
  [key: string]: unknown;
}

const NAV_ITEMS = [
  { icon: User,    label: "Profile Details" },
  { icon: Package, label: "Order History",  active: true },
  { icon: MapPin,  label: "Saved Addresses" },
];

export default function ProfilePage() {
  const { isMobile, isTablet, cpad } = useResponsive();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeNav, setActiveNav] = useState("Order History");
  const { addItem } = useCartStore();
  const { toast }   = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vo_user");
      if (raw) setUser(JSON.parse(raw) as StoredUser);
    } catch { /* ignore */ }
  }, []);

  // Fetch real orders when user is loaded
  useEffect(() => {
    if (!user?.customerId) return;
    setLoadingOrders(true);
    fetch(`/api/orders?customerId=${user.customerId}`)
      .then(r => r.json())
      .then((data: ApiOrder[] | { error?: string }) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => { /* silent — orders just won't show */ })
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("vo_user");
    window.location.href = "/";
  };

  const handleReorder = (order: ApiOrder) => {
    (order.orderItems ?? []).forEach(item => {
      addItem({
        id: `reorder-${item.productId}`,
        productId: String(item.productId),
        productName: item.productName,
        productImage: item.productImage || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200",
        price: item.price,
        quantity: item.quantity,
        weight: `${item.unit}${item.unitType}`,
        type: "product",
      });
    });
    toast({ title: "Items added to cart", description: `${(order.orderItems ?? []).length} items from order #${order.orderId}` });
  };

  /* Unauthenticated */
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #D4C9B8", padding: isMobile ? "36px 24px" : "48px 40px", maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <User style={{ width: 32, height: 32, color: gold }} />
          </div>
          <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.6rem", color: navy, marginBottom: 10 }}>Sign In Required</h1>
          <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, marginBottom: 32 }}>
            Please sign in to view your profile, order history, and manage your account.
          </p>
          <Link href="/sign-in" style={{ display: "block", textDecoration: "none", marginBottom: 12 }}>
            <button style={{ width: "100%", height: 50, borderRadius: 12, border: "none", background: navy, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <User style={{ width: 18, height: 18 }} /> Sign In
            </button>
          </Link>
          <Link href="/register" style={{ display: "block", textDecoration: "none" }}>
            <button style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Create Account
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = (user.customerName ?? "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>
      {/* Hero bar */}
      <div style={{ background: navy, padding: isMobile ? "32px 0" : "48px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: cpad, display: "flex", alignItems: "center", gap: isMobile ? 14 : 20, flexWrap: "wrap" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 22 }}>{initials}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: isMobile ? "1.2rem" : "1.5rem", color: "#fff", marginBottom: 4 }}>{user.customerName ?? "My Account"}</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{user.email ?? ""}</p>
            {user.phoneNumber ? <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{user.phoneNumber as string}</p> : null}
          </div>
          <button
            onClick={handleSignOut}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 10, cursor: "pointer" }}>
            <LogOut style={{ width: 15, height: 15 }} /> Sign Out
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: `${isMobile ? 24 : 40}px ${cpad.split(" ")[1] ?? "16px"} 72px` }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "240px 1fr", gap: isMobile ? 20 : 28, alignItems: "start" }}>

          {/* Sidebar (desktop) */}
          {!isMobile && !isTablet && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #D4C9B8", padding: "20px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 8px", marginBottom: 10 }}>Account</p>
              {NAV_ITEMS.map(({ icon: Icon, label }) => (
                <button key={label} onClick={() => setActiveNav(label)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, border: "none", background: activeNav === label ? "#F6F1E8" : "none", color: activeNav === label ? navy : "#6B6B6B", fontSize: 13, fontWeight: activeNav === label ? 700 : 500, cursor: "pointer", marginBottom: 2 }}>
                  <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                  <ChevronRight style={{ width: 14, height: 14, opacity: 0.4 }} />
                </button>
              ))}
            </div>
          )}

          {/* Main content */}
          <div>
            {/* Mobile tab bar */}
            {isMobile && (
              <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 12, border: "1px solid #D4C9B8", overflow: "hidden", marginBottom: 20 }}>
                {NAV_ITEMS.map(({ icon: Icon, label }) => (
                  <button key={label} onClick={() => setActiveNav(label)}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 4px", border: "none", borderBottom: activeNav === label ? `2px solid ${navy}` : "2px solid transparent", background: activeNav === label ? "#F6F1E8" : "#fff", color: activeNav === label ? navy : "#9B9B9B", fontSize: 10, fontWeight: activeNav === label ? 700 : 500, cursor: "pointer" }}>
                    <Icon style={{ width: 16, height: 16 }} />
                    {label.split(" ")[0]}
                  </button>
                ))}
              </div>
            )}

            {/* Profile Details */}
            {activeNav === "Profile Details" && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #D4C9B8", padding: isMobile ? "20px" : "28px 32px" }}>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.25rem", color: navy, marginBottom: 24 }}>Profile Details</h2>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                  {[
                    { label: "Full Name",    value: user.customerName as string ?? "—" },
                    { label: "Email",        value: user.email as string ?? "—" },
                    { label: "Phone",        value: user.phoneNumber as string ?? "—" },
                    { label: "Customer ID",  value: user.customerId ? `#${user.customerId}` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</p>
                      <p style={{ fontSize: 14, color: navy, fontWeight: 600 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order History */}
            {activeNav === "Order History" && (
              <div>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.35rem", color: navy, marginBottom: 20 }}>Order History</h2>

                {loadingOrders && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 12 }}>
                    <Loader2 style={{ width: 22, height: 22, color: gold, animation: "spin 1s linear infinite" }} />
                    <span style={{ fontSize: 14, color: "#6B6B6B" }}>Loading orders…</span>
                  </div>
                )}

                {!loadingOrders && orders.length === 0 && (
                  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #D4C9B8", padding: "48px 24px", textAlign: "center" }}>
                    <Package style={{ width: 40, height: 40, color: "#D4C9B8", margin: "0 auto 16px" }} />
                    <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.1rem", color: navy, marginBottom: 8 }}>No orders yet</p>
                    <p style={{ fontSize: 13, color: "#9B9B9B", marginBottom: 24 }}>Start shopping to see your orders here.</p>
                    <Link href="/shop" style={{ textDecoration: "none" }}>
                      <button style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: navy, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                        Browse Products
                      </button>
                    </Link>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {orders.map(order => {
                    const s = getStatusDisplay(order);
                    return (
                      <div key={order.orderId} style={{ background: "#fff", borderRadius: 16, border: "1px solid #D4C9B8", padding: isMobile ? "16px" : "20px 24px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                          <div>
                            <p style={{ fontWeight: 700, color: navy, fontSize: 13, marginBottom: 5 }}>Order #{order.orderId}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Clock style={{ width: 13, height: 13, color: "#9B9B9B" }} />
                              <p style={{ fontSize: 12, color: "#9B9B9B" }}>
                                {order.orderCreatedDate
                                  ? new Date(order.orderCreatedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                  : "—"}
                              </p>
                            </div>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: s.color, background: s.bg, padding: "4px 12px", borderRadius: 999 }}>{s.label}</span>
                        </div>
                        <div style={{ height: 1, background: "#F0EBE1", marginBottom: 14 }} />
                        {(order.orderItems ?? []).length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                            {(order.orderItems ?? []).map((item, i) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 12, color: "#6B6B6B", flex: 1, minWidth: 0 }}>{item.productName} × {item.quantity}</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: navy, flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {order.fullAddress && (
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 14 }}>
                            <MapPin style={{ width: 12, height: 12, color: "#9B9B9B", marginTop: 2, flexShrink: 0 }} />
                            <p style={{ fontSize: 11, color: "#9B9B9B", lineHeight: 1.5 }}>{order.fullAddress}</p>
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ fontSize: 11, color: "#9B9B9B", marginBottom: 2 }}>Total</p>
                            <p style={{ fontWeight: 700, color: navy, fontSize: 16 }}>{formatPrice(order.orderNetAmount)}</p>
                          </div>
                          {(order.orderItems ?? []).length > 0 && (
                            <button onClick={() => handleReorder(order)}
                              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                              <RefreshCw style={{ width: 13, height: 13 }} /> Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
