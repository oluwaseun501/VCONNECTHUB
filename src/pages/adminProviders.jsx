import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import { Plug2, Plus, Trash2, CheckCircle2, Pencil, X, Loader2, AlertCircle } from "lucide-react";
import { getProviders, addProvider, updateProvider, activateProvider, deleteProvider } from "./adminApi";

const EMPTY_FORM = { name: "", apiKey: "", baseUrl: "https://5sim.net/v1", markupPercent: 0, notes: "" };

export default function AdminProviders() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [providers, setProviders]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [showForm, setShowForm]         = useState(false);
  const [editing, setEditing]           = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [activating, setActivating]     = useState(null);
  const [deleting, setDeleting]         = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await getProviders();
      setProviders(res.data ?? []);
    } catch {
      setError("Failed to load providers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(provider) {
    setEditing(provider);
    setForm({
      name:          provider.name ?? "",
      apiKey:        provider.apiKey ?? "", // will show masked value e.g. ••••••abc123
      baseUrl:       provider.baseUrl ?? "",
      markupPercent: provider.markupPercent ?? 0,
      notes:         provider.notes ?? "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        const payload = {
          name:          form.name,
          baseUrl:       form.baseUrl,
          markupPercent: form.markupPercent,
          notes:         form.notes,
        };
        // Only include apiKey if the user actually typed a new one (not the masked value)
        if (form.apiKey && !form.apiKey.includes("•")) {
          payload.apiKey = form.apiKey;
        }
        await updateProvider(editing._id, payload);
      } else {
        await addProvider(form);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save provider.");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(id) {
    setActivating(id);
    setError("");
    try {
      await activateProvider(id);
      await load();
    } catch {
      setError("Failed to activate provider.");
    } finally {
      setActivating(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this provider? This cannot be undone.")) return;
    setDeleting(id);
    setError("");
    try {
      await deleteProvider(id);
      await load();
    } catch {
      setError("Failed to delete provider.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">API Providers</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage virtual number providers. Only one can be active at a time.
              </p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Provider
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
            </div>
          ) : providers.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <Plug2 className="w-7 h-7 text-violet-400" />
              </div>
              <p className="font-semibold text-foreground">No providers yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first virtual number provider to get started.
              </p>
              <button
                onClick={openAdd}
                className="mt-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
              >
                Add Provider
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {providers.map((p) => (
                <div
                  key={p._id}
                  className={`glass-card rounded-2xl p-5 space-y-4 border-2 transition-colors ${
                    p.isActive ? "border-violet-500/40" : "border-transparent"
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <Plug2 className="w-5 h-5 text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{p.name}</p>
                        {p.notes && (
                          <p className="text-xs text-muted-foreground truncate">{p.notes}</p>
                        )}
                      </div>
                    </div>
                    {p.isActive && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wide flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Masked API key */}
                  <div className="px-3 py-2 rounded-lg bg-muted/50 font-mono text-xs text-muted-foreground truncate">
                    {p.apiKey}
                  </div>

                  {/* Base URL + markup */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground truncate">{p.baseUrl}</p>
                    {p.markupPercent > 0 && (
                      <p className="text-xs text-amber-400">Markup: {p.markupPercent}%</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {!p.isActive && (
                      <button
                        onClick={() => handleActivate(p._id)}
                        disabled={activating === p._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {activating === p._id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <CheckCircle2 className="w-3 h-3" />}
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(p)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deleting === p._id}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {deleting === p._id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Trash2 className="w-3 h-3" />}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">
                {editing ? "Edit Provider" : "Add Provider"}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Provider Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 5sim"
                  className="w-full h-10 px-3 rounded-lg text-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  API Key *
                </label>
                <input
                  required={!editing}
                  value={form.apiKey}
                  onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                  placeholder={editing ? "Leave unchanged or enter new key" : "Enter API key"}
                  className="w-full h-10 px-3 rounded-lg text-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500 transition-colors font-mono"
                />
                {editing && (
                  <p className="text-[11px] text-muted-foreground">
                    Showing masked key. Type a new key to replace it.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Base URL *
                </label>
                <input
                  required
                  value={form.baseUrl}
                  onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                  placeholder="e.g. https://5sim.net/v1"
                  className="w-full h-10 px-3 rounded-lg text-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Markup %
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.markupPercent}
                  onChange={(e) => setForm({ ...form, markupPercent: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full h-10 px-3 rounded-lg text-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Notes
                </label>
                <input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional note"
                  className="w-full h-10 px-3 rounded-lg text-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editing ? "Save Changes" : "Add Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}