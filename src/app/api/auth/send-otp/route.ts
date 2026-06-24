import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json() as { phoneNumber: string };

    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Valid phone number is required." }, { status: 400 });
    }

    // Strip to digits only, take last 10
    const cleaned = phoneNumber.replace(/\D/g, "").slice(-10);

    const res = await sendOtp(cleaned);

    // API returns code 200 on success
    if (res.code !== 200) {
      return NextResponse.json({ error: res.message ?? "Failed to send OTP." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "OTP service unavailable." }, { status: 503 });
  }
}
