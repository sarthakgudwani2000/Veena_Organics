import { NextResponse } from "next/server";
import { placeOrder } from "@/lib/api";
import { randomUUID } from "crypto";

const STORE_ID   = Number(process.env.NEXT_PUBLIC_STORE_ID ?? "6");
const MERCHANT_ID = STORE_ID; // merchant_id = store_id in this system

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      customerId: number;
      customerName: string;
      phoneNumber: string;
      fullAddress: string;
      paymentMode: string;
      items: {
        productId: number;
        productName: string;
        productImage: string;
        price: number;
        mrp: number;
        quantity: number;
        unit: number;
        unitType: string;
        categoryId: number;
        subCategoryId: number;
        brandId: number;
        typeId: number;
        attributeId: number;
        groupId: string;
      }[];
      orderGrossAmount: number;
      orderNetAmount: number;
    };

    const orderPayload = [{
      storeId:             STORE_ID,
      merchantId:          MERCHANT_ID,
      addressId:           0,
      uuid:                randomUUID(),
      customerId:          body.customerId || null,
      customerName:        body.customerName,
      customerPhoneNumber: body.phoneNumber,
      fullAddress:         body.fullAddress,
      orderGrossAmount:    body.orderGrossAmount,
      orderNetAmount:      body.orderNetAmount,
      taxAmount:           0,
      discount:            0,
      paymentMode:         body.paymentMode,
      paymentStatus:       "PENDING",
      orderType:           "web",
      orderStatus:         "placed",
      trackOrder:          "new_order",
      orderItems:          body.items,
    }];

    const res = await placeOrder(orderPayload);

    if (res.code !== 200) {
      return NextResponse.json({ error: res.message ?? "Order placement failed." }, { status: 400 });
    }

    return NextResponse.json({ success: true, orderId: res.groupId ?? res.data });
  } catch {
    return NextResponse.json({ error: "Order service unavailable." }, { status: 503 });
  }
}
