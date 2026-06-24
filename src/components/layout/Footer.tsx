"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Leaf, Phone, Mail, MapPin, Share2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useResponsive } from "@/hooks/use-responsive";

const navy = "#1C2B3A";
const gold = "#B8923A";

const QUICK_LINKS = [
  { href: "/shop",            label: "Shop All Products"  },
  { href: "/categories",      label: "Categories"         },
  { href: "/pooja-special",   label: "Pooja Special"      },
  { href: "/gifts",           label: "Gift Hampers"       },
  { href: "/bulk-orders",     label: "Bulk Orders"        },
  { href: "/veena-organics",  label: "Premium Collection" },
];

export function Footer() {
  const { isMobile, isTablet } = useResponsive();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const year = new Date().getFullYear();

  const headingStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
    color: gold, marginBottom: 18,
  };
  const linkStyle: React.CSSProperties = { fontSize: 13, color: "#B0A898", textDecoration: "none", display: "block", marginBottom: 10 };
  const btnLinkStyle: React.CSSProperties = { ...linkStyle, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" };

  const cols = isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr 1fr" : "1.8fr 1fr 1fr 1.2fr";
  const pad  = isMobile ? "40px 16px" : isTablet ? "48px 24px" : "64px 48px";

  return (
    <>
      <footer style={{ background: navy, color: "#F6F1E8" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: pad }}>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? 32 : 40 }}>

            {/* Brand — full width on mobile */}
            <div style={isMobile ? { gridColumn: "1 / -1" } : {}}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: gold, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Leaf style={{ width: 18, height: 18, color: "#fff" }} />
                </div>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#F6F1E8", display: "block", lineHeight: 1.1 }}>Veena Organics</span>
                  <span style={{ fontSize: 10, color: gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>Est. 1984</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#B0A898", lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>
                Four decades of trust. Pure, authentic organic products sourced directly from Indian farms to your table.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[Share2, Share2, X].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social"
                    style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <Icon style={{ width: 15, height: 15, color: "#F6F1E8" }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p style={headingStyle}>Quick Links</p>
              {QUICK_LINKS.map(l => (
                <Link key={l.href} href={l.href} style={linkStyle}>{l.label}</Link>
              ))}
            </div>

            {/* Information */}
            <div>
              <p style={headingStyle}>Information</p>
              <Link href="/about"   style={linkStyle}>About Us</Link>
              <Link href="/contact" style={linkStyle}>Contact Us</Link>
              <button onClick={() => setPrivacyOpen(true)} style={btnLinkStyle}>Privacy Policy</button>
              <button style={btnLinkStyle}>Terms & Conditions</button>
              <button style={btnLinkStyle}>Shipping Policy</button>
              <button style={btnLinkStyle}>Return Policy</button>
            </div>

            {/* Contact */}
            <div>
              <p style={headingStyle}>Contact Us</p>
              {[
                { Icon: Phone,  main: "+91 98765 43210",         sub: "Mon–Sat, 9am–7pm"      },
                { Icon: Mail,   main: "info@veenaorganics.com",  sub: "We reply within 24 hrs" },
                { Icon: MapPin, main: "Mumbai, Maharashtra",      sub: "India – 400001"         },
              ].map(({ Icon, main, sub }) => (
                <div key={main} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                  <Icon style={{ width: 15, height: 15, color: gold, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, color: "#F6F1E8", marginBottom: 2 }}>{main}</p>
                    <p style={{ fontSize: 11, color: "#B0A898" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 48, paddingTop: 24, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 8 }}>
            <p style={{ fontSize: 12, color: "#B0A898" }}>© {year} Veena Organics. All rights reserved.</p>
            <p style={{ fontSize: 12, color: "#B0A898" }}>Made with ❤️ in India · Pure · Natural · Organic</p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent style={{ maxWidth: 640, maxHeight: "80vh", overflowY: "auto" }}>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.75 }}>
            <p style={{ marginBottom: 12 }}><strong style={{ color: navy }}>Last Updated:</strong> January 2025</p>
            <p style={{ marginBottom: 12 }}>Veena Organics is committed to protecting your personal information and your right to privacy.</p>
            <p style={{ fontWeight: 700, color: navy, marginBottom: 6, marginTop: 16 }}>Information We Collect</p>
            <p style={{ marginBottom: 12 }}>We collect information you provide directly to us, such as your name, email address, phone number, and delivery address when you place orders or create an account.</p>
            <p style={{ fontWeight: 700, color: navy, marginBottom: 6, marginTop: 16 }}>How We Use Your Information</p>
            <p style={{ marginBottom: 12 }}>We use your information to process orders, send order confirmations, provide customer support, and send promotional communications with your consent.</p>
            <p style={{ fontWeight: 700, color: navy, marginBottom: 6, marginTop: 16 }}>Data Security</p>
            <p style={{ marginBottom: 12 }}>We implement appropriate technical and organizational measures to protect your personal data against unauthorized processing, accidental loss, or damage.</p>
            <p style={{ fontWeight: 700, color: navy, marginBottom: 6, marginTop: 16 }}>Your Rights</p>
            <p style={{ marginBottom: 12 }}>You have the right to access, update, or delete your personal information. Contact us at privacy@veenaorganics.com for any data-related requests.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
