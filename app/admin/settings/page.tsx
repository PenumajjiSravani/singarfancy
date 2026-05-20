"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sliders, KeyRound, Palette, Briefcase, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function CuratorSettingsPage() {
  const [storeName, setStoreName] = useState("Singar Fancy");
  const [commissionRate, setCommissionRate] = useState(15);
  const [themeMode, setThemeMode] = useState("luxury-dark");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Boutique settings successfully updated by the Grand Curator!");
    }, 1200);
  };

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
        <div>
          <span className="text-[var(--color-gold)] tracking-[0.25em] text-[10px] font-semibold uppercase block mb-1">
            System Tuning
          </span>
          <h1 className="text-3xl font-display text-[var(--color-ivory)]">
            Curator Settings
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: General Curation Options */}
          <div className="glass-card p-6 md:p-8 rounded-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <Sliders className="w-5 h-5 text-[var(--color-gold)]" />
              <h2 className="text-base font-semibold text-[var(--color-ivory)] uppercase tracking-wider">
                Boutique Configuration
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Boutique Display Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Curator Commission Rate (%)</label>
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Curator Brand Narrative</label>
              <textarea
                rows={3}
                defaultValue="A premier boutique for exquisite jewelry, royal accessories, clothing masterworks, and elite floral cosmetics."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none resize-none"
              />
            </div>
          </div>

          {/* Section 2: Layout / Branding Theme */}
          <div className="glass-card p-6 md:p-8 rounded-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <Palette className="w-5 h-5 text-[var(--color-gold)]" />
              <h2 className="text-base font-semibold text-[var(--color-ivory)] uppercase tracking-wider">
                Luxury Theme Selection
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setThemeMode("luxury-dark")}
                className={`p-4 border text-left rounded-none flex flex-col justify-between h-28 transition-all ${
                  themeMode === "luxury-dark" ? "border-[var(--color-gold)] bg-zinc-950" : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
                }`}
              >
                <span className="font-semibold text-sm text-[var(--color-ivory)]">Imperial Obsidian</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Deep Black & Gold</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode("ivory-gold")}
                className={`p-4 border text-left rounded-none flex flex-col justify-between h-28 transition-all opacity-60 cursor-not-allowed ${
                  themeMode === "ivory-gold" ? "border-[var(--color-gold)] bg-zinc-950" : "border-zinc-800 bg-zinc-950/10"
                }`}
              >
                <span className="font-semibold text-sm text-zinc-400">Royal Alabaster</span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Ivory & Champagne</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode("blush-rose")}
                className={`p-4 border text-left rounded-none flex flex-col justify-between h-28 transition-all opacity-60 cursor-not-allowed ${
                  themeMode === "blush-rose" ? "border-[var(--color-gold)] bg-zinc-950" : "border-zinc-800 bg-zinc-950/10"
                }`}
              >
                <span className="font-semibold text-sm text-zinc-400">Curator Blush</span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Rose Quartz Accent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Panels */}
        <div className="space-y-6">
          {/* Secure Environments Credentials Check */}
          <div className="glass-card p-6 rounded-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <KeyRound className="w-5 h-5 text-[var(--color-gold)]" />
              <h3 className="text-sm font-semibold text-[var(--color-ivory)] uppercase tracking-wider">
                Gateway Creds Check
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-light">Razorpay Key ID</span>
                <span className="px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 font-mono tracking-wider">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-light">Prisma database</span>
                <span className="px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 font-mono tracking-wider">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-light">NextAuth OAuth</span>
                <span className="px-2 py-0.5 rounded-sm bg-zinc-900 text-zinc-500 font-mono tracking-wider">STANDBY</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="glass-card p-6 rounded-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <Briefcase className="w-5 h-5 text-[var(--color-gold)]" />
              <h3 className="text-sm font-semibold text-[var(--color-ivory)] uppercase tracking-wider">
                Curation Metrics
              </h3>
            </div>

            <div className="space-y-4 text-xs font-light text-zinc-400 leading-relaxed">
              <p>Active Curation Target is set to <span className="text-[var(--color-gold)] font-bold">15%</span> of total gross boutique volumes.</p>
              <p>Transactions are processed via secure Razorpay checkout gateways with real-time signature checks enabled.</p>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={isSaving} className="w-full flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            {isSaving ? "COMMITING OPTIONS..." : "SAVE CURATOR CONFIG"}
          </Button>
        </div>
      </form>
    </div>
  );
}
