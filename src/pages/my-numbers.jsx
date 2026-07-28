import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  List, Clock, CheckCircle2, XCircle, ShoppingCart,
  RefreshCw, Copy, Check, Loader2, MessageSquare, Download,
} from "lucide-react";
import {
  SiWhatsapp, SiTelegram, SiTiktok, SiFacebook,
  SiInstagram, SiX, SiSnapchat, SiGmail, SiBinance, SiSignal,
} from "react-icons/si";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/axios";

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
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function useCountdown(purchasedAt, isActive) {
  const [secsLeft, setSecsLeft] = useState(null);
  useEffect(() => {
    if (!isActive || !purchasedAt) return;
    const expiry = new Date(purchasedAt).getTime() + 15 * 60 * 1000;
    const tick = () => {
      const left = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setSecsLeft(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [purchasedAt, isActive]);
  return secsLeft;
}

// Backend statuses are uppercase: PENDING, RECEIVED, FINISHED, CANCELED, TIMEOUT, BANNED
function normalizeStatus(status) {
  switch (status) {
    case "PENDING":   return "waiting";
    case "RECEIVED":  return "received";
    case "FINISHED":
    case "CANCELED":
    case "TIMEOUT":
    case "BANNED":    return "expired";
    default:          return "waiting";
  }
}

function getOtp(order) {
  if (Array.isArray(order.sms) && order.sms.length > 0) {
    const latest = order.sms[order.sms.length - 1];
    return { code: latest.code || null, text: latest.text || null };
  }
  return null;
}

const EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

// Client-side expiry: regardless of what the backend says,
// if it's been 15+ minutes and no OTP code arrived → expired.
function effectiveStatus(entry) {
  // If already explicitly expired by backend, keep it
  if (entry.status === "expired") return "expired";

  // If there's an OTP code, the number is still useful → keep active
  if (entry.otp && entry.otp.code) return entry.status;

  // No OTP and 15+ minutes old → expired on the client
  if (entry.purchasedAt) {
    const age = Date.now() - new Date(entry.purchasedAt).getTime();
    if (age > EXPIRY_MS) return "expired";
  }

  return entry.status;
}

// "active" = waiting or received (still usable)
function isActive(status) {
  return status === "waiting" || status === "received";
}

// Inline mini badge (used inside metadata line)
function CountdownBadge({ purchasedAt, status }) {
  const secs = useCountdown(purchasedAt, status === "waiting");
  if (status !== "waiting" || secs === null) return null;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const urgent = secs < 120;
  return (
    <span className={`flex items-center gap-1 text-xs font-mono font-semibold ${urgent ? "text-red-500" : "text-amber-500"}`}>
      <Clock className="w-3 h-3" />
      {m}:{String(s).padStart(2, "0")} remaining
    </span>
  );
}

// Prominent timer bar shown on the card when number is active and within 15 min window
function TimerBar({ purchasedAt, status }) {
  // Show for any active number that still has time left — don't rely on exact status string
  const active = isActive(status) && !!purchasedAt;
  const secs = useCountdown(purchasedAt, active);
  if (!active || secs === null || secs <= 0) return null;

  const total   = 15 * 60; // 15 minutes in seconds
  const pct     = Math.max(0, Math.min(100, (secs / total) * 100));
  const m       = Math.floor(secs / 60);
  const s       = secs % 60;
  const urgent  = secs < 120;  // last 2 minutes
  const warning = secs < 300;  // last 5 minutes

  const barColor = urgent  ? "bg-red-500"
                 : warning ? "bg-amber-500"
                 :           "bg-emerald-500";

  const textColor = urgent  ? "text-red-500"
                  : warning ? "text-amber-500"
                  :           "text-emerald-500";

  const bgColor = urgent  ? "bg-red-500/10 border-red-500/20"
                : warning ? "bg-amber-500/10 border-amber-500/20"
                :           "bg-emerald-500/10 border-emerald-500/20";

  return (
    <div className={`mt-3 rounded-xl border px-4 py-3 ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Clock className={`w-3.5 h-3.5 ${textColor}`} />
          <span className={`text-xs font-semibold ${textColor}`}>
            {urgent ? "Expiring soon!" : warning ? "Time running out" : "Number active"}
          </span>
        </div>
        <span className={`text-sm font-mono font-bold tabular-nums ${textColor}`}>
          {m}:{String(s).padStart(2, "0")}
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor} ${urgent ? "animate-pulse" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground mt-1.5">
        This number expires in {m} min {s}s — send the SMS now
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  if (isActive(status)) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/25">
      <XCircle className="w-3 h-3" />
      Expired
    </span>
  );
}

function SmsSection({ entry, onCheck, checking }) {
  const hasOtp = entry.otp && entry.otp.code;
  const msgCount = entry.otp ? 1 : 0;

  return (
    <div className="mt-3 border border-border rounded-xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">SMS Verification Code</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {msgCount} message{msgCount !== 1 ? "s" : ""} received
        </span>
      </div>

      {/* Section body */}
      <div className="px-4 py-3">
        {hasOtp ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">OTP Code</p>
                <p className="text-lg font-bold text-emerald-500 tracking-[0.3em]">{entry.otp.code}</p>
                {entry.otp.text && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{entry.otp.text}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No SMS code received yet</p>
            {isActive(entry.status) && (
              <button
                onClick={() => onCheck(entry)}
                disabled={checking}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
              >
                {checking
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <RefreshCw className="w-3.5 h-3.5" />
                }
                Check for SMS
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyNumbers() {
  const [numbers, setNumbers]     = useState([]);
  const [copied, setCopied]       = useState(null);
  const [filter, setFilter]       = useState("all");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [checkingId, setCheckingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/numbers/orders?page=1&limit=50");
      const orders = data?.orders || [];
      const mapped = orders.map((order) => {
        // Try every possible date field; fall back to ObjectId-encoded timestamp
        const purchasedAt =
          order.createdAt ||
          order.created_at ||
          order.purchasedAt ||
          order.date ||
          order.timestamp ||
          // MongoDB ObjectId encodes creation time in the first 4 bytes
          (order._id
            ? new Date(parseInt(String(order._id).slice(0, 8), 16) * 1000).toISOString()
            : null);

        const base = {
          id: order._id || order.orderId,
          orderId: order.orderId,
          serviceId: (order.product || "").toLowerCase(),
          service: order.product,
          country: order.country,
          price: order.price,
          number: order.phone,
          status: normalizeStatus(order.status),
          otp: getOtp(order),
          smsAll: Array.isArray(order.sms) ? order.sms : [],
          purchasedAt,
        };
        // Apply client-side expiry: if still "waiting" past 15 min, treat as expired
        base.status = effectiveStatus(base);
        return base;
      });
      setNumbers(mapped);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load your numbers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const copyNumber = (num, id) => {
    navigator.clipboard.writeText(num);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Auto-poll every 20 s while there are "waiting" numbers (no OTP yet)
  useEffect(() => {
    const hasWaiting = numbers.some((n) => n.status === "waiting");
    if (!hasWaiting) return;
    const id = setInterval(() => {
      load();
    }, 20000);
    return () => clearInterval(id);
  }, [numbers]);

  const checkSms = async (entry) => {
    setCheckingId(entry.id);
    try {
      // Try to fetch just this order's latest status
      const { data } = await api.get(`/api/numbers/orders/${entry.id}`);
      const updated = data?.order || data;
      if (updated) {
        setNumbers((prev) =>
          prev.map((n) => {
            if (n.id !== entry.id) return n;
            const patched = {
              ...n,
              status: normalizeStatus(updated.status),
              otp: getOtp(updated),
              smsAll: Array.isArray(updated.sms) ? updated.sms : n.smsAll,
              purchasedAt: updated.createdAt || n.purchasedAt,
            };
            patched.status = effectiveStatus(patched);
            return patched;
          })
        );
        setCheckingId(null);
        return;
      }
    } catch {
      // endpoint not available — fall back to full refresh
    }
    await load();
    setCheckingId(null);
  };

  // "active" = waiting or received
  const tabs = [
    { key: "all",     label: "All Numbers" },
    { key: "active",  label: "Active" },
    { key: "expired", label: "Expired" },
  ];

  const counts = {
    all:     numbers.length,
    active:  numbers.filter((n) => isActive(n.status)).length,
    expired: numbers.filter((n) => n.status === "expired").length,
  };

  const filtered =
    filter === "all"     ? numbers :
    filter === "active"  ? numbers.filter((n) => isActive(n.status)) :
                           numbers.filter((n) => n.status === "expired");

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
              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground text-sm transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-500 flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && numbers.length === 0 && !error && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading your numbers…
          </div>
        )}

        {/* Filter tabs */}
        {!loading && numbers.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map((tab) => (
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
                <span className="ml-1.5 text-xs opacity-70">({counts[tab.key]})</span>
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && numbers.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={GLIDE}
            className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <List className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground mb-2">No numbers yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Purchase your first virtual number to get started with SMS verification
            </p>
            <Link href="/purchase-number">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-md hover:opacity-90 transition-all">
                Buy Virtual Number →
              </button>
            </Link>
          </motion.div>
        )}

        {/* Empty filtered state */}
        {!loading && numbers.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No {filter} numbers to show.
          </div>
        )}

        {/* Numbers list */}
        <AnimatePresence>
          <div className="space-y-4">
            {filtered.map((entry, i) => {
              const svc = SERVICE_ICONS[entry.serviceId] || { icon: List, color: "#8b5cf6" };
              const Icon = svc.icon;
              const isChecking = checkingId === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...GLIDE, delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-violet-500/25 transition-all"
                >
                  {/* Top row: icon + number + badge + actions */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: svc.color + "22" }}
                      >
                        <Icon className="w-5 h-5" style={{ color: svc.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-base font-bold text-foreground tracking-wide">
                            {entry.number}
                          </code>
                          <StatusBadge status={entry.status} />
                        </div>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">
                          Country: <span className="capitalize">{entry.country}</span>
                          {" · "}Service: <span className="capitalize">{entry.service}</span>
                          {" · "}
                          {isActive(entry.status)
                            ? <CountdownBadge purchasedAt={entry.purchasedAt} status={entry.status} />
                            : <span>Expires in: <span className="text-red-400">Expired</span></span>
                          }
                        </p>
                      </div>
                    </div>

                    {/* Action buttons (top-right) */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => copyNumber(entry.number, entry.id)}
                        title="Copy number"
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                      >
                        {copied === entry.id
                          ? <Check className="w-4 h-4 text-emerald-500" />
                          : <Copy className="w-4 h-4" />
                        }
                      </button>
                      {isActive(entry.status) && (
                        <button
                          onClick={() => checkSms(entry)}
                          disabled={isChecking}
                          title="Check for new SMS"
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Countdown timer bar — only shown while number is active/waiting */}
                  <TimerBar purchasedAt={entry.purchasedAt} status={entry.status} />

                  {/* SMS Verification Code section */}
                  <SmsSection
                    entry={entry}
                    onCheck={checkSms}
                    checking={isChecking}
                  />

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Purchased: {timeAgo(entry.purchasedAt)}
                      {entry.price ? ` · Total cost: ₦${Number(entry.price).toLocaleString()}` : ""}
                    </p>
                    {entry.smsAll.length > 0 && (
                      <button
                        onClick={() => {
                          const content = entry.smsAll.map((s) => `Code: ${s.code}\n${s.text}`).join("\n---\n");
                          const blob = new Blob([content], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url; a.download = `sms-${entry.number}.txt`; a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export SMS
                      </button>
                    )}
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
