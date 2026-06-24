import { NextResponse } from "next/server";
import { getProducts, mapApiProduct } from "@/lib/api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const products = await getProducts({ pageSize: 500 });
    const found = products.find(p => String(p.productId) === id);
    if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapApiProduct(found));
  } catch {
    return NextResponse.json({ error: "API unavailable" }, { status: 503 });
  }
}
