import { ExternalLink, Github, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="border-t py-10 px-4"
      style={{ backgroundColor: "#0F1628", borderColor: "#263046" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-black text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #22D3EE, #3B82F6, #8B5CF6)",
                }}
              >
                DF
              </div>
              <span className="font-bold text-sm" style={{ color: "#EAF0FF" }}>
                DesignForge
              </span>
            </div>
            <p className="text-xs" style={{ color: "#9AA6BF" }}>
              Made for interview prep
            </p>
          </div>
          <div className="flex items-center gap-6">
            {["Questions", "Progress", "Community", "About"].map((link) => (
              <span
                key={link}
                className="text-xs cursor-default"
                style={{ color: "#9AA6BF" }}
              >
                {link}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-md hover:bg-white/5 transition-colors"
              style={{ color: "#9AA6BF" }}
            >
              <Github className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-md hover:bg-white/5 transition-colors"
              style={{ color: "#9AA6BF" }}
            >
              <Twitter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          className="mt-8 pt-6 border-t text-center text-xs"
          style={{ borderColor: "#263046", color: "#9AA6BF" }}
        >
          {"\u00a9 "}
          {year}
          {" Built with "}
          <span style={{ color: "#EC4899" }}>{"\u2764"}</span>
          {" using "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            style={{ color: "#3B82F6" }}
          >
            caffeine.ai <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
