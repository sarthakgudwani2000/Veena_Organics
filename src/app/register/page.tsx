"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserPlus, Leaf, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import { useResponsive } from "@/hooks/use-responsive";

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

const MSG91_WIDGET_ID  = "3663696d466d323737373633";
const MSG91_TOKEN_AUTH = "493694TA8wHg97Bc69b8fe55P1";

declare global {
  interface Window {
    initSendOTP?: (config: object) => void;
    sendOtp?: (identifier: string, success: (d: unknown) => void, failure: (e: unknown) => void) => void;
    retryOtp?: (channel: number, success: (d: unknown) => void, failure: (e: unknown) => void) => void;
    verifyOtp?: (otp: string, success: (d: unknown) => void, failure: (e: unknown) => void) => void;
  }
}

type Step = "details" | "otp";

export default function RegisterPage() {
  const { isMobile } = useResponsive();
  const [step, setStep]     = useState<Step>("details");
  const [form, setForm]     = useState({ name: "", phone: "", email: "" });
  const [otp, setOtp]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [sdkReady, setSdkReady] = useState(false);
  const captchaRef = useRef<HTMLDivElement>(null);

  const cleanPhone = form.phone.replace(/\D/g, "").slice(-10);
  const phoneValid = cleanPhone.length === 10;
  const nameValid  = form.name.trim().length >= 2;
  const identifier = `91${cleanPhone}`;

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  // Load MSG91 SDK
  useEffect(() => {
    if (document.getElementById("msg91-sdk")) { setSdkReady(true); return; }
    const script = document.createElement("script");
    script.id = "msg91-sdk";
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.onload = () => {
      if (window.initSendOTP) {
        window.initSendOTP({
          widgetId: MSG91_WIDGET_ID,
          tokenAuth: MSG91_TOKEN_AUTH,
          exposeMethods: true,
          captchaRenderId: "msg91-captcha-register",
          success: () => {},
          failure: () => {},
        });
      }
      setSdkReady(true);
    };
    document.head.appendChild(script);
  }, []);

  const startCooldown = () => {
    setResendCooldown(30);
    const t = setInterval(() => {
      setResendCooldown(v => { if (v <= 1) { clearInterval(t); return 0; } return v - 1; });
    }, 1000);
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nameValid)  { setError("Please enter your full name."); return; }
    if (!phoneValid) { setError("Enter a valid 10-digit phone number."); return; }
    if (!sdkReady || !window.sendOtp) { setError("OTP service loading, please try again."); return; }
    setLoading(true); setError("");
    window.sendOtp(
      identifier,
      () => { setLoading(false); setStep("otp"); startCooldown(); },
      (err) => { setLoading(false); setError(typeof err === "string" ? err : "Failed to send OTP. Please try again."); },
    );
  };

  const handleResend = () => {
    if (!window.retryOtp) return;
    setError("");
    window.retryOtp(
      11,
      () => startCooldown(),
      (err) => setError(typeof err === "string" ? err : "Failed to resend OTP."),
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) { setError("Enter the OTP sent to your phone."); return; }
    if (!window.verifyOtp) { setError("OTP service unavailable."); return; }
    setLoading(true); setError("");
    window.verifyOtp(
      otp,
      async () => {
        try {
          const res = await fetch("/api/auth/resolve-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: cleanPhone,
              name: form.name.trim(),
              email: form.email.trim() || undefined,
            }),
          });
          const json = await res.json() as { error?: string };
          if (!res.ok || json.error) { setError(json.error ?? "Registration failed."); setLoading(false); return; }
          localStorage.setItem("vo_user", JSON.stringify(json));
          window.location.href = "/profile";
        } catch {
          setError("Unable to connect. Please try again.");
          setLoading(false);
        }
      },
      (err) => { setLoading(false); setError(typeof err === "string" ? err : "Invalid OTP. Please try again."); },
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 50, borderRadius: 12, border: "1.5px solid #D4C9B8",
    padding: "0 16px", fontSize: 15, color: navy, background: "#fff",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6, display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "24px 16px" : "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf style={{ width: 22, height: 22, color: gold }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: serif, fontWeight: 700, fontSize: 18, color: navy, lineHeight: 1.1 }}>Veena Organics</p>
              <p style={{ fontSize: 10, color: "#9B9B9B", letterSpacing: "0.08em", textTransform: "uppercase" }}>Est. 1984</p>
            </div>
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #D4C9B8", padding: isMobile ? "28px 20px 24px" : "40px 40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <UserPlus style={{ width: 26, height: 26, color: gold }} />
          </div>

          {step === "details" ? (
            <>
              <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.75rem", color: navy, textAlign: "center", marginBottom: 6 }}>Create Account</h1>
              <p style={{ fontSize: 13, color: "#6B6B6B", textAlign: "center", marginBottom: 32 }}>Join Veena Organics — we'll verify with a one-time SMS</p>

              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input value={form.name} onChange={set("name")} placeholder="Your full name" style={inputStyle} required />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Phone Number *</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ height: 50, borderRadius: 12, border: "1.5px solid #D4C9B8", padding: "0 14px", display: "flex", alignItems: "center", fontSize: 14, fontWeight: 600, color: navy, background: "#F6F1E8", flexShrink: 0, gap: 6 }}>
                      🇮🇳 +91
                    </div>
                    <input type="tel" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile number" maxLength={15} style={{ ...inputStyle, flex: 1 }} required />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Email Address <span style={{ color: "#9B9B9B", fontWeight: 400 }}>(optional)</span></label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" style={inputStyle} />
                </div>

                {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#DC2626" }}>{error}</div>}

                <div id="msg91-captcha-register" ref={captchaRef} style={{ marginBottom: 12 }} />

                <p style={{ fontSize: 11, color: "#9B9B9B", marginBottom: 20, lineHeight: 1.6 }}>
                  By creating an account you agree to our{" "}
                  <Link href="#" style={{ color: gold, textDecoration: "none" }}>Terms of Service</Link>{" "}and{" "}
                  <Link href="#" style={{ color: gold, textDecoration: "none" }}>Privacy Policy</Link>.
                </p>

                <button type="submit" disabled={loading || !nameValid || !phoneValid || !sdkReady}
                  style={{ width: "100%", height: 50, borderRadius: 12, border: "none", background: (loading || !nameValid || !phoneValid || !sdkReady) ? "#D4C9B8" : gold, color: "#fff", fontSize: 15, fontWeight: 700, cursor: (loading || !nameValid || !phoneValid || !sdkReady) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {loading ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Sending OTP…</> : <>Send OTP <ArrowRight style={{ width: 16, height: 16 }} /></>}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.75rem", color: navy, textAlign: "center", marginBottom: 6 }}>Verify Phone</h1>
              <p style={{ fontSize: 13, color: "#6B6B6B", textAlign: "center", marginBottom: 4 }}>OTP sent to</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: navy, textAlign: "center", marginBottom: 28 }}>+91 {cleanPhone}</p>

              <form onSubmit={handleVerifyOtp}>
                <label style={labelStyle}>One-Time Password</label>
                <input type="number" value={otp} onChange={e => setOtp(e.target.value.slice(0, 6))} placeholder="Enter 6-digit OTP"
                  style={{ ...inputStyle, letterSpacing: "0.2em", fontSize: 20, textAlign: "center", marginBottom: 8 }} autoFocus />

                <div style={{ textAlign: "right", marginBottom: 20 }}>
                  {resendCooldown > 0
                    ? <span style={{ fontSize: 12, color: "#9B9B9B" }}>Resend in {resendCooldown}s</span>
                    : <button type="button" onClick={handleResend} style={{ fontSize: 12, color: gold, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Resend OTP</button>
                  }
                </div>

                {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#DC2626" }}>{error}</div>}

                <button type="submit" disabled={loading || otp.length < 4}
                  style={{ width: "100%", height: 50, borderRadius: 12, border: "none", background: (loading || otp.length < 4) ? "#D4C9B8" : gold, color: "#fff", fontSize: 15, fontWeight: 700, cursor: (loading || otp.length < 4) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                  {loading ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Verifying…</> : <>Create Account <ArrowRight style={{ width: 16, height: 16 }} /></>}
                </button>

                <button type="button" onClick={() => { setStep("details"); setOtp(""); setError(""); }}
                  style={{ width: "100%", height: 44, borderRadius: 12, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <ChevronLeft style={{ width: 15, height: 15 }} /> Change Details
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B6B6B" }}>
          Already have an account?{" "}
          <Link href="/sign-in" style={{ color: gold, fontWeight: 700, textDecoration: "none" }}>
            Sign In <ArrowRight style={{ width: 13, height: 13, display: "inline", verticalAlign: "middle" }} />
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
