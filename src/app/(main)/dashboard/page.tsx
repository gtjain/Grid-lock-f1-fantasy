"use client";

import { motion } from "framer-motion";
import { Plus, Users, ChevronRight, Share2, Target, Award, Calendar, Trophy, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createLeague, joinLeague, getDashboardData } from "@/lib/actions";
import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await getDashboardData();
            setUserData(data);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const handleShare = (e: React.MouseEvent, inviteCode: string) => {
        e.preventDefault();
        navigator.clipboard.writeText(inviteCode);
        alert(`Invite code ${inviteCode} copied to clipboard!`);
    };

    const handleCreateLeague = async () => {
        const name = prompt("Name your new league:");
        if (name) {
            await createLeague(name);
            const data = await getDashboardData();
            setUserData(data);
        }
    };

    const handleJoinLeague = async () => {
        const code = prompt("Enter the 6-digit Invite Code:");
        if (code) {
            try {
                await joinLeague(code.toUpperCase());
                const data = await getDashboardData();
                setUserData(data);
                alert("Successfully joined the league!");
            } catch (error: any) {
                alert(error.message || "Failed to join league");
            }
        }
    };

    if (isLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse">Loading Season Data...</div>;
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Quick Actions / Schedule Link */}
            <section className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Race Center</h2>
                </div>
                <Link href="/schedule" className="text-xs font-bold text-[var(--color-neon-blue)] flex items-center hover:underline">
                    View Full Schedule <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
            </section>

            {/* Main Action Card */}
            <Link href="/picks">
                <motion.div
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative bg-gradient-to-br from-[var(--color-f1-red)] to-orange-600 rounded-[2rem] p-8 overflow-hidden group mb-6 cursor-pointer shadow-xl shadow-red-500/20"
                >
                    <div className="absolute right-[-5%] top-[-10%] w-48 h-48 bg-white/10 blur-3xl rounded-full transition-transform group-hover:scale-125 duration-700" />
                    <div className="relative z-10 space-y-2">
                        {userData?.nextRace ? (
                            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
                                <span className="text-sm leading-none">{userData.nextRace.flag}</span> Next Up: {userData.nextRace.name}
                            </span>
                        ) : (
                            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                Season Ended
                            </span>
                        )}
                        <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">Make Your <br />Podium Picks</h3>
                        <p className="text-white/80 text-sm font-bold flex items-center mt-2 group-hover:translate-x-1 transition-transform">
                            Lock in before Quali begins <ChevronRight className="w-4 h-4 ml-1" />
                        </p>
                    </div>
                </motion.div>
            </Link>

            {/* Stats Grid */}
            <section>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <motion.div
                        className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 sm:p-6 flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-f1-red)]/10 flex items-center justify-center text-[var(--color-f1-red)] mb-4">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Global Points</p>
                            <h3 className="text-2xl font-black text-white mt-1">{userData?.globalPoints || 0}</h3>
                        </div>
                    </motion.div>
                    <motion.div
                        className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 sm:p-6 flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Global Rank</p>
                            <h3 className="text-2xl font-black text-white mt-1">#--</h3>
                        </div>
                    </motion.div>

                    <Link href="/schedule" className="col-span-2 md:col-span-1">
                        <motion.div
                            whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.6)" }}
                            className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 sm:p-6 flex items-center justify-between h-full group"
                        >
                            <div>
                                <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Schedule
                                </p>
                                <h3 className="text-xl font-black text-white mt-1">Full 2026 Calendar</h3>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                        </motion.div>
                    </Link>
                </div>
            </section>

            {/* Your Leagues */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Your Active Leagues</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userData?.leagues?.map((membership: any, idx: number) => (
                        <Link href={`/league/${membership.league.id}`} key={membership.league.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="group relative bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 hover:border-slate-500 transition-all shadow-lg hover:shadow-slate-500/5"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-black text-slate-100">{membership.league.name}</h3>
                                    <button
                                        onClick={(e) => handleShare(e, membership.league.inviteCode)}
                                        className="p-2.5 bg-slate-700/30 text-slate-400 hover:text-white rounded-xl transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <Users className="w-4 h-4 text-slate-600" />
                                        <span>{membership.league._count.members} members</span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between border-t border-slate-700/50 pt-6">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Rank</p>
                                        <p className="text-2xl font-black text-[var(--color-neon-green)] tracking-tight">#{membership.rank || "--"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">League Pts</p>
                                        <p className="text-2xl font-black text-white tracking-tight">{membership.points}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    <div className="flex flex-col gap-3 h-full">
                        <motion.button
                            whileHover={{ y: -4 }}
                            className="flex-1 min-h-[100px] bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-slate-600 hover:text-white hover:border-slate-600 transition-all group"
                            onClick={handleCreateLeague}
                        >
                            <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="font-black uppercase text-[10px] tracking-widest">Create League</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ y: -4 }}
                            className="flex-1 min-h-[100px] bg-slate-900/40 border-2 border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-blue-500 hover:text-blue-400 hover:border-blue-500/50 transition-all group"
                            onClick={handleJoinLeague}
                        >
                            <Users className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="font-black uppercase text-[10px] tracking-widest">Join with Code</span>
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
}
