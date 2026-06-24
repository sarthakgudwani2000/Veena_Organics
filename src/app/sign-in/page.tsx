"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Leaf, ArrowRight, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import { useResponsive } from "@/hooks/use-responsive";

const serif = "'Playfair Display', Georgia, serif";
const navy  = "#1C2B3A";
const gold  = "#B8923A";

type Step = "phone" | "otp";

export default function SignInPage() {
  const { isMobile } = useResponsive();
  const [step, setStep]           = useState<Step>("phone");
  const [phone, setPhone]         = useState("");
  const [otp, setOtp]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const phoneValid = cleanPhone.length === 10;

  const startCooldown = () => {
    setResendCooldown(30);
    const t = setInterval(() => {
      setResendCooldown(v => {
        if (v <= 1) { clearInterval(t); return 0; }
        return v - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!phoneValid) { setError("Enter a valid 10-digit phone number."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: cleanPhone }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok || json.error) { setError(json.error ?? "Failed to send OTP."); return; }
      setStep("otp");
      startCooldown();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) { setError("Enter the OTP sent to your phone."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: cleanPhone, otp }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok || json.error) { setError(json.error ?? "Invalid OTP. Please try again."); return; }
      localStorage.setItem("vo_user", JSON.stringify(json));
      window.location.href = "/profile";
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 50, borderRadius: 12, border: "1.5px solid #D4C9B8",
    padding: "0 16px", fontSize: 16, color: navy, background: "#fff",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "24px 16px" : "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
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

          {/* Icon */}
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            {step === "otp"
              ? <CheckCircle2 style={{ width: 26, height: 26, color: gold }} />
              : <Phone style={{ width: 26, height: 26, color: gold }} />
            }
          </div>

          {step === "phone" ? (
            <>
              <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.75rem", color: navy, textAlign: "center", marginBottom: 6 }}>Welcome Back</h1>
              <p style={{ fontSize: 13, color: "#6B6B6B", textAlign: "center", marginBottom: 32 }}>Enter your phone number to receive a one-time password</p>

              <form onSubmit={handleSendOtp}>
                <p style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Phone Number</p>
                <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                  <div style={{ height: 50, borderRadius: 12, border: "1.5px solid #D4C9B8", padding: "0 14px", display: "flex", alignItems: "center", fontSize: 14, fontWeight: 600, color: navy, background: "#F6F1E8", flexShrink: 0, gap: 6 }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={15}
                    style={{ ...inputStyle, flex: 1 }}
                    autoFocus
                  />
                </div>

                {error && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#DC2626" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading || !phoneValid}
                  style={{ width: "100%", height: 50, borderRadius: 12, border: "none", background: (loading || !phoneValid) ? "#D4C9B8" : navy, color: "#fff", fontSize: 15, fontWeight: 700, cursor: (loading || !phoneValid) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {loading
                    ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Sending OTP…</>
                    : <>Send OTP <ArrowRight style={{ width: 16, height: 16 }} /></>
                  }
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "1.75rem", color: navy, textAlign: "center", marginBottom: 6 }}>Enter OTP</h1>
              <p style={{ fontSize: 13, color: "#6B6B6B", textAlign: "center", marginBottom: 4 }}>
                We sent a 6-digit code to
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: navy, textAlign: "center", marginBottom: 28 }}>
                +91 {cleanPhone}
              </p>

              <form onSubmit={handleVerifyOtp}>
                <p style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>One-Time Password</p>
                <input
                  type="number"
                  value={otp}
                  onChange={e => setOtp(e.target.value.slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  style={{ ...inputStyle, letterSpacing: "0.2em", fontSize: 20, textAlign: "center", marginBottom: 8 }}
                  autoFocus
                />

                {/* Resend */}
                <div style={{ textAlign: "right", marginBottom: 20 }}>
                  {resendCooldown > 0
                    ? <span style={{ fontSize: 12, color: "#9B9B9B" }}>Resend in {resendCooldown}s</span>
                    : <button type="button" onClick={() => handleSendOtp()} style={{ fontSize: 12, color: gold, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        Resend OTP
                      </button>
                  }
                </div>

                {error && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#DC2626" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading || otp.length < 4}
                  style={{ width: "100%", height: 50, borderRadius: 12, border: "none", background: (loading || otp.length < 4) ? "#D4C9B8" : navy, color: "#fff", fontSize: 15, fontWeight: 700, cursor: (loading || otp.length < 4) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                  {loading
                    ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Verifying…</>
                    : <>Verify & Sign In <ArrowRight style={{ width: 16, height: 16 }} /></>
                  }
                </button>

                <button type="button" onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                  style={{ width: "100%", height: 44, borderRadius: 12, border: "1.5px solid #D4C9B8", background: "#fff", color: navy, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <ChevronLeft style={{ width: 15, height: 15 }} /> Change Number
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B6B6B" }}>
          New to Veena Organics?{" "}
          <Link href="/register" style={{ color: gold, fontWeight: 700, textDecoration: "none" }}>
            Create Account <ArrowRight style={{ width: 13, height: 13, display: "inline", verticalAlign: "middle" }} />
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
