import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      amount: number;
      customerName: string;
      customerIdentifier: string;
      requestId: string;
    };

    const keyId     = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay not configured." }, { status: 503 });
    }

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount:   body.amount,       // already in paise (multiplied by 100 in checkout)
        currency: "INR",
        receipt:  body.requestId,
      }),
    });

    const rzpData = await rzpRes.json() as { id?: string; error?: { description?: string } };

    if (!rzpRes.ok) {
      return NextResponse.json(
        { error: rzpData.error?.description ?? "Failed to create Razorpay order." },
        { status: rzpRes.status }
      );
    }

    return NextResponse.json(rzpData);
  } catch {
    return NextResponse.json({ error: "Payment service unavailable." }, { status: 503 });
  }
}
