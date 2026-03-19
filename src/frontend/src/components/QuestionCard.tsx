import { CheckCircle, Clock } from "lucide-react";
import type { Question } from "../types";

interface QuestionCardProps {
  question: Question;
  attempt?: { score: number };
  onStart: (question: Question) => void;
  index: number;
}

const difficultyConfig: Record<
  string,
  { color: string; bg: string; bar: string }
> = {
  Easy: { color: "#22C55E", bg: "rgba(34,197,94,0.12)", bar: "#22C55E" },
  Medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", bar: "#F59E0B" },
  Hard: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", bar: "#EF4444" },
};

export function QuestionCard({
  question,
  attempt,
  onStart,
  index,
}: QuestionCardProps) {
  const diff = difficultyConfig[question.difficulty];

  return (
    <article
      className="card-hover relative flex flex-col rounded-xl overflow-hidden border animate-fade-in-up"
      style={{
        backgroundColor: "#121826",
        borderColor: "#263046",
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
      }}
      data-ocid={`questions.item.${index + 1}`}
    >
      <div className="h-1 w-full" style={{ backgroundColor: diff.bar }} />
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-base leading-snug"
            style={{ color: "#EAF0FF" }}
          >
            {question.title}
          </h3>
          {attempt && (
            <div
              className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: "rgba(34,197,94,0.15)",
                color: "#22C55E",
              }}
            >
              <CheckCircle className="w-3 h-3" />
              {attempt.score}/100
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
            style={{ color: diff.color, backgroundColor: diff.bg }}
          >
            {question.difficulty}
          </span>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs border"
            style={{ color: "#9AA6BF", borderColor: "#263046" }}
          >
            {question.category}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-xs border"
              style={{
                color: "#9AA6BF",
                borderColor: "#263046",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          className="flex items-center justify-between mt-auto pt-3 border-t"
          style={{ borderColor: "#263046" }}
        >
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#9AA6BF" }}
          >
            <Clock className="w-3.5 h-3.5" />
            {question.time}
          </div>
          <button
            type="button"
            onClick={() => onStart(question)}
            data-ocid={`questions.button.${index + 1}`}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{
              borderColor: "rgba(59,130,246,0.4)",
              color: "#3B82F6",
              backgroundColor: "rgba(59,130,246,0.06)",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.background = "linear-gradient(135deg,#3B82F6,#8B5CF6)";
              btn.style.color = "#fff";
              btn.style.borderColor = "transparent";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.background = "rgba(59,130,246,0.06)";
              btn.style.color = "#3B82F6";
              btn.style.borderColor = "rgba(59,130,246,0.4)";
            }}
          >
            Start Practice
          </button>
        </div>
      </div>
    </article>
  );
}
