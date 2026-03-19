import { ArrowRight, BarChart2, Bot, Star, Users } from "lucide-react";
import type { Page } from "../types";

interface HeroProps {
  onNavigate: (page: Page) => void;
  onStartPractice: () => void;
}

const stats = [
  { icon: BarChart2, label: "248 Questions" },
  { icon: Users, label: "12K+ Users" },
  { icon: Bot, label: "AI Feedback" },
  { icon: Star, label: "Free Forever" },
];

export function Hero({ onNavigate, onStartPractice }: HeroProps) {
  return (
    <section
      id="hero"
      className="hero-gradient relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20"
    >
      <div
        className="absolute top-24 left-[8%] w-72 h-72 rounded-full opacity-10 animate-pulse-neon pointer-events-none"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-32 right-[10%] w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "pulseNeon 3s ease-in-out 1.5s infinite",
        }}
      />

      <div
        className="animate-float mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border"
        style={{
          borderColor: "rgba(59,130,246,0.4)",
          backgroundColor: "rgba(59,130,246,0.08)",
          color: "#22D3EE",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        New: AI Feedback v2.0 is live
      </div>

      <h1
        className="text-center font-black leading-tight mb-5"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
      >
        <span className="gradient-text">Master System Design</span>
        <br />
        <span style={{ color: "#EAF0FF" }}>Like LeetCode</span>
      </h1>

      <p
        className="text-center max-w-2xl text-base sm:text-lg leading-relaxed mb-10"
        style={{ color: "#9AA6BF" }}
      >
        Step-by-step guided practice with progress saving &amp; AI feedback
        simulation. Build, iterate, and master every system design concept.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <button
          type="button"
          onClick={onStartPractice}
          data-ocid="hero.primary_button"
          className="gradient-btn flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-sm"
          style={{
            boxShadow:
              "0 0 20px rgba(59,130,246,0.3), 0 0 40px rgba(139,92,246,0.15)",
          }}
        >
          Start Practicing Now <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate("progress")}
          data-ocid="hero.secondary_button"
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-white/5"
          style={{ borderColor: "#263046", color: "#EAF0FF" }}
        >
          View Progress
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
        {stats.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "rgba(59,130,246,0.12)",
                color: "#3B82F6",
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: "#EAF0FF" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs" style={{ color: "#9AA6BF" }}>
          Scroll to explore
        </span>
        <div
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: "#263046" }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: "#3B82F6" }}
          />
        </div>
      </div>
    </section>
  );
}
