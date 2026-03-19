import { Bell, Menu, Search, X, Zap } from "lucide-react";
import { useState } from "react";
import type { Page } from "../types";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: { label: string; page: Page | null }[] = [
    { label: "Home", page: "home" },
    { label: "Questions", page: "home" },
    { label: "My Progress", page: "progress" },
    { label: "Community", page: null },
  ];

  return (
    <nav
      className="navbar-glow-border sticky top-0 z-50"
      style={{ backgroundColor: "#0F1628" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            className="flex items-center gap-3"
            onClick={() => onNavigate("home")}
            data-ocid="nav.link"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black text-white"
              style={{
                background:
                  "linear-gradient(135deg, #22D3EE 0%, #3B82F6 40%, #8B5CF6 100%)",
              }}
            >
              DF
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: "#EAF0FF" }}
            >
              DesignForge
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page }) => {
              const active =
                (label === "Home" && currentPage === "home") ||
                (label === "Questions" && currentPage === "home") ||
                (label === "My Progress" && currentPage === "progress");
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => page && onNavigate(page)}
                  data-ocid="nav.link"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "nav-active text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.search_input"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold gradient-btn text-white"
              data-ocid="nav.button"
            >
              <Zap className="w-3 h-3" /> Upgrade
            </button>
            <button
              type="button"
              className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.button"
            >
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                }}
              >
                A
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#EAF0FF" }}
                >
                  Alex
                </span>
                <span className="text-xs" style={{ color: "#F59E0B" }}>
                  7 day streak
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="md:hidden pb-4 border-t"
            style={{ borderColor: "#263046" }}
          >
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map(({ label, page }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (page) {
                      onNavigate(page);
                      setMobileOpen(false);
                    }
                  }}
                  data-ocid="nav.link"
                  className="text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
