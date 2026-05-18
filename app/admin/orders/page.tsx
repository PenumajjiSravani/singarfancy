"use client";

import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, ShieldAlert } from "lucide-react";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const mockOrders = [
  {
    id: "#SF-8930",
    client: "Aditi Rao Hydari",
    email: "aditi@luxury.in",
    total: 37500,
    status: "PROCESSING" as OrderStatus,
    date: "May 18, 2026",
    items: "Golden Royale Necklace x1, Blush Rose Lip Oil x1",
  },
  {
    id: "#SF-8929",
    client: "Ranveer Singh",
    email: "ranveer@bollywood.com",
    total: 45000,
    status: "SHIPPED" as OrderStatus,
    date: "May 18, 2026",
    items: "Chrono Gold Timepiece x1",
  },
  {
    id: "#SF-8928",
    client: "Kareena Kapoor",
    email: "kareena@kapoor.com",
    total: 12500,
    status: "DELIVERED" as OrderStatus,
    date: "May 17, 2026",
    items: "Golden Royale Necklace x1",
  },
  {
    id: "#SF-8927",
    client: "Deepika Padukone",
    email: "deepika@luxury.in",
    total: 24500,
    status: "CONFIRMED" as OrderStatus,
    date: "May 17, 2026",
    items: "Starlight Diamond Studs x1",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success(`Updated order ${id} status to ${newStatus}`);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-display text-[var(--color-ivory)]">Order Commissions</h1>
        <p className="text-zinc-500 font-light text-sm">Review, track transit states, and update client commission orders.</p>
      </div>

      {/* Orders Table */}
      <div className="glass-card p-6 rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-light text-zinc-400">
            <thead>
              <tr className="border-b border-zinc-900 text-xs text-zinc-500 uppercase tracking-widest pb-3">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Acquisitions</th>
                <th className="pb-3">Total Value</th>
                <th className="pb-3">Transit State</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-950/20 transition-colors">
                  <td className="py-4 font-semibold text-[var(--color-ivory)]">{o.id}</td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--color-ivory)]">{o.client}</span>
                      <span className="text-[10px] text-zinc-600 font-light">{o.email}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs truncate max-w-xs">{o.items}</td>
                  <td className="py-4 text-[var(--color-gold)] font-semibold">{formatPrice(o.total)}</td>
                  <td className="py-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-2 py-1 bg-zinc-950 border focus:border-[var(--color-gold)] outline-none rounded-sm uppercase ${
                        o.status === "DELIVERED"
                          ? "border-green-900/30 text-green-500"
                          : o.status === "SHIPPED"
                          ? "border-blue-900/30 text-blue-400"
                          : o.status === "PROCESSING"
                          ? "border-yellow-900/30 text-yellow-500"
                          : "border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="py-4 text-xs text-zinc-500">{o.date}</td>
                  <td className="py-4 text-right">
                    <button className="w-8 h-8 rounded-full border border-zinc-800 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] flex items-center justify-center transition-colors ml-auto">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
