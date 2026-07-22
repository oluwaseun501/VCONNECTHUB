import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import { Zap, Plus, Trash2, CheckCircle2, RefreshCw, Loader2, Pencil, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getSMMProviders, addSMMProvider, updateSMMProvider,
  activateSMMProvider, deleteSMMProvider,
  syncSMMServices, getSMMServices, updateSMMService, getSMMCategories,
  getAdminSettings  // ← already exists in your adminApi.js, no changes needed
} from "./adminApi";

export default function AdminSMMProviders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [form, setForm] = useState({ name: "", apiUrl: "", apiKey: "", markupPercent: 0, notes: "" });
  const [activeTab, setActiveTab] = useState("providers");
  const [usdToNgn, setUsdToNgn] = useState(1600); // ← NEW: NGN rate

  // Load providers + NGN rate
  const loadProviders = async () => {
    try {
      const [pRes, cfgRes] = await Promise.all([
        getSMMProviders(),
        getAdminSettings(),  // ← already in your adminApi.js
      ]);
      const providerData = pRes.data;
      setProviders(Array.isArray(providerData) ? providerData : providerData?.providers ?? []);
      if (cfgRes.data?.usdToNgn) setUsdToNgn(cfgRes.data.usdToNgn); // ← store rate
    } catch {
      setError("Failed to load providers.");
    } finally {
      setLoading(false);
    }
  };

  // Load services (paginated)
  const loadServices = useCallback(async (p = page, s = search, c = category) => {
    setServicesLoading(true);
    try {
      const sRes = await getSMMServices({ page: p, limit: 50, search: s, category: c });
      const data = sRes.data;
      setServices(data.services ?? []);
      setTotalServices(data.total ?? 0);
      setTotalPages(data.pages ?? 1);
    } catch {
      setError("Failed to load services.");
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Load categories for filter dropdown
  const loadCategories = async () => {
    try {
      const res = await getSMMCategories();
      setCategories(res.data ?? []);
    } catch { /* non-critical */ }
  };

  useEffect(() => { loadProviders(); }, []);

  useEffect(() => {
    if (activeTab === "services") {
      loadServices(1, "", "");
      loadCategories();
      setPage(1);
      setSearch("");
      setCategory("");
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "services") return;
    const t = setTimeout(() => {
      setPage(1);
      loadServices(1, search, category);
    }, 400);
    return () => clearTimeout(t);
  }, [search, category]);

  const notify = (msg, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProvider) {
        await updateSMMProvider(editingProvider._id, form);
        notify("Provider updated");
      } else {
        await addSMMProvider(form);
        notify("Provider added");
      }
      setShowForm(false);
      setEditingProvider(null);
      setForm({ name: "", apiUrl: "", apiKey: "", markupPercent: 0, notes: "" });
      loadProviders();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to save provider", true);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateSMMProvider(id);
      notify("Provider activated");
      loadProviders();
    } catch {
      notify("Failed to activate", true);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this provider and all its services?")) return;
    try {
      await deleteSMMProvider(id);
      notify("Provider deleted");
      loadProviders();
    } catch {
      notify("Failed to delete", true);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncSMMServices();
      notify(res.data.message);
      loadServices(1, search, category);
    } catch (err) {
      notify(err.response?.data?.message || "Sync failed", true);
    } finally {
      setSyncing(false);
    }
  };

  const handleServiceUpdate = async (id, field, value) => {
    try {
      await updateSMMService(id, { [field]: value });
      setServices(prev => prev.map(s => s._id === id ? { ...s, [field]: value } : s));
    } catch {
      notify("Failed to update service", true);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadServices(newPage, search, category);
  };

  const openEdit = (p) => {
    setEditingProvider(p);
    setForm({ name: p.name, apiUrl: p.apiUrl, apiKey: "", markupPercent: p.markupPercent, notes: p.notes || "" });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 space-y-6 overflow-auto pb-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">SMM Providers</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage boosting API providers and service pricing.</p>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditingProvider(null); setForm({ name: "", apiUrl: "", apiKey: "", markupPercent: 0, notes: "" }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Provider
            </button>
          </div>

          {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          {success && <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{success}</div>}

          {/* Add/Edit Form */}
          {showForm && (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">{editingProvider ? "Edit Provider" : "Add Provider"}</h2>
                <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500"
                    placeholder="e.g. SMMRaja" required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">API URL</label>
                  <input value={form.apiUrl} onChange={e => setForm({ ...form, apiUrl: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500"
                    placeholder="https://www.smmraja.com/api/v3" required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">API Key</label>
                  <input value={form.apiKey} onChange={e => setForm({ ...form, apiKey: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500"
                    placeholder={editingProvider ? "Leave blank to keep current" : "Your API key"} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Markup %</label>
                  <input type="number" value={form.markupPercent} onChange={e => setForm({ ...form, markupPercent: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500"
                    placeholder="e.g. 20" min="0" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Notes (optional)</label>
                  <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500"
                    placeholder="Any notes..." />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
                    {editingProvider ? "Update" : "Add Provider"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            {["providers", "services"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-violet-500 text-violet-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
            </div>
          ) : activeTab === "providers" ? (
            /* Providers Table */
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                {providers.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-muted-foreground">No providers yet. Add one above.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left px-6 py-3 font-medium">Name</th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">API URL</th>
                        <th className="text-left px-4 py-3 font-medium">Markup</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                        <th className="text-left px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {providers.map((p, i) => (
                        <tr key={p._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === providers.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-6 py-3.5 font-medium text-foreground">{p.name}</td>
                          <td className="px-4 py-3.5 text-muted-foreground text-xs hidden md:table-cell truncate max-w-[200px]">{p.apiUrl}</td>
                          <td className="px-4 py-3.5 text-foreground">{p.markupPercent}%</td>
                          <td className="px-4 py-3.5">
                            {p.isActive
                              ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Active</span>
                              : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-muted text-muted-foreground">Inactive</span>
                            }
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              {!p.isActive && (
                                <button onClick={() => handleActivate(p._id)}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors font-medium">
                                  Activate
                                </button>
                              )}
                              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            /* Services Tab */
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <p className="text-sm text-muted-foreground">
                  {totalServices.toLocaleString()} services synced
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search services..."
                      className="pl-8 pr-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500 w-44"
                    />
                  </div>
                  <select
                    value={category}
                    onChange={e => { setCategory(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500 max-w-[180px]"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleSync} disabled={syncing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60">
                    {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {syncing ? "Syncing..." : "Sync Services"}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  {servicesLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                    </div>
                  ) : services.length === 0 ? (
                    <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                      {search || category ? "No services match your search." : "No services yet. Activate a provider and click Sync."}
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                          <th className="text-left px-6 py-3 font-medium">Service</th>
                          <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                          <th className="text-left px-4 py-3 font-medium">Provider Price</th>
                          <th className="text-left px-4 py-3 font-medium">Your Price (USD)</th>
                          {/* ← NEW column */}
                          <th className="text-left px-4 py-3 font-medium text-emerald-400">User Sees (₦)</th>
                          <th className="text-left px-4 py-3 font-medium">Enabled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((s, i) => (
                          <tr key={s._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === services.length - 1 ? "border-b-0" : ""}`}>
                            <td className="px-6 py-3.5 text-foreground max-w-[200px] truncate" title={s.name}>{s.name}</td>
                            <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell text-xs">{s.category}</td>
                            <td className="px-4 py-3.5 text-muted-foreground">${s.providerPrice}</td>
                            <td className="px-4 py-3.5">
                              <input
                                type="number"
                                defaultValue={s.customPrice}
                                step="0.01"
                                onBlur={e => handleServiceUpdate(s._id, "customPrice", parseFloat(e.target.value))}
                                className="w-24 px-2 py-1 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-violet-500"
                              />
                            </td>
                            {/* ← NEW: NGN equivalent — read-only, so admin can see what users are charged */}
                            <td className="px-4 py-3.5 text-emerald-400 font-medium">
                              ₦{(s.customPrice * usdToNgn).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => handleServiceUpdate(s._id, "isEnabled", !s.isEnabled)}
                                className={`w-10 h-5 rounded-full transition-colors ${s.isEnabled ? "bg-violet-600" : "bg-muted"} relative`}>
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${s.isEnabled ? "left-5" : "left-0.5"}`} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Page {page} of {totalPages} ({totalServices.toLocaleString()} total)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/*
 * ─── ONE THING TO ADD IN adminApi.js ────────────────────────────────────────
 * Add this function so the component can fetch the NGN rate:
 *
 *   export const getSiteConfig = () => api.get("/api/settings");
 *
 * Replace "/api/settings" with whatever route exposes your SiteConfig
 * (the same one your virtual number admin uses to set usdToNgn).
 * ─────────────────────────────────────────────────────────────────────────────
 */
