import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun, Menu, ShieldCheck, LogOut, ArrowLeftRight, Globe,
         LayoutDashboard, Users, Phone, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";

// ── Bottom-nav links (mirrors sidebar) ───────────────────────────────
const NAV_LINKS = [
  { name: "Overview",      href: "/admin",               icon: LayoutDashboard },
  { name: "Users",         href: "/admin/users",          icon: Users },
  { name: "Numbers",       href: "/admin/numbers",        icon: Phone },
  { name: "Transactions",  href: "/admin/transactions",   icon: ArrowLeftRight },
  { name: "Settings",      href: "/admin/settings",       icon: Settings },
];

function handleLogout() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminEmail");
  window.location.href = "/admin/login";
}

// ── Avatar dropdown ───────────────────────────────────────────────────
function AvatarDropdown({ initials, name, email }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = [
    {
      label: "View Transactions",
      icon: ArrowLeftRight,
      action: () => { window.location.href = "/admin/transactions"; setOpen(false); },
    },
    {
      label: "View Website",
      icon: Globe,
      action: () => { window.open("/", "_blank"); setOpen(false); },
    },
    {
      label: "Sign Out",
      icon: LogOut,
      danger: true,
      action: () => { handleLogout(); setOpen(false); },
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/20 border-2 border-background hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-violet-500/40"
      >
        <span className="font-semibold text-white text-sm">{initials}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-52 rounded-2xl bg-card border border-border shadow-xl shadow-black/30 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{name || "Administrator"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{email || ""}</p>
            </div>
          </div>

          {/* Items */}
          <div className="py-1.5">
            {items.map(({ label, icon: Icon, danger, action }) => (
              <button
                key={label}
                onClick={action}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Topbar + Bottom navbar ────────────────────────────────────────────
export default function AdminTopbar({ onMenuClick }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [location] = useLocation();

  useEffect(() => { setMounted(true); }, []);

  // Read admin info from localStorage
  const adminName = localStorage.getItem("adminName") || "Administrator";
  const adminEmail = localStorage.getItem("adminEmail") || "";
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  return (
    <>
      {/* ── Top bar ── */}
      <header className="h-16 w-full sticky top-0 z-30 flex items-center justify-between px-6 bg-background/90 backdrop-blur-md border-b border-border">

        {/* Mobile: hamburger + brand */}
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-foreground">Admin</span>
          </div>
        </div>

        {/* Desktop: page context badge */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {/* Avatar with dropdown */}
          <AvatarDropdown initials={initials} name={adminName} email={adminEmail} />
        </div>
      </header>

      {/* ── Mobile bottom navbar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {NAV_LINKS.map(({ name, href, icon: Icon }) => {
            const isActive = location === href || (href !== "/admin" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div className="flex flex-col items-center gap-1 px-3 py-2 cursor-pointer group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-violet-500/15 text-violet-400"
                      : "text-muted-foreground group-hover:text-foreground group-hover:bg-white/5"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-medium leading-none transition-colors ${
                    isActive ? "text-violet-400" : "text-muted-foreground"
                  }`}>
                    {name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer so content isn't hidden behind bottom nav on mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
