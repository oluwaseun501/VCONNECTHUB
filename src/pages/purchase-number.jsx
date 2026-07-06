import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronDown, ShoppingCart, CheckCircle2,
  AlertCircle, Globe, Zap, Shield, Loader2, XCircle, Copy, Check
} from "lucide-react";
import {
  SiWhatsapp, SiTelegram, SiTiktok, SiFacebook,
  SiInstagram, SiX, SiSnapchat, SiGmail,
  SiBinance, SiSignal,
} from "react-icons/si";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/axios";

const GLIDE = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

const STEP_SELECT  = "select";
const STEP_SUCCESS = "success";

/* ─────────────────────────────────────────────
   Icon + colour map for known services
───────────────────────────────────────────── */
const SERVICE_META = {
  whatsapp:  { icon: SiWhatsapp,  color: "#25D366" },
  telegram:  { icon: SiTelegram,  color: "#2AABEE" },
  tiktok:    { icon: SiTiktok,    color: "#010101" },
  facebook:  { icon: SiFacebook,  color: "#1877F2" },
  instagram: { icon: SiInstagram, color: "#E4405F" },
  twitter:   { icon: SiX,         color: "#000000" },
  snapchat:  { icon: SiSnapchat,  color: "#FFFC00" },
  gmail:     { icon: SiGmail,     color: "#EA4335" },
  binance:   { icon: SiBinance,   color: "#F3BA2F" },
  signal:    { icon: SiSignal,    color: "#3A76F0" },
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

// Turn ISO-2 code into a flag emoji  e.g. "ru" → 🇷🇺
function isoToFlag(iso) {
  if (!iso || iso.length !== 2) return "🌐";
  return iso
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e0 + c.charCodeAt(0) - 65))
    .join("");
}

// Capitalise first letter of each word
function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ─────────────────────────────────────────────
   PIN Modal
───────────────────────────────────────────── */
function PinModal({ onConfirm, onCancel, loading, error }) {
  const [pin, setPin] = useState("");

  const handleChange = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-2xl p-7 w-full max-w-sm shadow-2xl"
      >
        <h3 className="text-lg font-bold text-foreground mb-1">Enter Transaction PIN</h3>
        <p className="text-sm text-muted-foreground mb-5">
          Enter your 4-digit PIN to authorise this purchase.
        </p>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="••••"
          value={pin}
          onChange={handleChange}
          className="w-full h-14 rounded-xl bg-muted/50 border border-border text-foreground text-3xl font-bold text-center tracking-[0.5em] outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all placeholder:tracking-normal placeholder:text-2xl mb-3"
          autoFocus
        />

        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1.5 mb-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </p>
        )}

        <div className="flex gap-3 mt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-11 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted hover:text-foreground transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(pin)}
            disabled={pin.length !== 4 || loading}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function PurchaseNumber() {
  const [, navigate] = useLocation();

  // ── Balance ──
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState(false);

  // ── Countries ──
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // ── Services ──
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  // ── Steps & Purchase ──
  const [step, setStep] = useState(STEP_SELECT);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState("");
  const [buying, setBuying] = useState(false);

  // ── Active Order (after buy) ──
  const [order, setOrder] = useState(null);   // full order object from API
  const [smsStatus, setSmsStatus] = useState("PENDING"); // PENDING | RECEIVED | CANCELED | FINISHED
  const [smsMessages, setSmsMessages] = useState([]);
  const [cancelling, setCancelling] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // ── Copy helper ──
  const [copied, setCopied] = useState(false);

  const pollRef = useRef(null);

  /* ── Fetch balance ── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/users/balance");
        setBalance(data.balance ?? 0);
      } catch {
        setBalanceError(true);
        // 401 is handled globally by the axios interceptor (redirects to /login)
      } finally {
        setBalanceLoading(false);
      }
    })();
  }, [navigate]);

  /* ── Fetch countries ── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/numbers/countries");
        // 5sim returns an object: { russia: { text, prefix, iso }, ... }
        const list = Object.entries(data).map(([key, val]) => ({
          code: key,                              // e.g. "russia"
          name: val.text || titleCase(key),       // display name
          iso:  val.iso || "",                    // 2-letter ISO for flag emoji
          flag: isoToFlag(val.iso),
        }));
        setCountries(list);
        if (list.length > 0) setSelectedCountry(list[0]);
      } catch {
        setCountriesError("Could not load countries. Please refresh.");
      } finally {
        setCountriesLoading(false);
      }
    })();
  }, []);

  /* ── Fetch services/products when country changes ── */
  useEffect(() => {
    if (!selectedCountry) return;
    setServicesLoading(true);
    setServicesError("");
    setSelectedService(null);
    setServices([]);

    (async () => {
      try {
        // country code used in the API route is the key from 5sim (e.g. "russia")
        const { data } = await api.get(
          `/api/numbers/products/${selectedCountry.code}/any`
        );
        // 5sim products response: { whatsapp: { any: { Qty, Price, Category } }, ... }
        // Field names can vary: Price/cost, Qty/count — handle both
        const getPrice = (op) => op?.Price ?? op?.price ?? op?.cost ?? 0;
        const getQty   = (op) => op?.Qty   ?? op?.qty   ?? op?.count ?? 0;

        const list = Object.entries(data)
          .filter(([, val]) => val && typeof val === "object" && Object.keys(val).length > 0)
          .map(([key, val]) => {
            // pick "any" operator data, fall back to first available operator
            const operatorData = val["any"] || Object.values(val)[0] || {};
            const price = getPrice(operatorData);
            const meta  = SERVICE_META[key.toLowerCase()] || {};
            return {
              id:    key,
              name:  titleCase(key.replace(/[_-]/g, " ")),
              icon:  meta.icon  || null,
              color: meta.color || "#7c3aed",
              price,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        setServices(list);
      } catch {
        setServicesError("Could not load services for this country.");
      } finally {
        setServicesLoading(false);
      }
    })();
  }, [selectedCountry]);

  /* ── SMS polling ── */
  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback((orderId) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/api/numbers/check/${orderId}`);
        setSmsStatus(data.status);
        if (data.sms && data.sms.length > 0) {
          setSmsMessages(data.sms);
        }
        // Stop polling once the order reaches a terminal state
        if (["RECEIVED", "CANCELED", "FINISHED"].includes(data.status)) {
          stopPolling();
        }
      } catch {
        // 401 is handled globally by the axios interceptor
        // Network hiccups / 5xx — keep polling silently
      }
    }, 5000);
  }, [stopPolling]);

  // Clean up poll on unmount
  useEffect(() => () => stopPolling(), [stopPolling]);

  /* ── Handlers ── */
  const handleBuyClick = () => {
    if (!selectedService || !selectedCountry) return;
    setPinError("");
    setShowPinModal(true);
  };

  const handlePinConfirm = async (pin) => {
    setBuying(true);
    setPinError("");
    try {
      const { data } = await api.post(
        "/api/numbers/buy",
        {
          country:  selectedCountry.code,
          product:  selectedService.id,
          operator: "any",
        },
        {
          headers: { "x-transaction-pin": pin },
        }
      );

      const newOrder = data.order;
      setOrder(newOrder);
      setSmsStatus(newOrder.status || "PENDING");
      setSmsMessages(newOrder.sms || []);

      // Refresh balance after debit
      try {
        const { data: balData } = await api.get("/api/users/balance");
        setBalance(balData.balance ?? 0);
      } catch { /* ignore */ }

      setShowPinModal(false);
      setStep(STEP_SUCCESS);

      // Start polling for SMS
      if (newOrder.orderId) {
        startPolling(newOrder.orderId);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Purchase failed. Check your PIN or balance and try again.";
      setPinError(msg);
    } finally {
      setBuying(false);
    }
  };

  const handleCancel = async () => {
    if (!order?.orderId) return;
    setCancelling(true);
    try {
      await api.post(`/api/numbers/cancel/${order.orderId}`);
      setSmsStatus("CANCELED");
      stopPolling();
      // Refresh balance (refund credited)
      const { data } = await api.get("/api/users/balance");
      setBalance(data.balance ?? 0);
    } catch (err) {
      alert(err?.response?.data?.message || "Could not cancel. Try again.");
    } finally {
      setCancelling(false);
    }
  };

  const handleFinish = async () => {
    if (!order?.orderId) return;
    setFinishing(true);
    try {
      await api.post(`/api/numbers/finish/${order.orderId}`);
      setSmsStatus("FINISHED");
      stopPolling();
    } catch (err) {
      alert(err?.response?.data?.message || "Could not finish order. Try again.");
    } finally {
      setFinishing(false);
    }
  };

  const handleCopyNumber = () => {
    if (!order?.phone) return;
    navigator.clipboard.writeText(order.phone)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard API blocked (e.g. non-HTTPS in dev) — fall back to selection
        const el = document.createElement("textarea");
        el.value = order.phone;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const handleBuyAnother = () => {
    stopPolling();
    setOrder(null);
    setSmsStatus("PENDING");
    setSmsMessages([]);
    setSelectedService(null);
    setStep(STEP_SELECT);
  };

  /* ── Filtered lists ── */
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Affordability is a soft hint only — the backend validates the real Naira cost on purchase.
  // 5sim listing prices are NOT in Naira, so we don't gate the button on them.
  const canAfford = () => true;

  /* ── Status badge config ── */
  const statusConfig = {
    PENDING:  { label: "Waiting for SMS…", color: "text-amber-500",  dot: "bg-amber-500",  animate: true  },
    RECEIVED: { label: "SMS Received!",    color: "text-emerald-500", dot: "bg-emerald-500", animate: false },
    FINISHED: { label: "Completed",        color: "text-blue-500",    dot: "bg-blue-500",    animate: false },
    CANCELED: { label: "Cancelled",        color: "text-red-500",     dot: "bg-red-500",     animate: false },
  };
  const statusInfo = statusConfig[smsStatus] || statusConfig.PENDING;

  /* ─────────────────────────────────────────────
     Render
  ───────────────────────────────────────────── */
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={GLIDE}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Virtual Numbers</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Buy a temporary number for SMS verification in 190+ countries
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border shadow-sm">
              <Globe className="w-4 h-4 text-violet-500" />
              <div>
                <p className="text-xs text-muted-foreground leading-none mb-0.5">Available Countries</p>
                <p className="text-sm font-bold text-foreground">
                  {countriesLoading ? "…" : countries.length}
                </p>
              </div>
            </div>
          </div>

          {/* Balance bar */}
          <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Balance</p>
                <p className="text-lg font-bold text-foreground">
                  {balanceLoading ? (
                    <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
                    </span>
                  ) : balanceError ? (
                    <span className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Failed to load
                    </span>
                  ) : (
                    `₦${balance.toLocaleString()}`
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/wallet")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-all"
            >
              + Add Funds
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════
              STEP: SELECT
          ══════════════════════════════════════ */}
          {step === STEP_SELECT && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={GLIDE}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left: country + service */}
              <div className="lg:col-span-2 space-y-6">

                {/* Step 1: Country */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <h2 className="font-semibold text-foreground">Select Country</h2>
                  </div>

                  {countriesError ? (
                    <p className="text-sm text-red-500 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> {countriesError}
                    </p>
                  ) : countriesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading countries…
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setCountryOpen(!countryOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-muted/50 hover:border-violet-500/40 transition-all"
                      >
                        <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                          <span className="text-xl">{selectedCountry?.flag}</span>
                          {selectedCountry?.name}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform ${countryOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {countryOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-30 overflow-hidden"
                          >
                            <div className="p-3 border-b border-border">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                  type="text"
                                  placeholder="Search country…"
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted text-foreground text-sm outline-none border border-transparent focus:border-violet-500"
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCountries.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-4 py-3">No results</p>
                              ) : (
                                filteredCountries.map((c) => (
                                  <button
                                    key={c.code}
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setCountryOpen(false);
                                      setCountrySearch("");
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted text-left transition-colors ${
                                      selectedCountry?.code === c.code
                                        ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                        : "text-foreground"
                                    }`}
                                  >
                                    <span className="text-lg">{c.flag}</span>
                                    {c.name}
                                  </button>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Step 2: Service */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h2 className="font-semibold text-foreground">Select Service</h2>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search services by name…"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/50 border border-border text-foreground text-sm outline-none focus:border-violet-500 transition-all"
                    />
                  </div>

                  {servicesError ? (
                    <p className="text-sm text-red-500 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> {servicesError}
                    </p>
                  ) : servicesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading services…
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-3">
                      {serviceSearch ? "No matching services." : "No services available for this country."}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredServices.map((service) => {
                        const Icon     = service.icon;
                        const selected = selectedService?.id === service.id;

                        return (
                          <button
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                              selected
                                ? "border-violet-500 bg-violet-500/10 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                                : "border-border hover:border-violet-500/40 hover:bg-muted/50 cursor-pointer"
                            }`}
                          >
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: service.color + "22" }}
                            >
                              {Icon
                                ? <Icon className="w-5 h-5" style={{ color: service.color }} />
                                : <span className="text-sm font-bold" style={{ color: service.color }}>{service.name[0]}</span>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{service.name}</p>
                              <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
                                {Number(service.price).toLocaleString()} pts
                              </p>
                            </div>
                            {selected && <div className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: summary */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm sticky top-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-violet-500" />
                    Purchase Summary
                  </h3>

                  <div className="space-y-3 text-sm mb-5">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Country</span>
                      <span className="font-medium text-foreground flex items-center gap-1.5">
                        {selectedCountry?.flag} {selectedCountry?.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium text-foreground">
                        {selectedService?.name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-bold text-violet-600 dark:text-violet-400">
                        {selectedService
                          ? `${Number(selectedService.price).toLocaleString()} pts`
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Guarantee badge */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
                      Your number will be ready immediately. Free replacement if OTP doesn't arrive within 2 minutes.
                    </p>
                  </div>

                  <button
                    onClick={handleBuyClick}
                    disabled={!selectedService || servicesLoading || countriesLoading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold shadow-lg shadow-violet-500/25 hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Purchase Number
                  </button>

                  {!selectedService && (
                    <p className="text-xs text-muted-foreground text-center mt-2">Select a service to continue</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════
              STEP: SUCCESS — shows real number + live SMS polling
          ══════════════════════════════════════ */}
          {step === STEP_SUCCESS && order && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={GLIDE}
              className="max-w-md mx-auto"
            >
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>

                <div>
                  <h2 className="text-xl font-bold text-foreground">Number Assigned! 🎉</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Use this number to verify your {selectedService?.name} account
                  </p>
                </div>

                {/* Phone number */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-500/10 border border-violet-500/20 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {selectedCountry?.flag} {selectedService?.name} · {selectedCountry?.name}
                  </p>
                  <p className="text-3xl font-bold text-foreground tracking-wide">{order.phone}</p>
                  <button
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1.5 mx-auto text-xs text-violet-500 hover:text-violet-400 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy number"}
                  </button>
                  <div className={`flex items-center justify-center gap-1.5 text-xs ${statusInfo.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} ${statusInfo.animate ? "animate-pulse" : ""}`} />
                    {statusInfo.label}
                  </div>
                </div>

                {/* SMS messages — shown once received */}
                {smsMessages.length > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-left space-y-3">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      SMS Received
                    </p>
                    {smsMessages.map((sms, i) => (
                      <div key={i} className="space-y-1">
                        {sms.code && (
                          <p className="text-2xl font-bold text-foreground tracking-[0.25em]">{sms.code}</p>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">{sms.text}</p>
                        <p className="text-xs text-muted-foreground/60">From: {sms.sender}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructions (only while waiting) */}
                {smsStatus === "PENDING" && (
                  <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2 text-sm">
                    <p className="font-semibold text-foreground">What to do next:</p>
                    <ol className="space-y-1.5 text-muted-foreground list-decimal list-inside">
                      <li>Copy the number above</li>
                      <li>Open {selectedService?.name} and enter it as your phone number</li>
                      <li>Request the verification SMS</li>
                      <li>The code will appear here automatically — no need to refresh</li>
                    </ol>
                  </div>
                )}

                {/* Cancelled notice */}
                {smsStatus === "CANCELED" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-500">Order cancelled. Your wallet has been refunded.</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleBuyAnother}
                    className="flex-1 h-11 rounded-xl border border-border text-foreground text-sm hover:bg-muted transition-all"
                  >
                    Buy Another
                  </button>

                  {/* Cancel — only while PENDING */}
                  {smsStatus === "PENDING" && (
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="flex-1 h-11 rounded-xl border border-red-500/40 text-red-500 text-sm hover:bg-red-500/10 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    >
                      {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Cancel
                    </button>
                  )}

                  {/* Finish — only when RECEIVED */}
                  {smsStatus === "RECEIVED" && (
                    <button
                      onClick={handleFinish}
                      disabled={finishing}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    >
                      {finishing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Finish ✓
                    </button>
                  )}

                  {/* My Numbers — always shown when not PENDING/RECEIVED */}
                  {["FINISHED", "CANCELED"].includes(smsStatus) && (
                    <button
                      onClick={() => navigate("/my-numbers")}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm hover:opacity-90 transition-all"
                    >
                      My Numbers →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* PIN modal — rendered outside the flow so it overlays everything */}
      <AnimatePresence>
        {showPinModal && (
          <PinModal
            onConfirm={handlePinConfirm}
            onCancel={() => setShowPinModal(false)}
            loading={buying}
            error={pinError}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
