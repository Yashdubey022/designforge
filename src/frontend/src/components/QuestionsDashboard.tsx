import { Search } from "lucide-react";
import { useState } from "react";
import { questions } from "../data/questions";
import type { Question } from "../types";
import { QuestionCard } from "./QuestionCard";

interface QuestionsDashboardProps {
  onStart: (question: Question) => void;
  attempts: Record<number, { score: number }>;
}

export function QuestionsDashboard({
  onStart,
  attempts,
}: QuestionsDashboardProps) {
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  const categories = [
    "All",
    ...Array.from(new Set(questions.map((q) => q.category))),
  ];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filtered = questions.filter((q) => {
    const matchDiff =
      difficultyFilter === "All" || q.difficulty === difficultyFilter;
    const matchCat = categoryFilter === "All" || q.category === categoryFilter;
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchCat && matchSearch;
  });

  return (
    <section
      id="questions"
      className="py-16 px-4"
      style={{ backgroundColor: "#0B1020" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#EAF0FF" }}>
            Practice Questions
          </h2>
          <p className="text-sm" style={{ color: "#9AA6BF" }}>
            {questions.length} system design challenges. Filter and start
            practicing.
          </p>
        </div>
        <div
          className="flex flex-wrap gap-3 mb-8 p-4 rounded-xl border"
          style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
          data-ocid="questions.panel"
        >
          <div className="relative flex-1 min-w-[160px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9AA6BF" }}
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="questions.search_input"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border bg-transparent outline-none focus:border-blue-500 transition-colors"
              style={{ borderColor: "#263046", color: "#EAF0FF" }}
            />
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            data-ocid="questions.select"
            className="px-3 py-2 rounded-lg text-sm border outline-none cursor-pointer"
            style={{
              borderColor: "#263046",
              color: "#EAF0FF",
              backgroundColor: "#121826",
            }}
          >
            {difficulties.map((d) => (
              <option key={d} value={d} style={{ backgroundColor: "#121826" }}>
                {d === "All" ? "All Difficulties" : d}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            data-ocid="questions.select"
            className="px-3 py-2 rounded-lg text-sm border outline-none cursor-pointer"
            style={{
              borderColor: "#263046",
              color: "#EAF0FF",
              backgroundColor: "#121826",
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c} style={{ backgroundColor: "#121826" }}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-20 text-center"
            data-ocid="questions.empty_state"
          >
            <div className="text-5xl mb-4">&#128269;</div>
            <p className="text-base font-semibold" style={{ color: "#EAF0FF" }}>
              No questions found
            </p>
            <p className="text-sm mt-1" style={{ color: "#9AA6BF" }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                attempt={attempts[q.id]}
                onStart={onStart}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
