import {
  Check,
  ChevronRight,
  Code2,
  Loader2,
  Play,
  Save,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { aiFeedback } from "../data/questions";
import type { Attempt, Question } from "../types";
import { Confetti } from "./Confetti";

const STEPS = [
  "Clarify Requirements",
  "Functional/Non-Functional",
  "High Level Design",
  "Deep Dive",
  "Trade-offs & Bottlenecks",
  "Submit",
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#22C55E",
  Medium: "#F59E0B",
  Hard: "#EF4444",
};

type MainTab = "description" | "code";
type CodeTab = "html" | "css" | "js";

const DEFAULT_HTML = `<h1>Hello World</h1>
<p>Start designing your system here...</p>`;
const DEFAULT_CSS =
  "body { font-family: sans-serif; padding: 20px; background: #0f172a; color: #e2e8f0; }";
const DEFAULT_JS = `// Write your JavaScript here
console.log('Ready!');`;

interface PracticeModalProps {
  question: Question;
  initialNotes?: string;
  initialCanvasData?: string;
  onClose: () => void;
  onSave: (attempt: Attempt) => void;
}

export function PracticeModal({
  question,
  initialNotes = "",
  onClose,
  onSave,
}: PracticeModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [notes, setNotes] = useState(initialNotes);
  const [mainTab, setMainTab] = useState<MainTab>("description");
  const [feedbackState, setFeedbackState] = useState<
    "idle" | "loading" | "shown"
  >("idle");
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Code editor state
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>("html");
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [iframeSrc, setIframeSrc] = useState("");

  const rafRef = useRef<number>(0);

  const buildSrcdoc = useCallback(
    (html: string, css: string, js: string) =>
      `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`,
    [],
  );

  const handleRunCode = useCallback(() => {
    setIframeSrc(buildSrcdoc(htmlCode, cssCode, jsCode));
  }, [htmlCode, cssCode, jsCode, buildSrcdoc]);

  // Auto-run on first switch to code tab
  useEffect(() => {
    if (mainTab === "code" && iframeSrc === "") {
      setIframeSrc(buildSrcdoc(DEFAULT_HTML, DEFAULT_CSS, DEFAULT_JS));
    }
  }, [mainTab, iframeSrc, buildSrcdoc]);

  const handleCodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const val = target.value;
        const newVal = `${val.substring(0, start)}  ${val.substring(end)}`;
        if (activeCodeTab === "html") setHtmlCode(newVal);
        else if (activeCodeTab === "css") setCssCode(newVal);
        else setJsCode(newVal);
        requestAnimationFrame(() => {
          target.selectionStart = start + 2;
          target.selectionEnd = start + 2;
        });
      }
    },
    [activeCodeTab],
  );

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Cleanup raf on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleFeedback = useCallback(() => {
    setFeedbackState("loading");
    setTimeout(() => {
      const fb = aiFeedback[question.id] || {
        score: 70,
        bullets: ["Good design overall!"],
      };
      setScore(fb.score);
      setFeedbackState("shown");
      let current = 0;
      const step = fb.score / 30;
      const interval = setInterval(() => {
        current = Math.min(current + step, fb.score);
        setDisplayScore(Math.round(current));
        if (current >= fb.score) clearInterval(interval);
      }, 50);
      if (fb.score >= 70) {
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 3500);
      }
    }, 1500);
  }, [question.id]);

  const handleSave = useCallback(() => {
    onSave({
      id: `${question.id}-${Date.now()}`,
      questionId: question.id,
      questionTitle: question.title,
      notes,
      score: feedbackState === "shown" ? score : 0,
      date: new Date().toISOString(),
      canvasData: "",
    });
  }, [question, notes, feedbackState, score, onSave]);

  const fb = aiFeedback[question.id];
  const sColor = score >= 80 ? "#22C55E" : score >= 70 ? "#F59E0B" : "#EF4444";
  const diffColor = DIFFICULTY_COLORS[question.difficulty] || "#9AA6BF";

  const currentCodeValue =
    activeCodeTab === "html"
      ? htmlCode
      : activeCodeTab === "css"
        ? cssCode
        : jsCode;

  const handleCodeChange = (val: string) => {
    if (activeCodeTab === "html") setHtmlCode(val);
    else if (activeCodeTab === "css") setCssCode(val);
    else setJsCode(val);
  };

  return (
    <>
      <Confetti active={confettiActive} />
      <div
        className="fixed inset-0 z-50 flex animate-slide-up"
        style={{ backgroundColor: "#0B1020" }}
        data-ocid="practice.modal"
      >
        {/* Left sidebar - steps */}
        <aside
          className="hidden md:flex flex-col w-56 flex-shrink-0 border-r"
          style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
        >
          <div className="p-4 border-b" style={{ borderColor: "#263046" }}>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: "#9AA6BF" }}
            >
              Practicing
            </p>
            <h2
              className="text-sm font-semibold leading-snug"
              style={{ color: "#EAF0FF" }}
            >
              {question.title}
            </h2>
            <span
              className="inline-block mt-1.5 px-2 py-0.5 rounded text-xs font-semibold"
              style={{ color: diffColor, backgroundColor: `${diffColor}18` }}
            >
              {question.difficulty}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-dark">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: "#9AA6BF" }}
            >
              Steps
            </p>
            <div className="flex flex-col gap-2">
              {STEPS.map((step, i) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  data-ocid="practice.tab"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                  style={{
                    backgroundColor:
                      activeStep === i
                        ? "rgba(59,130,246,0.12)"
                        : "transparent",
                    boxShadow:
                      activeStep === i
                        ? "0 0 12px rgba(59,130,246,0.2), inset 0 0 0 1px rgba(59,130,246,0.3)"
                        : "none",
                  }}
                >
                  <span
                    className={`step-indicator ${
                      activeStep === i
                        ? "active"
                        : completedSteps.has(i)
                          ? "completed"
                          : ""
                    }`}
                  >
                    {completedSteps.has(i) ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className="text-xs font-medium leading-tight"
                    style={{ color: activeStep === i ? "#EAF0FF" : "#9AA6BF" }}
                  >
                    {step}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t" style={{ borderColor: "#263046" }}>
            <div
              className="text-xs text-center mb-2"
              style={{ color: "#9AA6BF" }}
            >
              {completedSteps.size}/{STEPS.length} steps
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: "#263046" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(completedSteps.size / STEPS.length) * 100}%`,
                  background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                }}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setCompletedSteps((prev) => {
                  const next = new Set(prev);
                  next.add(activeStep);
                  return next;
                })
              }
              className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-white/5"
              style={{ borderColor: "#263046", color: "#9AA6BF" }}
            >
              Mark Step Done
            </button>
          </div>
        </aside>

        {/* Main area */}
        <main className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header
            className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
            style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
          >
            <button
              type="button"
              onClick={onClose}
              data-ocid="practice.close_button"
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              style={{ color: "#9AA6BF" }}
            >
              <X className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4" style={{ color: "#263046" }} />
            <span
              className="text-sm font-semibold flex-1 truncate"
              style={{ color: "#EAF0FF" }}
            >
              {question.title}
            </span>
            <div
              className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
              style={{
                backgroundColor: "rgba(59,130,246,0.12)",
                color: "#22D3EE",
              }}
            >
              {formatTime(elapsed)}
            </div>
            <button
              type="button"
              onClick={handleSave}
              data-ocid="practice.save_button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-btn text-white"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </header>

          {/* Tab bar */}
          <div
            className="flex items-center gap-1 px-4 border-b flex-shrink-0"
            style={{ backgroundColor: "#0B1020", borderColor: "#263046" }}
          >
            <button
              type="button"
              onClick={() => setMainTab("description")}
              data-ocid="practice.tab"
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-colors relative"
              style={{
                color: mainTab === "description" ? "#3B82F6" : "#9AA6BF",
                borderBottom:
                  mainTab === "description"
                    ? "2px solid #3B82F6"
                    : "2px solid transparent",
              }}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setMainTab("code")}
              data-ocid="practice.tab"
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-colors relative"
              style={{
                color: mainTab === "code" ? "#3B82F6" : "#9AA6BF",
                borderBottom:
                  mainTab === "code"
                    ? "2px solid #3B82F6"
                    : "2px solid transparent",
              }}
            >
              <Code2 className="w-3.5 h-3.5" /> Editor
            </button>
          </div>

          {/* Description tab */}
          {mainTab === "description" && (
            <div
              className="flex-1 overflow-y-auto p-6 scrollbar-dark"
              style={{ backgroundColor: "#0B1020" }}
            >
              {/* Title + meta */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1
                    className="text-xl font-bold"
                    style={{ color: "#EAF0FF" }}
                  >
                    {question.title}
                  </h1>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      color: diffColor,
                      backgroundColor: `${diffColor}1a`,
                    }}
                  >
                    {question.difficulty}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      color: "#9AA6BF",
                      backgroundColor: "rgba(38,48,70,0.6)",
                    }}
                  >
                    ⏱ {question.time}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        color: "#22D3EE",
                        backgroundColor: "rgba(34,211,238,0.08)",
                        border: "1px solid rgba(34,211,238,0.2)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Problem description */}
              <section className="mb-6">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#CBD5E1" }}
                >
                  {question.description}
                </p>
              </section>

              {/* Requirements */}
              <section className="mb-6">
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "#9AA6BF" }}
                >
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {question.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#3B82F6" }}
                      />
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: "#CBD5E1" }}
                      >
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Constraints */}
              <section className="mb-6">
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "#9AA6BF" }}
                >
                  Constraints
                </h3>
                <div
                  className="rounded-lg p-4 space-y-2"
                  style={{
                    backgroundColor: "rgba(15,22,40,0.8)",
                    border: "1px solid #263046",
                  }}
                >
                  {question.constraints.map((c) => (
                    <p
                      key={c}
                      className="text-xs font-mono leading-relaxed"
                      style={{ color: "#9AA6BF" }}
                    >
                      <span style={{ color: "#F59E0B" }}>&#x2022;</span> {c}
                    </p>
                  ))}
                </div>
              </section>

              {/* Examples */}
              <section className="mb-8">
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "#9AA6BF" }}
                >
                  Examples
                </h3>
                <div className="space-y-4">
                  {question.examples.map((ex, i) => (
                    <div
                      key={ex.input.slice(0, 20)}
                      className="rounded-lg overflow-hidden"
                      style={{ border: "1px solid #263046" }}
                    >
                      <div
                        className="px-4 py-2 text-xs font-semibold"
                        style={{
                          backgroundColor: "rgba(38,48,70,0.5)",
                          color: "#9AA6BF",
                        }}
                      >
                        Example {i + 1}
                      </div>
                      <div
                        className="p-4 space-y-2"
                        style={{ backgroundColor: "rgba(15,22,40,0.6)" }}
                      >
                        <div>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: "#22D3EE" }}
                          >
                            Input:{" "}
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "#CBD5E1" }}
                          >
                            {ex.input}
                          </span>
                        </div>
                        <div>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: "#22C55E" }}
                          >
                            Output:{" "}
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "#CBD5E1" }}
                          >
                            {ex.output}
                          </span>
                        </div>
                        {ex.explanation && (
                          <div
                            className="pt-2 mt-2"
                            style={{ borderTop: "1px solid #263046" }}
                          >
                            <span
                              className="text-xs font-semibold"
                              style={{ color: "#9AA6BF" }}
                            >
                              Explanation:{" "}
                            </span>
                            <span
                              className="text-xs leading-relaxed"
                              style={{ color: "#9AA6BF" }}
                            >
                              {ex.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA to open editor */}
              <button
                type="button"
                onClick={() => setMainTab("code")}
                data-ocid="practice.primary_button"
                className="w-full py-3 rounded-xl text-sm font-semibold gradient-btn text-white"
              >
                Open Editor &rarr;
              </button>
            </div>
          )}

          {/* Code Editor tab */}
          {mainTab === "code" && (
            <div className="flex flex-row flex-1 min-h-0 overflow-hidden">
              {/* Left: Editor panel */}
              <div
                className="flex flex-col flex-1 min-w-0 border-r"
                style={{ borderColor: "#263046" }}
              >
                {/* Code sub-tabs */}
                <div
                  className="flex items-center gap-1 px-3 border-b flex-shrink-0"
                  style={{
                    backgroundColor: "#0F1628",
                    borderColor: "#263046",
                  }}
                >
                  {(["html", "css", "js"] as CodeTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCodeTab(tab)}
                      data-ocid="practice.tab"
                      className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                      style={{
                        color: activeCodeTab === tab ? "#3B82F6" : "#9AA6BF",
                        borderBottom:
                          activeCodeTab === tab
                            ? "2px solid #3B82F6"
                            : "2px solid transparent",
                      }}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-2 py-1.5">
                    <span className="text-xs" style={{ color: "#9AA6BF" }}>
                      {activeCodeTab === "html"
                        ? "index.html"
                        : activeCodeTab === "css"
                          ? "styles.css"
                          : "script.js"}
                    </span>
                  </div>
                </div>

                {/* Textarea */}
                <div className="flex-1 relative overflow-hidden">
                  <textarea
                    value={currentCodeValue}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onKeyDown={handleCodeKeyDown}
                    spellCheck={false}
                    data-ocid="practice.editor"
                    className="w-full h-full resize-none scrollbar-dark"
                    style={{
                      background: "#0B1020",
                      color: "#EAF0FF",
                      fontFamily:
                        '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace',
                      fontSize: "13px",
                      lineHeight: "1.7",
                      padding: "16px",
                      outline: "none",
                      border: "none",
                      tabSize: 2,
                    }}
                  />
                </div>

                {/* Run button */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-t flex-shrink-0"
                  style={{
                    backgroundColor: "#0F1628",
                    borderColor: "#263046",
                  }}
                >
                  <span className="text-xs" style={{ color: "#9AA6BF" }}>
                    Press{" "}
                    <kbd
                      className="px-1.5 py-0.5 rounded text-xs font-mono"
                      style={{
                        backgroundColor: "rgba(38,48,70,0.8)",
                        color: "#22D3EE",
                        border: "1px solid #263046",
                      }}
                    >
                      Tab
                    </kbd>{" "}
                    to indent
                  </span>
                  <button
                    type="button"
                    onClick={handleRunCode}
                    data-ocid="practice.primary_button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold gradient-btn text-white"
                  >
                    <Play className="w-3.5 h-3.5" /> Run
                  </button>
                </div>
              </div>

              {/* Right: Preview panel */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* Preview header */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5 border-b flex-shrink-0"
                  style={{
                    backgroundColor: "#0F1628",
                    borderColor: "#263046",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#22C55E" }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#9AA6BF" }}
                  >
                    Live Preview
                  </span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(34,211,238,0.08)",
                        color: "#22D3EE",
                        border: "1px solid rgba(34,211,238,0.2)",
                      }}
                    >
                      localhost
                    </span>
                  </div>
                </div>

                {/* iframe */}
                <div className="flex-1 relative">
                  {iframeSrc ? (
                    <iframe
                      srcDoc={iframeSrc}
                      title="Live Preview"
                      sandbox="allow-scripts"
                      data-ocid="practice.canvas_target"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        background: "white",
                      }}
                    />
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center h-full gap-3"
                      style={{ backgroundColor: "#0B1020" }}
                    >
                      <Play
                        className="w-10 h-10 opacity-20"
                        style={{ color: "#3B82F6" }}
                      />
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#9AA6BF" }}
                      >
                        Click <strong style={{ color: "#EAF0FF" }}>Run</strong>{" "}
                        to see the output
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right panel - notes + feedback */}
        <aside
          className="hidden lg:flex flex-col w-64 flex-shrink-0 border-l"
          style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
        >
          <div
            className="p-4 border-b flex-shrink-0"
            style={{ borderColor: "#263046" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "#9AA6BF" }}
            >
              Notes
            </p>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your design notes here..."
            data-ocid="practice.textarea"
            className="flex-1 p-4 resize-none outline-none text-xs font-mono leading-relaxed scrollbar-dark"
            style={{
              backgroundColor: "transparent",
              color: "#EAF0FF",
              caretColor: "#3B82F6",
            }}
          />
          <div
            className="p-4 border-t flex flex-col gap-3"
            style={{ borderColor: "#263046" }}
          >
            <button
              type="button"
              onClick={handleFeedback}
              disabled={feedbackState === "loading"}
              data-ocid="practice.primary_button"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold gradient-btn text-white disabled:opacity-60"
            >
              {feedbackState === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Get AI Feedback"
              )}
            </button>

            {feedbackState === "shown" && fb && (
              <div
                className="rounded-lg p-3 space-y-3 animate-fade-in-up"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid #263046",
                }}
                data-ocid="practice.success_state"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#9AA6BF" }}>
                    Score
                  </span>
                  <span
                    className="text-2xl font-black"
                    style={{ color: sColor }}
                  >
                    {displayScore}
                    <span
                      className="text-sm font-normal"
                      style={{ color: "#9AA6BF" }}
                    >
                      /100
                    </span>
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#263046" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${displayScore}%`,
                      backgroundColor: sColor,
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  {fb.bullets.map((b) => (
                    <p
                      key={b}
                      className="text-xs leading-snug"
                      style={{ color: "#9AA6BF" }}
                    >
                      {b}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              data-ocid="practice.save_button"
              className="w-full py-2 rounded-lg text-xs font-semibold border transition-colors hover:bg-white/5"
              style={{ borderColor: "#263046", color: "#9AA6BF" }}
            >
              Save Progress
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
