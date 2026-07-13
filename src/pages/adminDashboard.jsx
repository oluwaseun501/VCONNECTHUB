import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import {
  Users,
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getAdminStats, getAdminOrders, getAdminTransactions } from "./adminApi";

const STATUS_STYLES = {
  PENDING:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  RECEIVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  FINISHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_ICON = {
  PENDING:  <Clock className="w-3 h-3" />,
  RECEIVED: <AlertCircle className="w-3 h-3" />,
  FINISHED: <CheckCircle2 className="w-3 h-3" />,
  CANCELED: <XCircle className="w-3 h-3" />,
};

const TYPE_STYLES = {
  credit:   "bg-emerald-500/10 text-emerald-400",
  debit:    "bg-red-500/10 text-red-400",
  fund:     "bg-blue-500/10 text-blue-400",
  purchase: "bg-violet-500/10 text-violet-400",
  transfer: "bg-amber-500/10 text-amber-400",
};

function fmt(n) {
  return `₦${Number(n).toLocaleString()}`;
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Separate state for total money in — fetched from all credit transactions if not in stats
  const [totalMoneyIn, setTotalMoneyIn] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, ordersRes, txRes] = await Promise.all([
          getAdminStats(),
          getAdminOrders({ page: 1, limit: 6 }),
          getAdminTransactions({ page: 1, limit: 7 }),
        ]);

        const statsData = statsRes.data;
        setStats(statsData);
        setOrders(ordersRes.data?.orders ?? ordersRes.data ?? []);
        setTransactions(txRes.data?.transactions ?? txRes.data ?? []);

        // Try to get total money in from stats first
        const moneyInFromStats =
          statsData?.totalFunded ??
          statsData?.totalMoneyIn ??
          statsData?.totalCredit ??
          statsData?.totalDeposited ??
          statsData?.totalCredited ??
          null;

        if (moneyInFromStats !== null) {
          setTotalMoneyIn(moneyInFromStats);
        } else {
          // Fallback: fetch all credit transactions and sum them
          try {
            const allCredits = await getAdminTransactions({ type: "credit", limit: 1000 });
            const list = allCredits.data?.transactions ?? allCredits.data ?? [];
            const sum = list
              .filter((t) => t.status === "successful")
              .reduce((acc, t) => acc + Number(t.amount ?? 0), 0);
            setTotalMoneyIn(sum);
          } catch {
            setTotalMoneyIn(0);
          }
        }
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const STATS = stats
    ? [
        {
          label: "Total Users",
          value: (stats.totalUsers ?? stats.users ?? 0).toLocaleString(),
          icon: Users,
          color: "text-violet-400",
          bg: "bg-violet-500/10",
        },
        {
          label: "Total Money In",
          value: fmt(totalMoneyIn),
          icon: Wallet,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
        },
        {
          label: "Total Revenue",
          value: fmt(stats.totalRevenue ?? stats.revenue ?? 0),
          icon: TrendingUp,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        },
        {
          label: "Numbers Purchased",
          value: (stats.totalOrders ?? stats.orders ?? 0).toLocaleString(),
          icon: ShoppingBag,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
        },
        {
          label: "Total Transactions",
          value: (stats.totalTransactions ?? stats.transactions ?? 0).toLocaleString(),
          icon: MessageSquare,
          color: "text-fuchsia-400",
          bg: "bg-fuchsia-500/10",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 space-y-6 overflow-auto pb-20">
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Overview</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Welcome back — here's what's happening today.</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
            </div>
          ) : (
            <>
              {/* Stat cards — 5 cards, wraps naturally */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center justify-between">
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium truncate">{s.label}</p>
                      <p className="text-2xl font-bold text-foreground truncate">{s.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0 ml-3`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom grid: Recent orders + Recent transactions */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Orders (2/3 width) */}
                <div className="xl:col-span-2 glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Recent Orders</h2>
                    <a href="/admin/numbers" className="text-xs text-violet-400 hover:underline">View all</a>
                  </div>
                  <div className="overflow-x-auto">
                    {orders.length === 0 ? (
                      <p className="px-6 py-10 text-center text-sm text-muted-foreground">No orders yet.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                            <th className="text-left px-6 py-3 font-medium">Order</th>
                            <th className="text-left px-4 py-3 font-medium">User</th>
                            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Service</th>
                            <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Amount</th>
                            <th className="text-left px-4 py-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o, i) => (
                            <tr key={o._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === orders.length - 1 ? "border-b-0" : ""}`}>
                              <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">#{o.orderId ?? o._id?.slice(-6)}</td>
                              <td className="px-4 py-3.5 font-medium text-foreground">
                                {typeof o.user === "object" ? o.user?.name : o.user}
                              </td>
                              <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell capitalize">{o.product}</td>
                              <td className="px-4 py-3.5 font-semibold text-foreground hidden lg:table-cell">₦{o.price}</td>
                              <td className="px-4 py-3.5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${STATUS_STYLES[o.status] ?? ""}`}>
                                  {STATUS_ICON[o.status]}
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Recent Transactions (1/3 width) */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Recent Transactions</h2>
                    <a href="/admin/transactions" className="text-xs text-violet-400 hover:underline">View all</a>
                  </div>
                  {transactions.length === 0 ? (
                    <p className="px-6 py-10 text-center text-sm text-muted-foreground">No transactions yet.</p>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {transactions.map((t) => (
                        <div key={t._id} className="px-6 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {typeof t.user === "object" ? t.user?.name : (t.user ?? "User")}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${TYPE_STYLES[t.type] ?? ""}`}>
                                {t.type}
                              </span>
                              <span className="text-[11px] text-muted-foreground">{timeAgo(t.createdAt)}</span>
                            </div>
                          </div>
                          <span className={`text-sm font-bold ml-3 flex-shrink-0 ${t.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                            {t.type === "credit" ? "+" : "-"}₦{Number(t.amount ?? 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
