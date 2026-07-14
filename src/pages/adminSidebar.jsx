import React from "react";
import { Link, useLocation } from "wouter";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Phone, ArrowLeftRight, Settings, LogOut, ShieldCheck, X, Plug2, DollarSign, Zap, ShoppingCart, TrendingUp } from "lucide-react";


const links = [
  { name: "Overview",           href: "/admin",                  icon: LayoutDashboard },
  { name: "Users",              href: "/admin/users",             icon: Users },
  { name: "Numbers Purchased",  href: "/admin/numbers",           icon: Phone },
  { name: "Boost Orders",       href: "/admin/boost-orders",      icon: ShoppingCart },
  { name: "All Transactions",   href: "/admin/transactions",      icon: ArrowLeftRight },
  { name: "API Providers",      href: "/admin/providers",         icon: Plug2 },
  { name: "SMM Providers",      href: "/admin/smm-providers",     icon: Zap },
  { name: "Pricing",            href: "/admin/pricing",           icon: DollarSign },
  { name: "Boost Pricing",      href: "/admin/boost-pricing",     icon: TrendingUp },
  { name: "Settings",           href: "/admin/settings",          icon: Settings },
];

function handleLogout(onClose) {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminEmail");
  if (onClose) onClose();
  window.location.href = "/admin/login";
}

export default function AdminSidebar({ open, onClose }) {
  const [location] = useLocation();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/30">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-foreground">VConnectHub</span>
            <p className="text-[10px] font-medium text-violet-500 uppercase tracking-widest -mt-0.5">Admin</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href || (link.href !== "/admin" && location.startsWith(link.href));

          return (
            <Link key={link.href} href={link.href} onClick={onClose}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  size={18}
                  className={cn(isActive ? "text-primary" : "text-muted-foreground")}
                />
                <span className="flex-1">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => handleLogout(onClose)}
          className="w-full"
        >
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
      {/* Desktop sidebar */}
      <div className="w-64 h-dvh hidden md:flex flex-col fixed left-0 top-0 z-40 bg-card border-r border-border">
        <SidebarContent />
      </div>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 top-0 h-dvh w-72 z-50 bg-card border-r border-border flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
}
