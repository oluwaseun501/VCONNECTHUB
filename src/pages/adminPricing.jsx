import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import { DollarSign, Plus, Trash2, Loader2, AlertCircle, X, Search } from "lucide-react";
import { getPriceOverrides, upsertPriceOverride, deletePriceOverride } from "./adminApi";
import api from "@/lib/axios";

export default function AdminPricing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overrides, setOverrides]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  // Country + service pickers
  const [countries, setCountries]         = useState([]);
  const [services, setServices]           = useState([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);

  // Modal
  const [showModal, setShowModal]       = useState(false);
  const [modalService, setModalService] = useState(null);
  const [customPrice, setCustomPrice]   = useState("");
  const [saving, setSaving]             = useState(false);
  const [deleting, setDeleting]         = useState(null);

  async function loadOverrides() {
    try {
      setLoading(true);
      const res = await getPriceOverrides();
      setOverrides(res.data ?? []);
    } catch { setError("Failed to load overrides."); }
    finally  { setLoading(false); }
  }

  useEffect(() => { loadOverrides(); }, []);

  // Load countries
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/numbers/countries");
        const list = Object.entries(data).map(([key, val]) => ({
          id: key, name: val.text || key,
        }));
        setCountries(list);
        if (list.length) setSelectedCountry(list[0]);
      } catch {}
    })();
  }, []);

  // Load services when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    setLoadingServices(true);
    setServices([]);
    (async () => {
      try {
        const { data } = await api.get(`/api/numbers/products/${selectedCountry.id}/any`);
        const list = Object.entries(data).map(([key, val]) => {
          const op  = val["any"] || Object.values(val)[0] || {};
          const raw = op?.Price ?? op?.price ?? op?.cost ?? 0;
          return { id: key, name: key.charAt(0).toUpperCase() + key.slice(1), basePrice: raw };
        });
        setServices(list);
      } catch {}
      finally { setLoadingServices(false); }
    })();
  }, [selectedCountry]);

  function openModal(service) {
    const existing = overrides.find(
      o => o.service === service.id.toLowerCase() && o.country === selectedCountry?.id.toLowerCase()
    );
    setModalService(service);
    setCustomPrice(existing ? String(existing.price) : String(service.basePrice));
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!modalService || !selectedCountry) return;
    setSaving(true);
    setError("");
    try {
      await upsertPriceOverride({
        service: modalService.id,
        country: selectedCountry.id,
        price:   parseFloat(customPrice),
      });
      await loadOverrides();
      setShowModal(false);
    } catch { setError("Failed to save override."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await deletePriceOverride(id);
      await loadOverrides();
    } catch { setError("Failed to delete override."); }
    finally { setDeleting(null); }
  }

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  function getOverride(serviceId) {
    return overrides.find(
      o => o.service === serviceId.toLowerCase() && o.country === selectedCountry?.id.toLowerCase()
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service Pricing</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Set custom prices per service and country. Overrides the global markup for that specific combo.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Country picker */}
            <div className="lg:col-span-3 glass-card rounded-2xl p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Country</p>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  placeholder="Search…"
                  className="w-full h-8 pl-8 pr-3 rounded-lg text-xs bg-muted border border-border text-foreground outline-none focus:border-violet-500"
                />
              </div>
              <div className="space-y-1 max-h-[420px] overflow-y-auto">
                {filteredCountries.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCountry(c)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCountry?.id === c.id
                        ? "bg-violet-500/10 text-violet-400 font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Services list */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Services — {selectedCountry?.name ?? "…"}
                </p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    value={serviceSearch}
                    onChange={e => setServiceSearch(e.target.value)}
                    placeholder="Search…"
                    className="h-8 pl-8 pr-3 rounded-lg text-xs bg-muted border border-border text-foreground outline-none focus:border-violet-500 w-36"
                  />
                </div>
              </div>

              {loadingServices ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
                  {filteredServices.map(s => {
                    const override = getOverride(s.id);
                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Base: ₦{Number(s.basePrice).toLocaleString()}
                            {override && (
                              <span className="ml-2 text-violet-400 font-semibold">
                                → Override: ₦{Number(override.price).toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => openModal(s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-medium transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          {override ? "Edit" : "Set Price"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* All overrides */}
            <div className="lg:col-span-4 glass-card rounded-2xl p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                All Overrides ({overrides.length})
              </p>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                </div>
              ) : overrides.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No overrides yet</p>
              ) : (
                <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
                  {overrides.map(o => (
                    <div key={o._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted/40">
                      <div>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {o.service} — {o.country.toUpperCase()}
                        </p>
                        <p className="text-xs text-violet-400 font-semibold">₦{Number(o.price).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(o._id)}
                        disabled={deleting === o._id}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        {deleting === o._id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Price modal */}
      {showModal && modalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="font-semibold text-foreground capitalize">{modalService.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedCountry?.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Custom Price (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={customPrice}
                  onChange={e => setCustomPrice(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg text-sm bg-muted border border-border text-foreground outline-none focus:border-violet-500 transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  Base from provider: ₦{Number(modalService.basePrice).toLocaleString()}
                </p>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}