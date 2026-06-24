import { NextResponse } from "next/server";
import { getOrders } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const orders = await getOrders({
      customerId: customerId ? Number(customerId) : undefined,
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Unable to fetch orders." }, { status: 503 });
  }
}
