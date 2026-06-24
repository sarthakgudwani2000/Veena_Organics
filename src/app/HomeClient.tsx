"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Award, Leaf, Shield, Truck, Star, ArrowRight, Quote, Sprout, Flame, Package, ChevronRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { mockBrandValues } from "@/data/mock";
import { useResponsive } from "@/hooks/use-responsive";
import type { Product, ProductCategory } from "@/types";

const MARQUEE = [
  "🌿 100% Certified Organic","🚜 Direct Farm Sourcing","✨ 40+ Years of Trust",
  "🌱 No Preservatives","🏆 Award-Winning Quality","🚚 Free Shipping ₹999+",
  "🪴 Sustainably Harvested","💎 Premium Ayurvedic Herbs","🧪 Lab Tested & Verified","❤️ Loved by 10,000+ Families",
];

const STATS = [
  { n: "40+",  label: "Years of Legacy", sub: "Est. 1984" },
  { n: "200+", label: "Farm Partners",   sub: "Across India" },
  { n: "10K+", label: "Happy Families",  sub: "Nationwide" },
  { n: "500+", label: "Products",        sub: "In our catalog" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma",  loc: "Mumbai",    text: "Veena Organics has been my family's go-to for 15 years. The turmeric and cardamom are absolutely unmatched.", initials: "PS", bg: "#1C2B3A" },
  { name: "Rajesh Kumar",  loc: "Delhi",     text: "The Ashwagandha quality is exceptional. You can feel the difference from the very first week of use.", initials: "RK", bg: "#B8923A" },
  { name: "Ananya Patel",  loc: "Bangalore", text: "Their Griha Pravesh package had everything perfectly assembled. Saved me hours of preparation!", initials: "AP", bg: "#4A6741" },
];

const ICONS: Record<string, React.ElementType> = { Award, Leaf, Sprout, Shield, Sparkles };

const serif = "'Playfair Display', Georgia, serif";
const gold  = "#B8923A";
const navy  = "#1C2B3A";
const cream = "#FDFAF4";

function SectionLabel({ text, dark }: { text: string; dark?: boolean }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: dark ? "#D4AD5E" : gold, marginBottom: 8 }}>
      {text}
    </p>
  );
}

interface Props {
  featuredProducts: Product[];
  categories: ProductCategory[];
}

export default function HomeClient({ featuredProducts, categories }: Props) {
  const { isMobile, isTablet, cpad, cols4, cols3 } = useResponsive();

  const featured = featuredProducts.slice(0, 8);
  const cats     = categories.slice(0, 5);

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ background: navy, position: "relative", overflow: "hidden", minHeight: isMobile ? "auto" : "90vh", display: "flex", alignItems: "center" }}>
        <div style={{ position:"absolute", top:0, right:0, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(184,146,58,.13) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, left:"25%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(184,146,58,.07) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "56px 16px 40px" : isTablet ? "64px 24px" : "80px 48px", width: "100%", display: "flex", alignItems: "center", gap: isMobile ? 0 : 48, flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(184,146,58,.14)", border:"1px solid rgba(184,146,58,.3)", color:"#D4AD5E", padding:"7px 16px", borderRadius:999, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:28 }}>
              <Leaf style={{ width:11, height:11 }} /> Established 1984 · 40 Years of Purity
            </div>
            <h1 style={{ fontFamily:serif, fontSize: isMobile ? "2.2rem" : "clamp(2.4rem,3.5vw,4rem)", fontWeight:800, lineHeight:1.1, color:"#fff", marginBottom:20 }}>
              Nature&apos;s Finest<br />
              <span style={{ background:"linear-gradient(90deg,#B8923A,#D4AD5E,#F5E6C8,#D4AD5E,#B8923A)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 4s linear infinite" }}>
                Pure &amp; Organic
              </span>
            </h1>
            <p style={{ color:"#9C8B72", fontSize:15, lineHeight:1.75, maxWidth:460, marginBottom:36 }}>
              From India&apos;s most sacred farms directly to your home — premium organic spices, Ayurvedic herbs, and traditional ingredients trusted for four decades.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
              <Link href="/shop" style={{ display:"inline-flex", alignItems:"center", gap:8, background:gold, color:"#fff", fontWeight:700, padding:"13px 28px", borderRadius:12, fontSize:14, textDecoration:"none" }}>
                Shop Now <ArrowRight style={{ width:15, height:15 }} />
              </Link>
              <Link href="/about" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.09)", border:"1px solid rgba(255,255,255,.18)", color:"rgba(255,255,255,.9)", fontWeight:600, padding:"13px 28px", borderRadius:12, fontSize:14, textDecoration:"none" }}>
                Our Story
              </Link>
            </div>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
              {[{ I:Shield, t:"100% Pure" }, { I:Truck, t:"Free Shipping" }, { I:Award, t:"Farm Direct" }].map(({ I, t }) => (
                <div key={t} style={{ display:"flex", alignItems:"center", gap:6, color:"rgba(255,255,255,.5)", fontSize:12, fontWeight:500 }}>
                  <I style={{ width:13, height:13, color:gold }} /> {t}
                </div>
              ))}
            </div>
          </div>

          {!isMobile && featured.length > 0 && (
            <div style={{ flex:"0 0 auto", width: isTablet ? 280 : 400, display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows: isTablet ? "140px 120px" : "176px 156px", gap:12 }}>
              {featured.slice(0, 4).map((p, i) => (
                <Link key={p.id} href={`/product/${p.id}`} style={{ gridColumn: i===0 ? "span 2" : undefined, position:"relative", borderRadius:16, overflow:"hidden", background:"#243447", border:"1px solid rgba(255,255,255,.07)", textDecoration:"none", display:"block" }}>
                  <Image src={p.itemImage} alt={p.itemName} fill style={{ objectFit:"cover", opacity:.75 }} sizes="400px" />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,43,58,.92) 0%,rgba(28,43,58,.1) 55%,transparent 100%)" }} />
                  <div style={{ position:"absolute", bottom:10, left:12, right:12 }}>
                    <p style={{ color:"#fff", fontWeight:700, fontSize:12, fontFamily:serif }}>{p.itemName}</p>
                    <p style={{ color:"#D4AD5E", fontWeight:700, fontSize:12 }}>₹{p.itemPrice}</p>
                  </div>
                  {p.isBestSeller && (
                    <span style={{ position:"absolute", top:8, right:8, background:"linear-gradient(135deg,#B8923A,#D4AD5E)", color:"#fff", fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:999 }}>★ BEST</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:48, background:"linear-gradient(to top,#FDFAF4,transparent)", pointerEvents:"none" }} />
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background:navy, overflow:"hidden", padding:"11px 0", borderTop:"1px solid #243447", borderBottom:"1px solid #243447" }}>
        <div className="marquee-track marquee-track--play">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} style={{ display:"inline-flex", alignItems:"center", padding:"0 18px", fontSize:12, color:"rgba(255,255,255,.72)", whiteSpace:"nowrap", fontWeight:500 }}>
              {t}<span style={{ color:gold, fontSize:16, marginLeft:12 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{ background:"#fff", padding: isMobile ? "36px 0" : "52px 0", borderBottom:"1px solid #E8DDD0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: cpad }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16 }}>
            {STATS.map(s => (
              <div key={s.n} style={{ textAlign:"center", padding: isMobile ? "12px 8px" : 0 }}>
                <p style={{ fontFamily:serif, fontSize: isMobile ? "2rem" : "2.8rem", fontWeight:800, lineHeight:1, color:navy }}>{s.n}</p>
                <p style={{ fontWeight:700, color:navy, fontSize:13, marginTop:6 }}>{s.label}</p>
                <p style={{ fontSize:10, color:"#7A6E62", marginTop:3, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {cats.length > 0 && (
        <section style={{ background:cream, padding: isMobile ? "40px 0" : "64px 0" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding: cpad }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:8 }}>
              <div>
                <SectionLabel text="Collections" />
                <h2 style={{ fontFamily:serif, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight:700, color:navy }}>Shop by Category</h2>
              </div>
              <Link href="/categories" style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:700, color:gold, textDecoration:"none" }}>
                All Categories <ArrowRight style={{ width:13, height:13 }} />
              </Link>
            </div>

            {isMobile ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {cats.map(cat => (
                  <Link key={cat.id} href={`/category/${cat.slug}`} style={{ position:"relative", borderRadius:16, overflow:"hidden", display:"block", textDecoration:"none", height:140 }}>
                    <Image src={cat.categoryImage} alt={cat.categoryName} fill style={{ objectFit:"cover" }} sizes="50vw" />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,43,58,.75) 0%,transparent 55%)" }} />
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 12px" }}>
                      <p style={{ fontFamily:serif, fontWeight:700, color:"#fff", fontSize:13, lineHeight:1.3 }}>{cat.categoryName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gridTemplateRows:isTablet ? "200px 200px" : "240px 240px", gap:14 }}>
                <Link href={`/category/${cats[0]?.slug}`} style={{ gridColumn:"span 2", gridRow:"span 2", position:"relative", borderRadius:24, overflow:"hidden", display:"block", textDecoration:"none", height:"100%" }}>
                  <Image src={cats[0]?.categoryImage ?? ""} alt={cats[0]?.categoryName ?? ""} fill style={{ objectFit:"cover" }} sizes="50vw" priority />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,43,58,.82) 25%,rgba(28,43,58,.12) 65%,transparent 100%)" }} />
                  <div style={{ position:"absolute", bottom:28, left:28, right:28 }}>
                    <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#D4AD5E", marginBottom:8 }}>Featured</p>
                    <h3 style={{ fontFamily:serif, fontSize:"1.7rem", fontWeight:700, color:"#fff", marginBottom:8 }}>{cats[0]?.categoryName}</h3>
                    <p style={{ fontSize:13, color:"rgba(255,255,255,.62)", marginBottom:16, lineHeight:1.5 }}>{cats[0]?.description}</p>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,.15)", color:"#fff", fontSize:11, fontWeight:700, padding:"8px 16px", borderRadius:999 }}>
                      Shop Now <ArrowRight style={{ width:11, height:11 }} />
                    </span>
                  </div>
                </Link>
                {cats.slice(1, 5).map(cat => (
                  <Link key={cat.id} href={`/category/${cat.slug}`} style={{ position:"relative", borderRadius:18, overflow:"hidden", display:"block", textDecoration:"none", height:"100%" }}>
                    <Image src={cat.categoryImage} alt={cat.categoryName} fill style={{ objectFit:"cover" }} sizes="25vw" />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,43,58,.74) 0%,transparent 55%)" }} />
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"14px 16px" }}>
                      <p style={{ fontFamily:serif, fontWeight:700, color:"#fff", fontSize:14, lineHeight:1.3 }}>{cat.categoryName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── BEST SELLERS ── */}
      {featured.length > 0 && (
        <section style={{ background:"#fff", padding: isMobile ? "40px 0" : "64px 0" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding: cpad }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:8 }}>
              <div>
                <SectionLabel text="Best Sellers" />
                <h2 style={{ fontFamily:serif, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight:700, color:navy }}>Customer Favourites</h2>
                {!isMobile && <p style={{ color:"#7A6E62", marginTop:8, fontSize:14 }}>Trusted and reordered by thousands of families every month</p>}
              </div>
              <Link href="/shop" style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:700, color:gold, textDecoration:"none" }}>
                View All <ArrowRight style={{ width:13, height:13 }} />
              </Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: cols4, gap: isMobile ? 12 : 18 }}>
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND VALUES ── */}
      <section style={{ background:cream, padding: isMobile ? "40px 0" : "64px 0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: cpad }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <SectionLabel text="Why Choose Us" />
            <h2 style={{ fontFamily:serif, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight:700, color:navy }}>The Veena Promise</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: cols4, gap: isMobile ? 12 : 18 }}>
            {mockBrandValues.map(v => {
              const Icon = ICONS[v.icon] ?? Leaf;
              return (
                <div key={v.id} style={{ background:"#fff", borderRadius:20, padding: isMobile ? "18px 16px" : "24px 22px", border:"1px solid #E8DDD0" }}>
                  <div style={{ width:46, height:46, background:"#F5E6C8", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                    <Icon style={{ width:21, height:21, color:gold }} />
                  </div>
                  <h3 style={{ fontFamily:serif, fontWeight:700, color:navy, fontSize:15, marginBottom:8 }}>{v.title}</h3>
                  <p style={{ fontSize:13, color:"#7A6E62", lineHeight:1.65 }}>{v.shortDescription}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL SPLIT ── */}
      <section style={{ background:"#fff", padding: isMobile ? "40px 0" : "64px 0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: cpad, display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:18, alignItems:"stretch" }}>
          <Link href="/pooja-special" style={{ borderRadius:28, overflow:"hidden", background:"#2C1810", position:"relative", minHeight: isMobile ? 280 : 400, textDecoration:"none", display:"block" }}>
            <div style={{ position:"absolute", inset:0, opacity:.32, backgroundImage:"url('https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=800&q=70')", backgroundSize:"cover", backgroundPosition:"center" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(44,24,16,.92) 30%,transparent 70%)" }} />
            <div style={{ position:"absolute", bottom:32, left:32, right:32 }}>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#F59E0B", marginBottom:10 }}>Sacred Collections</p>
              <h3 style={{ fontFamily:serif, fontSize: isMobile ? "1.4rem" : "1.9rem", fontWeight:700, color:"#fff", lineHeight:1.2, marginBottom:10 }}>Pooja Special</h3>
              <p style={{ fontSize:13, color:"rgba(255,255,255,.58)", marginBottom:20 }}>25+ curated ritual packages across all five stages of the Hindu life cycle.</p>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#D97706", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 20px", borderRadius:10 }}>
                <Flame style={{ width:13, height:13 }} /> Explore Packages
              </span>
            </div>
          </Link>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Link href="/bulk-orders" style={{ borderRadius:22, background:navy, padding:"28px 28px 24px", textDecoration:"none", flex:1, display:"block" }}>
              <div style={{ width:42, height:42, background:"rgba(184,146,58,.18)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                <Package style={{ width:20, height:20, color:"#D4AD5E" }} />
              </div>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#D4AD5E", marginBottom:6 }}>For Businesses</p>
              <h3 style={{ fontFamily:serif, fontSize:"1.45rem", fontWeight:700, color:"#fff", marginBottom:8 }}>Bulk Orders</h3>
              <p style={{ fontSize:13, color:"rgba(255,255,255,.48)", marginBottom:18 }}>Special pricing for restaurants, caterers & retailers</p>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6, color:"#D4AD5E", fontSize:13, fontWeight:700 }}>
                Get a Quote <ArrowRight style={{ width:13, height:13 }} />
              </span>
            </Link>
            <Link href="/gifts" style={{ borderRadius:22, background:"#F5E6C8", padding:"28px 28px 24px", textDecoration:"none", flex:1, display:"block" }}>
              <div style={{ width:42, height:42, background:"rgba(184,146,58,.18)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, fontSize:20 }}>🎁</div>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#6B5A3E", marginBottom:6 }}>Gifts & Hampers</p>
              <h3 style={{ fontFamily:serif, fontSize:"1.45rem", fontWeight:700, color:navy, marginBottom:8 }}>Gift Collections</h3>
              <p style={{ fontSize:13, color:"#6B5A3E", marginBottom:18 }}>Corporate, personal & wedding organic gift hampers</p>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6, color:gold, fontSize:13, fontWeight:700 }}>
                Browse Gifts <ArrowRight style={{ width:13, height:13 }} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background:navy, padding: isMobile ? "40px 0" : "64px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(184,146,58,.07) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding: cpad }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <SectionLabel text="Testimonials" dark />
            <h2 style={{ fontFamily:serif, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight:700, color:"#fff" }}>Words from Our Families</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: cols3, gap: isMobile ? 12 : 18 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, padding: isMobile ? 18 : 26 }}>
                <div style={{ display:"flex", gap:3, marginBottom:14 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} style={{ width:13, height:13, color:"#D4AD5E", fill:"#D4AD5E" }} />)}
                </div>
                <Quote style={{ width:22, height:22, color:"rgba(184,146,58,.38)", marginBottom:10 }} />
                <p style={{ fontSize:13, color:"rgba(255,255,255,.7)", lineHeight:1.75, fontStyle:"italic", marginBottom:20 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:12, borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:18 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:12, flexShrink:0 }}>{t.initials}</div>
                  <div>
                    <p style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{t.name}</p>
                    <p style={{ color:"rgba(255,255,255,.4)", fontSize:11 }}>{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background:"#fff", padding: isMobile ? "40px 16px" : "64px 24px" }}>
        <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center", background:cream, borderRadius:32, border:"1px solid #E8DDD0", padding: isMobile ? "36px 24px" : "52px 40px" }}>
          <div style={{ width:52, height:52, background:navy, borderRadius:15, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
            <Leaf style={{ width:24, height:24, color:"#fff" }} />
          </div>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:gold, marginBottom:12 }}>Join the Family</p>
          <h2 style={{ fontFamily:serif, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight:700, color:navy, lineHeight:1.2, marginBottom:16 }}>
            Experience 40 Years<br />of Organic Excellence
          </h2>
          <p style={{ fontSize:14, color:"#7A6E62", lineHeight:1.75, marginBottom:32 }}>
            Discover why over 10,000 families trust Veena Organics for their daily nutrition, wellness, and ritual needs.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/shop" style={{ display:"inline-flex", alignItems:"center", gap:8, background:navy, color:"#fff", fontWeight:700, padding:"13px 30px", borderRadius:12, fontSize:14, textDecoration:"none" }}>
              Shop Now <ArrowRight style={{ width:15, height:15 }} />
            </Link>
            <Link href="/about" style={{ display:"inline-flex", alignItems:"center", gap:8, border:"2px solid #E8DDD0", color:navy, fontWeight:600, padding:"13px 30px", borderRadius:12, fontSize:14, textDecoration:"none" }}>
              Learn Our Story <ChevronRight style={{ width:15, height:15 }} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
