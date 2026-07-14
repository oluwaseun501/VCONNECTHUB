import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingCart, Wallet, ArrowLeftRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Home",     href: "/dashboard",       icon: LayoutDashboard },
  { name: "Number",      href: "/purchase-number", icon: ShoppingCart },
  { name: "Boost",    href: "/boosting",        icon: Zap },           
  { name: "Wallet",   href: "/wallet",          icon: Wallet },
  { name: "Transfer", href: "/transfer",        icon: ArrowLeftRight },
];
export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.href;

          return (
            <Link key={tab.href} href={tab.href}>
              <div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer min-w-[56px]">
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                  <Icon size={20} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {tab.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}