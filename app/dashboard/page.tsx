"use client";
import { useEffect, useState } from "react";
import { useStore, MOCK_ORDERS, SAMPLE_PRODUCTS, Order } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingBag, Heart, User, Settings, LogOut, ChevronRight,
    Package, MapPin, Phone, Mail, Sparkles, Clock, CheckCircle, Truck, XCircle, Home, X
} from "lucide-react";

type Section = "overview" | "orders" | "wishlist" | "profile" | "settings";

const statusIcon: Record<string, any> = { Pending: Clock, Confirmed: CheckCircle, Ready: Package, Processing: Clock, Shipped: Truck, Delivered: CheckCircle, Cancelled: XCircle };
const statusColor: Record<string, string> = { Pending: "text-amber-600 bg-amber-50", Confirmed: "text-blue-600 bg-blue-50", Ready: "text-purple-600 bg-purple-50", Processing: "text-amber-600 bg-amber-50", Shipped: "text-blue-600 bg-blue-50", Delivered: "text-green-600 bg-green-50", Cancelled: "text-red-500 bg-red-50" };

export default function DashboardPage() {
    const router = useRouter();
    const { wishlist } = useStore();
    const { data: session, status } = useSession();
    const user = session?.user;
    const [section, setSection] = useState<Section>("overview");
    const [editMode, setEditMode] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profilePhone, setProfilePhone] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (user?.role === "admin") { router.push("/admin"); return; }
        if (user) {
            setProfileName(user.name || "");
            setProfileEmail(user.email || "");
            setProfilePhone("");
        }
    }, [user, status, router]);

    if (!isMounted || status === "loading" || !user || user.role === "admin") return <div className="min-h-screen bg-[#FDFBF7]" />;

    const myOrders = MOCK_ORDERS.filter((o) => o.userId === user.id);
    const wishlisted = SAMPLE_PRODUCTS.filter((p) => wishlist.includes(p.id));
    const totalSpent = myOrders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0);

    const navLinks = [
        { id: "overview", label: "Overview", icon: Home },
        { id: "orders", label: "My Orders", icon: ShoppingBag, badge: myOrders.length },
        { id: "wishlist", label: "Wishlist", icon: Heart, badge: wishlisted.length },
        { id: "profile", label: "Profile", icon: User },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const handleLogout = async () => { await signOut({ callbackUrl: "/" }); };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#F4E8D1] flex flex-col sticky top-0 h-screen">
                {/* Logo */}
                <div className="p-6 border-b border-[#F4E8D1]">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Sparkles size={16} className="text-[#C5A059]" />
                        <div>
                            <span className="block text-[8px] tracking-[0.4em] uppercase text-[#C5A059] font-bold leading-none">Singar</span>
                            <span className="block text-xl font-serif text-[#3D1014] italic leading-tight">Fancy</span>
                        </div>
                    </Link>
                </div>

                {/* Avatar */}
                <div className="p-6 border-b border-[#F4E8D1]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#58181F] flex items-center justify-center text-white font-bold text-sm">
                            {(user.name ?? "User").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-[#3D1014] text-sm truncate">{user.name ?? "User"}</p>
                            <p className="text-[10px] text-[#3D1014]/40 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navLinks.map(({ id, label, icon: Icon, badge }) => (
                        <button
                            key={id}
                            onClick={() => setSection(id as Section)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${section === id ? "bg-[#58181F] text-white" : "text-[#3D1014]/60 hover:bg-[#F4E8D1]/50 hover:text-[#3D1014]"}`}
                        >
                            <span className="flex items-center gap-2.5">
                                <Icon size={16} />
                                {label}
                            </span>
                            {badge !== undefined && badge > 0 && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${section === id ? "bg-white/20 text-white" : "bg-[#58181F]/10 text-[#58181F]"}`}>{badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-[#F4E8D1]">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-8 py-10">

                    {/* OVERVIEW */}
                    {section === "overview" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Welcome Back</p>
                                <h1 className="text-[30px] font-serif text-[#3D1014]">Hello, {(user.name ?? "User").split(" ")[0]} 👋</h1>
                                <p className="text-[#3D1014]/50 text-sm mt-1">Member since {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-3 gap-5 mb-10">
                                {[
                                    { label: "Total Orders", value: myOrders.length, icon: ShoppingBag, color: "bg-[#58181F]" },
                                    { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: Package, color: "bg-[#C5A059]" },
                                    { label: "Wishlist Items", value: wishlisted.length, icon: Heart, color: "bg-rose-500" },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white border border-[#F4E8D1] rounded-xl p-5">
                                        <div className={`w-9 h-9 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
                                            <s.icon size={16} className="text-white" />
                                        </div>
                                        <p className="text-2xl font-bold font-serif text-[#3D1014]">{s.value}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-[#3D1014]/40 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-white border border-[#F4E8D1] rounded-xl p-6 mb-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-serif text-[18px] text-[#3D1014]">Recent Orders</h2>
                                    <button onClick={() => setSection("orders")} className="text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-[#58181F] flex items-center gap-1 font-bold transition-colors">
                                        View All <ChevronRight size={12} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {myOrders.slice(0, 2).map((order) => {
                                        const Icon = statusIcon[order.status];
                                        return (
                                            <div
                                                key={order.id}
                                                onClick={() => setSelectedOrder(order)}
                                                className="flex items-center justify-between py-3 border-b border-[#F4E8D1] last:border-0 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={order.products[0].image} alt="" className="w-10 h-10 rounded-lg object-cover bg-[#F9F6F0]" />
                                                    <div>
                                                        <p className="text-sm font-medium text-[#3D1014]">{order.id}</p>
                                                        <p className="text-[11px] text-[#3D1014]/40">{order.products.length} item{order.products.length > 1 ? "s" : ""} · {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusColor[order.status]}`}>
                                                        <Icon size={10} /> {order.status}
                                                    </span>
                                                    <span className="font-bold text-sm text-[#3D1014]">₹{order.total.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Wishlist Preview */}
                            {wishlisted.length > 0 && (
                                <div className="bg-white border border-[#F4E8D1] rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="font-serif text-[18px] text-[#3D1014]">Your Wishlist</h2>
                                        <button onClick={() => setSection("wishlist")} className="text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-[#58181F] flex items-center gap-1 font-bold transition-colors">
                                            View All <ChevronRight size={12} />
                                        </button>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-1">
                                        {wishlisted.map((p) => (
                                            <Link key={p.id} href={`/product/${p.id}`} className="flex-none w-24 group">
                                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#F9F6F0] mb-2">
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                </div>
                                                <p className="text-[10px] text-[#3D1014] font-medium line-clamp-1">{p.name}</p>
                                                <p className="text-[10px] font-bold text-[#58181F]">₹{p.price}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ORDERS */}
                    {section === "orders" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Order History</p>
                                <h1 className="text-[28px] font-serif text-[#3D1014]">My Orders</h1>
                            </div>
                            <div className="space-y-4">
                                {myOrders.map((order) => {
                                    const Icon = statusIcon[order.status];
                                    return (
                                        <div
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className="bg-white border border-[#F4E8D1] rounded-xl p-6 cursor-pointer hover:border-[#C5A059] transition-all group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="font-bold text-[#3D1014] text-sm">{order.id}</p>
                                                    <p className="text-[11px] text-[#3D1014]/40 mt-0.5">
                                                        Placed on {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColor[order.status]}`}>
                                                        <Icon size={10} /> {order.status}
                                                    </span>
                                                    <span className="font-bold text-[#3D1014]">₹{order.total.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mb-4">
                                                {order.products.map((p, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-[#FDFBF7] rounded-lg p-2">
                                                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                                                        <div>
                                                            <p className="text-[11px] font-medium text-[#3D1014] leading-tight">{p.name}</p>
                                                            <p className="text-[10px] text-[#3D1014]/40">Qty: {p.qty} · ₹{p.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-[#3D1014]/40">
                                                <MapPin size={12} />
                                                {order.address}
                                            </div>
                                        </div>
                                    );
                                })}
                                {myOrders.length === 0 && (
                                    <div className="text-center py-20 bg-white border border-[#F4E8D1] rounded-xl">
                                        <ShoppingBag size={40} className="mx-auto text-[#3D1014]/20 mb-4" />
                                        <p className="font-serif text-xl text-[#3D1014]/40 italic">No orders yet</p>
                                        <Link href="/" className="mt-4 inline-block text-[11px] uppercase tracking-widest text-[#58181F] border-b border-[#58181F] font-bold">
                                            Start Shopping
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* WISHLIST */}
                    {section === "wishlist" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Saved Items</p>
                                <h1 className="text-[28px] font-serif text-[#3D1014]">My Wishlist</h1>
                            </div>
                            {wishlisted.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {wishlisted.map((p) => (
                                        <Link key={p.id} href={`/product/${p.id}`} className="bg-white border border-[#F4E8D1] rounded-xl overflow-hidden group hover:border-[#C5A059] transition-colors">
                                            <div className="aspect-square overflow-hidden bg-[#F9F6F0]">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            <div className="p-3">
                                                <p className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold mb-0.5">{p.subcategory}</p>
                                                <p className="text-sm font-serif text-[#3D1014] line-clamp-1">{p.name}</p>
                                                <p className="text-[12px] font-bold text-[#58181F] mt-1">₹{p.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white border border-[#F4E8D1] rounded-xl">
                                    <Heart size={40} className="mx-auto text-[#3D1014]/20 mb-4" />
                                    <p className="font-serif text-xl text-[#3D1014]/40 italic">Your wishlist is empty</p>
                                    <Link href="/" className="mt-4 inline-block text-[11px] uppercase tracking-widest text-[#58181F] border-b border-[#58181F] font-bold">
                                        Explore Collection
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* PROFILE */}
                    {section === "profile" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Account Details</p>
                                <h1 className="text-[28px] font-serif text-[#3D1014]">My Profile</h1>
                            </div>
                            <div className="bg-white border border-[#F4E8D1] rounded-xl p-8">
                                {/* Avatar */}
                                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#F4E8D1]">
                                    <div className="w-16 h-16 rounded-full bg-[#58181F] flex items-center justify-center text-white text-xl font-bold">
                                        {(user.name ?? "User").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="font-serif text-xl text-[#3D1014]">{user.name ?? "User"}</h2>
                                        <p className="text-[11px] text-[#3D1014]/40 uppercase tracking-widest">Member since {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
                                    </div>
                                    <button onClick={() => setEditMode(!editMode)} className={`ml-auto px-4 py-2 rounded-lg text-[11px] uppercase tracking-widest font-bold transition-all ${editMode ? "bg-[#F4E8D1] text-[#3D1014]" : "bg-[#58181F] text-white hover:bg-[#3D1014]"}`}>
                                        {editMode ? "Cancel" : "Edit Profile"}
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    {[
                                        { label: "Full Name", value: profileName, setter: setProfileName, icon: User, type: "text" },
                                        { label: "Email Address", value: profileEmail, setter: setProfileEmail, icon: Mail, type: "email" },
                                        { label: "Phone Number", value: profilePhone, setter: setProfilePhone, icon: Phone, type: "tel" },
                                    ].map(({ label, value, setter, icon: Icon, type }) => (
                                        <div key={label}>
                                            <label className="block text-[10px] uppercase tracking-widest text-[#3D1014]/50 mb-1.5 font-bold">{label}</label>
                                            <div className="relative">
                                                <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3D1014]/30" />
                                                <input
                                                    type={type}
                                                    value={value}
                                                    onChange={(e) => setter(e.target.value)}
                                                    disabled={!editMode}
                                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm text-[#3D1014] transition-colors ${editMode ? "border-[#C5A059] bg-white focus:outline-none focus:border-[#58181F]" : "border-[#F4E8D1] bg-[#FDFBF7] cursor-default"}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {editMode && (
                                        <button className="w-full bg-[#58181F] text-white py-3 rounded-lg text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#3D1014] transition-colors mt-2">
                                            Save Changes
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SETTINGS */}
                    {section === "settings" && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-1">Preferences</p>
                                <h1 className="text-[28px] font-serif text-[#3D1014]">Settings</h1>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: "Notifications", desc: "Manage email and push notification preferences", action: "Configure" },
                                    { title: "Address Book", desc: "Manage your saved delivery addresses", action: "Manage" },
                                    { title: "Payment Methods", desc: "Add or remove saved payment methods", action: "Manage" },
                                    { title: "Privacy", desc: "Control your data and privacy settings", action: "Review" },
                                    { title: "Delete Account", desc: "Permanently delete your Singar Fancy account", action: "Delete", danger: true },
                                ].map((item) => (
                                    <div key={item.title} className={`bg-white border rounded-xl p-5 flex items-center justify-between ${item.danger ? "border-red-100" : "border-[#F4E8D1]"}`}>
                                        <div>
                                            <p className={`font-medium text-sm ${item.danger ? "text-red-500" : "text-[#3D1014]"}`}>{item.title}</p>
                                            <p className="text-[11px] text-[#3D1014]/40 mt-0.5">{item.desc}</p>
                                        </div>
                                        <button className={`text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded-lg transition-colors ${item.danger ? "text-red-500 hover:bg-red-50" : "text-[#58181F] hover:bg-[#F4E8D1]/50"}`}>
                                            {item.action}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-[#3D1014]/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-[101]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-[#F4E8D1] flex items-center justify-between bg-[#FDFBF7]">
                                <div>
                                    <h2 className="text-xl font-serif text-[#3D1014]">Order Details</h2>
                                    <p className="text-[11px] text-[#3D1014]/40 mt-0.5 tracking-wider uppercase font-bold">{selectedOrder.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-[#58181F]/5 text-[#3D1014]/40 hover:text-[#58181F] rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Status & Date */}
                                <div className="flex items-center justify-between bg-[#FDFBF7] p-4 rounded-xl border border-[#F4E8D1]">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-[#3D1014]/40 font-bold mb-1">Status</p>
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${statusColor[selectedOrder.status]}`}>
                                            {(() => {
                                                const Icon = statusIcon[selectedOrder.status];
                                                return <Icon size={12} />;
                                            })()}
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-widest text-[#3D1014]/40 font-bold mb-1">Date</p>
                                        <p className="text-sm font-medium text-[#3D1014]">
                                            {new Date(selectedOrder.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <p className="text-[11px] uppercase tracking-widest text-[#C5A059] font-bold mb-4">Items</p>
                                    <div className="space-y-3">
                                        {selectedOrder.products.map((item, i) => (
                                            <div key={i} className="flex gap-4 p-3 rounded-xl border border-[#F4E8D1] hover:bg-[#FDFBF7] transition-colors">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F9F6F0] flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="text-sm font-serif text-[#3D1014] truncate">{item.name}</p>
                                                    <p className="text-[11px] text-[#3D1014]/40 mt-0.5">{item.category} · Qty: {item.qty}</p>
                                                </div>
                                                <div className="text-right flex flex-col justify-center">
                                                    <p className="text-sm font-bold text-[#3D1014]">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                                                    <p className="text-[10px] text-[#3D1014]/40">₹{item.price.toLocaleString("en-IN")} each</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                <div>
                                    <p className="text-[11px] uppercase tracking-widest text-[#C5A059] font-bold mb-4">Shipping Address</p>
                                    <div className="flex gap-3 p-4 rounded-xl bg-[#FDFBF7] border border-[#F4E8D1]">
                                        <MapPin size={18} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-[#3D1014]/70 leading-relaxed font-medium">
                                            {selectedOrder.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-[#F4E8D1] bg-[#FDFBF7] flex items-center justify-between">
                                <div className="text-[#3D1014]/40">
                                    <p className="text-[10px] uppercase tracking-widest font-bold">Total Amount</p>
                                    <p className="text-xs">Inc. all taxes</p>
                                </div>
                                <p className="text-2xl font-serif text-[#58181F]">₹{selectedOrder.total.toLocaleString("en-IN")}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
