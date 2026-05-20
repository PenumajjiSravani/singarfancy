"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User, ShoppingBag, MapPin, Phone, Mail, Shield, CheckCircle, Package, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

// High-fidelity mock orders database for an instant beautiful experience
interface MockOrder {
  id: string;
  date: string;
  status: "Processing" | "Dispatched" | "Delivered";
  paymentId: string;
  total: number;
  items: {
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

const mockOrders: MockOrder[] = [
  {
    id: "SF-10932",
    date: "May 15, 2026",
    status: "Delivered",
    paymentId: "pay_Opz83ksmD02s1a",
    total: 45000,
    items: [
      {
        name: "Chrono Gold Timepiece",
        price: 45000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=200&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "SF-10821",
    date: "April 28, 2026",
    status: "Delivered",
    paymentId: "pay_Nks92jsmX829ds",
    total: 14300,
    items: [
      {
        name: "Golden Hour Hoop Earrings",
        price: 6500,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop",
      },
      {
        name: "Crimson Velvet Lip Glaze",
        price: 2200,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=200&auto=format&fit=crop",
      },
      {
        name: "Midnight Silk Scarf",
        price: 3500,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=200&auto=format&fit=crop",
      },
    ],
  },
];

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "orders">("details");

  // Editable Account States
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("Royal Orchid Manor, Block 4, UB City");
  const [city, setCity] = useState("Bangalore, Karnataka");
  const [zip, setZip] = useState("560001");

  useEffect(() => {
    setMounted(true);
    // Sync active tab state from URL params
    const tabParam = searchParams.get("tab");
    if (tabParam === "orders" || tabParam === "details") {
      setActiveTab(tabParam);
    }

    if (!isAuthenticated()) {
      toast.error("Please sign in to view your profile.");
      router.push("/login");
    }
  }, [searchParams, isAuthenticated, router]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account information securely updated!");
  };

  if (!mounted || !user) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
          Securely loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background text-[var(--color-ivory)]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Welcome Banner */}
        <div className="glass-card p-8 rounded-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
              <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase">
                Bespoke Client Curation
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-semibold">
              Hello, {user.name}
            </h1>
            <p className="text-zinc-400 font-light text-sm">
              Manage your personal details, secure delivery coordinates, and examine order histories.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-5 py-3 text-xs uppercase tracking-widest transition-all duration-300 font-semibold cursor-pointer border ${
                activeTab === "details"
                  ? "border-[var(--color-gold)] text-black bg-[var(--color-gold)]"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700 bg-zinc-950/20"
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-3 text-xs uppercase tracking-widest transition-all duration-300 font-semibold cursor-pointer border ${
                activeTab === "orders"
                  ? "border-[var(--color-gold)] text-black bg-[var(--color-gold)]"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700 bg-zinc-950/20"
              }`}
            >
              Order History
            </button>
          </div>
        </div>

        {/* Tab Layout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Main Panel */}
          <main className="lg:col-span-2 space-y-8">
            
            {activeTab === "details" ? (
              // ------------------- Account Details Tab -------------------
              <div className="glass-card p-6 md:p-8 rounded-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-2">
                  <User className="w-5 h-5 text-[var(--color-gold)]" />
                  <h2 className="text-base font-semibold uppercase tracking-wider">
                    Personal Coordinates & Delivery Details
                  </h2>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest font-semibold">Full Name</label>
                      <input
                        type="text"
                        disabled
                        value={user.name}
                        className="w-full bg-zinc-950/60 border border-zinc-900 outline-none px-4 py-3 text-sm text-zinc-500 rounded-none cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest font-semibold">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full bg-zinc-950/60 border border-zinc-900 outline-none px-4 py-3 text-sm text-zinc-500 rounded-none cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest font-semibold">Contact Mobile</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm rounded-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest font-semibold">Boutique ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm rounded-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest font-semibold">Delivery Address Line</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm rounded-none transition-colors mb-4"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm rounded-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[var(--color-gold)] text-black font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-none cursor-pointer"
                  >
                    SECURE AND COMMIT DETAILS
                  </button>
                </form>
              </div>
            ) : (
              // ------------------- Order History Tab -------------------
              <div className="space-y-6">
                <div className="glass-card p-6 md:p-8 rounded-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-2">
                    <ShoppingBag className="w-5 h-5 text-[var(--color-gold)]" />
                    <h2 className="text-base font-semibold uppercase tracking-wider">
                      Your Order History
                    </h2>
                  </div>

                  {mockOrders.length > 0 ? (
                    <div className="space-y-6">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border border-zinc-900 bg-zinc-950/20 p-5 md:p-6 rounded-sm space-y-4 hover:border-zinc-800 transition-colors">
                          
                          {/* Order Card Top */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-4 gap-4">
                            <div>
                              <p className="text-xs text-zinc-500 uppercase tracking-wider font-light">Order Reference</p>
                              <p className="text-sm font-semibold text-[var(--color-gold)] tracking-wider mt-0.5">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-zinc-500 uppercase tracking-wider font-light">Acquisition Date</p>
                              <p className="text-xs font-semibold text-[var(--color-ivory)] mt-0.5">{order.date}</p>
                            </div>
                            <div>
                              <p className="text-xs text-zinc-500 uppercase tracking-wider font-light">Payment Gate</p>
                              <span className="inline-block text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-sm border border-zinc-900 mt-0.5">{order.paymentId}</span>
                            </div>
                            <div>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-emerald-500/10 text-emerald-400">
                                <CheckCircle className="w-3 h-3" />
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Items Grid */}
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center justify-between">
                                <div className="flex gap-4 items-center">
                                  <div className="relative w-12 h-14 bg-zinc-900 border border-zinc-900 rounded-sm overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-[var(--color-ivory)]">{item.name}</p>
                                    <p className="text-[10px] text-zinc-500 font-light mt-0.5">Quantity: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-[var(--color-gold)]">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Invoice / Action Bottom */}
                          <div className="flex justify-between items-center border-t border-zinc-900 pt-4 mt-2">
                            <span className="text-xs text-zinc-500">Gross Total volume: <strong className="text-[var(--color-gold)]">{formatPrice(order.total)}</strong></span>
                            <button
                              onClick={() => toast.success("Invoice successfully downloaded to your device!")}
                              className="text-[10px] font-bold text-zinc-400 hover:text-[var(--color-gold)] transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              GET PDF INVOICE
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-zinc-900 bg-zinc-950/20 rounded-sm">
                      <p className="text-zinc-500 font-light">No order records found in this vault.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* Right Info Panels */}
          <aside className="space-y-6">
            {/* Membership Tier Widget */}
            <div className="glass-card p-6 rounded-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                <Shield className="w-5 h-5 text-[var(--color-gold)]" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  Curation Tier
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest block mb-1">Assigned Rank</span>
                  <span className="text-lg font-display text-[var(--color-gold)] font-bold tracking-wider uppercase">
                    {user.role === "ADMIN" ? "Grand Curator" : "Imperial Elite Client"}
                  </span>
                </div>
                <div className="h-[1px] w-full bg-zinc-900" />
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Enjoy custom bespoke checkout limits, timing-safe Razorpay gateways, and complimentary signature shipping on all jewelry, cosmetics, and accessories.
                </p>
              </div>
            </div>

            {/* Quick Curation Guide */}
            <div className="glass-card p-6 rounded-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                <Package className="w-5 h-5 text-[var(--color-gold)] animate-pulse" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  Complimentary Support
                </h3>
              </div>

              <div className="space-y-4 text-xs font-light text-zinc-400 leading-relaxed">
                <p>Have any questions regarding sizing or curation adjustments?</p>
                <button
                  onClick={() => toast.success("Curation concierge has been notified. We will reach you shortly!")}
                  className="flex items-center gap-2 text-[var(--color-gold)] font-semibold hover:underline mt-1 cursor-pointer uppercase tracking-wider"
                >
                  Contact Curation Concierge
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
          Securely loading profile...
        </div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
