import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function PublicNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-border shadow-sm"
          : "bg-background/60 backdrop-blur-md border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/30">
              <span className="font-bold text-white text-sm">V</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:block">
              VConnectHub
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium mr-2 text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </a>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
  Pricing
</Link>
          </div>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>

          <Link href="/register">
            <Button
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white border-0 shadow-md shadow-violet-500/20"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-24">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center">
                <span className="font-bold text-white text-sm">V</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">VConnectHub</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium virtual numbers and instant OTPs for Nigerians who value privacy and speed.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Supported Services</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} VConnectHub. All rights reserved.</p>
          <span>Built in Lagos, Nigeria 🇳🇬</span>
        </div>
      </div>
    </footer>
  );
}