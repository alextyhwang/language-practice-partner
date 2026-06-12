import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CoachingMode, Correction, NpcMood, SessionPhase, TranscriptTurn } from "../types";
import {
  allScenarios,
  getScenarioScript,
  playerStats,
} from "../data/mockData";

interface UseSessionOptions {
  scenarioId: string;
  coachingMode?: CoachingMode;
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

export function useSession({ scenarioId, coachingMode = "friendly" }: UseSessionOptions) {
  const scenario = useMemo(
    () => allScenarios.find((s) => s.id === scenarioId) ?? allScenarios[0],
    [scenarioId],
  );
  const script = useMemo(() => getScenarioScript(scenario.id), [scenario.id]);

  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [goalProgress, setGoalProgress] = useState(25);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>(script.initialTranscript);
  const [corrections, setCorrections] = useState<Correction[]>(script.mockCorrections);
  const [activeCorrectionId, setActiveCorrectionId] = useState<string | null>(
    script.mockCorrections[0]?.id ?? null,
  );
  const [isMicActive, setIsMicActive] = useState(false);
  const [partnerSpeaking, setPartnerSpeaking] = useState(false);

  const scriptIndex = useRef(0);
  const userScriptIndex = useRef(0);
  const turnCounter = useRef(script.initialTranscript.length);

  useEffect(() => {
    scriptIndex.current = 0;
    userScriptIndex.current = 0;
    turnCounter.current = script.initialTranscript.length;
    setTranscript(script.initialTranscript);
    setCorrections(script.mockCorrections);
    setActiveCorrectionId(script.mockCorrections[0]?.id ?? null);
    setPhase("idle");
    setGoalProgress(25);
    setCurrentGoalIndex(0);
    setIsMicActive(false);
    setPartnerSpeaking(false);
    setElapsedSeconds(0);
  }, [scenarioId, script]);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase !== "listening") return;

    const line = script.scriptedPartnerLines[scriptIndex.current];
    if (!line) {
      setPartnerSpeaking(false);
      setPhase("idle");
      return;
    }

    setPartnerSpeaking(true);
    const timeout = setTimeout(() => {
      turnCounter.current += 1;
      const newTurn: TranscriptTurn = {
        id: `t${turnCounter.current}`,
        speaker: "partner",
        text: line.text,
        translation: line.translation,
        timestamp: elapsedSeconds,
      };
      setTranscript((prev) => [...prev, newTurn]);
      setPartnerSpeaking(false);
      setPhase("idle");
      scriptIndex.current += 1;
    }, line.delayMs);

    return () => clearTimeout(timeout);
  }, [phase, script, elapsedSeconds]);

  const toggleMic = useCallback(() => {
    if (isMicActive) {
      setIsMicActive(false);
      setPhase("processing");

      const userLine = script.scriptedUserLines[userScriptIndex.current];
      if (userLine) {
        setTimeout(() => {
          turnCounter.current += 1;
          const turnId = `t${turnCounter.current}`;
          const newTurn: TranscriptTurn = {
            id: turnId,
            speaker: "user",
            text: userLine.text,
            translation: userLine.translation,
            timestamp: elapsedSeconds,
          };
          setTranscript((prev) => [...prev, newTurn]);
          userScriptIndex.current += 1;

          if (userLine.correction) {
            const correction = { ...userLine.correction, turnId };
            setCorrections((prev) => [...prev, correction]);
            setActiveCorrectionId(correction.id);
            setPhase("correcting");
            setGoalProgress((p) => Math.min(p + 15, 100));
          } else {
            setPhase("listening");
            setGoalProgress((p) => {
              const next = Math.min(p + 12, 100);
              if (next >= 50 && currentGoalIndex < 1) setCurrentGoalIndex(1);
              if (next >= 75 && currentGoalIndex < 2) setCurrentGoalIndex(2);
              if (next >= 95 && currentGoalIndex < 3) setCurrentGoalIndex(3);
              return next;
            });
          }
        }, 1200);
      } else {
        setPhase("idle");
      }
    } else {
      setIsMicActive(true);
      setPhase("speaking");
      setPartnerSpeaking(false);
      setActiveCorrectionId(null);
    }
  }, [isMicActive, elapsedSeconds, script, currentGoalIndex]);

  const dismissCorrection = useCallback(() => {
    setActiveCorrectionId(null);
    setPhase("listening");
  }, []);

  const retryPhrase = useCallback(() => {
    const active = corrections.find((c) => c.id === activeCorrectionId);
    if (!active) return;

    setActiveCorrectionId(null);
    setPhase("speaking");
    setIsMicActive(true);

    setTimeout(() => {
      setIsMicActive(false);
      turnCounter.current += 1;
      const newTurn: TranscriptTurn = {
        id: `t${turnCounter.current}`,
        speaker: "user",
        text: active.suggestion,
        translation: "(retry)",
        timestamp: elapsedSeconds,
        isRetry: true,
      };
      setTranscript((prev) => [...prev, newTurn]);
      setPhase("listening");
      setGoalProgress((p) => Math.min(p + 8, 100));
    }, 2000);
  }, [activeCorrectionId, corrections, elapsedSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const activeCorrection = corrections.find((c) => c.id === activeCorrectionId) ?? null;

  const currentLine = useMemo(() => {
    if (phase === "speaking" && isMicActive) {
      return {
        speaker: "user" as const,
        text: "…",
        translation: "Listening to your Mandarin…",
      };
    }
    const last = transcript[transcript.length - 1];
    if (!last) return null;
    return {
      speaker: last.speaker,
      text: last.text,
      translation: last.translation,
    };
  }, [transcript, phase, isMicActive]);

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
    toggleMic,
    dismissCorrection,
    retryPhrase,
  };
}
