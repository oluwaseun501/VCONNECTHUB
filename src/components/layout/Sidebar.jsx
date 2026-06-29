import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Phone, Wallet, Settings, LogOut, KeyRound, ArrowLeftRight, ShoppingCart, List } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Dashboard",         href: "/dashboard",       icon: LayoutDashboard },
  { name: "Virtual Numbers",   href: "/purchase-number", icon: ShoppingCart },
  { name: "My Numbers",        href: "/my-numbers",      icon: List },
  { name: "Wallet & Billing",  href: "/wallet",          icon: Wallet },
  { name: "Transfer Funds",    href: "/transfer",        icon: ArrowLeftRight },
  { name: "Set PIN",           href: "/set-pin",         icon: KeyRound },
  { name: "Settings",          href: "/settings",        icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const pinSet = !!localStorage.getItem("txn_pin");

  return (
    <div className="w-64 h-screen hidden md:flex flex-col fixed left-0 top-0 z-40 bg-card border-r border-border">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/30">
          <span className="font-bold text-white text-sm">V</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">VConnectHub</span>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          const isPinLink = link.href === "/set-pin";

          return (
            <Link key={link.href} href={link.href}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <Icon size={18} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="flex-1">{link.name}</span>
                {isPinLink && !pinSet && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link href="/">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer text-sm font-medium">
            <LogOut size={18} />
            <span>Sign Out</span>
          </div>
        </Link>
      </div>
    </div>
  );
}