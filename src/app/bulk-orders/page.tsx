"use client";

import React, { useState } from "react";
import { Package, Upload, FileText, CheckCircle2, Building2, Users, Truck, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useResponsive } from "@/hooks/use-responsive";

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

const PRODUCT_INTERESTS = [
  "Spices & Masalas","Ayurvedic Herbs","Dry Fruits & Nuts","Organic Flours",
  "Roasted Snacks","Bakery Essentials","Pooja Samagri","Gift Hampers","Multiple Categories",
];
const BENEFITS = [
  { icon: Package,   title: "Volume Discounts",  desc: "Save up to 30% on bulk orders" },
  { icon: Truck,     title: "Priority Dispatch", desc: "Dedicated shipping for business orders" },
  { icon: Users,     title: "Account Manager",   desc: "Dedicated support for your business" },
  { icon: Building2, title: "Custom Packaging",  desc: "White-label options available" },
];
const PRICING_TIERS = [
  { range: "5–20 kg",   discount: "10% off", color: "#16a34a" },
  { range: "20–50 kg",  discount: "20% off", color: "#16a34a" },
  { range: "50–100 kg", discount: "25% off", color: "#059669" },
  { range: "100+ kg",   discount: "30% off", color: "#059669" },
];
const MIN_ORDERS = [
  "Spices & Herbs: 5 kg per SKU",
  "Dry Fruits: 10 kg per SKU",
  "Flours: 25 kg per SKU",
  "Gift Hampers: 10 units minimum",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>{children}</p>;
}

export default function BulkOrdersPage() {
  const { isMobile, isTablet, cpad, cols4, cols2 } = useResponsive();
  const [form, setForm] = useState({ companyName: "", contactName: "", email: "", phone: "", productInterest: "", quantity: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [fileName, setFileName]   = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bulk-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName:    form.productInterest,
          contactNumber:  form.phone,
          contactAddress: form.companyName + (form.message ? ` — ${form.message}` : ""),
          remarks:        `Contact: ${form.contactName}, Email: ${form.email}, Qty: ${form.quantity}kg/month`,
          isPartyOrder:   0,
        }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok || json.error) { setError(json.error ?? "Submission failed. Please try again."); return; }
      setSubmitted(true);
    } catch {
      setError("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>

      {/* Hero */}
      <div style={{ background: navy, padding: isMobile ? "48px 0" : "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: cpad }}>
          <div style={{ width: 60, height: 60, background: gold, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Building2 style={{ width: 28, height: 28, color: "#fff" }} />
          </div>
          <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>For Businesses</p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>Bulk Orders</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
            Special pricing for restaurants, caterers, Ayurvedic practitioners, retailers, and institutions.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `${isMobile ? 32 : 56}px ${cpad.split(" ")[1] ?? "16px"} ${isMobile ? 48 : 80}px` }}>

        {/* Benefits strip */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : cols4, gap: isMobile ? 12 : 16, marginBottom: isMobile ? 36 : 52 }}>
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: "#fff", borderRadius: 16, padding: isMobile ? "18px 14px" : "24px 20px", border: "1px solid #D4C9B8", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, background: "#F6F1E8", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Icon style={{ width: 22, height: 22, color: gold }} />
              </div>
              <p style={{ fontWeight: 700, color: navy, fontSize: 13, marginBottom: 5 }}>{title}</p>
              <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Main content: Form + Sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 360px", gap: isMobile ? 24 : 32, alignItems: "start" }}>

          {/* Form card */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #D4C9B8", padding: isMobile ? "24px 20px" : "36px 40px" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle2 style={{ width: 36, height: 36, color: "#16a34a" }} />
                </div>
                <h3 style={{ fontFamily: serif, fontSize: "1.4rem", fontWeight: 700, color: navy, marginBottom: 10 }}>Enquiry Submitted!</h3>
                <p style={{ color: "#6B6B6B", marginBottom: 28, fontSize: 14, lineHeight: 1.65 }}>Our bulk orders team will contact you within 2 business days.</p>
                <button onClick={() => setSubmitted(false)}
                  style={{ padding: "10px 24px", borderRadius: 10, border: "2px solid #D4C9B8", background: "#fff", color: navy, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: serif, fontSize: "1.5rem", fontWeight: 700, color: navy, marginBottom: 28 }}>Submit Bulk Order Enquiry</h2>
                <form onSubmit={handleSubmit}>
                  {/* Row 1 */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 20, marginBottom: 20 }}>
                    <div><FieldLabel>Company Name *</FieldLabel><Input value={form.companyName} onChange={set("companyName")} placeholder="Your company name" required /></div>
                    <div><FieldLabel>Contact Person *</FieldLabel><Input value={form.contactName} onChange={set("contactName")} placeholder="Your full name" required /></div>
                  </div>
                  {/* Row 2 */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 20, marginBottom: 20 }}>
                    <div><FieldLabel>Email Address *</FieldLabel><Input type="email" value={form.email} onChange={set("email")} placeholder="business@email.com" required /></div>
                    <div><FieldLabel>Phone Number *</FieldLabel><Input type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" required /></div>
                  </div>
                  {/* Row 3 */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 20, marginBottom: 20 }}>
                    <div>
                      <FieldLabel>Product Category</FieldLabel>
                      <Select value={form.productInterest} onValueChange={v => setForm(f => ({ ...f, productInterest: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>{PRODUCT_INTERESTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><FieldLabel>Monthly Quantity (kg)</FieldLabel><Input type="number" value={form.quantity} onChange={set("quantity")} placeholder="e.g., 50" min="1" /></div>
                  </div>
                  {/* File upload */}
                  <div style={{ marginBottom: 20 }}>
                    <FieldLabel>Upload Product List (Optional)</FieldLabel>
                    <label style={{ display: "flex", alignItems: "center", gap: 14, border: `2px dashed ${fileName ? gold : "#D4C9B8"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", background: fileName ? "rgba(184,146,58,0.04)" : "#FAFAF8" }}>
                      <div style={{ width: 42, height: 42, background: "#F6F1E8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {fileName ? <FileText style={{ width: 20, height: 20, color: gold }} /> : <Upload style={{ width: 20, height: 20, color: "#9B9B9B" }} />}
                      </div>
                      <div>
                        {fileName
                          ? <p style={{ fontSize: 13, fontWeight: 600, color: gold }}>{fileName}</p>
                          : <><p style={{ fontSize: 13, fontWeight: 600, color: "#2B2B2B", marginBottom: 2 }}>Upload CSV, Excel, or Word file</p><p style={{ fontSize: 11, color: "#9B9B9B" }}>with product names and quantities</p></>
                        }
                      </div>
                      <input type="file" accept=".csv,.xlsx,.xls,.doc,.docx,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) setFileName(f.name); }} style={{ display: "none" }} />
                    </label>
                  </div>
                  {/* Message */}
                  <div style={{ marginBottom: 28 }}>
                    <FieldLabel>Additional Requirements</FieldLabel>
                    <Textarea value={form.message} onChange={set("message")} placeholder="Custom packaging, delivery schedule, special requirements..." style={{ minHeight: 120, resize: "vertical" }} />
                  </div>
                  {error && (
                    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626" }}>
                      {error}
                    </div>
                  )}
                  <button type="submit" disabled={loading}
                    style={{ width: "100%", height: 52, borderRadius: 12, border: "none", background: loading ? "#c4a870" : gold, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading ? "Submitting…" : "Submit Bulk Enquiry"}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: navy, borderRadius: 16, padding: "24px 24px 28px" }}>
              <h3 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.05rem", color: "#fff", marginBottom: 16 }}>Minimum Order</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MIN_ORDERS.map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: gold, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "24px 24px 28px", border: "1px solid #D4C9B8" }}>
              <h3 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.05rem", color: navy, marginBottom: 16 }}>Bulk Pricing</h3>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {PRICING_TIERS.map((tier, i) => (
                  <div key={tier.range} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < PRICING_TIERS.length - 1 ? "1px solid #F0EBE1" : "none" }}>
                    <span style={{ fontSize: 13, color: "#5A5A5A", fontWeight: 500 }}>{tier.range}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tier.color, background: "#DCFCE7", padding: "3px 10px", borderRadius: 999 }}>{tier.discount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#FEF9EC", borderRadius: 16, padding: "20px 24px", border: "1px solid #FDE68A" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: navy }}>Quick Quote</p>
              </div>
              <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.65 }}>Call us directly for immediate assistance with bulk orders.</p>
              <a href="tel:+919876543210" style={{ display: "inline-block", marginTop: 10, fontSize: 15, fontWeight: 700, color: gold, textDecoration: "none" }}>+91 98765 43210</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
