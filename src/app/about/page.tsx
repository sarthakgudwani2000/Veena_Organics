import React from "react";
import Link from "next/link";
import { Leaf, Award, Globe, Handshake, Sprout, Shield, Beaker, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "The story of Veena Organics — 40+ years of pure, authentic organic products",
};

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

const VALUES = [
  { icon: Award,     title: "40+ Years Legacy",   desc: "Four decades of uncompromising quality since 1984" },
  { icon: Leaf,      title: "100% Pure",           desc: "No additives, preservatives, or artificial ingredients" },
  { icon: Globe,     title: "Nationwide Reach",    desc: "Serving customers across all Indian states" },
  { icon: Handshake, title: "Farmer Partnerships", desc: "Direct relationships with 200+ farming families" },
  { icon: Award,     title: "Quality Certified",   desc: "ISO certified with rigorous quality testing" },
  { icon: Beaker,    title: "Lab Tested",          desc: "Every batch tested for purity and potency" },
  { icon: Sprout,    title: "Sustainably Sourced", desc: "Supporting regenerative and organic farming" },
  { icon: Shield,    title: "Customer Trust",      desc: "10,000+ satisfied families and growing" },
];

const TEAM = [
  { name: "Veena Agarwal",  role: "Founder & CEO",        initials: "VA", bio: "Founded Veena Organics in 1984 with a vision to bring pure organic products to every Indian home." },
  { name: "Arjun Agarwal",  role: "Managing Director",    initials: "AA", bio: "Second generation leader driving digital transformation while preserving the brand's authentic heritage." },
  { name: "Dr. Priya Sharma", role: "Head of Quality",    initials: "PS", bio: "PhD in Ayurvedic Sciences. Ensures every product meets the highest standards of purity." },
  { name: "Ravi Menon",     role: "Head of Sourcing",     initials: "RM", bio: "20+ years of experience building relationships with organic farmers across India." },
];

const TIMELINE = [
  { year: "1984", event: "Founded in Crawford Market, Mumbai" },
  { year: "1992", event: "Expanded to 5 cities across Maharashtra" },
  { year: "2001", event: "Launched direct farm sourcing program" },
  { year: "2010", event: "Introduced Ayurvedic herbs collection" },
  { year: "2016", event: "Added Pooja Samagri and ritual packages" },
  { year: "2020", event: "Launched e-commerce platform" },
  { year: "2024", event: "40 years — serving 10,000+ families nationwide" },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8" }}>

      {/* Hero */}
      <div style={{ background: navy, textAlign: "center", position: "relative", overflow: "hidden" }} className="r-hero-pad">
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 40, right: 40, width: 256, height: 256, borderRadius: "50%", border: `2px solid ${gold}` }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 384, height: 384, borderRadius: "50%", border: `2px solid ${gold}` }} />
        </div>
        <div className="r-container" style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ width: 64, height: 64, background: gold, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Leaf style={{ width: 30, height: 30, color: "#fff" }} />
          </div>
          <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Est. 1984</p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2.2rem,5vw,3.5rem)", fontWeight: 700, color: "#fff", marginBottom: 18 }}>Our Story</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.75, maxWidth: 580, margin: "0 auto" }}>
            Forty years ago, a woman named Veena walked into her small Mumbai shop with a simple dream:
            to give every family access to the purest, most authentic organic products India has to offer.
          </p>
        </div>
      </div>

      {/* Journey */}
      <section style={{ background: "#fff" }} className="r-section-pad">
        <div className="r-container" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="r-grid-journey">
            <div>
              <p style={{ color: gold, fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Our Journey</p>
              <h2 style={{ fontFamily: serif, fontSize: "1.9rem", fontWeight: 700, color: navy, marginBottom: 24 }}>Four Decades of Pure Tradition</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "#6B6B6B", lineHeight: 1.75, fontSize: 15 }}>
                <p>In 1984, Veena Agarwal opened a small organic products store in Mumbai&apos;s Crawford Market. Her philosophy was radical for its time: source directly from farmers, never compromise on quality, and treat every customer like family.</p>
                <p>Word spread quickly. Within a decade, Veena Organics had become the go-to destination for discerning Mumbai families seeking genuine organic spices, Ayurvedic herbs, and traditional Indian ingredients.</p>
                <p>Today, we work with over 200 farming families across India — from the cardamom hills of Kerala to the turmeric fields of Tamil Nadu, the saffron valleys of Kashmir to the wheat plains of Punjab.</p>
                <p>Our mission remains unchanged: bring you nature&apos;s finest, exactly as nature intended it.</p>
              </div>
            </div>
            {/* Timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TIMELINE.map(item => (
                <div key={item.year} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: gold, fontWeight: 700, fontSize: 11, textAlign: "center", lineHeight: 1.2 }}>{item.year}</span>
                  </div>
                  <div style={{ borderLeft: "2px solid #E8E0D0", paddingLeft: 16, flex: 1 }}>
                    <p style={{ fontSize: 14, color: "#2B2B2B", fontWeight: 500 }}>{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "#F6F1E8" }} className="r-section-pad">
        <div className="r-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: gold, fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>What We Stand For</p>
            <h2 style={{ fontFamily: serif, fontSize: "2.2rem", fontWeight: 700, color: navy }}>Our Core Values</h2>
          </div>
          <div className="r-grid-4">
            {VALUES.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", border: "1px solid #D4C9B8", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, background: "#F6F1E8", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Icon style={{ width: 22, height: 22, color: gold }} />
                  </div>
                  <h3 style={{ fontWeight: 700, color: navy, marginBottom: 6, fontSize: 14 }}>{v.title}</h3>
                  <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "#fff" }} className="r-section-pad">
        <div className="r-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: gold, fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>The People Behind</p>
            <h2 style={{ fontFamily: serif, fontSize: "2.2rem", fontWeight: 700, color: navy }}>Our Team</h2>
          </div>
          <div className="r-grid-4">
            {TEAM.map(member => (
              <div key={member.name} style={{ background: "#F6F1E8", borderRadius: 16, padding: "28px 20px", textAlign: "center", border: "1px solid #E8E0D0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: navy, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <span style={{ color: gold, fontWeight: 700, fontSize: 18 }}>{member.initials}</span>
                </div>
                <h3 style={{ fontFamily: serif, fontWeight: 700, color: navy, marginBottom: 4, fontSize: 16 }}>{member.name}</h3>
                <p style={{ fontSize: 11, color: gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{member.role}</p>
                <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: navy, textAlign: "center" }} className="r-section-pad">
        <div className="r-container" style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontFamily: serif, fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: 14 }}>Experience the Veena Organics Difference</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32, fontSize: 15 }}>Join 10,000+ families who trust us for their daily organic needs.</p>
          <Link href="/shop"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: gold, color: "#fff", fontSize: 15, fontWeight: 700, padding: "13px 28px", borderRadius: 12, textDecoration: "none" }}>
            Shop Our Products <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </section>
    </div>
  );
}
