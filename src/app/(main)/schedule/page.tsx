"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Calendar, MapPin, Flag, CheckCircle2, Trophy, Users, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RACES, STANDINGS_2025 } from "@/lib/f1-data";

export default function SchedulePage() {
    const [activeTab, setActiveTab] = useState<"schedule" | "standings">("schedule");
    const [expandedRace, setExpandedRace] = useState<number | null>(null);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 mt-4 px-4 sm:px-6">
            <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-2 text-sm font-bold">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white">Season Central</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">2026 Season Schedule & History</p>
                </div>

                <div className="flex bg-slate-900 rounded-xl p-1">
                    <button
                        onClick={() => setActiveTab("schedule")}
                        className={`px-6 py-2 rounded-lg font-bold transition-all text-xs uppercase tracking-widest ${activeTab === "schedule" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}
                    >
                        Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab("standings")}
                        className={`px-6 py-2 rounded-lg font-bold transition-all text-xs uppercase tracking-widest ${activeTab === "standings" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}
                    >
                        Standings
                    </button>
                </div>
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
            >
                {activeTab === "schedule" && (
                    <>

                        <div className="grid gap-4">
                            {RACES.map((race, idx) => {
                                const isDone = race.status === "completed";
                                const isUpcoming = race.status === "upcoming";
                                const isExpanded = expandedRace === race.id;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        key={race.id}
                                        onClick={() => isDone && setExpandedRace(isExpanded ? null : race.id)}
                                        className={`group relative bg-slate-800/40 border ${isDone ? "border-slate-800 cursor-pointer" : "border-slate-700/50"} rounded-3xl p-5 sm:p-6 transition-all hover:bg-slate-800/60`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 sm:gap-6 flex-1">
                                                <div className="text-3xl sm:text-4xl grayscale-[0.5] group-hover:grayscale-0 transition-all">{race.flag}</div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black py-0.5 px-2 bg-slate-700/50 text-slate-400 rounded-md">RD {race.id}</span>
                                                        {race.sprint && <span className="text-[10px] font-black py-0.5 px-2 bg-orange-500/10 text-orange-500 rounded-md uppercase">Sprint</span>}
                                                    </div>
                                                    <h3 className={`text-lg sm:text-xl font-bold ${isDone ? "text-slate-400 group-hover:text-white" : "text-white"}`}>{race.name}</h3>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {race.venue}</span>
                                                        <span className="hidden sm:flex items-center gap-1"><Calendar className="w-3 h-3" /> {race.date}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right flex flex-col items-end gap-2">
                                                {isDone ? (
                                                    <div className="flex items-center text-[var(--color-neon-green)] font-black text-[10px] uppercase tracking-wider">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Results In
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                                        Upcoming
                                                    </div>
                                                )}
                                                <div className={`${isDone ? "text-slate-600" : "text-slate-400"} text-sm font-black`}>
                                                    {isDone ? (isExpanded ? "Hide Details ↑" : "View Results ↓") : race.time}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Results View */}
                                        {isDone && race.results && isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                className="mt-6 pt-6 border-t border-slate-700/30 overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-3">Top 3 Drivers</p>
                                                        <div className="space-y-3">
                                                            {race.results.top3.map((driver, i) => (
                                                                <div key={driver} className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 0 ? "bg-yellow-500/20 text-yellow-500" : i === 1 ? "bg-slate-400/20 text-slate-300" : "bg-orange-600/20 text-orange-500"}`}>
                                                                            P{i + 1}
                                                                        </span>
                                                                        <span className="text-sm font-bold text-white">{driver}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5 flex flex-col justify-center items-center text-center">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Winning Team</p>
                                                        <Trophy className="w-6 h-6 text-[var(--color-f1-red)] mb-1" />
                                                        <span className="text-lg font-black text-white">{race.results.winningTeam}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Mobile Date Row */}
                                        <div className="sm:hidden mt-4 pt-4 border-t border-slate-700/30 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <span><Calendar className="w-3 h-3 inline mr-1 opacity-50" /> {race.date}</span>
                                            <Link href={isUpcoming ? "/picks" : "#"} className={isUpcoming ? "text-[var(--color-neon-blue)]" : "opacity-0 pointer-events-none"}>
                                                {isUpcoming ? "Go to Picks →" : ""}
                                            </Link>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </>
                )}

                {activeTab === "standings" && (
                    <div className="space-y-10">
                        {/* Drivers Standings */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-black text-white flex items-center gap-3 px-2 italic uppercase">
                                <Users className="w-5 h-5 text-[var(--color-neon-blue)]" /> Drivers Championship
                            </h2>
                            <div className="bg-slate-800/40 rounded-[2rem] border border-slate-700/50 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-700/50 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                            <th className="px-6 py-4 w-16">Pos</th>
                                            <th className="px-6 py-4">Driver</th>
                                            <th className="px-6 py-4 text-right">Wins</th>
                                            <th className="px-6 py-4 text-right">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/30">
                                        {STANDINGS_2025.drivers.map((d) => (
                                            <tr key={d.name} className="group hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-5 font-black text-slate-400">#{d.position}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white text-sm">{d.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{d.team}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right font-bold text-slate-600 italic">{d.wins}</td>
                                                <td className="px-6 py-5 text-right font-black text-white tabular-nums">{d.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Constructors Standings */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-black text-white flex items-center gap-3 px-2 italic uppercase">
                                <Trophy className="w-5 h-5 text-[var(--color-f1-red)]" /> Constructors Championship
                            </h2>
                            <div className="bg-slate-800/40 rounded-[2rem] border border-slate-700/50 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-700/50 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                            <th className="px-6 py-4 w-16">Pos</th>
                                            <th className="px-6 py-4">Constructor</th>
                                            <th className="px-6 py-4 text-right">Wins</th>
                                            <th className="px-6 py-4 text-right">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/30">
                                        {STANDINGS_2025.constructors.map((c) => (
                                            <tr key={c.name} className="group hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-5 font-black text-slate-400">#{c.position}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white text-sm">{c.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right font-bold text-slate-600 italic">{c.wins}</td>
                                                <td className="px-6 py-5 text-right font-black text-white tabular-nums">{c.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

