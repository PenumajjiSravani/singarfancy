"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Phone, Mail, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "email" | "google" | "mobile";
type OtpStep = "phone" | "otp";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useStore();

    const [tab, setTab] = useState<Tab>("email");
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpStep, setOtpStep] = useState<OtpStep>("phone");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        if (result?.error) {
            setError("Invalid email or password");
            setLoading(false);
        } else {
            // Fetch session to check role
            const res = await fetch("/api/auth/session");
            const session = await res.json();
            router.push(session?.user?.role === "admin" ? "/admin" : "/dashboard");
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        await signIn("google", { callbackUrl: "/dashboard" });
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) { setError("Enter a valid 10-digit number"); return; }
        setError("");
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setOtpStep("otp");
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 6) { setError('Enter 6-digit OTP'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Mobile User', email: `mobile_${phone}@singar.com`, phone, provider: 'mobile' }),
            });
            const data = await res.json();
            // if user exists (409), try login flow
            if (res.status === 409) {
                login({ id: 'mobile', name: 'Mobile User', email: `mobile_${phone}@singar.com`, phone, role: 'user', joinDate: new Date().toISOString().split('T')[0] });
                router.push('/dashboard');
            } else if (res.ok) {
                login({ ...data, joinDate: data.joinDate || new Date().toISOString().split('T')[0] });
                router.push('/dashboard');
            } else {
                setError(data.error || 'Verification failed');
            }
        } catch {
            setError('Network error. Please try again.');
        }
        setLoading(false);
    };

    const handleOtpChange = (val: string, i: number) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        if (val && i < 5) {
            const nextEl = document.getElementById(`otp-${i + 1}`);
            nextEl?.focus();
        }
    };

    return (
        <div className="min-h-screen flex bg-[#FDFBF7]">
            {/* Left - Brand Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#58181F]">
                <img
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200"
                    alt="Singar Fancy"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#58181F]/80 to-[#3D1014]/90" />
                <div className="relative z-10 flex flex-col justify-between p-14 w-full">
                    <Link href="/" className="flex items-center">
                        <Image 
                            src="/logo.png" 
                            alt="Singar Fancy Logo" 
                            width={350} 
                            height={180} 
                            style={{ height: 'auto' }}
                            className="object-contain"
                            priority
                        />
                    </Link>
                    <div>
                        <h1 className="text-[48px] font-serif text-white leading-[1.1] mb-6">
                            Welcome<br />
                            <span className="italic text-[#C5A059]">back.</span>
                        </h1>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            Sign in to access your orders, wishlist, and exclusive member benefits at Singar Fancy.
                        </p>
                        <div className="mt-8 flex gap-6">
                            {["Earrings", "Bangles", "Cosmetics"].map((tag) => (
                                <span key={tag} className="text-[9px] uppercase tracking-widest text-white/30 border-t border-white/10 pt-2">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <Link href="/" className="lg:hidden flex items-center justify-center mb-12">
                        <Image 
                            src="/logo.png" 
                            alt="Singar Fancy Logo" 
                            width={280} 
                            height={140} 
                            style={{ height: 'auto' }}
                            className="object-contain"
                            priority
                        />
                    </Link>

                    <h2 className="text-[28px] font-serif text-[#3D1014] mb-1">Sign in</h2>
                    <p className="text-[#3D1014]/50 text-sm mb-8">
                        New here?{" "}
                        <Link href="/signup" className="text-[#58181F] font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-[#F4E8D1]/60 p-1 rounded-lg mb-8">
                        {(["email", "google", "mobile"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setError(""); setOtpStep("phone"); }}
                                className={`flex-1 py-2 text-[11px] uppercase tracking-widest font-bold rounded-md transition-all ${tab === t ? "bg-white text-[#58181F] shadow-sm" : "text-[#3D1014]/40 hover:text-[#3D1014]/70"}`}
                            >
                                {t === "email" ? "Email" : t === "google" ? "Google" : "Mobile"}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs">
                            {error}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {/* EMAIL TAB */}
                        {tab === "email" && (
                            <motion.form key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} onSubmit={handleEmailLogin} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[#3D1014]/60 mb-1.5 font-bold">Email Address</label>
                                    <div className="relative">
                                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3D1014]/30" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 border border-[#F4E8D1] bg-white rounded-lg text-sm text-[#3D1014] focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-[#3D1014]/25"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[#3D1014]/60 mb-1.5 font-bold">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-4 pr-10 py-3 border border-[#F4E8D1] bg-white rounded-lg text-sm text-[#3D1014] focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-[#3D1014]/25"
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3D1014]/30 hover:text-[#3D1014]/60">
                                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" className="text-[11px] text-[#58181F] hover:underline">Forgot password?</button>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-[#58181F] text-white py-3.5 rounded-lg text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-[#3D1014] transition-colors disabled:opacity-60">
                                    {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight size={14} /></>}
                                </button>
                                <div className="text-center">
                                    <p className="text-[10px] text-[#3D1014]/30 bg-[#F4E8D1]/40 rounded-lg px-3 py-2 inline-block">
                                        Admin demo: <span className="text-[#58181F] font-bold">admin@singar.com / admin123</span> &nbsp;|&nbsp;
                                        User demo: <span className="text-[#58181F] font-bold">priya@example.com / user1234</span>
                                    </p>
                                </div>
                            </motion.form>
                        )}

                        {/* GOOGLE TAB */}
                        {tab === "google" && (
                            <motion.div key="google" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-white border border-[#F4E8D1] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                                        <svg viewBox="0 0 24 24" className="w-8 h-8">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-[#3D1014] mb-2">Continue with Google</h3>
                                    <p className="text-sm text-[#3D1014]/50 mb-8">Sign in seamlessly with your Google account</p>
                                    <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white border-2 border-[#F4E8D1] text-[#3D1014] py-3.5 rounded-lg text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 hover:border-[#C5A059] hover:bg-[#FDFBF7] transition-all disabled:opacity-60">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                        {loading ? "Connecting..." : "Sign in with Google"}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* MOBILE TAB */}
                        {tab === "mobile" && (
                            <motion.div key="mobile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                <AnimatePresence mode="wait">
                                    {otpStep === "phone" ? (
                                        <motion.form key="phone-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSendOtp} className="space-y-5">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-[#3D1014]/60 mb-1.5 font-bold">Mobile Number</label>
                                                <div className="relative flex">
                                                    <span className="flex items-center px-3.5 bg-[#F4E8D1]/60 border border-r-0 border-[#F4E8D1] rounded-l-lg text-sm text-[#3D1014]/60 font-medium">+91</span>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
                                                        placeholder="9876543210"
                                                        className="flex-1 px-4 py-3 border border-[#F4E8D1] bg-white rounded-r-lg text-sm text-[#3D1014] focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-[#3D1014]/25"
                                                    />
                                                </div>
                                            </div>
                                            <button type="submit" disabled={loading} className="w-full bg-[#58181F] text-white py-3.5 rounded-lg text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-[#3D1014] transition-colors disabled:opacity-60">
                                                <Phone size={14} />
                                                {loading ? "Sending OTP..." : "Send OTP"}
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.form key="otp-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleVerifyOtp} className="space-y-6">
                                            <div className="text-center">
                                                <p className="text-sm text-[#3D1014]/60 mb-1">OTP sent to <span className="font-bold text-[#3D1014]">+91 {phone}</span></p>
                                                <button type="button" onClick={() => setOtpStep("phone")} className="text-[11px] text-[#58181F] hover:underline">Change number</button>
                                            </div>
                                            <div className="flex gap-2 justify-center">
                                                {otp.map((d, i) => (
                                                    <input
                                                        key={i}
                                                        id={`otp-${i}`}
                                                        type="text"
                                                        maxLength={1}
                                                        value={d}
                                                        onChange={(e) => handleOtpChange(e.target.value, i)}
                                                        className="w-11 h-12 text-center border border-[#F4E8D1] bg-white rounded-lg text-lg font-bold text-[#3D1014] focus:outline-none focus:border-[#C5A059] transition-colors"
                                                    />
                                                ))}
                                            </div>
                                            <button type="submit" disabled={loading} className="w-full bg-[#58181F] text-white py-3.5 rounded-lg text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-[#3D1014] transition-colors disabled:opacity-60">
                                                {loading ? "Verifying..." : <><span>Verify & Sign In</span><ArrowRight size={14} /></>}
                                            </button>
                                            <p className="text-center text-[11px] text-[#3D1014]/40">Enter any 6-digit code for demo</p>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="mt-10 text-center text-[10px] text-[#3D1014]/25 uppercase tracking-widest">
                        © 2026 Singar Fancy · All rights reserved
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
