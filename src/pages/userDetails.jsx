import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import {
  ArrowLeft, Mail, Wallet, ShoppingBag, Calendar, Shield, ShieldOff,
  Trash2, Plus, Ban, CheckCircle2, ChevronRight, X, AlertTriangle,
  Phone, Hash, CreditCard, Activity, Clock, TrendingUp, TrendingDown,
  RefreshCw, Lock, Loader2,
} from "lucide-react";
import {
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
  fundUserWallet,
  debitUserWallet,
  getAdminTransactions,
  getAdminOrders,
  getAllBoostOrders,   
  sendPasswordReset,
} from "./adminApi";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-fuchsia-500", "bg-amber-500",
  "bg-emerald-500", "bg-blue-500", "bg-rose-500",
];

function colorFor(id) {
  const hash = String(id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "??";
}

function fmt(n) { return `₦${Number(n).toLocaleString()}`; }

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

const TABS = ["Overview", "Transactions", "Numbers Purchased", "Boost Orders", "Danger Zone"];

// ── Confirm modal ──────────────────────────────────────────────────────
function ConfirmModal({ title, description, confirmLabel, confirmClass, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel} disabled={loading} className="flex-1 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:bg-white/5 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${confirmClass}`}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Funds modal ────────────────────────────────────────────────────
function AddFundsModal({ user, onConfirm, onCancel, loading }) {
  const [amount, setAmount] = useState("");
  const quick = ["500", "1000", "2000", "5000"];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm glass-card rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground text-lg">Add Funds</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className={`w-9 h-9 rounded-full ${colorFor(user._id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {getInitials(user.name)}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">Current balance: {fmt(user.balance)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Amount (₦)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">₦</span>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 pl-8 pr-4 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all"
            />
          </div>
          <div className="flex gap-2">
            {quick.map((q) => (
              <button key={q} onClick={() => setAmount(q)}
                className={`flex-1 h-8 rounded-lg text-xs font-semibold border transition-colors ${amount === q ? "bg-violet-500/20 text-violet-300 border-violet-500/40" : "border-border text-muted-foreground hover:bg-white/5"}`}>
                ₦{q}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading} className="flex-1 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:bg-white/5 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            disabled={!amount || isNaN(amount) || Number(amount) <= 0 || loading}
            onClick={() => onConfirm(Number(amount))}
            className="flex-1 h-10 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Add ${amount ? fmt(amount) : "Funds"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status / type chips ───────────────────────────────────────────────
function TxnStatus({ status }) {
  const map = {
    successful: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
    failed:     "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}

function TypeChip({ type }) {
  const map = {
    credit:   "bg-emerald-500/10 text-emerald-400",
    debit:    "bg-red-500/10 text-red-400",
    fund:     "bg-blue-500/10 text-blue-400",
    purchase: "bg-violet-500/10 text-violet-400",
    transfer: "bg-amber-500/10 text-amber-400",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${map[type] || ""}`}>
      {type}
    </span>
  );
}

const ORDER_STATUS_STYLES = {
  PENDING:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  RECEIVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  FINISHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELED: "bg-red-500/10 text-red-400 border-red-500/20",
};

// ── Main component ─────────────────────────────────────────────────────
export default function UserDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [boostOrders, setBoostOrders] = useState([]);
const [boostLoading, setBoostLoading] = useState(false);

  // Modal state
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = "emerald") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // Load user
  useEffect(() => {
    async function load() {
      setUserLoading(true);
      setUserError("");
      try {
        const { data } = await getAdminUser(id);
        // API may return { user: {...} } or the object directly
        const raw = data?.user ?? data;
        // Normalize field variants so UI always has consistent keys
        setUser({
          ...raw,
          balance:         raw.balance         ?? raw.walletBalance ?? 0,
          hasPin:          raw.hasPin          ?? raw.hasTransactionPin ?? raw.pin ?? false,
          isEmailVerified: raw.isEmailVerified ?? raw.emailVerified  ?? false,
          isBanned:        raw.isBanned        ?? raw.banned         ?? false,
          isAdmin:         raw.isAdmin         ?? raw.admin          ?? false,
          orders:          raw.orders          ?? raw.totalOrders    ?? 0,
          totalSpent:      raw.totalSpent      ?? raw.amountSpent    ?? 0,
        });
      } catch (err) {
        setUserError("Failed to load user.");
      } finally {
        setUserLoading(false);
      }
    }
    load();
  }, [id]);

  // Load transactions when tab switches to Transactions
  useEffect(() => {
    if (activeTab !== "Transactions" || transactions.length > 0) return;
    async function load() {
      setTxLoading(true);
      try {
        // Fetch all transactions and filter by this user's _id
        const { data } = await getAdminTransactions({ limit: 100 });
        const list = Array.isArray(data) ? data : (data.transactions ?? []);
        setTransactions(list.filter((t) => {
          const uid = typeof t.user === "object" ? t.user?._id : t.user;
          return uid === id;
        }));
      } catch {}
      setTxLoading(false);
    }
    load();
  }, [activeTab, id]);

  // Load orders when tab switches to Numbers Purchased
  useEffect(() => {
    if (activeTab !== "Numbers Purchased" || orders.length > 0) return;
    async function load() {
      setOrdersLoading(true);
      try {
        const { data } = await getAdminOrders({ limit: 100 });
        const list = Array.isArray(data) ? data : (data.orders ?? []);
        setOrders(list.filter((o) => {
          const uid = typeof o.user === "object" ? o.user?._id : o.user;
          return uid === id;
        }));
      } catch {}
      setOrdersLoading(false);
    }
    load();
  }, [activeTab, id]);

    useEffect(() => {
    if (activeTab !== "Boost Orders" || boostOrders.length > 0) return;
    async function load() {
      setBoostLoading(true);
      try {
        const { data } = await getAllBoostOrders({ limit: 100 });
        const list = Array.isArray(data) ? data : (data.orders ?? []);
        setBoostOrders(list.filter((o) => {
          const uid = typeof o.user === "object" ? o.user?._id : o.user;
          return uid === id;
        }));
      } catch {}
      setBoostLoading(false);
    }
    load();
  }, [activeTab, id]);

  // ── Action handlers ──
  const handleAddFunds = async (amount) => {
    setActionLoading(true);
    try {
      await fundUserWallet(id, amount);
      setUser((u) => ({ ...u, balance: (u.balance ?? 0) + amount }));
      setModal(null);
      showToast(`${fmt(amount)} added to ${user.name}'s account`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add funds.", "red");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBan = async () => {
    setActionLoading(true);
    try {
      await updateAdminUser(id, { isBanned: true });
      setUser((u) => ({ ...u, isBanned: true }));
      setModal(null);
      showToast(`${user.name} has been banned`, "red");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to ban user.", "red");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async () => {
    setActionLoading(true);
    try {
      await updateAdminUser(id, { isBanned: false });
      setUser((u) => ({ ...u, isBanned: false }));
      setModal(null);
      showToast(`${user.name} has been unbanned`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to unban user.", "red");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteAdminUser(id);
      setModal(null);
      showToast(`${user.name}'s account deleted`, "red");
      setTimeout(() => setLocation("/admin/users"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete user.", "red");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setActionLoading(true);
    try {
      await updateAdminUser(id, { isAdmin: true });
      setUser((u) => ({ ...u, isAdmin: true }));
      setModal(null);
      showToast(`${user.name} upgraded to Admin`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to upgrade user.", "red");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDowngrade = async () => {
    setActionLoading(true);
    try {
      await updateAdminUser(id, { isAdmin: false });
      setUser((u) => ({ ...u, isAdmin: false }));
      setModal(null);
      showToast(`${user.name} downgraded to User`, "amber");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to downgrade user.", "red");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setActionLoading(true);
    try {
      await sendPasswordReset(user.email);
      setModal(null);
      showToast(`Password reset email sent to ${user.email}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send reset email.", "red");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Loading / Error states ──
  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-foreground font-semibold">{userError || "User not found"}</p>
          <button onClick={() => setLocation("/admin/users")} className="text-sm text-violet-400 hover:underline">
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  const avatarColor = colorFor(user._id);
  const isAdmin = user.isAdmin ?? false;
  const isBanned = user.isBanned ?? false;
  

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* ── Back + breadcrumb ── */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={() => setLocation("/admin/users")}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Users
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{user.name}</span>
          </div>

          {/* ── Profile header ── */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className={`w-20 h-20 rounded-2xl ${avatarColor} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
                {getInitials(user.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-violet-500/15 text-violet-300 border border-violet-500/30">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                    isBanned
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}>
                    {isBanned ? "banned" : "active"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </p>
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setModal("addFunds")}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Funds
                </button>
                <button
                  onClick={() => setModal(isBanned ? "unban" : "ban")}
                  className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold border transition-colors ${
                    isBanned
                      ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  {isBanned ? <><CheckCircle2 className="w-4 h-4" /> Unban</> : <><Ban className="w-4 h-4" /> Ban</>}
                </button>
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Balance",     value: fmt(user.balance ?? 0),    icon: Wallet,     color: "text-violet-400" },
                { label: "Total Spent", value: fmt(user.totalSpent ?? 0),  icon: TrendingUp, color: "text-fuchsia-400" },
                { label: "Orders",      value: user.orders ?? 0,           icon: ShoppingBag,color: "text-blue-400" },
                { label: "Account",     value: isBanned ? "Banned" : "Active", icon: Shield, color: "text-emerald-400" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-2 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-border w-fit overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Tab: Overview ── */}
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Info */}
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" /> Account Information
                </h2>
                <div className="space-y-3">
                  {[
                    { icon: Hash,   label: "User ID",  value: user._id },
                    { icon: Mail,   label: "Email",    value: user.email },
                    { icon: Shield, label: "Role",     value: isAdmin ? "Administrator" : "Standard User" },
                    { icon: Clock,  label: "Joined",   value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{label}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground truncate max-w-[180px]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avatar info */}
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-fuchsia-400" /> Wallet Overview
                </h2>
                <div className="space-y-3">
                  {[
                    { label: "Current Balance",  value: fmt(user.balance ?? 0) },
                    { label: "Total Spent",       value: fmt(user.totalSpent ?? 0) },
                    { label: "Total Orders",      value: user.orders ?? 0 },
                    { label: "Account Status",    value: isBanned ? "Banned" : "Active" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Transactions ── */}
          {activeTab === "Transactions" && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">All Transactions</h2>
                <span className="text-xs text-muted-foreground">{transactions.length} records</span>
              </div>
              {txLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left px-6 py-3.5 font-medium">Reference</th>
                        <th className="text-left px-4 py-3.5 font-medium">Type</th>
                        <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Description</th>
                        <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Date</th>
                        <th className="text-left px-4 py-3.5 font-medium">Status</th>
                        <th className="text-right px-6 py-3.5 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground text-sm">No transactions found.</td>
                        </tr>
                      ) : (
                        transactions.map((t, i) => (
                          <tr key={t._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === transactions.length - 1 ? "border-b-0" : ""}`}>
                            <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{t.reference ?? t._id?.slice(-8)}</td>
                            <td className="px-4 py-3.5"><TypeChip type={t.type} /></td>
                            <td className="px-4 py-3.5 text-foreground text-xs hidden md:table-cell max-w-[200px] truncate">{t.description}</td>
                            <td className="px-4 py-3.5 text-muted-foreground text-xs hidden lg:table-cell">{formatDate(t.createdAt)}</td>
                            <td className="px-4 py-3.5"><TxnStatus status={t.status} /></td>
                            <td className={`px-6 py-3.5 text-right font-bold ${t.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                              {t.type === "credit" ? "+" : "-"}₦{(t.amount ?? 0).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Numbers Purchased ── */}
          {activeTab === "Numbers Purchased" && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Numbers Purchased</h2>
                <span className="text-xs text-muted-foreground">{orders.length} orders</span>
              </div>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left px-6 py-3.5 font-medium">Order ID</th>
                        <th className="text-left px-4 py-3.5 font-medium">Number</th>
                        <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Service</th>
                        <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Country</th>
                        <th className="text-left px-4 py-3.5 font-medium">Status</th>
                        <th className="text-right px-6 py-3.5 font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground text-sm">No orders found.</td>
                        </tr>
                      ) : (
                        orders.map((o, i) => (
                          <tr key={o._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === orders.length - 1 ? "border-b-0" : ""}`}>
                            <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">#{o.orderId}</td>
                            <td className="px-4 py-3.5 font-mono text-sm text-foreground">{o.phone}</td>
                            <td className="px-4 py-3.5 text-foreground capitalize hidden md:table-cell">{o.product}</td>
                            <td className="px-4 py-3.5 text-muted-foreground hidden lg:table-cell capitalize">{o.country}</td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${ORDER_STATUS_STYLES[o.status] ?? ""}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right font-semibold text-foreground">₦{o.price}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          

          {/* ── Tab: Boost Orders ── */}
{activeTab === "Boost Orders" && (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
      <h2 className="font-semibold text-foreground">Boost Orders</h2>
      <span className="text-xs text-muted-foreground">{boostOrders.length} orders</span>
    </div>
    {boostLoading ? (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="text-left px-6 py-3.5 font-medium">Order ID</th>
              <th className="text-left px-4 py-3.5 font-medium">Service</th>
              <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Link</th>
              <th className="text-left px-4 py-3.5 font-medium">Qty</th>
              <th className="text-left px-4 py-3.5 font-medium">Status</th>
              <th className="text-right px-6 py-3.5 font-medium">Charge</th>
            </tr>
          </thead>
          <tbody>
            {boostOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground text-sm">
                  No boost orders found.
                </td>
              </tr>
            ) : (
              boostOrders.map((o, i) => (
                <tr key={o._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === boostOrders.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">#{o._id?.slice(-8)}</td>
                  <td className="px-4 py-3.5 text-foreground text-xs max-w-[160px] truncate">
                    {typeof o.service === "object" ? o.service?.name : o.serviceName ?? "—"}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs hidden md:table-cell max-w-[160px] truncate">
                    <a href={o.link} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">
                      {o.link}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-foreground">{o.quantity?.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${ORDER_STATUS_STYLES[o.status] ?? "bg-white/5 text-muted-foreground border-border"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-bold text-red-400">
                    -{fmt(o.charge ?? o.totalPrice ?? 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

          {/* ── Tab: Danger Zone ── */}
          {activeTab === "Danger Zone" && (
            <div className="space-y-4 max-w-2xl">

              {/* Upgrade / Downgrade Role */}
              <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {isAdmin ? "Downgrade to User" : "Upgrade to Admin"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {isAdmin
                        ? "Remove admin privileges. User will lose access to the admin panel."
                        : "Grant admin privileges. User will have full access to the admin panel."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModal(isAdmin ? "downgradeAdmin" : "upgradeAdmin")}
                  className={`h-9 px-5 rounded-xl text-sm font-semibold border transition-colors flex-shrink-0 ${
                    isAdmin
                      ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      : "border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                  }`}
                >
                  {isAdmin ? "Downgrade" : "Upgrade to Admin"}
                </button>
              </div>

              {/* Reset Password */}
              <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Reset Password</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Send a password reset email to {user.email}.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModal("resetPassword")}
                  className="h-9 px-5 rounded-xl text-sm font-semibold border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors flex-shrink-0"
                >
                  Send Reset Email
                </button>
              </div>

              {/* Ban / Unban */}
              <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isBanned ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                    {isBanned ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Ban className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {isBanned ? "Unban Account" : "Ban Account"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {isBanned
                        ? "Restore access and allow the user to log in again."
                        : "Prevent this user from logging in or using any services."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModal(isBanned ? "unban" : "ban")}
                  className={`h-9 px-5 rounded-xl text-sm font-semibold border transition-colors flex-shrink-0 ${
                    isBanned
                      ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  {isBanned ? "Unban User" : "Ban User"}
                </button>
              </div>

              {/* Delete Account */}
              <div className="glass-card rounded-2xl p-5 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-400">Delete Account</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Permanently delete this account and all associated data. This cannot be undone.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModal("delete")}
                  className="h-9 px-5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors flex-shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Modals ── */}
      {modal === "addFunds" && (
        <AddFundsModal user={user} onConfirm={handleAddFunds} onCancel={() => setModal(null)} loading={actionLoading} />
      )}
      {modal === "ban" && (
        <ConfirmModal
          title="Ban this user?"
          description={`${user.name} will lose access to the platform immediately.`}
          confirmLabel="Yes, Ban User"
          confirmClass="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
          onConfirm={handleBan}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}
      {modal === "unban" && (
        <ConfirmModal
          title="Unban this user?"
          description={`${user.name} will regain full access to the platform.`}
          confirmLabel="Yes, Unban User"
          confirmClass="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
          onConfirm={handleUnban}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}
      {modal === "upgradeAdmin" && (
        <ConfirmModal
          title="Upgrade to Admin?"
          description={`${user.name} will have full access to the admin panel and all admin actions.`}
          confirmLabel="Yes, Upgrade"
          confirmClass="bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20"
          onConfirm={handleUpgrade}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}
      {modal === "downgradeAdmin" && (
        <ConfirmModal
          title="Downgrade to User?"
          description={`${user.name} will lose all admin privileges and access to the admin panel.`}
          confirmLabel="Yes, Downgrade"
          confirmClass="bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
          onConfirm={handleDowngrade}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}
      {modal === "resetPassword" && (
        <ConfirmModal
          title="Send password reset?"
          description={`A reset link will be sent to ${user.email}.`}
          confirmLabel="Send Email"
          confirmClass="bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20"
          onConfirm={handleResetPassword}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}
      {modal === "delete" && (
        <ConfirmModal
          title="Delete account permanently?"
          description={`All data for ${user.name} will be erased. This action cannot be undone.`}
          confirmLabel="Delete Forever"
          confirmClass="bg-red-600 text-white hover:bg-red-500"
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[70] px-5 py-3 rounded-xl text-sm font-medium shadow-lg border backdrop-blur-sm transition-all ${
          toast.color === "red"   ? "bg-red-500/10 text-red-300 border-red-500/20" :
          toast.color === "amber" ? "bg-amber-500/10 text-amber-300 border-amber-500/20" :
          "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
