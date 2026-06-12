import type { PlayerStats, Scenario } from "../types";

export const playerStats: PlayerStats = {
  level: 7,
  xp: 340,
  xpToNext: 500,
  coins: 1280,
  streak: 12,
};

// Missions mirror the backend scenarios (backend/src/coaching/scenarios.js),
// including their easy / medium / hard difficulty. Each carries the `backend`
// config used to start the realtime coaching session. Presentation (npc, scene,
// goals) is frontend-only flavor; the live goal is driven by the backend.

// ---- Easy ------------------------------------------------------------------

export const orderingFoodScenario: Scenario = {
  id: "ordering-food",
  title: "Ordering Food",
  description: "Order a drink and a dish at a busy restaurant.",
  icon: "🍜",
  language: "Mandarin Chinese",
  location: "Lanzhou Noodle House",
  locationBadge: "🍽️ Restaurant",
  goals: ["Greet the server", "Ask what's popular", "Order a drink and a dish", "Confirm your order"],
  npc: {
    name: "Marco",
    nameChinese: "Marco",
    role: "Restaurant Server",
    emoji: "👩‍🍳",
    sprite: "server",
    imageSrc: "/assets/01_waiter_marco.svg",
    scene: "tavern",
    frameFrom: "from-amber/40",
    frameTo: "to-surface-raised",
    accent: "border-amber-dark",
  },
  starsEarned: 2,
  difficulty: "easy",
  backend: { scenario: "order_food", language: "zh", level: "A2" },
};

export const askingDirectionsScenario: Scenario = {
  id: "asking-directions",
  title: "Asking for Directions",
  description: "Get clear directions to the metro and confirm them.",
  icon: "🗺️",
  language: "Mandarin Chinese",
  location: "Zhongshan Road",
  locationBadge: "🏙️ Street",
  goals: ["Get someone's attention", "Ask the way to the metro", "Confirm left vs. right", "Thank them"],
  npc: {
    name: "Sam",
    nameChinese: "Sam",
    role: "Local Passerby",
    emoji: "🧑‍🦳",
    sprite: "passerby",
    imageSrc: "/assets/03_directions_sam.svg",
    scene: "street",
    frameFrom: "from-sky/35",
    frameTo: "to-surface-raised",
    accent: "border-sky-dark",
  },
  starsEarned: 1,
  difficulty: "easy",
  backend: { scenario: "directions", language: "zh", level: "A2" },
};

export const askingForHelpScenario: Scenario = {
  id: "asking-for-help",
  title: "Asking for Help",
  description: "Convince your roommate to help with a task.",
  icon: "🙋",
  language: "Mandarin Chinese",
  location: "Your Apartment",
  locationBadge: "🏠 Home",
  goals: ["Get their attention", "Explain what you need", "Give a good reason", "Get them to agree"],
  npc: {
    name: "Dev",
    nameChinese: "Dev",
    role: "Friendly Coworker",
    emoji: "🧑",
    sprite: "passerby",
    imageSrc: "/assets/05_help_dev.svg",
    scene: "tavern",
    frameFrom: "from-accent/30",
    frameTo: "to-surface-raised",
    accent: "border-accent-dark",
  },
  starsEarned: 0,
  difficulty: "easy",
  backend: { scenario: "ask_help", language: "zh", level: "A2" },
};

export const hotelCheckInScenario: Scenario = {
  id: "hotel-check-in",
  title: "Hotel Check-in",
  description: "Check in and sort out a problem with your room.",
  icon: "🏨",
  language: "Mandarin Chinese",
  location: "Grand Lotus Hotel",
  locationBadge: "🛎️ Front Desk",
  goals: ["Greet the receptionist", "Give your reservation", "Resolve the room issue", "Get your key"],
  npc: {
    name: "Grace",
    nameChinese: "Grace",
    role: "Front Desk",
    emoji: "💁‍♀️",
    sprite: "receptionist",
    imageSrc: "/assets/07_hotel_grace.svg",
    scene: "hotel-desk",
    frameFrom: "from-primary/25",
    frameTo: "to-surface-raised",
    accent: "border-primary-dark",
  },
  starsEarned: 3,
  difficulty: "easy",
  backend: { scenario: "hotel_checkin", language: "zh", level: "A2" },
};

// ---- Medium ----------------------------------------------------------------

export const marketBargainScenario: Scenario = {
  id: "market-bargain",
  title: "Bargaining at the Market",
  description: "Haggle a street vendor down to a fair price.",
  icon: "🛍️",
  language: "Mandarin Chinese",
  location: "Night Market",
  locationBadge: "🏮 Market",
  goals: ["Ask the price", "Make a lower offer", "Negotiate back and forth", "Close the deal"],
  npc: {
    name: "Omar",
    nameChinese: "Omar",
    role: "Market Vendor",
    emoji: "🧑‍🌾",
    sprite: "clerk",
    imageSrc: "/assets/06_market_omar.svg",
    scene: "street",
    frameFrom: "from-amber/30",
    frameTo: "to-surface-raised",
    accent: "border-amber-dark",
  },
  starsEarned: 1,
  difficulty: "medium",
  backend: { scenario: "market_bargain", language: "zh", level: "B1" },
};

export const smallTalkScenario: Scenario = {
  id: "small-talk",
  title: "Small Talk at a Party",
  description: "Break the ice and make a real connection.",
  icon: "🎉",
  language: "Mandarin Chinese",
  location: "House Party",
  locationBadge: "🥳 Party",
  goals: ["Say hello", "Ask a good question", "Find common ground", "Agree to keep in touch"],
  npc: {
    name: "Theo",
    nameChinese: "Theo",
    role: "Fellow Guest",
    emoji: "🧑‍🎤",
    sprite: "passerby",
    imageSrc: "/assets/08_party_theo.svg",
    scene: "tavern",
    frameFrom: "from-primary/25",
    frameTo: "to-surface-raised",
    accent: "border-primary-dark",
  },
  starsEarned: 0,
  difficulty: "medium",
  backend: { scenario: "small_talk", language: "zh", level: "B1" },
};

export const customerServiceScenario: Scenario = {
  id: "customer-service",
  title: "Customer Service",
  description: "Explain a problem and get a refund or fix.",
  icon: "🧾",
  language: "Mandarin Chinese",
  location: "Service Counter",
  locationBadge: "🏬 Store",
  goals: ["Explain the problem", "Answer their questions", "Push back politely", "Get a resolution"],
  npc: {
    name: "Nora",
    nameChinese: "Nora",
    role: "Service Rep",
    emoji: "🧑‍💼",
    sprite: "clerk",
    imageSrc: "/assets/09_service_nora.svg",
    scene: "shop",
    frameFrom: "from-accent/30",
    frameTo: "to-surface-raised",
    accent: "border-accent-dark",
  },
  starsEarned: 2,
  difficulty: "medium",
  backend: { scenario: "customer_service", language: "zh", level: "B1" },
};

// ---- Hard ------------------------------------------------------------------

export const askingSomeoneOutScenario: Scenario = {
  id: "asking-someone-out",
  title: "Asking Someone Out",
  description: "Charm someone you just met into a date.",
  icon: "💐",
  language: "Mandarin Chinese",
  location: "Corner Café",
  locationBadge: "☕ Café",
  goals: ["Start a friendly chat", "Show genuine interest", "Handle hesitation", "Get a yes or a number"],
  npc: {
    name: "Lila",
    nameChinese: "Lila",
    role: "Someone New",
    emoji: "👩",
    sprite: "receptionist",
    imageSrc: "/assets/02_date_lila.svg",
    scene: "tavern",
    frameFrom: "from-fire/25",
    frameTo: "to-surface-raised",
    accent: "border-fire-dark",
  },
  starsEarned: 0,
  difficulty: "hard",
  backend: { scenario: "ask_out", language: "zh", level: "B2" },
};

export const changeFlightScenario: Scenario = {
  id: "change-flight",
  title: "Changing Your Flight",
  description: "Rebook onto a new flight despite the rules.",
  icon: "✈️",
  language: "Mandarin Chinese",
  location: "Airline Service Desk",
  locationBadge: "🛫 Airport",
  goals: ["Explain you need a change", "Give your booking details", "Negotiate fees and options", "Confirm the new flight"],
  npc: {
    name: "Priya",
    nameChinese: "Priya",
    role: "Airline Agent",
    emoji: "🧑‍✈️",
    sprite: "concierge",
    imageSrc: "/assets/04_flight_priya.svg",
    scene: "hotel-desk",
    frameFrom: "from-sky/35",
    frameTo: "to-surface-raised",
    accent: "border-sky-dark",
  },
  starsEarned: 1,
  difficulty: "hard",
  backend: { scenario: "change_flight", language: "zh", level: "B2" },
};

export const jobInterviewScenario: Scenario = {
  id: "job-interview",
  title: "Job Interview",
  description: "Win over the manager and land the job.",
  icon: "💼",
  language: "Mandarin Chinese",
  location: "Café Hiring Office",
  locationBadge: "🏢 Interview",
  goals: ["Introduce yourself", "Describe your experience", "Handle a tough question", "Get an offer"],
  npc: {
    name: "Mr. Reed",
    nameChinese: "Mr. Reed",
    role: "Hiring Manager",
    emoji: "🤵",
    sprite: "concierge",
    imageSrc: "/assets/10_interview_reed.svg",
    scene: "hotel-concierge",
    frameFrom: "from-primary/25",
    frameTo: "to-sky/15",
    accent: "border-primary-dark",
  },
  starsEarned: 0,
  difficulty: "hard",
  backend: { scenario: "job_interview", language: "zh", level: "B2" },
};

export const allScenarios: Scenario[] = [
  // Easy
  orderingFoodScenario,
  askingDirectionsScenario,
  askingForHelpScenario,
  hotelCheckInScenario,
  // Medium
  marketBargainScenario,
  smallTalkScenario,
  customerServiceScenario,
  // Hard
  askingSomeoneOutScenario,
  changeFlightScenario,
  jobInterviewScenario,
];

export const coachingModeLabels = {
  strict: { label: "Strict", emoji: "📋", color: "border-primary-dark/40 bg-primary/15 text-primary" },
  friendly: { label: "Buddy", emoji: "🧳", color: "border-accent-dark/40 bg-accent/15 text-accent-dark" },
  interviewer: { label: "Boss", emoji: "💼", color: "border-sky-dark/40 bg-sky/15 text-sky-dark" },
} as const;

export const correctionTypeMeta = {
  pronunciation: { label: "Pronunciation", icon: "🗣️", color: "border-correction-pronunciation bg-correction-pronunciation/8" },
  grammar: { label: "Grammar", icon: "✏️", color: "border-correction-grammar bg-correction-grammar/8" },
  vocabulary: { label: "Vocabulary", icon: "📖", color: "border-correction-vocabulary bg-correction-vocabulary/8" },
  fluency: { label: "Fluency", icon: "💬", color: "border-correction-fluency bg-correction-fluency/8" },
} as const;
