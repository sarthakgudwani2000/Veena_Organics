"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart, Menu, X, Leaf, User, Search, ChevronDown, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useResponsive } from "@/hooks/use-responsive";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  {
    href: "/shop",
    label: "Shop",
    children: [
      { href: "/shop",          label: "All Products" },
      { href: "/categories",    label: "Browse Categories" },
      { href: "/veena-organics",label: "Premium Collection" },
    ],
  },
  { href: "/pooja-special", label: "Pooja Special" },
  { href: "/gifts",         label: "Gifts" },
  { href: "/bulk-orders",   label: "Bulk Orders" },
  { href: "/about",         label: "About" },
  { href: "/contact",       label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCartStore();
  const { isMobile, isTablet } = useResponsive();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [scrolled,   setScrolled]       = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userName, setUserName]         = useState<string | null>(null);
  const [mounted,  setMounted]          = useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemCount  = mounted ? totalItems() : 0;
  const showMobile = isMobile || isTablet;

  useEffect(() => { setMounted(true); }, []);

  // Read auth state from localStorage
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("vo_user");
        if (raw) {
          const u = JSON.parse(raw) as { customerName?: string; phoneNumber?: string };
          setUserName(u.customerName || u.phoneNumber || "Account");
        } else {
          setUserName(null);
        }
      } catch { setUserName(null); }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, [pathname]);

  const handleDropdownEnter = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(href);
  };
  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="announcement-bar text-center py-2 px-4 text-xs text-white/90 font-medium tracking-wide">
        <span style={{ display: "inline-flex", alignItems: "center", gap: isMobile ? 4 : 8 }}>
          <Sparkles style={{ width: 12, height: 12, color: "#D4AD5E", flexShrink: 0 }} />
          {isMobile
            ? "Free shipping ₹999+ · 100% organic"
            : "Free shipping on orders above ₹999 · 40+ years of purity · 100% organic · Direct from farms"
          }
          <Sparkles style={{ width: 12, height: 12, color: "#D4AD5E", flexShrink: 0 }} />
        </span>
      </div>

      {/* ── Main nav ── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "nav-blur border-b border-[#E8DDD0] shadow-sm" : "bg-[#FDFAF4] border-b border-[#EDE4D3]"
        )}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div className="relative rounded-xl bg-[#1C2B3A] flex items-center justify-center shadow-sm hover:bg-[#B8923A] transition-colors duration-300"
                style={{ width: 36, height: 36 }}>
                <Leaf style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              {!isMobile && (
                <div style={{ lineHeight: 1 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#1C2B3A", fontFamily: "'Playfair Display', serif" }}>
                    Veena Organics
                  </span>
                  <span style={{ display: "block", fontSize: 9, color: "#B8923A", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>
                    Est. 1984
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Nav — hidden on mobile/tablet */}
            {!showMobile && (
              <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {NAV_LINKS.map((link) => (
                  <div
                    key={link.href}
                    style={{ position: "relative" }}
                    onMouseEnter={() => link.children && handleDropdownEnter(link.href)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "transition-all duration-150",
                        pathname === link.href || pathname.startsWith(link.href + "/")
                          ? "text-[#B8923A] bg-[#F5E6C8]"
                          : "text-[#3D3328] hover:text-[#1C2B3A] hover:bg-[#F4EDE0]"
                      )}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", fontSize: 13, fontWeight: 500, borderRadius: 8 }}
                    >
                      {link.label}
                      {link.children && <ChevronDown style={{ width: 12, height: 12, opacity: 0.5 }} />}
                    </Link>

                    {/* Dropdown */}
                    {link.children && openDropdown === link.href && (
                      <div
                        style={{ position: "absolute", top: "100%", left: 0, paddingTop: 6, zIndex: 50 }}
                        onMouseEnter={() => handleDropdownEnter(link.href)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #E8DDD0", padding: 8, minWidth: 210 }}>
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10, fontSize: 13, color: "#3D3328", textDecoration: "none" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#F4EDE0")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#B8923A", flexShrink: 0 }} />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8 }}>
              {/* Search */}
              <Link href="/shop" className="p-2 rounded-lg text-[#3D3328] hover:bg-[#F4EDE0] transition-colors" aria-label="Search">
                <Search style={{ width: 18, height: 18 }} />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-lg text-[#3D3328] hover:bg-[#F4EDE0] transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart style={{ width: 18, height: 18 }} />
                {itemCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, background: "#B8923A", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* Auth button — hide on mobile (shown in drawer) */}
              {!showMobile && (
                <Link
                  href={userName ? "/profile" : "/sign-in"}
                  style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4, padding: "7px 14px", background: "#1C2B3A", color: "#fff", fontSize: 12, fontWeight: 600, borderRadius: 8, textDecoration: "none", maxWidth: 140, overflow: "hidden" }}
                  className="hover:bg-[#243447] transition-colors"
                >
                  <User style={{ width: 14, height: 14, flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {userName ? userName.split(" ")[0] : "Sign In"}
                  </span>
                </Link>
              )}

              {/* Hamburger — only on mobile/tablet */}
              {showMobile && (
                <button
                  onClick={() => setMobileOpen(v => !v)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "#3D3328" }}
                  className="hover:bg-[#F4EDE0] transition-colors"
                  aria-label="Menu"
                >
                  {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div style={{ position: "fixed", right: 0, top: 0, height: "100%", width: 300, zIndex: 50, background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>

            {/* Drawer header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #E8DDD0" }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1C2B3A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Leaf style={{ width: 15, height: 15, color: "#fff" }} />
                </div>
                <span style={{ fontWeight: 700, color: "#1C2B3A", fontSize: 14, fontFamily: "'Playfair Display', serif" }}>
                  Veena Organics
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ width: 32, height: 32, borderRadius: 8, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                className="hover:bg-[#F4EDE0]"
              >
                <X style={{ width: 18, height: 18, color: "#3D3328" }} />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", padding: "11px 16px", borderRadius: 12, fontSize: 14, fontWeight: 500,
                      color: (pathname === link.href || pathname.startsWith(link.href + "/")) ? "#B8923A" : "#3D3328",
                      background: (pathname === link.href || pathname.startsWith(link.href + "/")) ? "#F5E6C8" : "none",
                      textDecoration: "none", marginBottom: 2,
                    }}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div style={{ paddingLeft: 16, marginBottom: 4 }}>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, fontSize: 12, color: "#7A6E62", textDecoration: "none", marginBottom: 1 }}
                          className="hover:bg-[#F4EDE0] hover:text-[#1C2B3A] transition-colors"
                        >
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#B8923A", flexShrink: 0 }} />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Bottom CTA */}
            <div style={{ padding: "16px", borderTop: "1px solid #E8DDD0", display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href={userName ? "/profile" : "/sign-in"} onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "12px 0", background: "#1C2B3A", color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 12, textDecoration: "none" }}
              >
                <User style={{ width: 16, height: 16 }} />
                {userName ? `Hi, ${userName.split(" ")[0]}` : "Sign In / Profile"}
              </Link>
              <button
                onClick={() => { openCart(); setMobileOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "12px 0", background: "#F5E6C8", color: "#B8923A", fontSize: 14, fontWeight: 600, borderRadius: 12, border: "none", cursor: "pointer" }}
              >
                <ShoppingCart style={{ width: 16, height: 16 }} />
                View Cart {itemCount > 0 && `(${itemCount})`}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
