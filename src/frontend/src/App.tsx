import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { PracticeModal } from "./components/PracticeModal";
import { ProgressPage } from "./components/ProgressPage";
import { QuestionsDashboard } from "./components/QuestionsDashboard";
import { useAttempts } from "./hooks/useLocalStorage";
import type { Attempt, Page, Question } from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [practiceQuestion, setPracticeQuestion] = useState<Question | null>(
    null,
  );
  const [practiceNotes, setPracticeNotes] = useState("");
  const [practiceCanvas, setPracticeCanvas] = useState<string | undefined>(
    undefined,
  );
  const { attempts, saveAttempt, getAttempt } = useAttempts();

  const attemptsMap: Record<number, { score: number }> = {};
  for (const a of attempts) {
    if (a.score > 0) attemptsMap[a.questionId] = { score: a.score };
  }

  const openPractice = useCallback(
    (question: Question, notes = "", canvasData?: string) => {
      setPracticeQuestion(question);
      setPracticeNotes(notes);
      setPracticeCanvas(canvasData);
    },
    [],
  );

  const handleStart = useCallback(
    (question: Question) => {
      const existing = getAttempt(question.id);
      openPractice(question, existing?.notes || "", existing?.canvasData);
    },
    [getAttempt, openPractice],
  );

  const handleSave = useCallback(
    (attempt: Attempt) => {
      saveAttempt(attempt);
      toast.success("Progress saved!", {
        description: `${attempt.questionTitle}${attempt.score > 0 ? ` — Score: ${attempt.score}/100` : ""}`,
      });
    },
    [saveAttempt],
  );

  const handleStartFromHero = useCallback(() => {
    setCurrentPage("home");
    setTimeout(() => {
      document
        .getElementById("questions")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <div className="dark min-h-screen flex flex-col">
      <Toaster />

      {!practiceQuestion && (
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      )}

      {practiceQuestion ? (
        <PracticeModal
          question={practiceQuestion}
          initialNotes={practiceNotes}
          initialCanvasData={practiceCanvas}
          onClose={() => setPracticeQuestion(null)}
          onSave={handleSave}
        />
      ) : currentPage === "home" ? (
        <main>
          <Hero
            onNavigate={setCurrentPage}
            onStartPractice={handleStartFromHero}
          />
          <QuestionsDashboard onStart={handleStart} attempts={attemptsMap} />
        </main>
      ) : (
        <main>
          <ProgressPage
            attempts={attempts}
            onResume={(q, notes, canvasData) =>
              openPractice(q, notes, canvasData)
            }
          />
        </main>
      )}

      {!practiceQuestion && <Footer />}
    </div>
  );
}
