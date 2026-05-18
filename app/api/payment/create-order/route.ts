import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt } = body;

    // Validate amount is at least 100 paise (₹1)
    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount must be 100 paise (₹1)." },
        { status: 400 }
      );
    }

    // Call Razorpay API to create order
    const options = {
      amount: Math.round(amount), // in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      return NextResponse.json(
        { error: "Failed to create order on Razorpay" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    
    // Auth failures or other specific API errors
    if (error.statusCode === 401) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid Razorpay credentials." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
