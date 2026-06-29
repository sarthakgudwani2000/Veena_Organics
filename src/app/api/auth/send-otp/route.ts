import { NextResponse } from "next/server";
import { sendOtp, guestRegister, activateCustomer } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json() as { phoneNumber: string };

    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Valid phone number is required." }, { status: 400 });
    }

    // Strip to digits only, take last 10
    const cleaned = phoneNumber.replace(/\D/g, "").slice(-10);

    let res = await sendOtp(cleaned);

    // If OTP failed (phone not found / inactive), register + activate then retry once
    if (res.code !== 200) {
      const regRes = await guestRegister(cleaned);
      const customerId = regRes.data?.customerId;
      if (customerId) {
        await activateCustomer(customerId, cleaned);
      }
      res = await sendOtp(cleaned);
    }

    if (res.code !== 200) {
      return NextResponse.json({ error: res.message ?? "Failed to send OTP." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "OTP service unavailable." }, { status: 503 });
  }
}
