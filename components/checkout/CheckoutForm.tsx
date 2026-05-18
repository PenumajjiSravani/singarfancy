"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export function CheckoutForm() {
  const router = useRouter();
  const { clearCart, getCartTotal } = useCartStore();
  const [step, setStep] = useState<"address" | "payment">("address");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });

  const onAddressSubmit = (data: AddressFormData) => {
    setStep("payment");
    toast.success("Shipping address validated!");
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    const addressData = getValues();
    const totalAmount = getCartTotal();

    if (totalAmount <= 0) {
      toast.error("Your cart is empty.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Create order on the backend (in paise)
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // paise
          currency: "INR",
          receipt: `receipt_sf_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create order on server.");
      }

      const data = await res.json();

      if (!data.success || !data.order_id) {
        throw new Error("Invalid order data returned from server.");
      }

      // 2. Configure Razorpay Standard Checkout options
      const options = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Sqiu5OsK2X5mix",
        amount: data.amount,
        currency: data.currency,
        name: "Singar Fancy",
        description: "Premium Curated Fancy Goods Checkout",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=120&auto=format&fit=crop",
        order_id: data.order_id,
        handler: async function (response: any) {
          try {
            setIsSubmitting(true);
            // 3. Send payment details to verify endpoint
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const verifyError = await verifyRes.json();
              throw new Error(verifyError.error || "Payment signature verification failed.");
            }

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              toast.success("Payment verified successfully! Thank you for purchasing.");
              router.push("/order-confirmation");
            } else {
              toast.error(verifyData.error || "Payment validation failed.");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            toast.error(err.message || "Failed to verify transaction signature.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: addressData.fullName,
          email: addressData.email,
          contact: addressData.phone,
        },
        notes: {
          address: `${addressData.street}, ${addressData.city}, ${addressData.state} - ${addressData.postalCode}`,
        },
        theme: {
          color: "#C9A84C", // Champagne Gold primary branding
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            toast.info("Payment cancelled. Feel free to try again.");
          },
        },
      };

      // 3. Open the modal
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        
        rzp.on("payment.failed", function (response: any) {
          toast.error(`Payment failed: ${response.error.description}`);
          setIsSubmitting(false);
        });

        rzp.open();
      } else {
        throw new Error("Razorpay SDK failed to load. Please refresh the page and try again.");
      }

    } catch (err: any) {
      console.error("Payment integration error:", err);
      toast.error(err.message || "Something went wrong while initiating the payment.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-sm">
      {/* Steps Indicator */}
      <div className="flex items-center gap-4 mb-8 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
            step === "address" ? "bg-[var(--color-gold)] text-black" : "bg-zinc-900 text-zinc-400"
          }`}>
            1
          </span>
          <span className={`text-sm tracking-wider uppercase font-medium ${
            step === "address" ? "text-[var(--color-gold)]" : "text-zinc-500"
          }`}>
            Shipping Address
          </span>
        </div>
        
        <div className="h-[1px] w-12 bg-zinc-900" />
        
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
            step === "payment" ? "bg-[var(--color-gold)] text-black" : "bg-zinc-900 text-zinc-400"
          }`}>
            2
          </span>
          <span className={`text-sm tracking-wider uppercase font-medium ${
            step === "payment" ? "text-[var(--color-gold)]" : "text-zinc-500"
          }`}>
            Payment Details
          </span>
        </div>
      </div>

      {step === "address" ? (
        <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Full Name</label>
              <input
                {...register("fullName")}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Phone Number</label>
            <input
              {...register("phone")}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Street Address</label>
            <input
              {...register("street")}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
            />
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">City</label>
              <input
                {...register("city")}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">State</label>
              <input
                {...register("state")}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Postal Code</label>
              <input
                {...register("postalCode")}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
            </div>
            
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Country</label>
              <input
                {...register("country")}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full mt-4">
            CONTINUE TO PAYMENT
          </Button>
        </form>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-xl text-[var(--color-ivory)] mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 border border-[var(--color-gold)] bg-zinc-950 text-left">
                <span className="font-semibold text-[var(--color-ivory)]">Razorpay (India)</span>
                <span className="w-4 h-4 rounded-full bg-[var(--color-gold)] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-black" />
                </span>
              </button>
              <button className="flex items-center justify-between p-4 border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-left opacity-60 cursor-not-allowed">
                <span className="font-semibold text-zinc-400">Card Payment (International)</span>
                <span className="w-4 h-4 rounded-full border border-zinc-800" />
              </button>
            </div>
          </div>

          <div className="border border-zinc-900 p-6 rounded-sm bg-zinc-950/30">
            <h4 className="font-semibold text-sm uppercase tracking-widest text-[var(--color-gold)] mb-3">Complimentary Insured Delivery</h4>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              Your signature luxury order will be double-boxed and shipped using complimentary insured express air transit. Full tracing data will be provided upon dispatch.
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" size="lg" onClick={() => setStep("address")} className="w-1/3">
              BACK
            </Button>
            <Button size="lg" onClick={handlePayment} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "PROCESSING PAYMENTS..." : "PAY & PLACE ORDER"}
            </Button>
          </div>
        </div>
      )}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}
