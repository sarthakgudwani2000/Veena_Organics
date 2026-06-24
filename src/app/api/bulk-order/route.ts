import { NextResponse } from "next/server";
import { placeBulkOrder } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      productName?: string;
      contactNumber: string;
      contactAddress: string;
      cost?: number;
      remarks?: string;
      isPartyOrder?: number;
    };

    if (!body.contactNumber || !body.contactAddress) {
      return NextResponse.json({ error: "Contact number and address are required." }, { status: 400 });
    }

    const res = await placeBulkOrder(body);

    if (res.code !== 200) {
      return NextResponse.json({ error: res.message ?? "Failed to submit bulk order." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bulk order service unavailable." }, { status: 503 });
  }
}
