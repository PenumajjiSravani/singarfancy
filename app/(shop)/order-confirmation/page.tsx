import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OrderConfirmationPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md glass-card p-12 rounded-sm space-y-8">
        <div className="w-16 h-16 bg-green-950/20 border border-green-900/30 rounded-full flex items-center justify-center text-green-500 mx-auto">
          <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
        </div>
        
        <div className="space-y-3">
          <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase block">
            Payment Secure
          </span>
          <h1 className="text-3xl md:text-4xl font-display text-[var(--color-ivory)]">
            Order Confirmed!
          </h1>
          <p className="text-zinc-500 font-light text-sm leading-relaxed max-w-xs mx-auto">
            Your premium purchase has been successfully placed. A luxury confirmation dispatch has been sent to your email.
          </p>
        </div>

        <div className="border-t border-zinc-900 pt-6 space-y-3 text-xs font-light text-zinc-500">
          <p>Order Reference: <span className="font-semibold text-zinc-300">#SF-{Math.floor(100000 + Math.random() * 900000)}</span></p>
          <p>Insured Express transit time: <span className="font-semibold text-zinc-300">2-4 Business Days</span></p>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <Link href="/products">
            <Button size="lg" className="w-full">
              CONTINUE SHOPPING
            </Button>
          </Link>
          
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full">
              RETURN HOME
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
