import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import FundWalletModal from "@/components/FundWalletModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Search, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import {
  SiWhatsapp, SiTelegram, SiTiktok, SiFacebook,
  SiInstagram, SiX, SiSnapchat, SiGmail,
  SiBinance, SiSignal,
} from "react-icons/si";

/* ── Service icon/colour map ── */
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

/* ── Popular items pinned to top ── */
const POPULAR_COUNTRY_IDS = ["usa", "england", "germany", "canada", "nigeria"];
const POPULAR_SERVICE_IDS = ["whatsapp", "telegram", "facebook", "instagram", "tiktok", "twitter", "gmail", "snapchat"];

const sortPopular = (list, ids) =>
  [...list].sort((a, b) => {
    const ai = ids.indexOf(a.id?.toLowerCase());
    const bi = ids.indexOf(b.id?.toLowerCase());
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

/* ── Helpers ── */
const COUNTRY_LABELS = {
  usa: "USA", uk: "UK", uae: "UAE", usa2: "USA 2",
};

function titleCase(str) {
  const lower = str?.toLowerCase() || "";
  if (COUNTRY_LABELS[lower]) return COUNTRY_LABELS[lower];
  return str.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function flagUrl(iso) {
  if (!iso || iso.length !== 2) return null;
  return `https://flagcdn.com/24x18/${iso.toLowerCase()}.png`;
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [, setLocation] = useLocation();

  /* ── Fund modal ── */
  const [showFundModal, setShowFundModal]     = useState(false);

  /* ── Buy flow ── */
  const [step, setStep]                       = useState(1);
  const [searchCountry, setSearchCountry]     = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [pin, setPin]                         = useState(["", "", "", ""]);
  const [buyError, setBuyError]               = useState("");
  const [numberResult, setNumberResult]       = useState(null);
  const [otp, setOtp]                         = useState(null);
  const [redirectCount, setRedirectCount]     = useState(3);

  /* ── Countries ── */
  const [countries, setCountries]             = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError]   = useState("");

  /* ── Services ── */
  const [services, setServices]               = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError]     = useState("");

  /* ── Dashboard stats ── */
  const [activeNumbers, setActiveNumbers]     = useState(0);
  const [totalOtps, setTotalOtps]             = useState(0);
  const [transactions, setTransactions]       = useState([]);
  const [loadingStats, setLoadingStats]       = useState(true);

  const pollIntervalRef = useRef(null);

  /* ── Cleanup on unmount ── */
  useEffect(() => () => { if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); }, []);

  /* ── Auto-redirect after successful purchase ── */
  useEffect(() => {
    if (step !== 5) return;
    setRedirectCount(3);
    const countdown = setInterval(() => setRedirectCount((n) => n - 1), 1000);
    const redirect  = setTimeout(() => setLocation("/my-numbers"), 3000);
    return () => { clearInterval(countdown); clearTimeout(redirect); };
  }, [step, setLocation]);

  /* ── Fetch countries ── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/numbers/countries");
        const list = Object.entries(data).map(([key, val]) => ({
          id:   key,
          name: val.text || titleCase(key),
          iso:  val.iso || "",
          flag: flagUrl(val.iso),
        }));
        setCountries(sortPopular(list, POPULAR_COUNTRY_IDS));
      } catch {
        setCountriesError("Could not load countries.");
      } finally {
        setCountriesLoading(false);
      }
    })();
  }, []);

  /* ── Fetch services when country changes ── */
  useEffect(() => {
    if (!selectedCountry) return;
    setServicesLoading(true);
    setServicesError("");
    setServices([]);
    setSelectedService(null);
    (async () => {
      try {
        const { data } = await api.get(`/api/numbers/products/${selectedCountry.id}/any`);
        const getPrice = (op) => op?.Price ?? op?.price ?? op?.cost ?? 0;
        const list = Object.entries(data)
          .filter(([, val]) => val && typeof val === "object" && Object.keys(val).length > 0)
          .map(([key, val]) => {
            const op   = val["any"] || Object.values(val)[0] || {};
            const meta = SERVICE_META[key.toLowerCase()] || {};
            return { id: key, name: titleCase(key), icon: meta.icon || null, color: meta.color || "#7c3aed", price: getPrice(op) };
          });
        setServices(sortPopular(list, POPULAR_SERVICE_IDS));
      } catch {
        setServicesError("Could not load services for this country.");
      } finally {
        setServicesLoading(false);
      }
    })();
  }, [selectedCountry]);

  /* ── Dashboard stats ── */
  useEffect(() => {
    (async () => {
      try {
        const [ordersRes, txRes] = await Promise.allSettled([
          api.get("/api/numbers/orders?page=1&limit=50"),
          api.get("/api/wallet/transactions"),
        ]);
        if (ordersRes.status === "fulfilled") {
          const orders = ordersRes.value.data?.orders || ordersRes.value.data || [];
          setActiveNumbers(Array.isArray(orders) ? orders.filter((o) => o.status === "PENDING" || o.status === "RECEIVED").length : 0);
          setTotalOtps(Array.isArray(orders) ? orders.filter((o) => o.status === "RECEIVED" || o.status === "FINISHED").length : 0);
        }
        if (txRes.status === "fulfilled") {
          const txData = txRes.value.data?.transactions || txRes.value.data || [];
          setTransactions(Array.isArray(txData) ? txData.slice(0, 10) : []);
        }
      } catch (_) {}
      finally { setLoadingStats(false); }
    })();
    refreshUser();
  }, []);

  /* ── Handlers ── */
  const handlePinChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) document.getElementById(`pin-${index + 1}`)?.focus();
  };

  const submitOrder = async () => {
    setBuyError("");
    setStep(4);
    try {
      const { data } = await api.post(
        "/api/numbers/buy",
        { country: selectedCountry.id.toLowerCase(), product: selectedService.id, operator: "any" },
        { headers: { "x-transaction-pin": pin.join("") } }
      );
      setNumberResult(data.order || data);
      setStep(5);
      pollForOtp((data.order || data).orderId);
      refreshUser();
    } catch (err) {
      setBuyError(err?.response?.data?.message || "Purchase failed. Please try again.");
      setStep(3);
    }
  };

  const pollForOtp = (orderId) => {
    if (!orderId) return;
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    let attempts = 0;
    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const { data } = await api.get(`/api/numbers/check/${orderId}`);
        const sms = data.sms;
        if (Array.isArray(sms) && sms.length > 0) {
          setOtp(sms[sms.length - 1].code || sms[sms.length - 1].text);
          clearInterval(pollIntervalRef.current); pollIntervalRef.current = null;
        } else if (data.status === "RECEIVED" && data.code) {
          setOtp(data.code);
          clearInterval(pollIntervalRef.current); pollIntervalRef.current = null;
        }
      } catch (_) {}
      if (attempts >= 30) { clearInterval(pollIntervalRef.current); pollIntervalRef.current = null; }
    }, 10000);
  };

  const resetFlow = () => { setStep(1); setPin(["", "", "", ""]); setBuyError(""); setNumberResult(null); setOtp(null); };

  const walletBalance = user?.walletBalance ?? user?.balance ?? 0;
  const filteredCountries = countries.filter((c) => c.name.toLowerCase().includes(searchCountry.toLowerCase()));
  const popularCountries  = filteredCountries.filter((c) => POPULAR_COUNTRY_IDS.includes(c.id));
  const otherCountries    = filteredCountries.filter((c) => !POPULAR_COUNTRY_IDS.includes(c.id));
  const popularServices   = services.filter((s) => POPULAR_SERVICE_IDS.includes(s.id.toLowerCase()));
  const otherServices     = services.filter((s) => !POPULAR_SERVICE_IDS.includes(s.id.toLowerCase()));

  /* ─────────────────────────────────────────────
     Render
  ───────────────────────────────────────────── */
  return (
    <DashboardLayout>
      {/* PIN reminder */}
      {user && !user.hasPin && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-sm mb-6">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <span className="text-base">🔐</span>
            <span>Haven't set your PIN yet?</span>
          </div>
          <Link href="/set-pin">
            <span className="text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer">Set it now →</span>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Get an instant number for verification.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Available Balance</div>
            <div className="text-3xl font-bold text-foreground">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : `₦${Number(walletBalance).toFixed(2)}`}
            </div>
            <div className="mt-4">
              <Button size="sm" variant="secondary" className="w-full" onClick={() => setShowFundModal(true)}>Fund Wallet</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Active Numbers</div>
            <div className="text-3xl font-bold text-foreground">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : activeNumbers}
            </div>
            <div className="mt-4 text-sm text-yellow-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> Expiring in ~15 mins
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Total OTPs Received</div>
            <div className="text-3xl font-bold text-foreground">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : totalOtps}
            </div>
            <div className="mt-4 text-sm text-emerald-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 96% success rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Buy flow card */}
        <div className="lg:col-span-7">
          <Card className="glass-card h-full border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-500" />
            <CardContent className="p-0">

              {/* Step tabs */}
              <div className="flex border-b border-border">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${step >= s ? "text-primary" : "text-muted-foreground"}`}>
                    {s === 1 ? "1. Country" : s === 2 ? "2. Service" : "3. Pay & Get OTP"}
                  </div>
                ))}
              </div>

              <div className="p-6">

                {/* ── Step 1: Country ── */}
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">

                    {/* Popular country quick-picks */}
                    {!countriesLoading && !countriesError && (
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Popular</p>
                        <div className="flex flex-wrap gap-2">
                          {countries.filter((c) => POPULAR_COUNTRY_IDS.includes(c.id)).map((c) => (
                            <button
                              key={c.id}
                              onClick={() => { setSelectedCountry(c); setStep(2); }}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-background/30 hover:border-primary/60 hover:bg-primary/5 text-sm font-medium transition-all"
                            >
                              {c.flag
                                ? <img src={c.flag} alt="" className="w-5 h-auto rounded-sm" onError={(e) => { e.target.style.display = "none"; }} />
                                : <span>🌐</span>}
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search all countries */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input placeholder="Search all countries..." className="pl-10 h-12 bg-background/50" value={searchCountry} onChange={(e) => setSearchCountry(e.target.value)} />
                    </div>

                    {countriesError ? (
                      <div className="flex items-center gap-2 text-sm text-red-400 py-4"><AlertCircle className="w-4 h-4" /> {countriesError}</div>
                    ) : countriesLoading ? (
                      <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-2">
                        {(searchCountry ? filteredCountries : otherCountries).map((country) => (
                          <div key={country.id} onClick={() => { setSelectedCountry(country); setStep(2); }}
                            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                              selectedCountry?.id === country.id
                                ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                                : "border-border bg-background/30 hover:border-primary/50"
                            }`}
                          >
                            {country.flag
                              ? <img src={country.flag} alt={country.name} className="w-6 h-auto mr-3 rounded-sm shadow-sm" onError={(e) => { e.target.style.display = "none"; }} />
                              : <span className="text-lg mr-3">🌐</span>}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{country.name}</div>
                              <div className="text-xs text-muted-foreground uppercase">{country.id}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 2: Service ── */}
                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 mb-5">
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="px-2 h-8">Back to Countries</Button>
                      <div className="flex-1" />
                      <div className="text-sm font-medium flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                        {selectedCountry?.flag
                          ? <img src={selectedCountry.flag} alt="" className="w-4 h-auto rounded-sm" />
                          : <span>🌐</span>}
                        {selectedCountry?.name}
                      </div>
                    </div>

                    {servicesError ? (
                      <div className="flex items-center gap-2 text-sm text-red-400 py-4"><AlertCircle className="w-4 h-4" /> {servicesError}</div>
                    ) : servicesLoading ? (
                      <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                    ) : services.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-8">No services available for this country.</div>
                    ) : (
                      <div className="max-h-[370px] overflow-y-auto pr-1 space-y-4">

                        {/* Popular services */}
                        {popularServices.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Popular</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {popularServices.map((service) => {
                                const Icon = service.icon;
                                return (
                                  <div key={service.id} onClick={() => { setSelectedService(service); setStep(3); }}
                                    className="flex flex-col items-center p-4 rounded-xl border border-primary/30 bg-primary/5 cursor-pointer hover:border-primary hover:bg-primary/10 transition-all text-center group"
                                  >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: service.color + "22" }}>
                                      {Icon ? <Icon className="w-6 h-6" style={{ color: service.color }} /> : <span className="text-lg font-bold" style={{ color: service.color }}>{service.name[0]}</span>}
                                    </div>
                                    <div className="font-medium text-sm">{service.name}</div>
                                    <div className="text-primary font-bold mt-1 text-xs">₦{Number(service.price).toLocaleString()}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Other services */}
                        {otherServices.length > 0 && (
                          <div>
                            {popularServices.length > 0 && (
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">All Services</p>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {otherServices.map((service) => {
                                const Icon = service.icon;
                                return (
                                  <div key={service.id} onClick={() => { setSelectedService(service); setStep(3); }}
                                    className="flex flex-col items-center p-4 rounded-xl border border-border bg-background/30 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
                                  >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: service.color + "22" }}>
                                      {Icon ? <Icon className="w-6 h-6" style={{ color: service.color }} /> : <span className="text-lg font-bold" style={{ color: service.color }}>{service.name[0]}</span>}
                                    </div>
                                    <div className="font-medium text-sm">{service.name}</div>
                                    <div className="text-primary font-bold mt-1 text-xs">₦{Number(service.price).toLocaleString()}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 3: PIN + confirm ── */}
                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="px-2 h-8 mb-4">Back to Services</Button>

                    <div className="bg-card/50 border border-border rounded-xl p-5 mb-6">
                      <h3 className="font-semibold mb-4 border-b border-border pb-3">Order Summary</h3>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          {selectedCountry?.flag ? <img src={selectedCountry.flag} alt="" className="w-4 mr-2 rounded-sm" /> : <span className="mr-2">🌐</span>}
                          Country
                        </div>
                        <div className="font-medium">{selectedCountry?.name}</div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-muted-foreground">Service</div>
                        <div className="flex items-center gap-2 font-medium">
                          {selectedService?.icon && <selectedService.icon className="w-4 h-4" style={{ color: selectedService.color }} />}
                          {selectedService?.name}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
                        <div className="text-sm font-medium">Total Cost</div>
                        <div className="text-xl font-bold text-primary">{Number(selectedService?.price).toLocaleString()} pts</div>
                      </div>
                    </div>

                    {buyError && (
                      <div
                        className="mb-4 flex items-start gap-2.5 rounded-xl border px-4 py-3"
                        style={{ backgroundColor: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.30)" }}
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                        <p className="text-sm leading-snug" style={{ color: "#f87171" }}>{buyError}</p>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground mb-4">Enter your 4-digit PIN to confirm purchase</p>
                      <div className="flex justify-center gap-3">
                        {[0, 1, 2, 3].map((i) => (
                          <input key={i} id={`pin-${i}`} type="password" inputMode="numeric" maxLength={1} value={pin[i]}
                            onChange={(e) => handlePinChange(i, e.target.value)}
                            className="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    <Button className="w-full h-12 text-lg" onClick={submitOrder} disabled={pin.join("").length < 4}>
                      Pay & Get Number
                    </Button>
                  </div>
                )}

                {/* ── Step 4: Loading ── */}
                {step === 4 && (
                  <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                    <h3 className="text-xl font-semibold mb-2">Processing…</h3>
                    <p className="text-muted-foreground text-center max-w-sm">Assigning your number. This only takes a moment.</p>
                  </div>
                )}

                {/* ── Step 5: Success + redirect ── */}
                {step === 5 && (
                  <div className="py-8 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                      <Check className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Number Purchased! 🎉</h3>
                    <p className="text-muted-foreground mb-6 text-center">
                      Your number is ready. Redirecting to My Numbers in{" "}
                      <span className="text-primary font-bold">{redirectCount}s</span>…
                    </p>

                    {numberResult && (
                      <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border w-full max-w-sm text-center">
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Your Number</div>
                        <div className="text-2xl font-mono tracking-widest text-foreground">
                          {numberResult.phone || numberResult.number}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 w-full max-w-sm">
                      <Button variant="outline" className="flex-1 h-11" onClick={resetFlow}>Buy Another</Button>
                      <Button className="flex-1 h-11" onClick={() => setLocation("/my-numbers")}>
                        My Numbers →
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-5">
          <Card className="glass-card h-full flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-lg">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setLocation("/wallet")}>View All</Button>
            </div>
            <div className="flex-1 p-0 overflow-y-auto">
              {loadingStats ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : transactions.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">No transactions yet</div>
              ) : (
                transactions.map((tx, i) => (
                  <div key={tx._id || tx.id || i}
                    className={`p-4 flex items-center justify-between border-b border-border hover:bg-white/5 transition-colors ${i === transactions.length - 1 ? "border-b-0" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "Credit" || tx.type === "credit" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"}`}>
                        {tx.type === "Credit" || tx.type === "credit" ? <ShieldCheck className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{tx.description || tx.narration || "Transaction"}</div>
                        <div className="text-xs text-muted-foreground">{new Date(tx.date || tx.createdAt).toLocaleDateString()} • {tx.status}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === "Credit" || tx.type === "credit" ? "text-emerald-500" : ""}`}>
                      {tx.type === "Credit" || tx.type === "credit" ? "+" : "-"}₦{tx.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

      </div>

      <FundWalletModal isOpen={showFundModal} onClose={() => setShowFundModal(false)} />
    </DashboardLayout>
  );
}
