import { NextResponse } from "next/server";
import { updateRazorpayOrder, placeOrder } from "@/lib/api";
import { randomUUID } from "crypto";

const STORE_ID    = Number(process.env.NEXT_PUBLIC_STORE_ID ?? "6");
const MERCHANT_ID = STORE_ID;

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
      order: {
        customerId: number;
        customerName: string;
        phoneNumber: string;
        fullAddress: string;
        items: Record<string, unknown>[];
        orderGrossAmount: number;
        orderNetAmount: number;
      };
    };

    // Verify payment with backend
    await updateRazorpayOrder({
      razorpayPaymentId: body.razorpayPaymentId,
      razorpayOrderId:   body.razorpayOrderId,
      razorpaySignature: body.razorpaySignature,
    });

    // Place order as paid
    const orderPayload = [{
      storeId:             STORE_ID,
      merchantId:          MERCHANT_ID,
      addressId:           0,
      uuid:                randomUUID(),
      customerId:          body.order.customerId || null,
      customerName:        body.order.customerName,
      customerPhoneNumber: body.order.phoneNumber,
      fullAddress:         body.order.fullAddress,
      orderGrossAmount:    body.order.orderGrossAmount,
      orderNetAmount:      body.order.orderNetAmount,
      taxAmount:           0,
      discount:            0,
      paymentMode:         "online",
      paymentStatus:       "PAID",
      orderType:           "web",
      orderStatus:         "placed",
      trackOrder:          "new_order",
      razorpayPaymentId:   body.razorpayPaymentId,
      razorpayOrderId:     body.razorpayOrderId,
      orderItems:          body.order.items,
    }];

    const res = await placeOrder(orderPayload);

    if (res.code !== 200) {
      return NextResponse.json({ error: res.message ?? "Order placement failed after payment." }, { status: 400 });
    }

    return NextResponse.json({ success: true, orderId: res.groupId ?? res.data });
  } catch {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 503 });
  }
}
