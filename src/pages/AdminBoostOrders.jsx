import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import { Loader2, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { getAdminBoostOrders } from "./adminApi";

const STATUS_STYLES = {
  pending:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed:     "bg-red-500/10 text-red-400 border-red-500/20",
  cancelled:  "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_ICON = {
  pending:    <Clock className="w-3 h-3" />,
  processing: <AlertCircle className="w-3 h-3" />,
  completed:  <CheckCircle2 className="w-3 h-3" />,
  failed:     <XCircle className="w-3 h-3" />,
  cancelled:  <XCircle className="w-3 h-3" />,
};

export default function AdminBoostOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminBoostOrders()
      .then(res => setOrders(res.data?.orders ?? []))
      .catch(() => setError("Failed to load boost orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 space-y-6 overflow-auto pb-20">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Boost Orders</h1>
            <p className="text-sm text-muted-foreground mt-0.5">All customer social media boosting orders.</p>
          </div>

          {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                {orders.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-muted-foreground">No boost orders yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left px-6 py-3 font-medium">User</th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Service</th>
                        <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Link</th>
                        <th className="text-left px-4 py-3 font-medium">Qty</th>
                        <th className="text-left px-4 py-3 font-medium">Amount</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o, i) => (
                        <tr key={o._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === orders.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-6 py-3.5 font-medium text-foreground">
                            <div>{o.user?.name ?? "—"}</div>
                            <div className="text-xs text-muted-foreground">{o.user?.email}</div>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell">{o.service?.name ?? "—"}</td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            <a href={o.link} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline text-xs truncate max-w-[150px] block">{o.link}</a>
                          </td>
                          <td className="px-4 py-3.5 text-foreground">{o.quantity?.toLocaleString()}</td>
                          <td className="px-4 py-3.5 font-semibold text-foreground">${o.amount}</td>
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
          )}
        </main>
      </div>
    </div>
  );
}