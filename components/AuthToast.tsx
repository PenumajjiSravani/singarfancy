"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X } from "lucide-react";
import Link from "next/link";

interface AuthToastProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

export default function AuthToast({ message, show, onClose }: AuthToastProps) {
    useEffect(() => {
        if (show) {
            const t = setTimeout(onClose, 4000);
            return () => clearTimeout(t);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 60, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-[#3D1014] text-white px-5 py-4 rounded-xl shadow-2xl max-w-sm w-[90vw]"
                >
                    <div className="w-9 h-9 bg-[#58181F] rounded-full flex items-center justify-center flex-shrink-0">
                        <LogIn size={16} className="text-[#C5A059]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#C5A059] mb-0.5">Sign in required</p>
                        <p className="text-[12px] text-white/80 leading-snug">{message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="text-[10px] uppercase tracking-widest font-bold bg-[#C5A059] text-[#3D1014] px-3 py-1.5 rounded-lg hover:bg-[#d4b06a] transition-colors"
                        >
                            Login
                        </Link>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
