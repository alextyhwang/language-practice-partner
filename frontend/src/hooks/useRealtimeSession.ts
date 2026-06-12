import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CoachingMode,
  Correction,
  CorrectionType,
  NpcMood,
  SessionPhase,
  TranscriptTurn,
} from "../types";
import { allScenarios, playerStats } from "../data/mockData";
import { RealtimeClient } from "../lib/realtime";

interface UseRealtimeSessionOptions {
  scenarioId: string;
  coachingMode?: CoachingMode;
  /** Overrides the mission's default target language (backend language id). */
  language?: string;
}

const CORRECTION_TYPES: CorrectionType[] = ["pronunciation", "grammar", "vocabulary", "fluency"];

function toCorrectionType(value: unknown): CorrectionType {
  return CORRECTION_TYPES.includes(value as CorrectionType)
    ? (value as CorrectionType)
    : "vocabulary";
}

function deriveMood(
  phase: SessionPhase,
  partnerSpeaking: boolean,
  activeCorrection: boolean,
  turnCount: number,
): NpcMood {
  if (activeCorrection) return "thinking";
  if (partnerSpeaking || phase === "listening") return "happy";
  if (turnCount <= 1) return "welcoming";
  if (phase === "processing") return "surprised";
  return "neutral";
}

export function useRealtimeSession({
  scenarioId,
  coachingMode = "friendly",
  language,
}: UseRealtimeSessionOptions) {
  const scenario = useMemo(
    () => allScenarios.find((s) => s.id === scenarioId) ?? allScenarios[0],
    [scenarioId],
  );

  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [connected, setConnected] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [activeCorrectionId, setActiveCorrectionId] = useState<string | null>(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const [partnerSpeaking, setPartnerSpeaking] = useState(false);

  const clientRef = useRef<RealtimeClient | null>(null);
  const turnCounter = useRef(0);
  const elapsedRef = useRef(0);
  const lastUserTurnId = useRef<string | null>(null);
  // Maps a backend response_id to the transcript turn accumulating its deltas.
  const partnerTurnByResponse = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  const nextTurnId = () => {
    turnCounter.current += 1;
    return `t${turnCounter.current}`;
  };

  const advanceGoals = useCallback(
    (progress: number) => {
      const goalCount = scenario.goals.length;
      const idx = Math.min(goalCount - 1, Math.floor((progress / 100) * goalCount));
      setCurrentGoalIndex((prev) => Math.max(prev, idx));
    },
    [scenario.goals.length],
  );

  // Connect once per mission.
  useEffect(() => {
    const client = new RealtimeClient({
      onStatus: (status) => {
        if (status === "connected") {
          setConnected(true);
          setPhase("listening");
        } else if (status === "closed") {
          setConnected(false);
        }
      },
      onError: (message) => {
        // Surface backend/connection errors as a partner line so they're visible.
        const id = nextTurnId();
        setTranscript((prev) => [
          ...prev,
          { id, speaker: "partner", text: `⚠️ ${message}`, timestamp: elapsedRef.current },
        ]);
      },
      onResponseStarted: () => {
        setPartnerSpeaking(true);
        setPhase("listening");
      },
      onPartnerTranscriptDelta: (delta, responseId) => {
        setPartnerSpeaking(true);
        setTranscript((prev) => {
          const existingId = partnerTurnByResponse.current.get(responseId);
          const idx = existingId ? prev.findIndex((turn) => turn.id === existingId) : -1;
          // Append a delta to the in-progress turn for this response.
          if (idx >= 0) {
            const next = prev.slice();
            next[idx] = { ...next[idx], text: next[idx].text + delta };
            return next;
          }
          // No turn yet (or the ref desynced from state) — start a fresh one.
          const id = nextTurnId();
          partnerTurnByResponse.current.set(responseId, id);
          return [
            ...prev,
            { id, speaker: "partner", text: delta, timestamp: elapsedRef.current },
          ];
        });
      },
      onUserTranscript: (text) => {
        const id = nextTurnId();
        lastUserTurnId.current = id;
        setTranscript((prev) => [
          ...prev,
          { id, speaker: "user", text, timestamp: elapsedRef.current },
        ]);
      },
      onResponseDone: () => {
        setPartnerSpeaking(false);
        setPhase((p) => (p === "correcting" ? p : "idle"));
      },
      onCorrection: (c) => {
        const id = `c${Date.now()}`;
        const correction: Correction = {
          id,
          type: toCorrectionType(c.category),
          original: String(c.original ?? ""),
          suggestion: String(c.correction ?? ""),
          explanation: String(c.explanation ?? ""),
          turnId: lastUserTurnId.current ?? "",
        };
        setCorrections((prev) => [...prev, correction]);
        setActiveCorrectionId(id);
        setPhase("correcting");
      },
      onScore: (s) => {
        const progress = Number(s.goalProgress);
        if (Number.isFinite(progress)) {
          const clamped = Math.max(0, Math.min(100, progress));
          setGoalProgress((prev) => Math.max(prev, clamped));
          advanceGoals(clamped);
        }
      },
      onGoal: () => {
        setGoalProgress(100);
        setCurrentGoalIndex(scenario.goals.length - 1);
      },
      onTranslation: (t) => {
        const responseId = String(t.responseId ?? "");
        const turnId = partnerTurnByResponse.current.get(responseId);
        if (!turnId || !t.text) return;
        setTranscript((prev) =>
          prev.map((turn) =>
            turn.id === turnId ? { ...turn, translation: String(t.text) } : turn,
          ),
        );
      },
    });

    clientRef.current = client;
    const sessionConfig = {
      ...scenario.backend,
      language: language || scenario.backend.language,
    };
    client.connect(sessionConfig, { greet: true });

    return () => {
      client.close();
      clientRef.current = null;
      partnerTurnByResponse.current.clear();
      lastUserTurnId.current = null;
    };
  }, [scenario, advanceGoals, language]);

  // Reset visible state when switching missions.
  useEffect(() => {
    turnCounter.current = 0;
    // Keep the response->turn map in lockstep with the transcript array, or the
    // delta handler will try to update turns that no longer exist.
    partnerTurnByResponse.current.clear();
    lastUserTurnId.current = null;
    setTranscript([]);
    setCorrections([]);
    setActiveCorrectionId(null);
    setPhase("idle");
    setConnected(false);
    setGoalProgress(0);
    setCurrentGoalIndex(0);
    setIsMicActive(false);
    setPartnerSpeaking(false);
    setElapsedSeconds(0);
  }, [scenarioId]);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMic = useCallback(() => {
    const client = clientRef.current;
    if (!client) return;

    if (isMicActive) {
      client.stopMic();
      setIsMicActive(false);
      setPhase("processing");
    } else {
      setActiveCorrectionId(null);
      void client.startMic().then((ok) => {
        if (ok) {
          setIsMicActive(true);
          setPhase("speaking");
          setPartnerSpeaking(false);
        }
      });
    }
  }, [isMicActive]);

  const dismissCorrection = useCallback(() => {
    setActiveCorrectionId(null);
    setPhase("idle");
  }, []);

  const retryPhrase = useCallback(() => {
    const active = corrections.find((c) => c.id === activeCorrectionId);
    if (!active || !clientRef.current) return;

    setActiveCorrectionId(null);
    const id = nextTurnId();
    lastUserTurnId.current = id;
    setTranscript((prev) => [
      ...prev,
      {
        id,
        speaker: "user",
        text: active.suggestion,
        timestamp: elapsedRef.current,
        isRetry: true,
      },
    ]);
    clientRef.current.sendText(active.suggestion);
    setPhase("processing");
  }, [activeCorrectionId, corrections]);

  const completeMission = useCallback(() => {
    setGoalProgress(100);
    setCurrentGoalIndex(scenario.goals.length - 1);
    setPartnerSpeaking(false);
    setIsMicActive(false);
    setPhase("idle");
    clientRef.current?.stopMic();
  }, [scenario.goals.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const activeCorrection = corrections.find((c) => c.id === activeCorrectionId) ?? null;

  const currentLine = useMemo(() => {
    if (phase === "speaking" && isMicActive) {
      return { speaker: "user" as const, text: "…", translation: "Listening…" };
    }
    const last = transcript[transcript.length - 1];
    if (!last) {
      return connected
        ? { speaker: "partner" as const, text: "", translation: "Connecting…" }
        : null;
    }
    return { speaker: last.speaker, text: last.text, translation: last.translation };
  }, [transcript, phase, isMicActive, connected]);

  const npcMood = deriveMood(
    phase,
    partnerSpeaking,
    !!activeCorrection,
    transcript.filter((t) => t.speaker === "partner").length,
  );

  return {
    scenario,
    coachingMode,
    playerStats,
    phase,
    connected,
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    goalProgress,
    currentGoalIndex,
    transcript,
    corrections,
    activeCorrection,
    isMicActive,
    partnerSpeaking,
    currentLine,
    npcMood,
    completeMission,
    toggleMic,
    dismissCorrection,
    retryPhrase,
  };
}
