import React from "react";
import { Link } from "wouter";
import { ShieldCheck, Zap, Globe2 } from "lucide-react";

const perks = [
  { icon: Zap,         text: "Instant number delivery — under 5 seconds" },
  { icon: ShieldCheck, text: "100% private — your real number stays hidden" },
  { icon: Globe2,      text: "50+ countries, 100+ supported services" },
];

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#08080f] flex-col justify-between p-12">
        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-fuchsia-500/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Logo */}
        <Link href="/">
          <div className="relative flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <span className="font-bold text-white">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">VConnectHub</span>
          </div>
        </Link>

        {/* Tagline */}
        <div className="relative space-y-6">
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Privacy meets{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
              precision.
            </span>
          </h2>
          <p className="text-white/50 leading-relaxed max-w-sm">
            Join thousands of Nigerians securing their digital footprint with temporary numbers that work every time.
          </p>
          <ul className="space-y-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/60 text-sm">
                <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-violet-400" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <p className="relative text-white/20 text-xs">
          Trusted by 10,000+ users across Nigeria and beyond.
        </p>
      </div>

      {/* Right panel — theme-aware */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center">
              <span className="font-bold text-white text-sm">V</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">VConnectHub</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}