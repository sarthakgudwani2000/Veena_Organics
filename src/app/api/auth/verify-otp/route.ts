import { NextResponse } from "next/server";
import { verifyOtp, registerCustomer } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { phoneNumber, otp, customerName, email } = await req.json() as {
      phoneNumber: string;
      otp: string;
      customerName?: string;
      email?: string;
    };

    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required." }, { status: 400 });
    }

    const cleaned = phoneNumber.replace(/\D/g, "").slice(-10);

    const res = await verifyOtp(cleaned, otp);

    if (res.code !== 200) {
      return NextResponse.json({ error: res.message ?? "Invalid OTP. Please try again." }, { status: 401 });
    }

    // If name provided, this is a registration — save/update customer details
    if (customerName) {
      await registerCustomer({
        customerName,
        phoneNumber: cleaned,
        email: email ?? "",
      }).catch(() => { /* non-fatal — customer may already exist */ });
    }

    // Build the user session object from verifyOtp response
    const data = (res.data ?? {}) as Record<string, unknown>;
    return NextResponse.json({
      customerId:   data.customerId ?? data.customer_id,
      customerName: data.customerName ?? customerName ?? "",
      phoneNumber:  cleaned,
      email:        data.email ?? email ?? "",
      token:        data.token ?? data.accessToken,
      ...data,
    });
  } catch {
    return NextResponse.json({ error: "Verification service unavailable." }, { status: 503 });
  }
}
