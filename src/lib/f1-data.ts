export const TEAMS = [
    "Red Bull Racing",
    "Ferrari",
    "Mercedes",
    "McLaren",
    "Aston Martin",
    "Alpine",
    "Williams",
    "Haas F1 Team",
    "Audi",
    "Racing Bulls",
    "Cadillac"
];

export const DRIVERS = [
    { name: "Max Verstappen", team: "Red Bull Racing" },
    { name: "Isack Hadjar", team: "Red Bull Racing" },
    { name: "Charles Leclerc", team: "Ferrari" },
    { name: "Lewis Hamilton", team: "Ferrari" },
    { name: "George Russell", team: "Mercedes" },
    { name: "Kimi Antonelli", team: "Mercedes" },
    { name: "Lando Norris", team: "McLaren" },
    { name: "Oscar Piastri", team: "McLaren" },
    { name: "Fernando Alonso", team: "Aston Martin" },
    { name: "Lance Stroll", team: "Aston Martin" },
    { name: "Pierre Gasly", team: "Alpine" },
    { name: "Franco Colapinto", team: "Alpine" },
    { name: "Alex Albon", team: "Williams" },
    { name: "Carlos Sainz", team: "Williams" },
    { name: "Esteban Ocon", team: "Haas F1 Team" },
    { name: "Oliver Bearman", team: "Haas F1 Team" },
    { name: "Nico Hulkenberg", team: "Audi" },
    { name: "Gabriel Bortoleto", team: "Audi" },
    { name: "Liam Lawson", team: "Racing Bulls" },
    { name: "Arvid Lindblad", team: "Racing Bulls" },
    { name: "Sergio Pérez", team: "Cadillac" },
    { name: "Valtteri Bottas", team: "Cadillac" }
];

export type Race = {
    id: number;
    name: string;
    venue: string;
    country: string;
    flag: string;
    date: string;
    time: string;
    status: "upcoming" | "completed";
    sprint?: boolean;
    saturday?: boolean;
    results?: {
        top3: string[];
        winningTeam: string;
    };
};

export const RACES: Race[] = [
    { id: 1, name: "Australian Grand Prix", venue: "Melbourne", country: "Australia", flag: "🇦🇺", date: "Mar 08, 2026", time: "09:30 AM UTC", status: "upcoming" },
    { id: 2, name: "Chinese Grand Prix", venue: "Shanghai", country: "China", flag: "🇨🇳", date: "Mar 22, 2026", time: "12:30 PM UTC", status: "upcoming", sprint: true },
    { id: 3, name: "Japanese Grand Prix", venue: "Suzuka", country: "Japan", flag: "🇯🇵", date: "Apr 05, 2026", time: "10:30 AM UTC", status: "upcoming" },
    { id: 4, name: "Bahrain Grand Prix", venue: "Sakhir", country: "Bahrain", flag: "🇧🇭", date: "Apr 19, 2026", time: "08:30 PM UTC", status: "upcoming" },
    { id: 5, name: "Saudi Arabian Grand Prix", venue: "Jeddah", country: "Saudi Arabia", flag: "🇸🇦", date: "May 03, 2026", time: "10:30 PM UTC", status: "upcoming" },
    { id: 6, name: "Miami Grand Prix", venue: "Miami", country: "USA", flag: "🇺🇸", date: "May 10, 2026", time: "01:30 AM UTC", status: "upcoming", sprint: true },
    { id: 7, name: "Emilia-Romagna Grand Prix", venue: "Imola", country: "Italy", flag: "🇮🇹", date: "May 17, 2026", time: "06:30 PM UTC", status: "upcoming" },
    { id: 8, name: "Monaco Grand Prix", venue: "Monte Carlo", country: "Monaco", flag: "🇲🇨", date: "May 24, 2026", time: "06:30 PM UTC", status: "upcoming" },
    { id: 9, name: "Spanish Grand Prix", venue: "Barcelona", country: "Spain", flag: "🇪🇸", date: "Jun 14, 2026", time: "06:30 PM UTC", status: "upcoming" },
    { id: 10, name: "Canadian Grand Prix", venue: "Montreal", country: "Canada", flag: "🇨🇦", date: "Jun 28, 2026", time: "11:30 PM UTC", status: "upcoming", sprint: true },
    { id: 11, name: "Austrian Grand Prix", venue: "Spielberg", country: "Austria", flag: "🇦🇹", date: "Jul 12, 2026", time: "06:30 PM UTC", status: "upcoming" },
    { id: 12, name: "British Grand Prix", venue: "Silverstone", country: "United Kingdom", flag: "🇬🇧", date: "Jul 26, 2026", time: "07:30 PM UTC", status: "upcoming", sprint: true },
    { id: 13, name: "Belgian Grand Prix", venue: "Spa-Francorchamps", country: "Belgium", flag: "🇧🇪", date: "Aug 09, 2026", time: "06:30 PM UTC", status: "upcoming" },
    { id: 14, name: "Hungarian Grand Prix", venue: "Budapest", country: "Hungary", flag: "🇭🇺", date: "Aug 23, 2026", time: "06:30 PM UTC", status: "upcoming" },
    { id: 15, name: "Dutch Grand Prix", venue: "Zandvoort", country: "Netherlands", flag: "🇳🇱", date: "Sep 06, 2026", time: "06:30 PM UTC", status: "upcoming", sprint: true },
    { id: 16, name: "Madrid Grand Prix", venue: "Madrid", country: "Spain", flag: "🇪🇸", date: "Sep 13, 2026", time: "06:30 PM UTC", status: "upcoming" },
    { id: 17, name: "Italian Grand Prix", venue: "Monza", country: "Italy", flag: "🇮🇹", date: "Sep 20, 2026", time: "06:30 PM UTC", status: "upcoming" },
    { id: 18, name: "Azerbaijan Grand Prix", venue: "Baku", country: "Azerbaijan", flag: "🇦🇿", date: "Sep 26, 2026", time: "04:30 PM UTC", status: "upcoming", saturday: true },
    { id: 19, name: "Singapore Grand Prix", venue: "Marina Bay", country: "Singapore", flag: "🇸🇬", date: "Oct 11, 2026", time: "05:30 PM UTC", status: "upcoming", sprint: true },
    { id: 20, name: "United States Grand Prix", venue: "Austin", country: "USA", flag: "🇺🇸", date: "Oct 25, 2026", time: "12:30 AM UTC", status: "upcoming" },
    { id: 21, name: "Mexico City Grand Prix", venue: "Mexico City", country: "Mexico", flag: "🇲🇽", date: "Nov 08, 2026", time: "01:30 AM UTC", status: "upcoming" },
    { id: 22, name: "São Paulo Grand Prix", venue: "Interlagos", country: "Brazil", flag: "🇧🇷", date: "Nov 22, 2026", time: "10:30 PM UTC", status: "upcoming" },
    { id: 23, name: "Las Vegas Grand Prix", venue: "Las Vegas", country: "USA", flag: "🇺🇸", date: "Nov 21, 2026", time: "11:30 PM UTC", status: "upcoming", saturday: true },
    { id: 24, name: "Qatar Grand Prix", venue: "Lusail", country: "Qatar", flag: "🇶🇦", date: "Nov 29, 2026", time: "09:30 PM UTC", status: "upcoming" },
    { id: 25, name: "Abu Dhabi Grand Prix", venue: "Yas Marina", country: "UAE", flag: "🇦🇪", date: "Dec 06, 2026", time: "06:30 PM UTC", status: "upcoming" }
];

export const STANDINGS_2025 = {
    drivers: [
        { position: 1, name: "Max Verstappen", team: "Red Bull Racing", points: 437, wins: 9 },
        { position: 2, name: "Lando Norris", team: "McLaren", points: 382, wins: 4 },
        { position: 3, name: "Charles Leclerc", team: "Ferrari", points: 356, wins: 3 },
        { position: 4, name: "Oscar Piastri", team: "McLaren", points: 302, wins: 2 },
        { position: 5, name: "Carlos Sainz", team: "Ferrari", points: 284, wins: 2 },
        { position: 6, name: "George Russell", team: "Mercedes", points: 245, wins: 1 },
        { position: 7, name: "Lewis Hamilton", team: "Mercedes", points: 212, wins: 2 },
    ],
    constructors: [
        { position: 1, name: "McLaren", points: 684, wins: 6 },
        { position: 2, name: "Ferrari", points: 640, wins: 5 },
        { position: 3, name: "Red Bull Racing", points: 588, wins: 9 },
        { position: 4, name: "Mercedes", points: 457, wins: 3 },
        { position: 5, name: "Aston Martin", points: 102, wins: 0 },
    ]
};

