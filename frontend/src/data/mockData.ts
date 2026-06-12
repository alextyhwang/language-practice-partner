import type {
  Correction,
  PlayerStats,
  Scenario,
  ScenarioScript,
  TranscriptTurn,
} from "../types";

export const playerStats: PlayerStats = {
  level: 7,
  xp: 340,
  xpToNext: 500,
  coins: 1280,
  streak: 12,
};

export const orderingFoodScenario: Scenario = {
  id: "ordering-food",
  title: "Ordering Food",
  description: "Order dishes and drinks at a busy noodle shop.",
  icon: "🍜",
  language: "Mandarin Chinese",
  location: "Lanzhou Noodle House",
  locationBadge: "🍽️ Restaurant",
  goals: [
    "Greet the server",
    "Ask what's popular today",
    "Order a dish and drink",
    "Ask for the check",
  ],
  npc: {
    name: "Xiao Mei",
    nameChinese: "小美",
    role: "Restaurant Server",
    emoji: "👩‍🍳",
    sprite: "server",
    scene: "tavern",
    frameFrom: "from-amber/40",
    frameTo: "to-surface-raised",
    accent: "border-amber-dark",
  },
  starsEarned: 2,
  difficulty: "easy",
};

export const askingDirectionsScenario: Scenario = {
  id: "asking-directions",
  title: "Asking for Directions",
  description: "Find your way to the metro station with a local's help.",
  icon: "🗺️",
  language: "Mandarin Chinese",
  location: "Zhongshan Road",
  locationBadge: "🏙️ Street",
  goals: [
    "Get the local's attention politely",
    "Ask where the metro is",
    "Confirm left vs. right",
    "Thank them and say goodbye",
  ],
  npc: {
    name: "Uncle Wang",
    nameChinese: "王叔叔",
    role: "Local Passerby",
    emoji: "🧑‍🦳",
    sprite: "passerby",
    scene: "street",
    frameFrom: "from-sky/35",
    frameTo: "to-surface-raised",
    accent: "border-sky-dark",
  },
  starsEarned: 1,
  difficulty: "easy",
};

export const findingBathroomScenario: Scenario = {
  id: "finding-bathroom",
  title: "Finding a Bathroom",
  description: "Ask a shop clerk where the restroom is — urgently!",
  icon: "🚻",
  language: "Mandarin Chinese",
  location: "Convenience Mart",
  locationBadge: "🏪 Shop",
  goals: [
    "Approach the counter",
    "Ask where the bathroom is",
    "Understand the directions",
    "Say thank you",
  ],
  npc: {
    name: "Shop Clerk Lin",
    nameChinese: "小林",
    role: "Store Clerk",
    emoji: "🧑‍💼",
    sprite: "clerk",
    scene: "shop",
    frameFrom: "from-accent/30",
    frameTo: "to-surface-raised",
    accent: "border-accent-dark",
  },
  starsEarned: 0,
  difficulty: "easy",
};

export const hotelCheckInScenario: Scenario = {
  id: "hotel-check-in",
  title: "Hotel Check-in",
  description: "Check in at the front desk and get your room key.",
  icon: "🏨",
  language: "Mandarin Chinese",
  location: "Grand Lotus Hotel",
  locationBadge: "🛎️ Front Desk",
  goals: [
    "Greet the receptionist",
    "Give your reservation name",
    "Confirm room type and nights",
    "Ask about breakfast hours",
  ],
  npc: {
    name: "Receptionist Chen",
    nameChinese: "陈小姐",
    role: "Front Desk",
    emoji: "💁‍♀️",
    sprite: "receptionist",
    scene: "hotel-desk",
    frameFrom: "from-primary/25",
    frameTo: "to-surface-raised",
    accent: "border-primary-dark",
  },
  starsEarned: 3,
  difficulty: "medium",
};

export const hotelQuestionsScenario: Scenario = {
  id: "hotel-questions",
  title: "Hotel Questions",
  description: "Ask the concierge about tours, Wi-Fi, and local tips.",
  icon: "🛎️",
  language: "Mandarin Chinese",
  location: "Grand Lotus Hotel",
  locationBadge: "🌟 Concierge",
  goals: [
    "Ask about nearby attractions",
    "Request a restaurant recommendation",
    "Ask about Wi-Fi password",
    "Book a taxi for tomorrow",
  ],
  npc: {
    name: "Concierge Liu",
    nameChinese: "刘礼宾",
    role: "Hotel Concierge",
    emoji: "🤵",
    sprite: "concierge",
    scene: "hotel-concierge",
    frameFrom: "from-amber/30",
    frameTo: "to-sky/15",
    accent: "border-amber-dark",
  },
  starsEarned: 1,
  difficulty: "medium",
};

export const allScenarios: Scenario[] = [
  orderingFoodScenario,
  askingDirectionsScenario,
  findingBathroomScenario,
  hotelCheckInScenario,
  hotelQuestionsScenario,
];

export const scenarioScripts: Record<string, ScenarioScript> = {
  "ordering-food": {
    initialTranscript: [
      {
        id: "t1",
        speaker: "partner",
        text: "歡迎光臨！請問幾位？",
        translation: "Welcome! How many people?",
        timestamp: 0,
      },
      {
        id: "t2",
        speaker: "user",
        text: "兩位，謝謝。",
        translation: "Two people, thank you.",
        timestamp: 4,
      },
      {
        id: "t3",
        speaker: "partner",
        text: "好的，這邊請。這是我們今天的特色菜單。",
        translation: "Sure, right this way. Here's today's specialty menu.",
        timestamp: 8,
      },
    ],
    mockCorrections: [
      {
        id: "c1",
        type: "pronunciation",
        original: "兩位",
        suggestion: "liǎng wèi",
        explanation:
          "The tone on 兩 (liǎng) should rise then fall — you flattened it. Try emphasizing the third tone dip.",
        turnId: "t2",
      },
    ],
    scriptedPartnerLines: [
      {
        text: "請問需要什麼飲料？",
        translation: "What would you like to drink?",
        delayMs: 3000,
      },
      {
        text: "我們的牛肉麵很受歡迎，要不要試試看？",
        translation: "Our beef noodle soup is very popular — would you like to try it?",
        delayMs: 4000,
      },
    ],
    scriptedUserLines: [
      { text: "我要一杯綠茶。", translation: "I'd like a cup of green tea." },
      {
        text: "好的，請給我一碗牛肉麵。",
        translation: "Sure, I'll have a bowl of beef noodle soup.",
        correction: {
          id: "c2",
          type: "grammar",
          original: "請給我一碗",
          suggestion: "麻煩請給我一碗",
          explanation:
            "Your sentence is correct! For extra politeness at a restaurant, add 麻煩 at the start.",
          turnId: "",
        },
      },
    ],
  },
  "asking-directions": {
    initialTranscript: [
      {
        id: "t1",
        speaker: "partner",
        text: "你好！需要幫忙嗎？",
        translation: "Hello! Do you need help?",
        timestamp: 0,
      },
    ],
    mockCorrections: [],
    scriptedPartnerLines: [
      {
        text: "地鐵站啊？一直往前走，過兩個紅綠燈就看到了。",
        translation: "The metro? Go straight, past two traffic lights and you'll see it.",
        delayMs: 3500,
      },
      {
        text: "對，在右手邊，藍色的標誌。",
        translation: "Yes, on the right side — look for the blue sign.",
        delayMs: 3000,
      },
    ],
    scriptedUserLines: [
      {
        text: "請問，地鐵站怎麼走？",
        translation: "Excuse me, how do I get to the metro station?",
      },
      {
        text: "是右邊嗎？",
        translation: "Is it on the right?",
        correction: {
          id: "c1",
          type: "fluency",
          original: "是右邊嗎",
          suggestion: "是在右邊嗎",
          explanation: "Adding 在 before 右邊 sounds more natural when asking about location.",
          turnId: "",
        },
      },
    ],
  },
  "finding-bathroom": {
    initialTranscript: [
      {
        id: "t1",
        speaker: "partner",
        text: "歡迎光臨！請問要買什麼？",
        translation: "Welcome! What would you like to buy?",
        timestamp: 0,
      },
    ],
    mockCorrections: [],
    scriptedPartnerLines: [
      {
        text: "洗手間在店後面，往左轉，看到冰櫃再右轉就到了。",
        translation: "The restroom is in the back — turn left, then right past the fridge.",
        delayMs: 4000,
      },
    ],
    scriptedUserLines: [
      {
        text: "不好意思，請問洗手間在哪裡？",
        translation: "Excuse me, where is the bathroom?",
      },
    ],
  },
  "hotel-check-in": {
    initialTranscript: [
      {
        id: "t1",
        speaker: "partner",
        text: "您好，歡迎入住蓮花大酒店！請問有預訂嗎？",
        translation: "Hello, welcome to Grand Lotus Hotel! Do you have a reservation?",
        timestamp: 0,
      },
    ],
    mockCorrections: [],
    scriptedPartnerLines: [
      {
        text: "好的，王先生，您預訂的是雙人房，住兩晚。這是您的房卡。",
        translation: "OK Mr. Wang, you booked a double room for two nights. Here's your key card.",
        delayMs: 4000,
      },
      {
        text: "早餐在七樓，早上七點到十點。",
        translation: "Breakfast is on the 7th floor, from 7 to 10 AM.",
        delayMs: 3000,
      },
    ],
    scriptedUserLines: [
      {
        text: "有的，我姓王，預訂了兩晚。",
        translation: "Yes, my name is Wang. I booked for two nights.",
      },
      {
        text: "請問早餐幾點開始？",
        translation: "What time does breakfast start?",
      },
    ],
  },
  "hotel-questions": {
    initialTranscript: [
      {
        id: "t1",
        speaker: "partner",
        text: "您好！我是禮賓部，有什麼可以為您服務的？",
        translation: "Hello! I'm from concierge — how may I help you?",
        timestamp: 0,
      },
    ],
    mockCorrections: [],
    scriptedPartnerLines: [
      {
        text: "附近最有名的就是故宮博物院，搭地鐵十分鐘就到。",
        translation: "The most famous nearby spot is the Palace Museum — 10 minutes by metro.",
        delayMs: 4000,
      },
      {
        text: "Wi-Fi密碼是 lotus2024，在大堂各處都能連上。",
        translation: "The Wi-Fi password is lotus2024 — it works throughout the lobby.",
        delayMs: 3500,
      },
    ],
    scriptedUserLines: [
      {
        text: "請問附近有什麼好玩的景點？",
        translation: "What attractions are nearby?",
      },
      {
        text: "還有，Wi-Fi密碼是多少？",
        translation: "Also, what's the Wi-Fi password?",
        correction: {
          id: "c1",
          type: "vocabulary",
          original: "Wi-Fi密碼",
          suggestion: "無線網密碼",
          explanation:
            "Wi-Fi works fine in casual speech, but 無線網 is the Mandarin term hotels often use formally.",
          turnId: "",
        },
      },
    ],
  },
};

export function getScenarioScript(scenarioId: string): ScenarioScript {
  return scenarioScripts[scenarioId] ?? scenarioScripts["ordering-food"];
}

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

/** @deprecated use scenarioScripts */
export const initialTranscript: TranscriptTurn[] = scenarioScripts["ordering-food"].initialTranscript;
/** @deprecated use scenarioScripts */
export const mockCorrections: Correction[] = scenarioScripts["ordering-food"].mockCorrections;
/** @deprecated use scenarioScripts */
export const scriptedPartnerLines = scenarioScripts["ordering-food"].scriptedPartnerLines;
/** @deprecated use scenarioScripts */
export const scriptedUserLines = scenarioScripts["ordering-food"].scriptedUserLines;
