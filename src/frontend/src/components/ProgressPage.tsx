import { Play, Target, TrendingUp, Trophy } from "lucide-react";
import { questions } from "../data/questions";
import type { Attempt, Question } from "../types";

interface ProgressPageProps {
  attempts: Attempt[];
  onResume: (question: Question, notes: string, canvasData?: string) => void;
}

function scoreColor(s: number) {
  if (s >= 80) return "#22C55E";
  if (s >= 70) return "#F59E0B";
  return "#EF4444";
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const STREAK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STREAK_ACTIVE = [true, true, true, true, true, true, false];

const STATS = [
  { id: "attempts", icon: Target, label: "Total Attempts", color: "#3B82F6" },
  { id: "avg", icon: TrendingUp, label: "Avg Score", color: "#8B5CF6" },
  { id: "best", icon: Trophy, label: "Best Score", color: "#F59E0B" },
] as const;

export function ProgressPage({ attempts, onResume }: ProgressPageProps) {
  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
      : 0;
  const bestScore =
    attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  function getStatValue(id: string) {
    if (id === "attempts") return String(attempts.length);
    if (id === "avg") return avgScore ? `${avgScore}/100` : "\u2014";
    return bestScore ? `${bestScore}/100` : "\u2014";
  }

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{ backgroundColor: "#0B1020" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2" style={{ color: "#EAF0FF" }}>
            My Progress
          </h1>
          <p className="text-sm" style={{ color: "#9AA6BF" }}>
            Track your system design journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {STATS.map(({ id, icon: Icon, label, color }) => (
            <div
              key={id}
              className="flex items-center gap-4 p-5 rounded-xl border"
              style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}18`, color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#9AA6BF" }}>
                  {label}
                </p>
                <p className="text-xl font-black" style={{ color: "#EAF0FF" }}>
                  {getStatValue(id)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="p-5 rounded-xl border mb-8"
          style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "#EAF0FF" }}>
              7 Day Streak
            </h3>
            <span className="text-xs" style={{ color: "#F59E0B" }}>
              Keep it up!
            </span>
          </div>
          <div className="flex gap-2">
            {STREAK_DAYS.map((day, i) => (
              <div
                key={day}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div
                  className="w-full aspect-square rounded-md"
                  style={{
                    backgroundColor: STREAK_ACTIVE[i]
                      ? "rgba(34,197,94,0.4)"
                      : "#121826",
                    border: `1px solid ${STREAK_ACTIVE[i] ? "rgba(34,197,94,0.5)" : "#263046"}`,
                    boxShadow: STREAK_ACTIVE[i]
                      ? "0 0 8px rgba(34,197,94,0.3)"
                      : "none",
                  }}
                />
                <span className="text-xs" style={{ color: "#9AA6BF" }}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-5" style={{ color: "#EAF0FF" }}>
            Recent Attempts
          </h2>
          {attempts.length === 0 ? (
            <div
              className="flex flex-col items-center py-20 text-center rounded-xl border"
              style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
              data-ocid="progress.empty_state"
            >
              <div className="text-6xl mb-4">&#127919;</div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "#EAF0FF" }}
              >
                No attempts yet
              </h3>
              <p className="text-sm" style={{ color: "#9AA6BF" }}>
                Start your first practice to see progress here!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {attempts.map((attempt, i) => (
                <div
                  key={attempt.id}
                  className="flex items-center gap-5 p-5 rounded-xl border card-hover"
                  style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
                  data-ocid={`progress.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-sm mb-1 truncate"
                      style={{ color: "#EAF0FF" }}
                    >
                      {attempt.questionTitle}
                    </h3>
                    <p className="text-xs" style={{ color: "#9AA6BF" }}>
                      {formatDate(attempt.date)}
                    </p>
                  </div>
                  {attempt.score > 0 && (
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 w-28">
                      <span
                        className="text-sm font-bold"
                        style={{ color: scoreColor(attempt.score) }}
                      >
                        {attempt.score}/100
                      </span>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: "#263046" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${attempt.score}%`,
                            backgroundColor: scoreColor(attempt.score),
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const q = questions.find(
                        (qq) => qq.id === attempt.questionId,
                      );
                      if (q) onResume(q, attempt.notes, attempt.canvasData);
                    }}
                    data-ocid={`progress.button.${i + 1}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold flex-shrink-0 transition-all"
                    style={{
                      backgroundColor: "rgba(59,130,246,0.1)",
                      color: "#3B82F6",
                      border: "1px solid rgba(59,130,246,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      const btn = e.currentTarget;
                      btn.style.background =
                        "linear-gradient(135deg,#3B82F6,#8B5CF6)";
                      btn.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      const btn = e.currentTarget;
                      btn.style.background = "rgba(59,130,246,0.1)";
                      btn.style.color = "#3B82F6";
                    }}
                  >
                    <Play className="w-3 h-3" /> Resume
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
