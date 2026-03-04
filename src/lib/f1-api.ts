/**
 * F1 Data API Service
 * Handles fetching results from Ergast or similar providers.
 */

const BASE_URL = "https://api.jolpi.ca/ergast/f1"; // Modern Ergast mirror/replacement

export async function fetchRaceResults(year: number, round: number) {
    try {
        const response = await fetch(`${BASE_URL}/${year}/${round}/results.json`);
        const data = await response.json();

        // Process Ergast JSON format
        const race = data.MRData.RaceTable.Races[0];
        if (!race) return null;

        return {
            results: race.Results.map((r: any) => ({
                position: parseInt(r.position),
                driver: r.Driver.givenName + " " + r.Driver.familyName,
                constructor: r.Constructor.name,
                points: parseInt(r.points)
            })),
            round: parseInt(race.round),
            raceName: race.raceName
        };
    } catch (error) {
        console.error("Error fetching F1 results:", error);
        return null;
    }
}

/**
 * Calculates fantasy points for a user based on race results.
 * @param userPicks The user's podium and team picks
 * @param actualResults The official race results from the API
 */
export function calculateFantasyPoints(userPicks: any, actualResults: any) {
    let score = 0;

    // Scoring Rules:
    // Correct Top 3 Racers - Exact Position: 25 pts
    // Off by 1 Position: 15 pts
    // Off by 2 Positions: 10 pts
    // Correct Driver, but outside Top 3: 5 pts
    // Correct Winning Team: 30 pts

    const podium = actualResults.slice(0, 3);
    const everyoneElse = actualResults.slice(3);

    // Winning Team Calculation (Team with most points in race)
    const teamPoints: Record<string, number> = {};
    actualResults.forEach((r: any) => {
        teamPoints[r.constructor] = (teamPoints[r.constructor] || 0) + r.points;
    });

    const winningTeam = Object.entries(teamPoints).sort((a, b) => b[1] - a[1])[0][0];

    if (userPicks.winningTeam === winningTeam) {
        score += 30;
    }

    // Podium Picks Calculation
    userPicks.top3.forEach((pick: string, pickIdx: number) => {
        const actualPos = actualResults.findIndex((r: any) => r.driver === pick) + 1;

        if (actualPos === 0) return; // Driver didn't finish or not in results

        const diff = Math.abs(actualPos - (pickIdx + 1));

        if (diff === 0 && actualPos <= 3) {
            score += 25;
        } else if (diff === 1) {
            score += 15;
        } else if (diff === 2) {
            score += 10;
        }
    });

    return score;
}
