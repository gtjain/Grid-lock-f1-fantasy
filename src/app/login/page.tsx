"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Chrome, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700/50 flex items-center justify-center mb-6 shadow-2xl relative z-10 mx-auto">
                            <Trophy className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Grid Lock</h1>
                    <p className="text-slate-500 font-bold text-sm">Sign in to start your 2026 fantasy season</p>
                </div>

                <div className="space-y-4 pt-4">
                    {!process.env.NEXT_PUBLIC_GOOGLE_AUTH_READY && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-start gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-orange-500 uppercase">Configuration Required</p>
                                <p className="text-xs font-medium text-slate-300">Please provide your Google Client ID and Secret in the .env file to enable login.</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all active:scale-[0.98] text-xs uppercase tracking-widest"
                    >
                        <Chrome className="w-5 h-5" />
                        Continue with Google
                    </button>
                </div>

                <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-4">
                    Secure login via Google OAuth
                </p>
            </motion.div>
        </div>
    );
}
