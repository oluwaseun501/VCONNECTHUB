import React, { useEffect, useState } from "react";
import { Moon, Sun, Bell, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <header className="h-16 w-full sticky top-0 z-30 flex items-center justify-between px-6 bg-background/90 backdrop-blur-md border-b border-border">

      {/* Mobile logo */}
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-bold text-lg text-foreground">VConnect</span>
      </div>

      {/* Desktop spacer */}
      <div className="hidden md:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Balance pill */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/20 text-sm">
          <span className="text-muted-foreground">Balance:</span>
          <span className="font-bold text-violet-600 dark:text-violet-400">₦42.50</span>
        </div>

        {/* Bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </Button>

        {/* Theme toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark"
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </Button>
        )}

        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/20 border-2 border-background">
          <span className="font-semibold text-white text-sm">DK</span>
        </div>
      </div>
    </header>
  );
}