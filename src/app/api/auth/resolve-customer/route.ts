import { NextResponse } from "next/server";
import { guestRegister, activateCustomer } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { phoneNumber, name, email } = await req.json() as {
      phoneNumber: string;
      name?: string;
      email?: string;
    };

    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Valid phone number is required." }, { status: 400 });
    }

    const cleaned = phoneNumber.replace(/\D/g, "").slice(-10);

    // Get or create customer
    const regRes = await guestRegister(cleaned);
    const customer = regRes.data;

    if (!customer?.customerId) {
      return NextResponse.json({ error: "Failed to resolve customer." }, { status: 500 });
    }

    // Activate and update name/email
    await activateCustomer(customer.customerId, cleaned, name);

    return NextResponse.json({
      customerId: customer.customerId,
      customerName: name ?? customer.customerName ?? null,
      phoneNumber: cleaned,
      email: email ?? customer.email ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Auth service unavailable." }, { status: 503 });
  }
}
