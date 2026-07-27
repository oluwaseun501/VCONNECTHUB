import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import {
  Search, X, ChevronLeft, ChevronRight, Loader2,
  Clock, CheckCircle2, XCircle, AlertCircle, Calendar, TimerOff,
} from "lucide-react";
import { getAdminOrders } from "./adminApi";

// ─── Client-side expiry (mirrors user-facing MyNumbers logic) ────────────────
const EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

function effectiveStatus(order) {
  const rawStatus = order.status?.toUpperCase();

  // Already hard-expired by backend
  if (rawStatus === "CANCELED" || rawStatus === "TIMEOUT" ||
      rawStatus === "FINISHED" || rawStatus === "BANNED" || rawStatus === "EXPIRED") {
    return "EXPIRED";
  }

  // Has an OTP/SMS → still active regardless of age
  if (order.sms?.length > 0) return "ACTIVE";
  if (order.smsCode)          return "ACTIVE";

  // RECEIVED but no stored SMS code → treat as active (SMS may be in transit)
  if (rawStatus === "RECEIVED") return "ACTIVE";

  // PENDING with no OTP — check age
  if (order.createdAt) {
    const age = Date.now() - new Date(order.createdAt).getTime();
    if (age > EXPIRY_MS) return "EXPIRED";
  }

  return "ACTIVE";
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const STATUS_FILTERS = ["ALL", "ACTIVE", "EXPIRED"];

const DATE_PRESETS = [
  { label: "7 days",  days: 7  },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "Custom",  days: null },
];

// Effective-status badge styles
const EFF_STYLES = {
  ACTIVE:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
};

// Raw backend status badge styles (used in modal detail)
const RAW_STYLES = {
  PENDING:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  RECEIVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  FINISHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELED: "bg-red-500/10 text-red-400 border-red-500/20",
  TIMEOUT:  "bg-red-500/10 text-red-400 border-red-500/20",
  EXPIRED:  "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  BANNED:   "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const PER_PAGE = 10;

function getInitials(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "??";
}

const AVATAR_COLORS = [
  "bg-violet-500", "bg-fuchsia-500", "bg-amber-500",
  "bg-emerald-500", "bg-blue-500", "bg-rose-500",
];

function colorFor(id) {
  const hash = String(id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function toInputDate(date) {
  return date.toISOString().slice(0, 10);
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderModal({ order, onClose }) {
  if (!order) return null;

  const userName  = typeof order.user === "object" ? order.user?.name  : "User";
  const userEmail = typeof order.user === "object" ? order.user?.email : "—";
  const userId    = typeof order.user === "object" ? order.user?._id   : order.user;
  const eff       = effectiveStatus(order);

  const rows = [
    { label: "Order ID",      value: `#${order.orderId ?? order._id}` },
    { label: "Date",          value: formatDate(order.createdAt) },
    { label: "Backend Status",value: order.status ?? "—" },
    { label: "Service",       value: order.product ?? "—" },
    { label: "Phone",         value: order.phone ?? "—" },
    { label: "Amount",        value: `₦${Number(order.price ?? 0).toLocaleString()}` },
    { label: "User",          value: userName },
    { label: "Email",         value: userEmail },
    { label: "User ID",       value: String(userId ?? "—") },
    ...(order.sms?.length > 0
      ? order.sms.map((s, i) => ({ label: `SMS ${i + 1}`, value: s.text ?? s.code ?? "—" }))
      : []),
    ...(order.smsCode ? [{ label: "SMS Code", value: order.smsCode }] : []),
    ...(order.expiresAt ? [{ label: "Expires", value: formatDate(order.expiresAt) }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#0f0f1a] border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${colorFor(userId)} flex items-center justify-center text-white text-sm font-bold`}>
              {getInitials(userName)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount + status hero */}
        <div className="px-6 py-5 text-center border-b border-border">
          <p className="text-3xl font-bold text-foreground">₦{Number(order.price ?? 0).toLocaleString()}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {/* Effective status badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${EFF_STYLES[eff]}`}>
              {eff === "ACTIVE"
                ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active</>
                : <><XCircle className="w-3 h-3" />Expired</>
              }
            </span>
            {/* Raw backend status (smaller, for admin reference) */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${RAW_STYLES[order.status?.toUpperCase()] ?? "bg-white/5 text-muted-foreground border-border"}`}>
              {order.status}
            </span>
            <span className="text-sm text-muted-foreground capitalize">{order.product}</span>
          </div>
        </div>

        {/* Detail rows */}
        <div className="px-6 py-4 space-y-3 max-h-72 overflow-y-auto">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4 text-sm">
              <span className="text-muted-foreground flex-shrink-0 w-28">{label}</span>
              <span className="text-foreground text-right break-all font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-border">
          <button onClick={onClose}
            className="w-full h-10 rounded-xl bg-white/5 border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NumbersPurchased() {
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [search,        setSearch]        = useState("");
  const [activeFilter,  setActiveFilter]  = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [datePreset, setDatePreset] = useState(null);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const [page,    setPage]    = useState(1);
  const [orders,  setOrders]  = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  function getDateRange() {
    if (datePreset) {
      const to   = new Date();
      const from = new Date();
      from.setDate(from.getDate() - datePreset);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    if (showCustom && customFrom && customTo) {
      return {
        from: new Date(customFrom).toISOString(),
        to:   new Date(customTo + "T23:59:59").toISOString(),
      };
    }
    return {};
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        // Always fetch ALL from backend — filtering is done client-side
        // so effectiveStatus (client-side expiry) is applied correctly
        const params = { page, limit: PER_PAGE };
        const { from, to } = getDateRange();
        if (from) params.from = from;
        if (to)   params.to   = to;

        const { data } = await getAdminOrders(params);
        if (!cancelled) {
          if (Array.isArray(data)) {
            setOrders(data);
            setTotal(data.length);
          } else {
            setOrders(data.orders ?? []);
            setTotal(data.total ?? data.orders?.length ?? 0);
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [page, datePreset, customFrom, customTo, showCustom]);

  // Apply effectiveStatus + tab filter + search client-side
  const withEffective = orders.map((o) => ({ ...o, _eff: effectiveStatus(o) }));

  const tabFiltered =
    activeFilter === "ALL"     ? withEffective :
    activeFilter === "ACTIVE"  ? withEffective.filter((o) => o._eff === "ACTIVE") :
                                 withEffective.filter((o) => o._eff === "EXPIRED");

  const filtered = search
    ? tabFiltered.filter((o) => {
        const userName = typeof o.user === "object" ? o.user?.name ?? "" : "";
        return (
          userName.toLowerCase().includes(search.toLowerCase()) ||
          String(o.orderId ?? "").includes(search) ||
          (o.phone   ?? "").includes(search) ||
          (o.product ?? "").toLowerCase().includes(search.toLowerCase())
        );
      })
    : tabFiltered;

  const totalPages = Math.ceil(total / PER_PAGE);

  // Tab counts
  const counts = {
    ALL:     withEffective.length,
    ACTIVE:  withEffective.filter((o) => o._eff === "ACTIVE").length,
    EXPIRED: withEffective.filter((o) => o._eff === "EXPIRED").length,
  };

  const handleDatePreset = (days) => {
    if (days === null) { setDatePreset(null); setShowCustom(true); }
    else { setDatePreset(days); setShowCustom(false); setCustomFrom(""); setCustomTo(""); }
    setPage(1);
  };

  const clearDateFilter = () => {
    setDatePreset(null); setShowCustom(false); setCustomFrom(""); setCustomTo(""); setPage(1);
  };

  const activeDateLabel = datePreset
    ? `Last ${datePreset} days`
    : showCustom && customFrom && customTo
    ? `${customFrom} → ${customTo}`
    : null;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Numbers Purchased</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{total} orders total</p>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by user, number, service…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            {/* Status tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium w-14">Status</span>
              {STATUS_FILTERS.map((f) => (
                <button key={f} onClick={() => { setActiveFilter(f); setPage(1); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all flex items-center gap-1.5 ${
                    activeFilter === f
                      ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                      : "bg-white/5 text-muted-foreground border-border hover:border-violet-500/40 hover:text-foreground"
                  }`}>
                  {f === "ACTIVE"  && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  {f === "EXPIRED" && <XCircle className="w-3 h-3" />}
                  {f}
                  <span className="opacity-60 font-normal">({counts[f]})</span>
                </button>
              ))}
            </div>

            {/* Period */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium w-14">Period</span>
              {DATE_PRESETS.map(({ label, days }) => {
                const isActive = days === null ? showCustom : datePreset === days;
                return (
                  <button key={label} onClick={() => handleDatePreset(days)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                        : "bg-white/5 text-muted-foreground border-border hover:border-violet-500/40 hover:text-foreground"
                    }`}>
                    {days === null && <Calendar className="w-3 h-3" />}
                    {label}
                  </button>
                );
              })}
              {(datePreset || (showCustom && customFrom && customTo)) && (
                <button onClick={clearDateFilter}
                  className="px-3 py-1.5 rounded-full text-xs border border-border text-muted-foreground hover:text-foreground flex items-center gap-1 transition-all">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {showCustom && (
              <div className="flex items-center gap-3 pl-16 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">From</label>
                  <input type="date" value={customFrom} max={customTo || toInputDate(new Date())}
                    onChange={(e) => { setCustomFrom(e.target.value); setPage(1); }}
                    className="h-8 px-2 rounded-lg bg-white/5 border border-border text-xs text-foreground outline-none focus:border-violet-500/50 transition-all" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">To</label>
                  <input type="date" value={customTo} min={customFrom} max={toInputDate(new Date())}
                    onChange={(e) => { setCustomTo(e.target.value); setPage(1); }}
                    className="h-8 px-2 rounded-lg bg-white/5 border border-border text-xs text-foreground outline-none focus:border-violet-500/50 transition-all" />
                </div>
              </div>
            )}

            {activeDateLabel && (
              <p className="text-xs text-violet-400 pl-16">Showing: {activeDateLabel}</p>
            )}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left px-6 py-3.5 font-medium">Order ID</th>
                      <th className="text-left px-4 py-3.5 font-medium">User</th>
                      <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Number</th>
                      <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Service</th>
                      <th className="text-left px-4 py-3.5 font-medium">Amount</th>
                      <th className="text-left px-4 py-3.5 font-medium">Status</th>
                      <th className="text-left px-4 py-3.5 font-medium hidden xl:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground text-sm">
                          No orders match your filters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((o, i) => {
                        const userName  = typeof o.user === "object" ? o.user?.name  ?? "User" : "User";
                        const userEmail = typeof o.user === "object" ? o.user?.email ?? ""     : "";
                        const userId    = typeof o.user === "object" ? o.user?._id             : o.user;
                        const eff       = o._eff;
                        return (
                          <tr key={o._id}
                            onClick={() => setSelectedOrder(o)}
                            className={`border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{o.orderId ?? o._id?.slice(-6)}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full ${colorFor(userId)} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                                  {getInitials(userName)}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground leading-tight">{userName}</p>
                                  <p className="text-xs text-muted-foreground hidden sm:block">{userEmail}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-mono text-xs text-muted-foreground hidden md:table-cell">{o.phone ?? "—"}</td>
                            <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell capitalize">{o.product ?? "—"}</td>
                            <td className="px-4 py-4 font-semibold text-foreground">₦{Number(o.price ?? 0).toLocaleString()}</td>
                            <td className="px-4 py-4">
                              {eff === "ACTIVE" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border bg-red-500/10 text-red-400 border-red-500/20">
                                  <XCircle className="w-3 h-3" />
                                  Expired
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-muted-foreground text-xs hidden xl:table-cell">{formatDate(o.createdAt)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <span>Page {page} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail popup */}
      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
