import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Phone, Wallet, Settings, LogOut, KeyRound, ArrowLeftRight, ShoppingCart, List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { name: "Dashboard",        href: "/dashboard",       icon: LayoutDashboard },
  { name: "Virtual Numbers",  href: "/purchase-number", icon: ShoppingCart },
  { name: "My Numbers",       href: "/my-numbers",      icon: List },
  { name: "Wallet & Billing", href: "/wallet",          icon: Wallet },
  { name: "Transfer Funds",   href: "/transfer",        icon: ArrowLeftRight },
  { name: "Set PIN",          href: "/set-pin",         icon: KeyRound },
  { name: "Settings",         href: "/settings",        icon: Settings },
];

export function Sidebar({ open, onClose }) {
  const [location] = useLocation();
  // pinSet now comes from the real user object instead of localStorage
  const { user, logout } = useAuth();
  const pinSet = user?.hasPin ?? false;

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="VConnectHub" className="h-8 w-auto" />
          <span className="text-lg font-bold tracking-tight text-foreground">VConnectHub</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          const isPinLink = link.href === "/set-pin";

          return (
            <Link key={link.href} href={link.href} onClick={onClose}>
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
        {/* logout() clears vn_token + vn_user and redirects to /login */}
        <button onClick={() => { onClose(); logout(); }} className="w-full">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer text-sm font-medium">
            <LogOut size={18} />
            <span>Sign Out</span>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="w-64 h-dvh  hidden md:flex flex-col fixed left-0 top-0 z-40 bg-card border-r border-border">
        <SidebarContent />
      </div>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile drawer — slides in from left */}
      <div
        className={`fixed left-0 top-0 h-dvh  w-72 z-50 bg-card border-r border-border flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
}
