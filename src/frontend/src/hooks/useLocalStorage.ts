import { useCallback, useState } from "react";
import type { Attempt } from "../types";

const STORAGE_KEY = "designforge_attempts";

export function useAttempts() {
  const [attempts, setAttempts] = useState<Attempt[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveAttempt = useCallback((attempt: Attempt) => {
    setAttempts((prev) => {
      const filtered = prev.filter((a) => a.id !== attempt.id);
      const next = [attempt, ...filtered];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getAttempt = useCallback(
    (questionId: number) => attempts.find((a) => a.questionId === questionId),
    [attempts],
  );

  return { attempts, saveAttempt, getAttempt };
}
