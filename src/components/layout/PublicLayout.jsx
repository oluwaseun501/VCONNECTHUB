import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

export function PublicNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

    const [location, navigate] = useLocation();

  const handleHowItWorks = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location === "/") {
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#how-it-works");
    }
  };

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled
        ? "bg-background/90 backdrop-blur-xl border-border shadow-sm"
        : "bg-background/60 backdrop-blur-md border-transparent"
    }`}>
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <img src="/logo.png" alt="VConnectHub" className="h-9 w-auto" />
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:block">
              VConnectHub
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium mr-2 text-muted-foreground">
           <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
           <a href="/#how-it-works" onClick={handleHowItWorks} className="hover:text-foreground transition-colors">How it Works</a>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
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

          <Link href="/login" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>

          <Link href="/register" className="hidden md:inline-flex">
            <Button
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white border-0 shadow-md shadow-violet-500/20"
            >
              Get Started
            </Button>
          </Link>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>


      {/* Mobile menu — glide down effect */}
      <div
       className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-t ${
          menuOpen
            ? "max-h-96 opacity-100 border-border"
            : "max-h-0 opacity-0 border-transparent"
        } bg-background/95 backdrop-blur-xl`}
      >
        <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
  <Link
  href="/"
  onClick={() => setMenuOpen(false)}
  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 border-b border-border/50"
>
  Home
</Link>
         <a
  href="/#how-it-works"
  onClick={handleHowItWorks}
  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 border-b border-border/50"
>
  How it Works
</a>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>
            <span className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 border-b border-border/50">
              Pricing
            </span>
          </Link>
          <div className="flex flex-col gap-2 pt-3">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white border-0"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  const [, navigate] = useLocation();

  const handleHowItWorks = (e) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#how-it-works");
    }
  };

  return (
    <footer className="border-t border-border bg-card/50 mt-24">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="VConnectHub" className="h-9 w-auto" />
              <span className="text-lg font-bold tracking-tight text-foreground">VConnectHub</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium virtual numbers and instant OTPs for Nigerians who value privacy and speed.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Products</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><Link href="/numbers" className="hover:text-primary transition-colors">Virtual Numbers</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
             <li><a href="/#how-it-works" onClick={handleHowItWorks} className="hover:text-primary transition-colors">How It Works</a></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Supported Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Support</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex justify-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VConnectHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}