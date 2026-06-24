"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CreditCard, Truck, CheckCircle2, Package, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { useResponsive } from "@/hooks/use-responsive";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

type Step = "cart" | "address" | "payment" | "review";

const STEPS: { id: Step; label: string }[] = [
  { id: "cart",    label: "Cart"    },
  { id: "address", label: "Address" },
  { id: "payment", label: "Payment" },
  { id: "review",  label: "Review"  },
];

interface StoredUser {
  customerId?: number;
  customerName?: string;
  email?: string;
  phoneNumber?: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("rzp-script")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id  = "rzp-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const { isMobile } = useResponsive();
  const [step, setStep] = useState<Step>("cart");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [address, setAddress] = useState({ fullName: "", phoneNumber: "", address: "", city: "", state: "", postalCode: "", country: "India" });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<StoredUser | null>(null);
  const { items, totalPrice, clearCart } = useCartStore();

  const subtotal  = totalPrice();
  const shipping  = subtotal >= 999 ? 0 : 60;
  const total     = subtotal + shipping;
  const stepIndex = STEPS.findIndex(s => s.id === step);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vo_user");
      if (raw) {
        const u = JSON.parse(raw) as StoredUser;
        setUser(u);
        setAddress(a => ({
          ...a,
          fullName: u.customerName ?? a.fullName,
          phoneNumber: u.phoneNumber ?? a.phoneNumber,
        }));
      }
    } catch { /* ignore */ }
  }, []);

  const buildOrderItems = () =>
    items.map(item => ({
      productId:     Number(item.productId) || 0,
      productName:   item.productName,
      productImage:  item.productImage,
      price:         item.price,
      mrp:           item.price,
      quantity:      item.quantity,
      unit:          1,
      unitType:      item.weight ?? "unit",
      categoryId:    0,
      subCategoryId: 0,
      brandId:       0,
      typeId:        0,
      attributeId:   0,
      groupId:       `web-${Date.now()}`,
    }));

  const handleCOD = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId:        user?.customerId ?? 0,
          customerName:      address.fullName,
          phoneNumber:       address.phoneNumber,
          fullAddress:       `${address.address}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`,
          paymentMode:       "cod",
          items:             buildOrderItems(),
          orderGrossAmount:  total,
          orderNetAmount:    total,
        }),
      });
      const json = await res.json() as { success?: boolean; orderId?: string; error?: string };
      if (!res.ok || json.error) { setError(json.error ?? "Order failed."); return; }
      clearCart();
      setOrderId(String(json.orderId ?? ""));
      setOrderPlaced(true);
    } catch {
      setError("Unable to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    setLoading(true);
    setError("");
    const loaded = await loadRazorpayScript();
    if (!loaded) { setError("Payment gateway failed to load. Please try again."); setLoading(false); return; }

    try {
      const requestId = `vo-${Date.now()}`;
      const rzpRes = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:              total * 100,
          customerName:        address.fullName,
          customerIdentifier:  user?.email ?? address.phoneNumber,
          requestId,
        }),
      });
      const rzpData = await rzpRes.json() as { id?: string; orderId?: string; error?: string };
      if (!rzpRes.ok || rzpData.error) { setError(rzpData.error ?? "Payment init failed."); setLoading(false); return; }

      const orderForVerify = {
        customerId:       user?.customerId ?? 0,
        customerName:     address.fullName,
        phoneNumber:      address.phoneNumber,
        fullAddress:      `${address.address}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`,
        items:            buildOrderItems(),
        orderGrossAmount: total,
        orderNetAmount:   total,
      };

      const options: Record<string, unknown> = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      total * 100,
        currency:    "INR",
        name:        "Veena Organics",
        description: "Order Payment",
        order_id:    rzpData.id ?? rzpData.orderId,
        prefill: {
          name:    address.fullName,
          contact: address.phoneNumber,
          email:   user?.email ?? "",
        },
        theme: { color: gold },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verRes = await fetch("/api/checkout/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId:   response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                order:             orderForVerify,
              }),
            });
            const verData = await verRes.json() as { success?: boolean; orderId?: string; error?: string };
            if (!verRes.ok || verData.error) { setError(verData.error ?? "Payment verification failed."); return; }
            clearCart();
            setOrderId(String(verData.orderId ?? response.razorpay_payment_id));
            setOrderPlaced(true);
          } catch {
            setError("Payment verified but order confirmation failed. Contact support.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "cod") handleCOD();
    else handleRazorpay();
  };

  /* ── Success screen ── */
  if (orderPlaced) {
    return (
      <div style={{ minHeight: "100vh", background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #D4C9B8", padding: isMobile ? "32px 20px" : "48px 40px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: "#16a34a" }} />
          </div>
          <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.75rem", color: navy, marginBottom: 8 }}>Order Placed!</h1>
          <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 6 }}>Your order has been confirmed.</p>
          {orderId && <p style={{ fontSize: 13, fontWeight: 700, color: gold, marginBottom: 20 }}>Order #{orderId}</p>}
          <p style={{ fontSize: 13, color: "#9B9B9B", lineHeight: 1.7, marginBottom: 32 }}>
            You&apos;ll receive updates as your order is processed and shipped.
          </p>
          <Link href="/shop" style={{ display: "block", textDecoration: "none", marginBottom: 12 }}>
            <button style={{ width: "100%", height: 50, borderRadius: 12, border: "none", background: gold, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Continue Shopping
            </button>
          </Link>
          <Link href="/profile" style={{ display: "block", textDecoration: "none" }}>
            <button style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              View My Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  /* ── Stepper ── */
  const StepBar = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {STEPS.map((s, i) => {
        const isActive = s.id === step;
        const isDone   = stepIndex > i;
        return (
          <React.Fragment key={s.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${isActive ? gold : isDone ? "#4ade80" : "rgba(255,255,255,0.25)"}`, background: isActive ? `${gold}33` : isDone ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isDone
                  ? <CheckCircle2 style={{ width: 14, height: 14, color: "#4ade80" }} />
                  : <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? gold : "rgba(255,255,255,0.4)" }}>{i + 1}</span>
                }
              </div>
              {!isMobile && <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? gold : isDone ? "#4ade80" : "rgba(255,255,255,0.4)" }}>{s.label}</span>}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: stepIndex > i ? "#4ade80" : "rgba(255,255,255,0.2)", margin: "0 8px" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  /* ── Order summary sidebar ── */
  const Summary = () => (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #D4C9B8", padding: 20 }}>
      <h3 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1rem", color: navy, marginBottom: 16 }}>Order Summary</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {items.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6B6B6B", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.productName} × {item.quantity}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: navy, flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "#F0EBE1", marginBottom: 12 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#6B6B6B" }}>Subtotal</span>
          <span style={{ fontSize: 13, color: navy }}>{formatPrice(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#6B6B6B" }}>Shipping</span>
          <span style={{ fontSize: 13, color: shipping === 0 ? "#16a34a" : navy, fontWeight: shipping === 0 ? 700 : 400 }}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
        </div>
        {shipping > 0 && <p style={{ fontSize: 11, color: gold }}>Add {formatPrice(999 - subtotal)} more for free shipping</p>}
        <div style={{ height: 1, background: "#F0EBE1" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: navy }}>Total</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: navy }}>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );

  const fieldStyle: React.CSSProperties = { width: "100%", height: 44, borderRadius: 10, border: "1.5px solid #D4C9B8", padding: "0 12px", fontSize: 14, color: navy, background: "#fff", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: navy, marginBottom: 6, display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>
      {/* Header */}
      <div style={{ background: navy, padding: isMobile ? "24px 16px" : "32px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "0" : "0 24px" }}>
          <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: isMobile ? "1.3rem" : "1.6rem", color: "#fff", marginBottom: 20 }}>Checkout</h1>
          <StepBar />
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "24px 16px 64px" : "32px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* Main panel */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #D4C9B8", padding: isMobile ? "20px" : "28px 32px" }}>

            {/* ── Cart ── */}
            {step === "cart" && (
              <div>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.2rem", color: navy, marginBottom: 20 }}>Your Cart</h2>
                {items.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <Package style={{ width: 40, height: 40, color: "#D4C9B8", margin: "0 auto 16px" }} />
                    <p style={{ color: "#6B6B6B", marginBottom: 20 }}>Your cart is empty</p>
                    <Link href="/shop" style={{ textDecoration: "none" }}>
                      <button style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: navy, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Shop Now</button>
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", background: "#FAFAF8", borderRadius: 12, padding: 12, border: "1px solid #E8E0D0" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", background: "#F6F1E8", flexShrink: 0, position: "relative" }}>
                          <Image src={item.productImage} alt={item.productName} fill style={{ objectFit: "cover" }} sizes="56px" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, color: navy, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.productName}</p>
                          {item.weight && <p style={{ fontSize: 11, color: gold, marginTop: 2 }}>{item.weight}</p>}
                          <p style={{ fontSize: 11, color: "#9B9B9B", marginTop: 1 }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontWeight: 700, color: navy, fontSize: 13, flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                    <button
                      onClick={() => setStep("address")}
                      style={{ width: "100%", height: 50, borderRadius: 12, border: "none", background: gold, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
                      Proceed to Address <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Address ── */}
            {step === "address" && (
              <div>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.2rem", color: navy, marginBottom: 20 }}>Delivery Address</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={fieldStyle} value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} placeholder="Your full name" />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input style={fieldStyle} value={address.phoneNumber} onChange={e => setAddress(a => ({ ...a, phoneNumber: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Address *</label>
                    <input style={fieldStyle} value={address.address} onChange={e => setAddress(a => ({ ...a, address: e.target.value }))} placeholder="House no, Street, Area" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input style={fieldStyle} value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} placeholder="City" />
                    </div>
                    <div>
                      <label style={labelStyle}>State *</label>
                      <input style={fieldStyle} value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} placeholder="State" />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Pincode *</label>
                      <input style={fieldStyle} value={address.postalCode} onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))} placeholder="6-digit pincode" />
                    </div>
                    <div>
                      <label style={labelStyle}>Country</label>
                      <input style={{ ...fieldStyle, background: "#F6F1E8", color: "#9B9B9B" }} value="India" disabled />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button onClick={() => setStep("cart")}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 10, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <ArrowLeft style={{ width: 15, height: 15 }} /> Back
                    </button>
                    <button
                      onClick={() => setStep("payment")}
                      disabled={!address.fullName || !address.address || !address.city || !address.phoneNumber}
                      style={{ flex: 1, height: 48, borderRadius: 10, border: "none", background: (!address.fullName || !address.address || !address.city || !address.phoneNumber) ? "#D4C9B8" : gold, color: "#fff", fontSize: 14, fontWeight: 700, cursor: (!address.fullName || !address.address || !address.city || !address.phoneNumber) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      Continue to Payment <ArrowRight style={{ width: 15, height: 15 }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Payment ── */}
            {step === "payment" && (
              <div>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.2rem", color: navy, marginBottom: 20 }}>Payment Method</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  {([
                    { id: "online" as const, title: "Pay Online", sub: "UPI, Cards, Net Banking via Razorpay", badge: "Recommended" },
                    { id: "cod"    as const, title: "Cash on Delivery", sub: "Pay when your order arrives" },
                  ] as { id: "online" | "cod"; title: string; sub: string; badge?: string }[]).map(opt => (
                    <button key={opt.id} onClick={() => setPaymentMethod(opt.id)}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, border: `2px solid ${paymentMethod === opt.id ? gold : "#D4C9B8"}`, background: paymentMethod === opt.id ? `${gold}10` : "#fff", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${paymentMethod === opt.id ? gold : "#D4C9B8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {paymentMethod === opt.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: gold }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, color: navy, fontSize: 14, marginBottom: 2 }}>{opt.title}</p>
                        <p style={{ fontSize: 12, color: "#9B9B9B" }}>{opt.sub}</p>
                      </div>
                      {opt.badge && <span style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", background: "#DBEAFE", padding: "3px 10px", borderRadius: 999 }}>{opt.badge}</span>}
                      {opt.id === "cod" && <Truck style={{ width: 18, height: 18, color: "#9B9B9B" }} />}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep("address")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 10, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <ArrowLeft style={{ width: 15, height: 15 }} /> Back
                  </button>
                  <button onClick={() => setStep("review")}
                    style={{ flex: 1, height: 48, borderRadius: 10, border: "none", background: gold, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Review Order <ArrowRight style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Review ── */}
            {step === "review" && (
              <div>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.2rem", color: navy, marginBottom: 20 }}>Review & Confirm</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                  <div style={{ background: "#F6F1E8", borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Delivery Address</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: navy, marginBottom: 4 }}>{address.fullName}</p>
                    <p style={{ fontSize: 13, color: "#6B6B6B" }}>{address.address}, {address.city}, {address.state} {address.postalCode}</p>
                    <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 2 }}>{address.phoneNumber}</p>
                  </div>
                  <div style={{ background: "#F6F1E8", borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Payment</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {paymentMethod === "online" ? <CreditCard style={{ width: 16, height: 16, color: navy }} /> : <Truck style={{ width: 16, height: 16, color: navy }} />}
                      <p style={{ fontSize: 14, fontWeight: 600, color: navy }}>{paymentMethod === "online" ? "Online Payment (Razorpay)" : "Cash on Delivery"}</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <AlertCircle style={{ width: 16, height: 16, color: "#DC2626", marginTop: 1, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: "#DC2626" }}>{error}</p>
                  </div>
                )}

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep("payment")} disabled={loading}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 10, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                    <ArrowLeft style={{ width: 15, height: 15 }} /> Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    style={{ flex: 1, height: 50, borderRadius: 10, border: "none", background: loading ? "#8B9DB0" : navy, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading
                      ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Processing…</>
                      : <><CheckCircle2 style={{ width: 16, height: 16 }} /> {paymentMethod === "online" ? `Pay ${formatPrice(total)}` : "Place Order"}</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <Summary />
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
