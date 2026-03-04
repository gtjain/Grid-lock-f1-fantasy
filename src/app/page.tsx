"use client";

import { motion } from "framer-motion";
import { Trophy, ChevronRight, Flag } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  const handleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-f1-red)]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-neon-blue)]/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md p-8 md:p-12 rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl flex flex-col items-center text-center space-y-8"
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-f1-red)] to-orange-500 shadow-lg shadow-red-500/30">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Paddock <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-f1-red)] to-orange-400">Picks</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            The ultimate premium F1 fantasy racing experience among close friends.
          </p>
        </div>

        <div className="w-full pt-4">
          <button
            onClick={handleLogin}
            className="group relative w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100 absolute right-6" />
          </button>
          <p className="mt-6 text-xs text-slate-500">
            By continuing, you agree to the Terms of Service and Race Rules.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
