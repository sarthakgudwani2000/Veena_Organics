"use client";

import { useState, useEffect } from "react";

export function useResponsive() {
  // Default to undefined (SSR). After mount, actual window width is used.
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile  = width !== undefined && width < 640;
  const isTablet  = width !== undefined && width >= 640 && width < 1024;
  // Default true until mounted (renders desktop layout server-side)
  const isDesktop = width === undefined || width >= 1024;

  // Padding helpers
  const cpad = isMobile ? "0 16px" : isTablet ? "0 24px" : "0 48px";

  // Grid column helpers
  const cols4 = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
  const cols3 = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";
  const cols2 = isMobile ? "1fr" : "1fr 1fr";

  const gap = isMobile ? 16 : 20;

  return { isMobile, isTablet, isDesktop, width, cpad, cols4, cols3, cols2, gap };
}
