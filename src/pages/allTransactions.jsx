import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import {
  Search, X, ChevronLeft, ChevronRight, Loader2,
  Calendar, ArrowDownLeft, ArrowUpRight, ArrowRightLeft,
  Clock, XCircle,
} from "lucide-react";
import { getAdminTransactions } from "./adminApi";

const TYPE_FILTERS = ["all", "credit", "debit", "transfer", "admin", "boost"];
const STATUS_FILTERS = ["all", "successful", "pending", "failed"];

const DATE_PRESETS = [
  { label: "7 days",  days: 7  },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "Custom",  days: null },
];

const TYPE_STYLES = {
  credit:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  debit:    "bg-red-500/10 text-red-400 border-red-500/20",
  fund:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  purchase: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  transfer: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  admin:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  boost:    "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20", 
};

const STATUS_STYLES = {
  successful: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending:    "bg-amber-500/10  text-amber-400  border-amber-500/20",
  failed:     "bg-red-500/10    text-red-400    border-red-500/20",
};

const PER_PAGE = 10;

function fmt(n) {
  return `₦${Number(n ?? 0).toLocaleString()}`;
}

function getInitials(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "??";
}

const AVATAR_COLORS = [
  "bg-violet-500", "bg-fuchsia-500", "bg-amber-500",
  "bg-emerald-500", "bg-blue-500",   "bg-rose-500",
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

const EMPTY_SUMMARY = {
  totalIn: 0, totalOut: 0, totalTransfer: 0,
  totalPending: 0, totalFailed: 0,
  countPending: 0, countFailed: 0,
};

// ─── Transaction Detail Modal ────────────────────────────────────────────────
function TransactionModal({ tx, onClose }) {
  if (!tx) return null;

  const userName  = typeof tx.user === "object" ? tx.user?.name  : "User";
  const userEmail = typeof tx.user === "object" ? tx.user?.email : "—";
  const userId    = typeof tx.user === "object" ? tx.user?._id   : tx.user;
  const isCredit  = tx.type === "credit" || tx.type === "transfer";

  const rows = [
    { label: "Reference",   value: tx.reference ?? tx._id },
    { label: "Date",        value: formatDate(tx.createdAt) },
    { label: "Type",        value: tx.type },
    { label: "Status",      value: tx.status },
    { label: "Amount",      value: `${isCredit ? "+" : "-"}${fmt(tx.amount)}` },
    { label: "Description", value: tx.description ?? "—" },
    { label: "User",        value: userName },
    { label: "Email",       value: userEmail },
    { label: "User ID",     value: String(userId ?? "—") },
    ...(tx.recipient
      ? [{ label: "Recipient", value: typeof tx.recipient === "object" ? (tx.recipient?.name ?? tx.recipient?.email) : tx.recipient }]
      : []),
    ...(tx.metadata
      ? Object.entries(tx.metadata).map(([k, v]) => ({ label: k, value: String(v) }))
      : []),
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

        {/* Amount hero */}
        <div className="px-6 py-5 text-center border-b border-border">
          <p className={`text-3xl font-bold ${isCredit ? "text-emerald-400" : "text-red-400"}`}>
            {isCredit ? "+" : "-"}{fmt(tx.amount)}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${TYPE_STYLES[tx.type] ?? "bg-white/5 text-muted-foreground border-border"}`}>
              {tx.type}
            </span>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${STATUS_STYLES[tx.status] ?? "bg-white/5 text-muted-foreground border-border"}`}>
              {tx.status}
            </span>
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

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AllTransactions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search,      setSearch]      = useState("");
  const [selectedTx,  setSelectedTx]  = useState(null);

  const [typeFilter,   setTypeFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [datePreset,  setDatePreset]  = useState(null);
  const [customFrom,  setCustomFrom]  = useState("");
  const [customTo,    setCustomTo]    = useState("");
  const [showCustom,  setShowCustom]  = useState(false);

  const [page,         setPage]         = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [total,        setTotal]        = useState(0);
  const [summary,      setSummary]      = useState(EMPTY_SUMMARY);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

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
        const params = { page, limit: PER_PAGE };
        if (typeFilter   !== "all") params.type   = typeFilter;
        if (statusFilter !== "all") params.status = statusFilter;
        const { from, to } = getDateRange();
        if (from) params.from = from;
        if (to)   params.to   = to;

        const { data } = await getAdminTransactions(params);
        if (!cancelled) {
          if (Array.isArray(data)) {
            setTransactions(data);
            setTotal(data.length);
            setSummary(EMPTY_SUMMARY);
          } else {
            setTransactions(data.transactions ?? []);
            setTotal(data.total ?? data.transactions?.length ?? 0);
            setSummary(data.summary ?? EMPTY_SUMMARY);
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load transactions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [page, typeFilter, statusFilter, datePreset, customFrom, customTo, showCustom]);

  const filtered = search
    ? transactions.filter((t) => {
        const userName = typeof t.user === "object" ? t.user?.name : "";
        const ref      = t.reference ?? "";
        const desc     = t.description ?? "";
        return (
          userName.toLowerCase().includes(search.toLowerCase()) ||
          ref.toLowerCase().includes(search.toLowerCase()) ||
          desc.toLowerCase().includes(search.toLowerCase())
        );
      })
    : transactions;

  const totalPages = Math.ceil(total / PER_PAGE);

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

  const showSummary = !!(datePreset || (showCustom && customFrom && customTo));

  const summaryCards = [
    { label: "Money In",           value: fmt(summary.totalIn),       icon: ArrowDownLeft,  color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Money Out (Debits)", value: fmt(summary.totalOut),      icon: ArrowUpRight,   color: "text-red-400",     bg: "bg-red-500/10"     },
    { label: "Transfers",          value: fmt(summary.totalTransfer), icon: ArrowRightLeft, color: "text-amber-400",   bg: "bg-amber-500/10"   },
    { label: "Pending",            value: fmt(summary.totalPending),  icon: Clock,          color: "text-amber-400",   bg: "bg-amber-500/10",
      sub: `${summary.countPending} txn${summary.countPending !== 1 ? "s" : ""}` },
    { label: "Failed",             value: fmt(summary.totalFailed),   icon: XCircle,        color: "text-red-400",     bg: "bg-red-500/10",
      sub: `${summary.countFailed} txn${summary.countFailed !== 1 ? "s" : ""}` },
  ];

  // Label shown in the type pill on each row
  function rowTypeLabel(t) {
    if (t.description?.toLowerCase().includes("admin wallet")) return "admin";
    return t.type;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Transactions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{total} transactions total</p>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search by user, reference or description…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-all" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            {/* Type */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium w-14">Type</span>
              {TYPE_FILTERS.map((f) => (
                <button key={f} onClick={() => { setTypeFilter(f); setPage(1); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${
                    typeFilter === f
                      ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                      : "bg-white/5 text-muted-foreground border-border hover:border-violet-500/40 hover:text-foreground"
                  }`}>{f}</button>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium w-14">Status</span>
              {STATUS_FILTERS.map((f) => (
                <button key={f} onClick={() => { setStatusFilter(f); setPage(1); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${
                    statusFilter === f
                      ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                      : "bg-white/5 text-muted-foreground border-border hover:border-violet-500/40 hover:text-foreground"
                  }`}>{f}</button>
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

          {/* Summary cards */}
          {showSummary && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
              {summaryCards.map((c) => (
                <div key={c.label} className="glass-card rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium truncate">{c.label}</p>
                    <p className="text-lg font-bold text-foreground truncate mt-0.5">{c.value}</p>
                    {c.sub && <p className="text-[11px] text-muted-foreground mt-0.5">{c.sub}</p>}
                  </div>
                  <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <c.icon className={`w-4 h-4 ${c.color}`} />
                  </div>
                </div>
              ))}
            </div>
          )}

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
                      <th className="text-left px-6 py-3.5 font-medium">Reference</th>
                      <th className="text-left px-4 py-3.5 font-medium">User</th>
                      <th className="text-left px-4 py-3.5 font-medium">Type</th>
                      <th className="text-left px-4 py-3.5 font-medium">Amount</th>
                      <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Status</th>
                      <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground text-sm">
                          No transactions match your filters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((t, i) => {
                        const userName  = typeof t.user === "object" ? t.user?.name  : "User";
                        const userEmail = typeof t.user === "object" ? t.user?.email : "";
                        const userId    = typeof t.user === "object" ? t.user?._id   : t.user;
                        const typeLabel = rowTypeLabel(t);
                        const isCredit  = t.type === "credit" || t.type === "transfer";
                        return (
                          <tr key={t._id}
                            onClick={() => setSelectedTx(t)}
                            className={`border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{t.reference ?? t._id?.slice(-8)}</td>
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
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${TYPE_STYLES[typeLabel] ?? "bg-white/5 text-muted-foreground border-border"}`}>
                                {typeLabel}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`font-bold ${isCredit ? "text-emerald-400" : "text-red-400"}`}>
                                {isCredit ? "+" : "-"}₦{Number(t.amount ?? 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_STYLES[t.status] ?? "bg-white/5 text-muted-foreground border-border"}`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-muted-foreground text-xs hidden lg:table-cell">{formatDate(t.createdAt)}</td>
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
      <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}
