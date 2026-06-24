import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      amount: number;
      customerName: string;
      customerIdentifier: string;
      requestId: string;
    };

    const res = await createRazorpayOrder({
      requestId: body.requestId,
      clientId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      currency: "INR",
      amount: body.amount,
      paymentMode: "online",
      customerName: body.customerName,
      customerIdentifier: body.customerIdentifier,
    });

    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "Payment service unavailable." }, { status: 503 });
  }
}
