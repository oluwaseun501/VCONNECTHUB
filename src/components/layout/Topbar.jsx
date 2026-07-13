import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun, Menu, LayoutDashboard, Phone, Wallet, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// ── Avatar dropdown ───────────────────────────────────────────────────
function AvatarDropdown({ initials, name, email, onLogout }) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
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
      label: "Dashboard",
      icon: LayoutDashboard,
      action: () => { navigate("/dashboard"); setOpen(false); },
    },
    {
      label: "My Numbers",
      icon: Phone,
      action: () => { navigate("/my-numbers"); setOpen(false); },
    },
    {
      label: "Wallet & Billing",
      icon: Wallet,
      action: () => { navigate("/wallet"); setOpen(false); },
    },
    {
      label: "Settings",
      icon: Settings,
      action: () => { navigate("/settings"); setOpen(false); },
    },
    {
      label: "Sign Out",
      icon: LogOut,
      danger: true,
      action: () => { onLogout(); setOpen(false); },
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/20 border-2 border-background hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-violet-500/40"
      >
        <span className="font-semibold text-white text-sm">{initials}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-52 rounded-2xl bg-card border border-border shadow-xl shadow-black/30 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{name || "User"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{email || ""}</p>
            </div>
          </div>

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

// ── Topbar ────────────────────────────────────────────────────────────
export function Topbar({ onMenuClick }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const balance = user?.balance ?? 0;

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    } else {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <header className="h-16 w-full sticky top-0 z-30 flex items-center justify-between px-6 bg-background/90 backdrop-blur-md border-b border-border">

      {/* Mobile logo + hamburger */}
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-bold text-lg text-foreground">VConnect</span>
      </div>

      {/* Desktop spacer */}
      <div className="hidden md:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/20 text-sm">
          <span className="text-muted-foreground">Balance:</span>
          <span className="font-bold text-violet-600 dark:text-violet-400">
            ₦{Number(balance).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        <AvatarDropdown
          initials={initials}
          name={user?.name}
          email={user?.email}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}