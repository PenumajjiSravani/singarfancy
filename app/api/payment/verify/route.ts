import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Missing fields validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment fields: razorpay_order_id, razorpay_payment_id, or razorpay_signature." },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Server Configuration Error: Razorpay Key Secret is missing." },
        { status: 500 }
      );
    }

    // Generate expected signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    // Compare generated signature with razorpay_signature
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(razorpay_signature, "utf-8")
    );

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Signature mismatch." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified by Singar Fancy Secure Gateways.",
      payment_id: razorpay_payment_id,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Razorpay Verify Payment Signature Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify signature" },
      { status: 500 }
    );
  }
}
