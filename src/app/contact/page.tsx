"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useResponsive } from "@/hooks/use-responsive";

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

const CONTACT_CARDS = [
  { icon: Phone,  label: "Phone",   value: "+91 98765 43210",       sub: "Mon–Sat, 9am–7pm",     href: "tel:+919876543210" },
  { icon: Mail,   label: "Email",   value: "info@veenaorganics.com", sub: "Reply within 24 hours", href: "mailto:info@veenaorganics.com" },
  { icon: MapPin, label: "Address", value: "Crawford Market, Mumbai", sub: "Maharashtra 400001",  href: null },
  { icon: Clock,  label: "Hours",   value: "Mon–Sat: 9am – 7pm",    sub: "Sunday: 10am – 4pm",   href: null },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>{children}</p>;
}

export default function ContactPage() {
  const { isMobile, isTablet, cpad } = useResponsive();
  const [form, setForm]       = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]    = useState(false);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>

      {/* Hero */}
      <div style={{ background: navy, padding: isMobile ? "48px 0" : "72px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: cpad }}>
          <div style={{ width: 60, height: 60, background: gold, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <MessageCircle style={{ width: 28, height: 28, color: "#fff" }} />
          </div>
          <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Get in Touch</p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#fff", marginBottom: 14 }}>Contact Us</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.75, maxWidth: 440, margin: "0 auto" }}>
            We&apos;d love to hear from you. Reach out for orders, queries, or anything at all.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `${isMobile ? 32 : 56}px ${cpad.split(" ")[1] ?? "16px"} ${isMobile ? 48 : 80}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 400px", gap: isMobile ? 24 : 36, alignItems: "start" }}>

          {/* Form */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #D4C9B8", padding: isMobile ? "24px 20px" : "36px 40px" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle2 style={{ width: 36, height: 36, color: "#16a34a" }} />
                </div>
                <h3 style={{ fontFamily: serif, fontSize: "1.4rem", fontWeight: 700, color: navy, marginBottom: 10 }}>Message Sent!</h3>
                <p style={{ color: "#6B6B6B", fontSize: 14, lineHeight: 1.65, marginBottom: 28 }}>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  style={{ padding: "10px 24px", borderRadius: 10, border: "2px solid #D4C9B8", background: "#fff", color: navy, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: serif, fontSize: "1.6rem", fontWeight: 700, color: navy, marginBottom: 28 }}>Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 20, marginBottom: 20 }}>
                    <div><FieldLabel>Full Name *</FieldLabel><Input value={form.name} onChange={set("name")} placeholder="Your full name" required /></div>
                    <div><FieldLabel>Phone Number</FieldLabel><Input type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" /></div>
                  </div>
                  <div style={{ marginBottom: 20 }}><FieldLabel>Email Address *</FieldLabel><Input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" required /></div>
                  <div style={{ marginBottom: 20 }}><FieldLabel>Subject</FieldLabel><Input value={form.subject} onChange={set("subject")} placeholder="What is this about?" /></div>
                  <div style={{ marginBottom: 28 }}>
                    <FieldLabel>Message *</FieldLabel>
                    <Textarea value={form.message} onChange={set("message")} placeholder="Tell us how we can help you..." style={{ minHeight: 140, resize: "vertical" }} required />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ width: "100%", height: 52, borderRadius: 12, border: "none", background: loading ? "#c4a870" : gold, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading ? "Sending…" : <><Send style={{ width: 16, height: 16 }} /> Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: "1.4rem", fontWeight: 700, color: navy, marginBottom: 10 }}>Get in Touch</h2>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.75 }}>
                We&apos;re here to help with any questions about our products, orders, or bulk enquiries.
                Our team typically responds within a few hours during business hours.
              </p>
            </div>

            {/* Contact cards */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {CONTACT_CARDS.map(({ icon: Icon, label, value, sub, href }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #D4C9B8", padding: "18px 16px" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <Icon style={{ width: 17, height: 17, color: gold }} />
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{label}</p>
                  {href
                    ? <a href={href} style={{ display: "block", fontSize: 13, fontWeight: 700, color: navy, textDecoration: "none", marginBottom: 3 }}>{value}</a>
                    : <p style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 3 }}>{value}</p>
                  }
                  <p style={{ fontSize: 11, color: "#9B9B9B" }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Store card */}
            <div style={{ background: navy, borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(184,146,58,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <MapPin style={{ width: 22, height: 22, color: gold }} />
              </div>
              <p style={{ fontFamily: serif, color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Visit Our Store</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>Crawford Market, Mumbai<br />Maharashtra, India 400001</p>
              <span style={{ display: "inline-block", background: "rgba(184,146,58,0.2)", color: gold, fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 999, letterSpacing: "0.06em" }}>
                Open Mon–Sat 9am–7pm
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
