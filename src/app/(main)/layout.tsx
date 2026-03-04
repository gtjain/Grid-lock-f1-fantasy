"use client";

import { Trophy, User, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import PointsModal from "@/components/PointsModal";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <Trophy className="w-6 h-6 text-orange-500" />
                        <span className="font-bold text-lg tracking-tight ml-2">Grid Lock</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsPointsModalOpen(true)}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                                id="header-help-icon"
                            >
                                <HelpCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center space-x-2 border-l border-slate-800 pl-6 relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="User" width={32} height={32} />
                                    ) : (
                                        <User className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">
                                    {session?.user?.name || "Guest"}
                                </span>
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 top-12 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm font-medium flex items-center text-red-400 text-center justify-start"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="border-t border-slate-800 py-6 mt-auto bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs font-medium tracking-wide text-slate-500">
                    <p>
                        This is an unofficial game and has no relation to Formula 1 or any of its team members. <br className="sm:hidden" />
                        Vibe coded with love using AI.
                    </p>
                </div>
            </footer>

            <PointsModal
                isOpen={isPointsModalOpen}
                onClose={() => setIsPointsModalOpen(false)}
            />
        </div>
    );
}
