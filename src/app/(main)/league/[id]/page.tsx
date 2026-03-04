"use client";

import { motion } from "framer-motion";
import { Trophy, ChevronLeft, Medal, Users, RefreshCw, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { getLeagueData, syncOfficialResults as syncEngine } from "@/lib/actions";
import { useSession } from "next-auth/react";

export default function LeaguePage({ params }: { params: Promise<{ id: string }> }) {
    const { data: session } = useSession();
    const [league, setLeague] = useState<any>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedMember, setExpandedMember] = useState<string | null>(null);

    const resolvedParams = use(params);

    useEffect(() => {
        async function loadLeague() {
            try {
                const data = await getLeagueData(resolvedParams.id);
                setLeague(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadLeague();
    }, [resolvedParams.id]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            alert("This feature connects to the live F1 Ergast API and will become active once the 2026 season begins and official results are published.");
            // In a real scenario, this would determine the latest un-synced round automatically.
            // const data = await getLeagueData(resolvedParams.id);
            // setLeague(data);
        } catch (error: any) {
            alert(error.message || "Failed to sync results");
        } finally {
            setIsSyncing(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse">Fetching Standings...</div>;
    }

    const members = league?.members || [];

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 mt-4 px-4 sm:px-6">
            <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-2 text-xs font-bold">
                <ChevronLeft className="w-4 h-4 mr-1" /> Dashboard
            </Link>

            <div className="flex flex-col gap-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 sm:p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-f1-red)]/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center space-x-2 text-[var(--color-neon-blue)] font-black text-[10px] tracking-[0.2em] uppercase">
                        <Users className="w-4 h-4" />
                        <span>Private League • Invite: <span className="text-white bg-white/10 px-2 py-0.5 rounded ml-1">{league?.inviteCode}</span></span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{league?.name}</h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        {members.length} Members • Global Scoring Active
                    </p>
                </div>
                <div className="relative z-10 flex gap-3 mt-4 sm:mt-0">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 ${isSyncing ? "bg-slate-700" : "bg-white"} text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-lg`}
                    >
                        {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        {isSyncing ? "Syncing API..." : "Sync Official Results"}
                    </button>
                    <button
                        className="flex-1 sm:flex-none border border-slate-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                        onClick={() => {
                            navigator.clipboard.writeText(league?.inviteCode);
                            alert("Invite code copied!");
                        }}
                    >
                        Copy Invite
                    </button>
                </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-[2rem] overflow-hidden backdrop-blur-md">
                <div className="p-6 border-b border-slate-700/30 flex justify-between items-center">
                    <h2 className="text-lg font-black flex items-center gap-3 uppercase tracking-widest text-slate-300">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Standings
                    </h2>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">League Pts</span>
                </div>

                <div className="divide-y divide-slate-700/30">
                    {members.map((membership: any, idx: number) => {
                        const rank = idx + 1;
                        const isTop3 = rank <= 3;
                        const isMe = membership.user.id === (session?.user as any)?.id;
                        const isExpanded = expandedMember === membership.id;
                        const colors = ["text-yellow-400", "text-slate-400", "text-orange-500"];

                        // Get latest pick for transparency
                        const latestPick = membership.user.racePicks?.[membership.user.racePicks.length - 1];

                        return (
                            <div key={membership.id} className="flex flex-col">
                                <motion.div
                                    layout
                                    onClick={() => setExpandedMember(isExpanded ? null : membership.id)}
                                    className={`p-4 sm:p-6 flex items-center justify-between transition-all cursor-pointer ${isMe ? "bg-[var(--color-f1-red)]/5" : "hover:bg-slate-800/20"}`}
                                >
                                    <div className="flex items-center space-x-4 sm:space-x-6">
                                        <div className={`w-6 sm:w-8 font-black text-sm text-center ${isTop3 ? colors[rank - 1] : "text-slate-600"}`}>
                                            {rank}
                                        </div>

                                        <div className="relative">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-sm font-black border ${isMe ? "border-[var(--color-f1-red)] bg-[var(--color-f1-red)]/20 text-[var(--color-f1-red)]" : "border-slate-700 bg-slate-800 text-slate-400"}`}>
                                                {membership.user.name?.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            {isTop3 && (
                                                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center ${colors[rank - 1]}`}>
                                                    <Medal className="w-2 h-2" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className={`font-black text-sm sm:text-base tracking-tight ${isMe ? "text-white" : "text-slate-200"}`}>
                                                {membership.user.name}
                                                {isMe && <span className="ml-2 text-[8px] bg-[var(--color-f1-red)] text-white px-1.5 py-0.5 rounded-md font-black uppercase">Me</span>}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                                                    Tap to view Picks
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-lg sm:text-2xl font-black text-white tracking-tighter">
                                            {membership.points}
                                            <span className="text-[10px] text-slate-600 ml-1 font-black">PTS</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="bg-slate-900/50 border-t border-slate-700/30 overflow-hidden"
                                    >
                                        <div className="p-4 sm:p-6 grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Winning Team</p>
                                                <p className="text-xs font-bold text-slate-300">{latestPick?.winningTeam || "No Pick"}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Podium Picks</p>
                                                <ul className="space-y-1">
                                                    {latestPick?.top3Drivers.map((driver: string, i: number) => (
                                                        <li key={i} className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                                            <span className="text-[10px] text-slate-700">P{i + 1}</span> {driver || "—"}
                                                        </li>
                                                    )) || <li className="text-xs text-slate-500">No picks made yet</li>}
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}
