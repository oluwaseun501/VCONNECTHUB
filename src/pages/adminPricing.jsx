import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import {
  DollarSign, Plus, Trash2, Loader2, AlertCircle, X, Search, Plug2,
  EyeOff, Eye,                // ← NEW: for disable/enable icons
} from "lucide-react";
import { getPriceOverrides, upsertPriceOverride, deletePriceOverride, getProviders } from "./adminApi";
import api from "@/lib/axios";

export default function AdminPricing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overrides, setOverrides]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  // Providers
  const [providers, setProviders]               = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Country + service pickers
  const [countries, setCountries]             = useState([]);
  const [services, setServices]               = useState([]);
  const [countrySearch, setCountrySearch]     = useState("");
  const [serviceSearch, setServiceSearch]     = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingServices, setLoadingServices]   = useState(false);

  // ── NEW: disabled services ──────────────────────────────────
  // Set of "service|country|providerId" combos that are disabled.
  // We store them as a Set for O(1) lookup.
  const [disabledSet, setDisabledSet]   = useState(new Set());
  const [togglingId, setTogglingId]     = useState(null); // service id currently toggling

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

  // ── NEW: load disabled services for current provider+country ──
  async function loadDisabled(country, provider) {
    if (!country || !provider) return;
    try {
      const { data } = await api.get("/api/numbers/disabled-services", {
        params: { country: country.id, provider: provider._id },
      });
      const set = new Set((data ?? []).map(d => `${d.service}|${d.country}|${d.provider}`));
      setDisabledSet(set);
    } catch {
      // non-fatal — just leave the set empty
    }
  }

  // Load all active providers on mount
  useEffect(() => {
    loadOverrides();
    (async () => {
      try {
        const res = await getProviders();
        const active = (res.data ?? []).filter(p => p.isActive);
        setProviders(active);
        if (active.length > 0) setSelectedProvider(active[0]);
      } catch {}
    })();
  }, []);

  // Load countries when selected provider changes
  useEffect(() => {
    if (!selectedProvider) return;
    setCountries([]);
    setServices([]);
    setSelectedCountry(null);
    setDisabledSet(new Set());
    setLoadingCountries(true);

    (async () => {
      try {
        const { data } = await api.get("/api/numbers/countries", {
          params: { provider: selectedProvider._id },
        });
        const list = Object.entries(data).map(([key, val]) => ({
          id: key,
          name: val?.name
            ? val.name.charAt(0).toUpperCase() + val.name.slice(1)
            : key.charAt(0).toUpperCase() + key.slice(1),
        }));
        setCountries(list);
        if (list.length) setSelectedCountry(list[0]);
      } catch {}
      finally { setLoadingCountries(false); }
    })();
  }, [selectedProvider]);

  // Load services + disabled list when country changes
  useEffect(() => {
    if (!selectedCountry || !selectedProvider) return;
    setLoadingServices(true);
    setServices([]);
    setDisabledSet(new Set());

    (async () => {
      try {
        const [servicesRes] = await Promise.allSettled([
          api.get(`/api/numbers/products/${selectedCountry.id}/any`, {
            params: { provider: selectedProvider._id },
          }),
          loadDisabled(selectedCountry, selectedProvider),
        ]);

        if (servicesRes.status === "fulfilled") {
          const { data } = servicesRes.value;
          const list = Object.entries(data).map(([key, val]) => {
            const op  = val["any"] || Object.values(val)[0] || {};
            const raw =
  op?.BasePrice ??
  op?.basePrice ??
  op?.Price ??
  op?.price ??
  op?.cost ??
  0;
            return {
              id:        key,
              name:      key.charAt(0).toUpperCase() + key.slice(1),
              basePrice: raw,
            };
          });
          setServices(list);
        }
      } catch {}
      finally { setLoadingServices(false); }
    })();
  }, [selectedCountry, selectedProvider]);

function isOverrideForProvider(override, providerId) {
  if (!override?.provider || !providerId) {
    return false;
  }

  const overrideProviderId =
    typeof override.provider === "object"
      ? override.provider._id || override.provider.id
      : override.provider;

  return String(overrideProviderId) === String(providerId);
}
function openModal(service) {
  const existing = overrides.find(
    (override) =>
      override.service === service.id.toLowerCase() &&
      override.country === selectedCountry?.id.toLowerCase() &&
      isOverrideForProvider(override, selectedProvider?._id),
  );

  setModalService(service);
  setCustomPrice(
    existing ? String(existing.price) : String(service.basePrice),
  );
  setShowModal(true);
}
  async function handleSave(e) {
    e.preventDefault();
    if (!modalService || !selectedCountry || !selectedProvider) {
  setError("Please select a provider, country and service.");
  return;
}

const numericPrice = Number(customPrice);

if (!Number.isFinite(numericPrice) || numericPrice < 0) {
  setError("Please enter a valid non-negative price.");
  return;
}
    setSaving(true);
    setError("");
    try {
   // AFTER
await upsertPriceOverride({
  service:   modalService.id,
  country:   selectedCountry.id,
  price:     numericPrice,
  provider:  selectedProvider._id,
  basePrice: modalService.basePrice,   // ← NEW
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

  // ── NEW: toggle a service's disabled state ──────────────────
  async function handleToggleDisable(service) {
    if (!selectedCountry || !selectedProvider) return;
    const key      = `${service.id.toLowerCase()}|${selectedCountry.id.toLowerCase()}|${selectedProvider._id}`;
    const isNowDisabled = !disabledSet.has(key);

    setTogglingId(service.id);
    try {
      await api.post("/api/numbers/toggle-disabled", {
        service:  service.id,
        country:  selectedCountry.id,
        provider: selectedProvider._id,
        disabled: isNowDisabled,
      });

      setDisabledSet(prev => {
        const next = new Set(prev);
        if (isNowDisabled) next.add(key);
        else next.delete(key);
        return next;
      });
    } catch {
      setError("Could not update service visibility. Try again.");
    } finally {
      setTogglingId(null);
    }
  }

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

function getOverride(serviceId) {
  return overrides.find(
    (override) =>
      override.service === serviceId.toLowerCase() &&
      override.country === selectedCountry?.id.toLowerCase() &&
      isOverrideForProvider(override, selectedProvider?._id),
  );
}

  function isDisabled(service) {
    if (!selectedCountry || !selectedProvider) return false;
    return disabledSet.has(
      `${service.id.toLowerCase()}|${selectedCountry.id.toLowerCase()}|${selectedProvider._id}`
    );
  }

  // Provider label colour
  const providerColor = (idx) => [
    "bg-violet-500/10 text-violet-400 border-violet-500/30",
    "bg-blue-500/10 text-blue-400 border-blue-500/30",
    "bg-amber-500/10 text-amber-400 border-amber-500/30",
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  ][idx % 4];

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
              Set custom prices per service and country. Use the eye icon to hide a service from users.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Provider tabs */}
          {providers.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              No active providers. Enable at least one in Admin → API Providers.
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {providers.map((p, idx) => (
                <button
                  key={p._id}
                  onClick={() => setSelectedProvider(p)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    selectedProvider?._id === p._id
                      ? providerColor(idx)
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  <Plug2 className="w-3.5 h-3.5" />
                  {p.name}
                </button>
              ))}
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
                {loadingCountries ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="w-4 h-4 animate-spin text-violet-400" /></div>
                ) : filteredCountries.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No countries found</p>
                ) : filteredCountries.map(c => (
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
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Services — {selectedCountry?.name ?? "…"}
                  </p>
                  {selectedProvider && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">via {selectedProvider.name}</p>
                  )}
                </div>
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
                <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-violet-400" /></div>
              ) : (
                <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
                  {filteredServices.length === 0 && !loadingServices && (
                    <p className="text-sm text-muted-foreground text-center py-8">No services found for this country</p>
                  )}
                  {filteredServices.map(s => {
                    const override    = getOverride(s.id);
                    const disabled    = isDisabled(s);
                    const isToggling  = togglingId === s.id;
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                          disabled ? "bg-muted/20 opacity-60" : "bg-muted/40 hover:bg-muted"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium truncate ${disabled ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              {s.name}
                            </p>
                            {disabled && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/30 font-medium flex-shrink-0">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Base: ₦{Number(s.basePrice).toLocaleString()}
                            {override && (
                              <span className="ml-2 text-violet-400 font-semibold">
                                → Override: ₦{Number(override.price).toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          {/* ── NEW: Disable / Enable toggle ── */}
                          <button
                            onClick={() => handleToggleDisable(s)}
                            disabled={isToggling}
                            title={disabled ? "Show to users" : "Hide from users"}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                              disabled
                                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            }`}
                          >
                            {isToggling
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : disabled
                              ? <Eye className="w-3.5 h-3.5" />
                              : <EyeOff className="w-3.5 h-3.5" />
                            }
                            {disabled ? "Show" : "Hide"}
                          </button>

                          {/* Set / Edit price */}
                          {!disabled && (
                            <button
                              onClick={() => openModal(s)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-medium transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              {override ? "Edit" : "Set Price"}
                            </button>
                          )}
                        </div>
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
                <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-violet-400" /></div>
              ) : overrides.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No overrides yet</p>
              ) : (
                <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
      {overrides.map(o => {
  const provIdx = providers.findIndex(p => {
    const pid = typeof p._id === "object" ? String(p._id) : p._id;
    const oid = typeof o.provider === "object" ? String(o.provider._id || o.provider) : String(o.provider);
    return pid === oid;
  });
  const prov = providers[provIdx];

  // ← NEW: fall back to live services state for current country view
  let displayBasePrice = o.basePrice;
  if ((!displayBasePrice || displayBasePrice === 0) &&
      o.country === selectedCountry?.id?.toLowerCase() &&
      isOverrideForProvider(o, selectedProvider?._id)) {
    const svc = services.find(s => s.id.toLowerCase() === o.service.toLowerCase());
    if (svc?.basePrice) displayBasePrice = svc.basePrice;
  }

  return (
    <div key={o._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted/40">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground capitalize truncate">
          {o.service} — {o.country.toUpperCase()}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {displayBasePrice != null && displayBasePrice > 0 && (
            <p className="text-xs text-muted-foreground">
              Base: ₦{Number(displayBasePrice).toLocaleString()}
            </p>
          )}
          <p className="text-xs text-violet-400 font-semibold">
            → ₦{Number(o.price).toLocaleString()}
          </p>
          {prov && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${providerColor(provIdx)}`}>
              {prov.name}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => handleDelete(o._id)}
        disabled={deleting === o._id}
        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 flex-shrink-0"
      >
        {deleting === o._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
})}
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
                <p className="text-xs text-muted-foreground">
                  {selectedCountry?.name}
                  {selectedProvider && <span className="ml-1">· {selectedProvider.name}</span>}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom Price (₦)</label>
                <input
                  type="number" min="0" step="0.01" required value={customPrice}
                  onChange={e => setCustomPrice(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg text-sm bg-muted border border-border text-foreground outline-none focus:border-violet-500 transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  Base from {selectedProvider?.name ?? "provider"}: ₦{Number(modalService.basePrice).toLocaleString()}
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
