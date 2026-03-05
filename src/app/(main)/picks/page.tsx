"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Trophy, Flag, AlertCircle, Save, Award as AwardIcon } from "lucide-react";
import { TEAMS, DRIVERS, RACES } from "@/lib/f1-data";
import { saveRacePicks, saveSeasonPicks, getUserPicks } from "@/lib/actions";

export default function PicksPage() {
    const [tab, setTab] = useState<"season" | "race">("season");
    const [seasonPicks, setSeasonPicks] = useState({ constChamp: "", driverChamp: "", top3: ["", "", ""] });

    // Store all race picks in a single object keyed by round ID
    const [allRacePicks, setAllRacePicks] = useState<Record<number, { winningTeam: string, top3: string[], isLocked?: boolean }>>({});
    const [selectedRound, setSelectedRound] = useState<number>(1);
    const [isSeasonLocked, setIsSeasonLocked] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadPicks() {
            const data = await getUserPicks();
            if (data) {
                if (data.seasonPick) {
                    setSeasonPicks({
                        constChamp: data.seasonPick.constChamp,
                        driverChamp: data.seasonPick.driverChamp,
                        top3: data.seasonPick.top3Drivers
                    });
                    setIsSeasonLocked(data.seasonPick.isLocked);
                }

                if (data.racePicks) {
                    const mapped: Record<number, any> = {};
                    data.racePicks.forEach(p => {
                        mapped[p.roundId] = {
                            winningTeam: p.winningTeam,
                            top3: p.top3Drivers,
                            isLocked: p.isLocked
                        };
                    });
                    setAllRacePicks(mapped);
                }
            }
        }

        loadPicks();

        // Default to the first upcoming race
        const currentRound = RACES.find(r => r.status === "upcoming")?.id || 1;
        setSelectedRound(currentRound);
    }, []);

    const selectedRace = RACES.find(r => r.id === selectedRound) || RACES[0];
    const currentPicks = allRacePicks[selectedRound] || { winningTeam: "", top3: ["", "", ""] };

    const bahrainRace = RACES.find(r => r.name === "Bahrain Grand Prix");
    const isPastBahrain = bahrainRace ? new Date() > new Date(`${bahrainRace.date} ${bahrainRace.time}`) : false;

    // Logic: Past races or synced results are locked.
    const isRaceLocked = selectedRace.status === "completed" || currentPicks.isLocked;
    const isLocked = tab === "season" ? (isSeasonLocked || isPastBahrain) : isRaceLocked;

    const nextRace = RACES.find(r => r.status === "upcoming") || RACES[0];
    const raceClosesIn = isRaceLocked ? "Event Closed" : "2d 14h";

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (tab === "race") {
                if (!currentPicks.winningTeam || currentPicks.top3.some(p => !p)) {
                    alert("Please complete all race picks!");
                    return;
                }
                await saveRacePicks(selectedRound, currentPicks.winningTeam, currentPicks.top3);
            } else {
                if (!seasonPicks.constChamp || !seasonPicks.driverChamp || seasonPicks.top3.some(p => !p)) {
                    alert("Please complete all season picks!");
                    return;
                }
                await saveSeasonPicks(seasonPicks.constChamp, seasonPicks.driverChamp, seasonPicks.top3);
            }
            alert("Picks successfully saved to the Grid Lock Cloud!");
        } catch (error) {
            console.error(error);
            alert("Failed to save picks. Please check your connection.");
        } finally {
            setIsSaving(false);
        }
    };

    const updateCurrentRacePicks = (updates: Partial<{ winningTeam: string, top3: string[] }>) => {
        setAllRacePicks(prev => ({
            ...prev,
            [selectedRound]: { ...currentPicks, ...updates }
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 mt-4 px-4 sm:px-6">

            {/* Header & Tabs */}
            <div className="flex flex-col gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                <div className="flex justify-between items-center sm:hidden">
                    <h1 className="text-xl font-bold">Make Picks</h1>
                    <span className={`text-[10px] font-bold uppercase py-1 px-2 rounded-full flex items-center ${isLocked ? "bg-red-500/10 text-red-400" : "bg-orange-500/10 text-orange-400"}`}>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {isLocked ? "Locked" : raceClosesIn}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex bg-slate-900 rounded-xl p-1 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setTab("season")}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap ${tab === "season" ? "bg-[var(--color-f1-red)] text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                        >
                            Season
                        </button>
                        <button
                            onClick={() => setTab("race")}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap ${tab === "race" ? "bg-[var(--color-neon-blue)] text-slate-900 shadow-lg" : "text-slate-400 hover:text-white"}`}
                        >
                            Race
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center space-x-4">
                        <span className="text-sm font-semibold flex items-center text-slate-300">
                            <AlertCircle className={`w-4 h-4 mr-1 ${isLocked ? "text-red-400" : "text-[var(--color-neon-blue)]"}`} />
                            {tab === "season" ? (isLocked ? "Locked for Season" : "Open until Bahrain GP") : (isRaceLocked ? "Race Locked" : `Closes in ${raceClosesIn}`)}
                        </span>
                        <button
                            onClick={handleSave}
                            disabled={isLocked}
                            className="flex items-center space-x-2 bg-white text-slate-900 px-4 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Picks</span>
                        </button>
                    </div>
                </div>
            </div>

            <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                {tab === "season" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex items-start gap-4 shadow-lg shadow-black/20">
                            <AlertCircle className="w-6 h-6 text-[var(--color-neon-blue)] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-slate-200">
                                    Season picks can be updated until the start of the <strong className="text-white">Bahrain Grand Prix</strong>.
                                </p>
                                <p className="text-xs font-medium text-slate-400 mt-1">
                                    After {bahrainRace?.date} at {bahrainRace?.time}, all season predictions will be firmly locked in!
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-lg font-extrabold flex items-center px-1">
                                <Trophy className="w-5 h-5 mr-2 text-yellow-400" /> Champions
                            </h2>

                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6">
                                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Constructors' Champion (100 pts)</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-medium focus:ring-2 focus:ring-[var(--color-f1-red)] outline-none appearance-none disabled:text-slate-500"
                                    value={seasonPicks.constChamp}
                                    onChange={(e) => setSeasonPicks({ ...seasonPicks, constChamp: e.target.value })}
                                    disabled={isSeasonLocked}
                                >
                                    <option value="">Select Constructor</option>
                                    {TEAMS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6">
                                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Drivers' Champion (100 pts)</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-medium focus:ring-2 focus:ring-[var(--color-f1-red)] outline-none appearance-none disabled:text-slate-500"
                                    value={seasonPicks.driverChamp}
                                    onChange={(e) => setSeasonPicks({ ...seasonPicks, driverChamp: e.target.value })}
                                    disabled={isSeasonLocked}
                                >
                                    <option value="">Select Driver</option>
                                    {DRIVERS.map(d => <option key={d.name} value={d.name}>{d.name} ({d.team})</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-lg font-extrabold flex items-center px-1">
                                <AwardIcon className="w-5 h-5 mr-2 text-blue-400" /> Season Top 3
                            </h2>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 space-y-4">
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-4">25 pts per correct driver. +50 pts exact order bonus.</p>
                                {[1, 2, 3].map((pos, i) => (
                                    <div key={pos} className="flex flex-col">
                                        <label className="text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-between">
                                            Position {pos}
                                            <span className="text-[10px] text-slate-600 font-black">P{pos}</span>
                                        </label>
                                        <select
                                            className={`w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white font-medium focus:ring-2 focus:ring-[var(--color-neon-blue)] outline-none appearance-none disabled:text-slate-500`}
                                            value={seasonPicks.top3[i]}
                                            onChange={(e) => {
                                                const newPicks = [...seasonPicks.top3];
                                                newPicks[i] = e.target.value;
                                                setSeasonPicks({ ...seasonPicks, top3: newPicks });
                                            }}
                                            disabled={isSeasonLocked}
                                        >
                                            <option value="">Select Driver</option>
                                            {DRIVERS.map(d => (
                                                <option
                                                    key={d.name}
                                                    value={d.name}
                                                    disabled={seasonPicks.top3.includes(d.name) && seasonPicks.top3[i] !== d.name}
                                                >
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {tab === "race" && (
                    <div className="space-y-6">
                        {/* Race Selector Dropdown */}
                        <div className="flex items-center space-x-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 overflow-x-auto no-scrollbar">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Select Round:</span>
                            <div className="flex gap-2">
                                {RACES.slice(0, 10).map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => setSelectedRound(r.id)}
                                        className={`w-10 h-10 flex-none rounded-xl font-black text-xs border transition-all ${selectedRound === r.id ? "bg-[var(--color-neon-blue)] border-[var(--color-neon-blue)] text-slate-900" : "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500"}`}
                                    >
                                        {r.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl flex p-6 items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-blue)]/10 blur-3xl rounded-full" />
                            <div className="relative z-10">
                                <p className="text-[var(--color-neon-blue)] font-bold tracking-widest uppercase text-xs mb-1">Round {selectedRace.id}</p>
                                <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedRace.name}</h2>
                                <p className="text-slate-400 font-medium mt-1 text-sm">{selectedRace.venue}, {selectedRace.country}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">{selectedRace.date} • {selectedRace.time}</p>
                            </div>
                            <div className="relative z-10 text-5xl sm:text-6xl drop-shadow-2xl">{selectedRace.flag}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6">
                                <h3 className="font-bold text-slate-300 mb-4 flex items-center justify-between text-sm uppercase tracking-wider">
                                    <span className="flex items-center"><Flag className="w-4 h-4 mr-2 text-[var(--color-neon-green)]" /> Race Podium</span>
                                    <span className="text-[10px] text-slate-500">Pick Top 3</span>
                                </h3>
                                <div className="space-y-5">
                                    {[1, 2, 3].map((pos, i) => (
                                        <div key={pos} className="flex flex-col">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="text-xs font-bold text-slate-400">P{pos} Result</label>
                                                <span className="text-[10px] uppercase text-slate-600 tracking-wider font-black">Tiered Scoring</span>
                                            </div>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white font-medium focus:ring-2 focus:ring-[var(--color-neon-green)] outline-none appearance-none disabled:text-slate-500"
                                                value={currentPicks.top3[i]}
                                                onChange={(e) => {
                                                    const newTop3 = [...currentPicks.top3];
                                                    newTop3[i] = e.target.value;
                                                    updateCurrentRacePicks({ top3: newTop3 });
                                                }}
                                                disabled={isRaceLocked}
                                            >
                                                <option value="">Select Driver</option>
                                                {DRIVERS.map(d => (
                                                    <option
                                                        key={d.name}
                                                        value={d.name}
                                                        disabled={currentPicks.top3.includes(d.name) && currentPicks.top3[i] !== d.name}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6">
                                    <h3 className="font-bold text-slate-300 mb-4 flex items-center text-sm uppercase tracking-wider">
                                        <Trophy className="w-4 h-4 mr-2 text-[var(--color-f1-red)]" />
                                        Winning Team (30 pts)
                                    </h3>
                                    <p className="text-[10px] text-slate-500 mb-4 uppercase font-bold leading-relaxed">Constructor scoring most points in this GP</p>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-medium focus:ring-2 focus:ring-[var(--color-f1-red)] outline-none appearance-none disabled:text-slate-500"
                                        value={currentPicks.winningTeam}
                                        onChange={(e) => updateCurrentRacePicks({ winningTeam: e.target.value })}
                                        disabled={isRaceLocked}
                                    >
                                        <option value="">Select Constructor</option>
                                        {TEAMS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={isRaceLocked}
                                    className="sm:hidden w-full bg-white text-slate-900 py-4 rounded-xl font-black text-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isRaceLocked ? "Event Locked" : "Save Picks"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// Need to import Award from lucide-react, I will manually add it to imports
function Award(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
    )
}
