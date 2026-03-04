"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Flag, Star, Award, Info } from "lucide-react";

export default function PointsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-slate-900 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-red-500/10"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-br from-red-600 to-orange-600 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter italic">Scoring<br />Manual</h2>
                                <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-2">Grid Lock 2026 Season</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                                id="close-points-modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                        {/* Season Picks */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-[var(--color-neon-blue)] font-black text-[10px] uppercase tracking-[0.2em]">
                                <Star className="w-3 h-3" />
                                <span>Season Predictions</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-yellow-400" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-200">Champion Predictor (D/C)</span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase">Drivers' & Constructors' Champ</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-white">100 PTS</span>
                                </div>
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/30">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <Award className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm font-bold text-slate-200 uppercase italic">Season Top 3</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>Correct Driver (Any Order)</span>
                                            <span className="text-white font-black whitespace-nowrap">25 PTS / DRIVER</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>Exact Order Bonus</span>
                                            <span className="text-[var(--color-neon-blue)] font-black">+50 PTS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Race Picks */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-[var(--color-neon-green)] font-black text-[10px] uppercase tracking-[0.2em]">
                                <Flag className="w-3 h-3" />
                                <span>Race Weekend</span>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/30">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-black text-slate-200 uppercase italic">Podium Tier</span>
                                        <Info className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>Exact Position Match</span>
                                            <span className="text-white font-black">25 PTS</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>Off by 1 Position</span>
                                            <span className="text-white/80 font-black">15 PTS</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>Off by 2 Positions</span>
                                            <span className="text-white/60 font-black">10 PTS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-[var(--color-f1-red)]" />
                                        <span className="text-sm font-bold text-slate-200">Winning Constructor</span>
                                    </div>
                                    <span className="text-sm font-black text-white">30 PTS</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="p-8 pt-0">
                        <button
                            onClick={onClose}
                            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Got it
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
