"use server";

export const dynamic = "force-dynamic";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { fetchRaceResults, calculateFantasyPoints } from "@/lib/f1-api";
import { RACES } from "@/lib/f1-data";

export async function saveRacePicks(roundId: number, winningTeam: string, top3Drivers: string[]) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Authentication required");
    }

    const userId = (session.user as any).id;

    const pick = await prisma.racePick.upsert({
        where: {
            userId_roundId: {
                userId,
                roundId,
            },
        },
        update: {
            winningTeam,
            top3Drivers,
        },
        create: {
            userId,
            roundId,
            winningTeam,
            top3Drivers,
        },
    });

    revalidatePath("/picks");
    revalidatePath("/dashboard");
    return pick;
}

export async function saveSeasonPicks(constChamp: string, driverChamp: string, top3Drivers: string[]) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Authentication required");
    }

    const userId = (session.user as any).id;

    const pick = await prisma.seasonPick.upsert({
        where: {
            userId,
        },
        update: {
            constChamp,
            driverChamp,
            top3Drivers,
        },
        create: {
            userId,
            constChamp,
            driverChamp,
            top3Drivers,
        },
    });

    revalidatePath("/picks");
    revalidatePath("/dashboard");
    return pick;
}

export async function getUserPicks() {
    const session = await getServerSession(authOptions);

    if (!session?.user) return null;
    const userId = (session.user as any).id;

    const racePicks = await prisma.racePick.findMany({
        where: { userId },
    });

    const seasonPick = await prisma.seasonPick.findUnique({
        where: { userId },
    });

    return { racePicks, seasonPick };
}

export async function syncOfficialResults(year: number, roundId: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    // 1. Fetch official results
    const officialData = await fetchRaceResults(year, roundId);
    if (!officialData) throw new Error("Could not fetch official results");

    // 2. Find all race picks for this round
    const picks = await prisma.racePick.findMany({
        where: { roundId },
        include: { user: true }
    });

    // 3. Calculate points for each user and update
    for (const pick of picks) {
        const points = calculateFantasyPoints(
            { winningTeam: pick.winningTeam, top3: pick.top3Drivers },
            officialData.results
        );

        // Update global user points and league memberships
        await prisma.user.update({
            where: { id: pick.userId },
            data: { globalPoints: { increment: points } }
        });

        // Update points in every league they belong to
        await prisma.leagueMembership.updateMany({
            where: { userId: pick.userId },
            data: { points: { increment: points } }
        });

        // Lock the pick so it can't be edited after results are synced
        await prisma.racePick.update({
            where: { id: pick.id },
            data: { isLocked: true }
        });
    }

    revalidatePath("/dashboard");
    revalidatePath("/league");
    return { success: true, count: picks.length };
}

export async function createLeague(name: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    const userId = (session.user as any).id;

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const league = await prisma.league.create({
        data: {
            name,
            inviteCode,
            members: {
                create: {
                    userId,
                }
            }
        }
    });

    revalidatePath("/dashboard");
    return league;
}

export async function joinLeague(inviteCode: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    const userId = (session.user as any).id;

    const league = await prisma.league.findUnique({
        where: { inviteCode }
    });

    if (!league) throw new Error("League not found");

    const membership = await prisma.leagueMembership.upsert({
        where: {
            userId_leagueId: {
                userId,
                leagueId: league.id,
            }
        },
        update: {},
        create: {
            userId,
            leagueId: league.id,
        }
    });

    revalidatePath("/dashboard");
    return league;
}

export async function getDashboardData() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            leagues: {
                include: {
                    league: {
                        include: {
                            _count: {
                                select: { members: true }
                            }
                        }
                    }
                }
            }
        }
    });

    const nextRace = RACES.find(race => race.status === "upcoming");

    return {
        ...user,
        nextRace,
    };
}

export async function getLeagueData(leagueId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const league = await prisma.league.findUnique({
        where: { id: leagueId },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            racePicks: true
                        }
                    }
                },
                orderBy: {
                    points: "desc"
                }
            }
        }
    });

    return league;
}
