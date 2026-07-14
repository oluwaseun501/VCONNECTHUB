import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, Search, ChevronDown, Loader2, ExternalLink, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import api from "@/lib/axios";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import FundWalletModal from "@/components/FundWalletModal";

const STATUS_STYLES = {
  PENDING:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  IN_PROGRESS:"bg-blue-500/10 text-blue-400 border-blue-500/20",
  FINISHED:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELED:   "bg-red-500/10 text-red-400 border-red-500/20",
  PARTIAL:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function fmt(n) { return `₦${Number(n ?? 0).toLocaleString()}`; }
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BoostingPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("order"); // "order" | "history"

  // Services
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

    const [pinInput, setPinInput] = useState(["", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  // Order form
  const [selectedService, setSelectedService] = useState(null);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [orderError, setOrderError] = useState("");

  // History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    api.get("/boost/services")
      .then(res => {
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.services ?? [];
        setServices(list.filter(s => s.isEnabled));
      })
      .catch(() => {})
      .finally(() => setServicesLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== "history" || history.length > 0) return;
    setHistoryLoading(true);
    api.get("/boost/orders")
      .then(res => {
        const data = res.data;
        setHistory(Array.isArray(data) ? data : data?.orders ?? []);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [tab]);

  const categories = ["All", ...new Set(services.map(s => s.category).filter(Boolean))];
  const filtered = services.filter(s => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const price = selectedService && quantity
    ? ((selectedService.customPrice / 1000) * Number(quantity)).toFixed(2)
    : null;

      const handlePinChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...pinInput];
    newPin[index] = value;
    setPinInput(newPin);
    if (value && index < 3) document.getElementById(`boost-pin-${index + 1}`)?.focus();
  };

    const handlePlaceOrder = async () => {
    if (!selectedService || !link.trim() || !quantity) return;
    const qty = Number(quantity);
    if (qty < selectedService.minOrder || qty > selectedService.maxOrder) {
      setOrderError(`Quantity must be between ${selectedService.minOrder.toLocaleString()} and ${selectedService.maxOrder.toLocaleString()}`);
      return;
    }
    // Show PIN step first
    if (!showPin) {
      setShowPin(true);
      return;
    }
    // Validate PIN
    const pin = pinInput.join("");
    if (pin.length < 4) {
      setOrderError("Please enter your 4-digit PIN.");
      return;
    }
    setPlacing(true);
    setOrderError("");
    setOrderSuccess("");
    try {
      await api.post(
        "/boost/order",
        { serviceId: selectedService._id, link: link.trim(), quantity: qty },
        { headers: { "x-transaction-pin": pin } }   // ← same header as virtual numbers
      );
      setOrderSuccess("Order placed successfully! Check your history for status updates.");
      setLink("");
      setQuantity("");
      setSelectedService(null);
      setPinInput(["", "", "", ""]);
      setShowPin(false);
      setHistory([]);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order. Check your balance or PIN.");
    } finally {
      setPlacing(false);
    }
  };

  const refreshHistory = () => {
    setHistory([]);
    setHistoryLoading(true);
    api.get("/boost/orders")
      .then(res => {
        const data = res.data;
        setHistory(Array.isArray(data) ? data : data?.orders ?? []);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  };

  return (
     <DashboardLayout>
              {/* ── Balance Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-border mb-6">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Wallet Balance</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              ₦{Number(user?.walletBalance ?? user?.balance ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowFundModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/20 whitespace-nowrap"
        >
          + Add Funds
        </button>
      </div>
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-fuchsia-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social Media Boosting</h1>
          <p className="text-sm text-muted-foreground">Grow your followers, likes, views and more</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-border w-fit">
        {[["order", "New Order"], ["history", "My Orders"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === val
                ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── New Order Tab ── */}
      {tab === "order" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Service selector */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-foreground">Select a Service</h2>

              {/* Search + Category */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search services..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-fuchsia-500/50 transition-all"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        category === c
                          ? "bg-fuchsia-600 text-white border-fuchsia-600"
                          : "bg-white/5 text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service list */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin text-fuchsia-400" />
                  </div>
                ) : filtered.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    No services available yet.
                  </p>
                ) : (
                  filtered.map(s => (
                    <button
                      key={s._id}
                      onClick={() => { setSelectedService(s); setQuantity(""); setOrderError(""); setOrderSuccess(""); }}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        selectedService?._id === s._id
                          ? "bg-fuchsia-500/10 border-fuchsia-500/40"
                          : "bg-white/[0.02] border-border hover:bg-white/5"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-fuchsia-400 font-semibold">
                          {fmt(s.customPrice)}/1k
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Min: {s.minOrder?.toLocaleString()} · Max: {s.maxOrder?.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Order form */}
          <div className="glass-card rounded-2xl p-5 space-y-5 h-fit">
            <h2 className="font-semibold text-foreground">Order Details</h2>

            {!selectedService ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Select a service from the left to get started</p>
              </div>
            ) : (
              <>
                {/* Selected service info */}
                <div className="p-3 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/20">
                  <p className="text-sm font-semibold text-foreground">{selectedService.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedService.category}</p>
                </div>

                {/* Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Link / URL
                  </label>
                  <input
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-fuchsia-500/50 transition-all"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Quantity ({selectedService.minOrder?.toLocaleString()} – {selectedService.maxOrder?.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    min={selectedService.minOrder}
                    max={selectedService.maxOrder}
                    placeholder={`Min ${selectedService.minOrder?.toLocaleString()}`}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-fuchsia-500/50 transition-all"
                  />
                </div>

                        
                               {/* Price preview */}
                {price && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-border">
                    <span className="text-sm text-muted-foreground">Total charge</span>
                    <span className="text-lg font-bold text-fuchsia-400">{fmt(price)}</span>
                  </div>
                )}

                {/* PIN step */}
                {showPin && (
                  <div className="space-y-3 p-4 rounded-xl bg-white/[0.03] border border-border">
                    <p className="text-sm text-center text-muted-foreground">
                      Enter your 4-digit PIN to confirm
                    </p>
                    <div className="flex justify-center gap-3">
                      {[0, 1, 2, 3].map((i) => (
                        <input
                          key={i}
                          id={`boost-pin-${i}`}
                          type="password"
                          inputMode="numeric"
                          maxLength={1}
                          value={pinInput[i]}
                          onChange={(e) => handlePinChange(i, e.target.value)}
                          className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-border bg-white/5 focus:border-fuchsia-500/50 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.12)] outline-none transition-all text-foreground"
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => { setShowPin(false); setPinInput(["", "", "", ""]); setOrderError(""); }}
                      className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                    >
                      ← Go back
                    </button>
                  </div>
                )}

                {orderError && (
                  <div className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {orderError}
                  </div>
                )}
                {orderSuccess && (
                  <div className="px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    {orderSuccess}
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || !link.trim() || !quantity || (showPin && pinInput.join("").length < 4)}
                  className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:from-fuchsia-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {placing
                    ? "Placing Order..."
                    : showPin
                    ? `Confirm · ${price ? fmt(price) : ""}`
                    : `Continue${price ? ` · ${fmt(price)}` : ""}`}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Your wallet balance: <span className="text-foreground font-medium">{fmt(user?.balance)}</span>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── My Orders Tab ── */}
      {tab === "history" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">My Boost Orders</h2>
            <button
              onClick={refreshHistory}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-fuchsia-400" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No boost orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="text-left px-6 py-3.5 font-medium">Service</th>
                    <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Link</th>
                    <th className="text-left px-4 py-3.5 font-medium">Qty</th>
                    <th className="text-left px-4 py-3.5 font-medium">Status</th>
                    <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-right px-6 py-3.5 font-medium">Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((o, i) => (
                    <tr key={o._id} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === history.length - 1 ? "border-b-0" : ""}`}>
                      <td className="px-6 py-3.5 text-foreground text-xs max-w-[160px]">
                        <span className="block truncate">
                          {typeof o.service === "object" ? o.service?.name : o.serviceName ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell max-w-[140px]">
                        <a href={o.link} target="_blank" rel="noreferrer"
                          className="text-xs text-fuchsia-400 hover:underline flex items-center gap-1 truncate">
                          {o.link} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>
                      <td className="px-4 py-3.5 text-foreground">{o.quantity?.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_STYLES[o.status] ?? "bg-white/5 text-muted-foreground border-border"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs hidden lg:table-cell">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-red-400">
                        -{fmt(o.charge ?? o.totalPrice ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
          {showFundModal && (
        <FundWalletModal onClose={() => setShowFundModal(false)} />
      )}
    </DashboardLayout>
  );
}