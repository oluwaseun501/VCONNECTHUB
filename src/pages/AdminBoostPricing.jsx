import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { getSMMServices, updateSMMService, syncSMMServices } from "./adminApi";

export default function AdminBoostPricing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editedPrices, setEditedPrices] = useState({});

  const notify = (msg, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3000);
  };

  const load = async () => {
    try {
      const res = await getSMMServices();
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.services ?? [];
      setServices(list);
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const categories = ["All", ...new Set(services.map(s => s.category).filter(Boolean))];

  const filtered = services.filter(s => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePriceChange = (id, value) => {
    setEditedPrices(prev => ({ ...prev, [id]: value }));
  };

  const handleSavePrice = async (id) => {
    const newPrice = parseFloat(editedPrices[id]);
    if (isNaN(newPrice) || newPrice < 0) return notify("Invalid price", true);
    try {
      await updateSMMService(id, { customPrice: newPrice });
      setServices(prev => prev.map(s => s._id === id ? { ...s, customPrice: newPrice } : s));
      setEditedPrices(prev => { const p = { ...prev }; delete p[id]; return p; });
      notify("Price updated");
    } catch {
      notify("Failed to update price", true);
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await updateSMMService(id, { isEnabled: !current });
      setServices(prev => prev.map(s => s._id === id ? { ...s, isEnabled: !current } : s));
    } catch {
      notify("Failed to update", true);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncSMMServices();
      notify(res.data.message);
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Sync failed", true);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 space-y-6 overflow-auto pb-20">

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Boost Pricing</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Set your selling price for each boosting service. Provider price shown for reference.
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {syncing ? "Syncing..." : "Sync from Provider"}
            </button>
          </div>

          {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          {success && <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{success}</div>}

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500 w-64"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                {filtered.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No services found. Go to SMM Providers and sync services first.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left px-6 py-3 font-medium">Service</th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                        <th className="text-left px-4 py-3 font-medium">Provider Price</th>
                        <th className="text-left px-4 py-3 font-medium">Your Price</th>
                        <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Min / Max</th>
                        <th className="text-left px-4 py-3 font-medium">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s, i) => {
                        const isEdited = editedPrices[s._id] !== undefined;
                        return (
                          <tr key={s._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                            <td className="px-6 py-3.5 text-foreground font-medium max-w-[200px]">
                              <span className="block truncate">{s.name}</span>
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell">{s.category}</td>
                            <td className="px-4 py-3.5 text-muted-foreground">${s.providerPrice}/1k</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={isEdited ? editedPrices[s._id] : s.customPrice}
                                  onChange={e => handlePriceChange(s._id, e.target.value)}
                                  className="w-24 px-2 py-1.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500"
                                />
                                {isEdited && (
                                  <button
                                    onClick={() => handleSavePrice(s._id)}
                                    className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground text-xs hidden lg:table-cell">
                              {s.minOrder?.toLocaleString()} / {s.maxOrder?.toLocaleString()}
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => handleToggle(s._id, s.isEnabled)}
                                className={`w-10 h-5 rounded-full transition-colors relative ${s.isEnabled ? "bg-violet-600" : "bg-muted"}`}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${s.isEnabled ? "left-5" : "left-0.5"}`} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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