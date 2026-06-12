// Scenario-based missions. Each gives the coach a setting, a role to play, and a
// concrete goal the learner should accomplish, so sessions feel structured rather
// than open-ended chat.
export const SCENARIOS = [
  {
    id: "cafe_order",
    label: "Order at a café",
    category: "travel",
    setting: "A busy neighborhood café.",
    coachRole: "a friendly barista taking the learner's order",
    goal: "Greet the barista, order a drink and a snack, ask the price, and pay.",
    starter: "Greet the learner as they walk up to the counter and ask what they would like.",
  },
  {
    id: "directions",
    label: "Ask for directions",
    category: "travel",
    setting: "A street corner in an unfamiliar city.",
    coachRole: "a helpful local passerby",
    goal: "Ask how to get to a landmark, understand the directions, and confirm them back.",
    starter: "Wait for the learner to stop you and ask for help, then respond naturally.",
  },
  {
    id: "hotel_checkin",
    label: "Hotel check-in",
    category: "travel",
    setting: "The front desk of a small hotel.",
    coachRole: "a hotel receptionist",
    goal: "Check in, confirm the reservation, ask about breakfast and Wi-Fi, and get the room key.",
    starter: "Welcome the learner to the hotel and ask for their reservation details.",
  },
  {
    id: "doctor_visit",
    label: "Doctor's appointment",
    category: "daily_life",
    setting: "A doctor's office.",
    coachRole: "a calm general practitioner",
    goal: "Describe a symptom, answer the doctor's questions, and understand the advice given.",
    starter: "Greet the learner and ask what brings them in today.",
  },
  {
    id: "make_friends",
    label: "Meet someone new",
    category: "daily_life",
    setting: "A casual gathering at a friend's place.",
    coachRole: "a sociable new acquaintance",
    goal: "Introduce yourself, ask and answer get-to-know-you questions, and make plans to meet again.",
    starter: "Introduce yourself to the learner and ask how they know the host.",
  },
  {
    id: "job_interview",
    label: "Job interview",
    category: "interview",
    setting: "A professional interview room.",
    coachRole: "a hiring manager",
    goal: "Introduce yourself, describe your experience, and answer two follow-up questions.",
    starter: "Greet the candidate and ask them to tell you a little about themselves.",
  },
  {
    id: "exam_oral",
    label: "Oral exam practice",
    category: "exam",
    setting: "A language proficiency oral exam.",
    coachRole: "an exam examiner",
    goal: "Respond to a prompt for at least a minute, staying on topic and well-structured.",
    starter: "Explain the format briefly, then give the learner their first speaking prompt.",
  },
];

const SCENARIO_BY_ID = new Map(SCENARIOS.map((scenario) => [scenario.id, scenario]));

export const DEFAULT_SCENARIO_ID = "cafe_order";

export const getScenario = (id) => SCENARIO_BY_ID.get(id) || SCENARIO_BY_ID.get(DEFAULT_SCENARIO_ID);
