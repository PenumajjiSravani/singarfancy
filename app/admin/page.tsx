"use client";
import { useEffect, useState } from "react";
import { useStore, MOCK_ORDERS, MOCK_CUSTOMERS, SAMPLE_PRODUCTS } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LayoutDashboard, ShoppingBag, Users, Package,
    LogOut, Sparkles, TrendingUp, IndianRupee,
    Clock, CheckCircle, Truck, XCircle, ChevronRight, Settings
} from "lucide-react";

type Section = "overview" | "orders" | "products" | "customers" | "settings";

const statusColor: Record<string, string> = {
    Processing: "text-amber-600 bg-amber-50 border-amber-100",
    Shipped: "text-blue-600 bg-blue-50 border-blue-100",
    Delivered: "text-green-600 bg-green-50 border-green-100",
    Cancelled: "text-red-500 bg-red-50 border-red-100",
};
const statusIcon: Record<string, React.ElementType> = {
    Processing: Clock, Shipped: Truck, Delivered: CheckCircle, Cancelled: XCircle,
};

const revenueData = [
    { month: "Jan", value: 18400 },
    { month: "Feb", value: 22000 },
    { month: "Mar", value: 19800 },
    { month: "Apr", value: 31200 },
    { month: "May", value: 24580 },
];
const maxRev = Math.max(...revenueData.map((d) => d.value));

export default function AdminPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user;
    const [section, setSection] = useState<Section>("overview");

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (user && user.role !== "admin") { router.push("/dashboard"); }
    }, [user, status, router]);

    if (status === "loading" || !user || user.role !== "admin") return <div className="min-h-screen bg-[#0F0608]" />;

    const totalRevenue = MOCK_ORDERS.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0);
    const totalOrders = MOCK_ORDERS.length;
    const totalCustomers = MOCK_CUSTOMERS.length;
    const totalProducts = SAMPLE_PRODUCTS.length;

    const stats = [
        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "bg-[#58181F]", change: "+18%" },
        { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "bg-[#C5A059]", change: "+12%" },
        { label: "Customers", value: totalCustomers, icon: Users, color: "bg-violet-600", change: "+8%" },
        { label: "Products", value: totalProducts, icon: Package, color: "bg-emerald-600", change: "Active" },
    ];

    const navLinks = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "orders", label: "Orders", icon: ShoppingBag, badge: MOCK_ORDERS.filter(o => o.status === "Processing").length },
        { id: "products", label: "Products", icon: Package },
        { id: "customers", label: "Customers", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#0F0608] flex">
            {/* Dark Sidebar */}
            <aside className="w-60 bg-[#1A0A0C] border-r border-white/5 flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Sparkles size={15} className="text-[#C5A059]" />
                        <div>
                            <span className="block text-[8px] tracking-[0.4em] uppercase text-[#C5A059] font-bold leading-none">Singar</span>
                            <span className="block text-lg font-serif text-white italic leading-tight">Fancy</span>
                        </div>
                    </Link>
                    <div className="mt-3 px-2 py-1 bg-[#C5A059]/10 rounded text-[9px] uppercase tracking-widest text-[#C5A059] font-bold text-center">
                        Admin Panel
                    </div>
                </div>

                <div className="p-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A059] to-[#58181F] flex items-center justify-center text-white font-bold text-xs">
                            AD
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">{user.name}</p>
                            <p className="text-white/30 text-[10px]">Administrator</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navLinks.map(({ id, label, icon: Icon, badge }) => (
                        <button
                            key={id}
                            onClick={() => setSection(id as Section)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${section === id ? "bg-[#58181F] text-white" : "text-white/40 hover:bg-white/5 hover:text-white/80"}`}
                        >
                            <span className="flex items-center gap-2.5"><Icon size={15} />{label}</span>
                            {badge !== undefined && badge > 0 && (
                                <span className="text-[9px] font-bold bg-[#C5A059] text-white px-1.5 py-0.5 rounded-full">{badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link href="/" className="w-full flex items-center gap-2 px-3 py-2 text-white/30 hover:text-white text-xs mb-1 rounded-lg hover:bg-white/5 transition-colors">
                        <ChevronRight size={14} className="rotate-180" /> View Store
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={15} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F8F5F0]">
                <div className="max-w-5xl mx-auto px-8 py-10">

                    {/* OVERVIEW */}
                    {section === "overview" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Dashboard</p>
                                <h1 className="text-[28px] font-serif text-[#3D1014]">Good evening, Admin 👑</h1>
                                <p className="text-[#3D1014]/40 text-sm mt-1">Here's what's happening at Singar Fancy today.</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {stats.map((s) => (
                                    <div key={s.label} className="bg-white rounded-xl border border-[#F4E8D1] p-5">
                                        <div className={`w-9 h-9 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
                                            <s.icon size={16} className="text-white" />
                                        </div>
                                        <p className="text-[22px] font-bold font-serif text-[#3D1014]">{s.value}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-[#3D1014]/40 mt-0.5">{s.label}</p>
                                        <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-0.5">
                                            <TrendingUp size={10} /> {s.change}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Revenue Chart */}
                            <div className="bg-white rounded-xl border border-[#F4E8D1] p-6 mb-6">
                                <h2 className="font-serif text-[18px] text-[#3D1014] mb-6">Revenue Overview</h2>
                                <div className="flex items-end gap-4 h-36">
                                    {revenueData.map((d) => (
                                        <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-[#3D1014]/50 font-bold">₹{(d.value / 1000).toFixed(0)}k</span>
                                            <div className="w-full rounded-t-md bg-gradient-to-t from-[#58181F] to-[#C5A059] transition-all" style={{ height: `${(d.value / maxRev) * 100}px` }} />
                                            <span className="text-[10px] uppercase tracking-widest text-[#3D1014]/40 font-bold">{d.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-white rounded-xl border border-[#F4E8D1] p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-serif text-[18px] text-[#3D1014]">Recent Orders</h2>
                                    <button onClick={() => setSection("orders")} className="text-[10px] uppercase tracking-widest text-[#C5A059] flex items-center gap-1 font-bold hover:text-[#58181F] transition-colors">
                                        View All <ChevronRight size={12} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {MOCK_ORDERS.slice(0, 4).map((order) => {
                                        const Icon = statusIcon[order.status];
                                        const customer = MOCK_CUSTOMERS.find(c => c.id === order.userId);
                                        return (
                                            <div key={order.id} className="flex items-center justify-between py-3 border-b border-[#F4E8D1] last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <img src={order.products[0].image} alt="" className="w-9 h-9 rounded-lg object-cover bg-[#F9F6F0]" />
                                                    <div>
                                                        <p className="text-sm font-medium text-[#3D1014]">{order.id}</p>
                                                        <p className="text-[10px] text-[#3D1014]/40">{customer?.name || "Customer"} · {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold border ${statusColor[order.status]}`}>
                                                        <Icon size={9} /> {order.status}
                                                    </span>
                                                    <span className="font-bold text-sm text-[#3D1014] w-20 text-right">₹{order.total.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ORDERS */}
                    {section === "orders" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Management</p>
                                <h1 className="text-[28px] font-serif text-[#3D1014]">All Orders</h1>
                            </div>
                            <div className="bg-white rounded-xl border border-[#F4E8D1] overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-[#FDFBF7] border-b border-[#F4E8D1]">
                                        <tr>
                                            {["Order ID", "Customer", "Items", "Total", "Date", "Status"].map(h => (
                                                <th key={h} className="text-left px-5 py-3 text-[9px] uppercase tracking-widest text-[#3D1014]/40 font-bold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MOCK_ORDERS.map((order) => {
                                            const Icon = statusIcon[order.status];
                                            const customer = MOCK_CUSTOMERS.find(c => c.id === order.userId);
                                            return (
                                                <tr key={order.id} className="border-b border-[#F4E8D1] last:border-0 hover:bg-[#FDFBF7] transition-colors">
                                                    <td className="px-5 py-3.5 text-sm font-bold text-[#3D1014]">{order.id}</td>
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-[#58181F]/10 flex items-center justify-center text-[10px] font-bold text-[#58181F]">
                                                                {customer?.avatar || "?"}
                                                            </div>
                                                            <span className="text-sm text-[#3D1014]">{customer?.name || "–"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm text-[#3D1014]/60">{order.products.length} item{order.products.length > 1 ? "s" : ""}</td>
                                                    <td className="px-5 py-3.5 text-sm font-bold text-[#3D1014]">₹{order.total.toLocaleString("en-IN")}</td>
                                                    <td className="px-5 py-3.5 text-[11px] text-[#3D1014]/50">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</td>
                                                    <td className="px-5 py-3.5">
                                                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold border w-fit ${statusColor[order.status]}`}>
                                                            <Icon size={9} /> {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* PRODUCTS */}
                    {section === "products" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Catalogue</p>
                                    <h1 className="text-[28px] font-serif text-[#3D1014]">Products</h1>
                                </div>
                                <button className="bg-[#58181F] text-white px-5 py-2.5 rounded-lg text-[11px] uppercase tracking-widest font-bold hover:bg-[#3D1014] transition-colors">
                                    + Add Product
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {SAMPLE_PRODUCTS.map((p) => {
                                    const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                                    return (
                                        <div key={p.id} className="bg-white border border-[#F4E8D1] rounded-xl overflow-hidden group">
                                            <div className="relative aspect-square overflow-hidden bg-[#F9F6F0]">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute top-2 left-2 bg-[#58181F] text-white text-[8px] font-bold px-1.5 py-0.5">-{discount}%</div>
                                                <div className="absolute top-2 right-2 bg-white/90 text-[8px] font-bold text-[#3D1014] px-1.5 py-0.5 rounded capitalize">{p.category}</div>
                                            </div>
                                            <div className="p-3">
                                                <p className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold mb-0.5">{p.subcategory}</p>
                                                <p className="text-[13px] font-serif text-[#3D1014] line-clamp-1">{p.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[12px] font-bold text-[#58181F]">₹{p.price}</span>
                                                    <span className="text-[10px] text-[#3D1014]/30 line-through">₹{p.mrp}</span>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <button className="flex-1 py-1.5 border border-[#F4E8D1] rounded-lg text-[9px] uppercase tracking-widest text-[#3D1014]/60 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors font-bold">Edit</button>
                                                    <button className="flex-1 py-1.5 border border-red-100 rounded-lg text-[9px] uppercase tracking-widest text-red-400 hover:bg-red-50 transition-colors font-bold">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* CUSTOMERS */}
                    {section === "customers" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Community</p>
                                <h1 className="text-[28px] font-serif text-[#3D1014]">Customers</h1>
                            </div>
                            <div className="bg-white rounded-xl border border-[#F4E8D1] overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-[#FDFBF7] border-b border-[#F4E8D1]">
                                        <tr>
                                            {["Customer", "Contact", "Orders", "Total Spent", "Member Since"].map(h => (
                                                <th key={h} className="text-left px-5 py-3 text-[9px] uppercase tracking-widest text-[#3D1014]/40 font-bold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MOCK_CUSTOMERS.map((c) => (
                                            <tr key={c.id} className="border-b border-[#F4E8D1] last:border-0 hover:bg-[#FDFBF7] transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A059]/30 to-[#58181F]/20 flex items-center justify-center text-[11px] font-bold text-[#58181F]">
                                                            {c.avatar}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#3D1014]">{c.name}</p>
                                                            <p className="text-[10px] text-[#3D1014]/40">{c.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-[11px] text-[#3D1014]/60">{c.phone}</td>
                                                <td className="px-5 py-4">
                                                    <span className="bg-[#58181F]/8 text-[#58181F] text-[11px] font-bold px-2.5 py-1 rounded-full">{c.orders} orders</span>
                                                </td>
                                                <td className="px-5 py-4 text-sm font-bold text-[#3D1014]">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                                                <td className="px-5 py-4 text-[11px] text-[#3D1014]/50">{new Date(c.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* SETTINGS */}
                    {section === "settings" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Configuration</p>
                                <h1 className="text-[28px] font-serif text-[#3D1014]">Admin Settings</h1>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: "Store Information", desc: "Update store name, description, and contact details" },
                                    { title: "Shipping Zones", desc: "Configure delivery areas and shipping rates" },
                                    { title: "Payment Gateway", desc: "Manage payment methods and gateway settings" },
                                    { title: "Tax Configuration", desc: "Set GST and other tax rates by category" },
                                    { title: "Notification Templates", desc: "Customize order and shipping email templates" },
                                    { title: "Admin Access", desc: "Manage admin accounts and role permissions" },
                                ].map((item) => (
                                    <div key={item.title} className="bg-white border border-[#F4E8D1] rounded-xl p-5 flex items-center justify-between hover:border-[#C5A059]/40 transition-colors">
                                        <div>
                                            <p className="font-semibold text-sm text-[#3D1014]">{item.title}</p>
                                            <p className="text-[11px] text-[#3D1014]/40 mt-0.5">{item.desc}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-[#3D1014]/30" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
