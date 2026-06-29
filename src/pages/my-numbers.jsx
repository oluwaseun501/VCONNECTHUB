import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { List, Clock, CheckCircle2, XCircle, ShoppingCart, RefreshCw, Copy, Check } from "lucide-react";
import {
  SiWhatsapp, SiTelegram, SiTiktok, SiFacebook,
  SiInstagram, SiX, SiSnapchat, SiGmail, SiBinance, SiSignal,
} from "react-icons/si";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const GLIDE = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

const SERVICE_ICONS = {
  whatsapp:  { icon: SiWhatsapp,  color: "#25D366" },
  telegram:  { icon: SiTelegram,  color: "#2AABEE" },
  tiktok:    { icon: SiTiktok,    color: "#010101" },
  facebook:  { icon: SiFacebook,  color: "#1877F2" },
  instagram: { icon: SiInstagram, color: "#E4405F" },
twitter:   { icon: SiX,         color: "#000000" },
  snapchat:  { icon: SiSnapchat,  color: "#FFFC00" },
  gmail:     { icon: SiGmail,     color: "#EA4335" },
  binance:   { icon: SiBinance,   color: "#F3BA2F" },
  signal:    { icon: SiSignal,    color: "#3A76F0" },
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function StatusBadge({ status }) {
  const styles = {
    waiting:  "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
    received: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    expired:  "bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/25",
  };
  const labels = { waiting: "⏳ Waiting for OTP", received: "✅ OTP Received", expired: "❌ Expired" };

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[status] || styles.waiting}`}>
      {labels[status] || status}
    </span>
  );
}

export default function MyNumbers() {
  const [numbers, setNumbers] = useState([]);
  const [copied, setCopied]   = useState(null);
  const [filter, setFilter]   = useState("all");

  const load = () => {
    const stored = JSON.parse(localStorage.getItem("purchased_numbers") || "[]");
    setNumbers(stored);
  };

  useEffect(() => { load(); }, []);

  const copyNumber = (num, id) => {
    navigator.clipboard.writeText(num);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = filter === "all" ? numbers : numbers.filter((n) => n.status === filter);

  const counts = {
    all:      numbers.length,
    waiting:  numbers.filter((n) => n.status === "waiting").length,
    received: numbers.filter((n) => n.status === "received").length,
    expired:  numbers.filter((n) => n.status === "expired").length,
  };

  return (
  <DashboardLayout>
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={GLIDE} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <List className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Numbers</h1>
              <p className="text-muted-foreground text-sm">All your purchased virtual numbers</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground text-sm transition-all">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link href="/purchase-number">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-all">
                <ShoppingCart className="w-4 h-4" />
                Buy Number
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      {numbers.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "all",      label: "All" },
            { key: "waiting",  label: "⏳ Waiting" },
            { key: "received", label: "✅ Received" },
            { key: "expired",  label: "❌ Expired" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === tab.key
                  ? "bg-violet-500/15 border-violet-500/30 text-violet-600 dark:text-violet-400"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className="ml-1.5 text-xs opacity-70">({counts[tab.key]})</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {numbers.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={GLIDE}
          className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <List className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground mb-2">No numbers yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Purchase your first virtual number to get started with SMS verification</p>
          <Link href="/purchase-number">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-md hover:opacity-90 transition-all">
              Buy Virtual Number →
            </button>
          </Link>
        </motion.div>
      )}

      {/* Numbers list */}
      <AnimatePresence>
        <div className="space-y-3">
          {filtered.map((entry, i) => {
            const svc = SERVICE_ICONS[entry.serviceId] || { icon: List, color: "#8b5cf6" };
            const Icon = svc.icon;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...GLIDE, delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-violet-500/25 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Service icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: svc.color + "22" }}>
                    <Icon className="w-6 h-6" style={{ color: svc.color }} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-foreground">{entry.service}</p>
                        <p className="text-xs text-muted-foreground">{entry.countryFlag} {entry.country} · ₦{entry.price?.toLocaleString()}</p>
                      </div>
                      <StatusBadge status={entry.status} />
                    </div>

                    {/* Number with copy */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <code className="text-sm font-bold text-foreground bg-muted px-3 py-1.5 rounded-lg tracking-wide">
                        {entry.number}
                      </code>
                      <button
                        onClick={() => copyNumber(entry.number, entry.id)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                      >
                        {copied === entry.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* OTP display */}
                    {entry.otp && (
                      <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">OTP Code</p>
                          <p className="text-base font-bold text-emerald-500 tracking-[0.25em]">{entry.otp}</p>
                        </div>
                      </div>
                    )}

                    {/* Waiting pulse */}
                    {entry.status === "waiting" && (
                      <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Waiting for OTP to arrive…</p>
                          <p className="text-xs text-muted-foreground">Use the number above on {entry.service}. Code will appear once received.</p>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">Purchased {timeAgo(entry.purchasedAt)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
     </div>
  </DashboardLayout>
  );
}