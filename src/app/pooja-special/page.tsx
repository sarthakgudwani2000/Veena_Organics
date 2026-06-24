"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Flame, ShoppingCart, Clock, Package, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
const POOJA_IMAGE = "https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=600&q=80";
const POOJA_INCLUSIONS = "Panchamrit, Akshata, Kalash Samagri, Puja Thali, Incense, Camphor, Flowers, Fruits (dried), Sacred Threads, Sindoor, Chandan, Dhoop";

const serif = "'Playfair Display', Georgia, serif";
const navy = "#1C2B3A";
const gold = "#B8923A";

const LIFECYCLE_CATEGORIES = [
  { id: "prarambh", name: "Prarambh",  meaning: "Beginnings",    desc: "Birth, naming & early life",        color: "#FFF3E0", accent: "#E65100" },
  { id: "vridhi",   name: "Vridhi",    meaning: "Growth",         desc: "Education & coming-of-age",         color: "#E8F5E9", accent: "#2E7D32" },
  { id: "samskara", name: "Samskara",  meaning: "Sacred Union",   desc: "Marriage & family ceremonies",      color: "#FCE4EC", accent: "#C2185B" },
  { id: "nitya",    name: "Nitya",     meaning: "Daily Devotion", desc: "Regular worship & festivals",       color: "#E3F2FD", accent: "#1565C0" },
  { id: "mrityu",   name: "Mrityu",    meaning: "Transition",     desc: "Final rites & ancestral puja",      color: "#F3E5F5", accent: "#6A1B9A" },
];

const ALL_RITUALS = [
  { name: "Satyanarayan Katha",          category: "nitya",    duration: "3-4 hours",   price: 1500 },
  { name: "Griha Pravesh Puja",          category: "samskara", duration: "2-3 hours",   price: 2500 },
  { name: "Ganesh Chaturthi Puja",       category: "nitya",    duration: "1-2 hours",   price: 1200 },
  { name: "Vivah (Wedding) Puja",        category: "samskara", duration: "Full day",    price: 5000 },
  { name: "Namakarana Ceremony",         category: "prarambh", duration: "2 hours",     price: 1800 },
  { name: "Annaprashana (First Rice)",   category: "prarambh", duration: "1-2 hours",   price: 1400 },
  { name: "Upanayana (Thread Ceremony)", category: "vridhi",   duration: "Half day",    price: 3500 },
  { name: "Navratri Puja Package",       category: "nitya",    duration: "9 days kit",  price: 4500 },
  { name: "Diwali Laxmi Puja",          category: "nitya",    duration: "2-3 hours",   price: 1800 },
  { name: "Saraswati Puja",             category: "vridhi",   duration: "1-2 hours",   price: 1200 },
  { name: "Mundan Ceremony",            category: "prarambh", duration: "1-2 hours",   price: 1600 },
  { name: "Shradh (Pitru Puja)",        category: "mrityu",   duration: "3-4 hours",   price: 2200 },
  { name: "Saptapadi Puja",             category: "samskara", duration: "2 hours",     price: 2000 },
  { name: "Vastu Puja",                 category: "samskara", duration: "2 hours",     price: 2800 },
  { name: "Ayushya Homam",             category: "vridhi",   duration: "3 hours",     price: 3000 },
  { name: "Pitru Tarpan",              category: "mrityu",   duration: "2 hours",     price: 1800 },
  { name: "Laxmi Puja (Weekly)",       category: "nitya",    duration: "1 hour",      price: 800  },
  { name: "Ganesha Homam",             category: "nitya",    duration: "2-3 hours",   price: 2200 },
  { name: "Jatakarma (Birth)",         category: "prarambh", duration: "1 hour",      price: 1200 },
  { name: "Vidyarambha",               category: "vridhi",   duration: "1-2 hours",   price: 1400 },
  { name: "Kanya Puja (Navratri)",     category: "nitya",    duration: "1 hour",      price: 900  },
  { name: "Pitru Purnima Puja",        category: "mrityu",   duration: "2-3 hours",   price: 2000 },
  { name: "Graduation Puja",           category: "vridhi",   duration: "1 hour",      price: 1000 },
  { name: "Antim Sanskar Kit",         category: "mrityu",   duration: "As required", price: 3500 },
  { name: "Navagraha Puja",            category: "nitya",    duration: "3 hours",     price: 2600 },
];

const ITEMS_PER_PAGE = 6;

export default function PoojaSpecialPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedRitual, setSelectedRitual] = useState<typeof ALL_RITUALS[0] | null>(null);
  const [page, setPage] = useState(0);
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const filteredRituals = activeCategory
    ? ALL_RITUALS.filter((r) => r.category === activeCategory)
    : ALL_RITUALS;
  const totalPages = Math.ceil(filteredRituals.length / ITEMS_PER_PAGE);
  const visibleRituals = filteredRituals.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const handleAddToCart = (ritual: typeof ALL_RITUALS[0]) => {
    addItem({
      id: `pooja-${ritual.name.toLowerCase().replace(/\s+/g, "-")}`,
      productId: `pooja-${ritual.category}`,
      productName: ritual.name,
      productImage: POOJA_IMAGE,
      price: ritual.price,
      quantity: 1,
      type: "pooja_package",
    });
    toast({ title: "Package added to cart ✓", description: ritual.name });
    setSelectedRitual(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg,#7B3F00 0%,#4a2400 50%,#1C2B3A 100%)", padding: "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ width: 60, height: 60, background: gold, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Flame style={{ width: 28, height: 28, color: "#fff" }} />
          </div>
          <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Sacred Collections</p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>Pooja Special</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.75, margin: 0 }}>
            25+ curated ritual packages across all five stages of the Hindu life cycle.
            Everything you need for an authentic ceremony.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 48px 72px" }}>

        {/* ── Category Filter ── */}
        <div style={{ marginBottom: 44 }}>
          <h2 style={{ fontFamily: serif, fontSize: "1.5rem", fontWeight: 700, color: navy, marginBottom: 20 }}>
            Life Ceremony Categories
          </h2>

          {/* All Rituals pill */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            <button
              onClick={() => { setActiveCategory(null); setPage(0); }}
              style={{ padding: "10px 20px", borderRadius: 999, border: `2px solid ${!activeCategory ? navy : "#D4C9B8"}`, background: !activeCategory ? navy : "#fff", color: !activeCategory ? "#fff" : "#6B6B6B", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
            >
              All Rituals ({ALL_RITUALS.length})
            </button>
            {LIFECYCLE_CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setPage(0); }}
                  style={{ padding: "10px 20px", borderRadius: 999, border: `2px solid ${active ? cat.accent : "#D4C9B8"}`, background: active ? cat.color : "#fff", color: active ? cat.accent : "#6B6B6B", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                >
                  {cat.name} · <span style={{ fontWeight: 400, fontSize: 12 }}>{cat.meaning}</span>
                </button>
              );
            })}
          </div>

          {/* Active category description card */}
          {activeCategory && (() => {
            const cat = LIFECYCLE_CATEGORIES.find(c => c.id === activeCategory)!;
            return (
              <div style={{ background: cat.color, border: `1px solid ${cat.accent}30`, borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.accent, flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 700, color: cat.accent, fontSize: 13 }}>{cat.name}</span>
                  <span style={{ color: "#6B6B6B", fontSize: 13 }}> — {cat.desc}</span>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#9B9B9B" }}>
                  {filteredRituals.length} packages
                </span>
              </div>
            );
          })()}
        </div>

        {/* ── Rituals Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
          {visibleRituals.map((ritual) => {
            const lifeCat = LIFECYCLE_CATEGORIES.find((c) => c.id === ritual.category);
            return (
              <div key={ritual.name}
                onClick={() => setSelectedRitual(ritual)}
                style={{ background: "#fff", borderRadius: 18, border: "1px solid #D4C9B8", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 200, background: "#F6F1E8", overflow: "hidden" }}>
                  <Image
                    src={POOJA_IMAGE}
                    alt={ritual.name}
                    fill
                    style={{ objectFit: "cover", opacity: 0.9 }}
                    sizes="33vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />
                  {lifeCat && (
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: lifeCat.color, color: lifeCat.accent }}>
                        {lifeCat.name}
                      </span>
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                      {formatPrice(ritual.price)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "18px 20px 20px" }}>
                  <h3 style={{ fontFamily: serif, fontWeight: 700, color: navy, fontSize: 15, marginBottom: 8, lineHeight: 1.3 }}>
                    {ritual.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9B9B9B", marginBottom: 14 }}>
                    <Clock style={{ width: 12, height: 12 }} />
                    {ritual.duration}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(ritual); }}
                    style={{ width: "100%", background: navy, color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "background 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = gold)}
                    onMouseLeave={e => (e.currentTarget.style.background = navy)}
                  >
                    <ShoppingCart style={{ width: 14, height: 14 }} /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid #D4C9B8", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: page === 0 ? 0.4 : 1, color: navy }}>
              <ChevronLeft style={{ width: 15, height: 15 }} /> Previous
            </button>
            <span style={{ fontSize: 13, color: "#6B6B6B", padding: "0 8px" }}>Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid #D4C9B8", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: page === totalPages - 1 ? 0.4 : 1, color: navy }}>
              Next <ChevronRight style={{ width: 15, height: 15 }} />
            </button>
          </div>
        )}
      </div>

      {/* ── Detail Modal (custom, no shadcn) ── */}
      {selectedRitual && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setSelectedRitual(null)}
        >
          <div
            style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", overflow: "hidden" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal image */}
            <div style={{ position: "relative", height: 200 }}>
              <Image src={POOJA_IMAGE} alt={selectedRitual.name} fill style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
              <button onClick={() => setSelectedRitual(null)}
                style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X style={{ width: 16, height: 16, color: navy }} />
              </button>
              {(() => {
                const lifeCat = LIFECYCLE_CATEGORIES.find(c => c.id === selectedRitual.category);
                return lifeCat ? (
                  <span style={{ position: "absolute", bottom: 14, left: 16, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: lifeCat.color, color: lifeCat.accent }}>
                    {lifeCat.name} · {lifeCat.meaning}
                  </span>
                ) : null;
              })()}
            </div>

            {/* Modal content */}
            <div style={{ padding: "24px 28px 28px" }}>
              <h2 style={{ fontFamily: serif, fontSize: "1.3rem", fontWeight: 700, color: navy, marginBottom: 8 }}>{selectedRitual.name}</h2>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B6B6B" }}>
                  <Clock style={{ width: 14, height: 14, color: gold }} /> {selectedRitual.duration}
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: gold }}>{formatPrice(selectedRitual.price)}</span>
              </div>

              <div style={{ background: "#FEF9EC", borderRadius: 12, padding: "14px 16px", border: "1px solid #FDE68A", marginBottom: 20 }}>
                <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <Package style={{ width: 14, height: 14 }} /> Package Includes
                </p>
                <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.7 }}>{POOJA_INCLUSIONS}</p>
              </div>

              <button
                onClick={() => handleAddToCart(selectedRitual)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: gold, color: "#fff", border: "none", borderRadius: 12, height: 50, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                <ShoppingCart style={{ width: 18, height: 18 }} /> Add to Cart — {formatPrice(selectedRitual.price)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
