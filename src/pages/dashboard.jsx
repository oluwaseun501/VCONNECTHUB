import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { services, countries } from "@/lib/mock-data";
import { Check, ChevronRight, Search, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [, setLocation] = useLocation();

  // Buy flow state
  const [step, setStep] = useState(1);
  const [searchCountry, setSearchCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [buyError, setBuyError] = useState("");
  const [numberResult, setNumberResult] = useState(null);
  const [otp, setOtp] = useState(null);

  // Stats state
  const [activeNumbers, setActiveNumbers] = useState(0);
  const [totalOtps, setTotalOtps] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchCountry.toLowerCase())
  );

  const pollIntervalRef = useRef(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Load dashboard stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, txRes] = await Promise.allSettled([
          api.get("/api/numbers/orders?page=1&limit=50"),
          api.get("/api/wallet/transactions"),
        ]);

        if (ordersRes.status === "fulfilled") {
          const orders = ordersRes.value.data?.orders || ordersRes.value.data || [];
          const active = Array.isArray(orders)
            ? orders.filter((o) => o.status === "PENDING" || o.status === "RECEIVED").length
            : 0;
          setActiveNumbers(active);
          const received = Array.isArray(orders)
            ? orders.filter((o) => o.status === "RECEIVED" || o.status === "FINISHED").length
            : 0;
          setTotalOtps(received);
        }

        if (txRes.status === "fulfilled") {
          const txData = txRes.value.data?.transactions || txRes.value.data || [];
          setTransactions(Array.isArray(txData) ? txData.slice(0, 10) : []);
        }
      } catch (_) {
        // silently fail — stats are non-critical
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
    refreshUser();
  }, []);

  const handlePinChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const submitOrder = async () => {
    setBuyError("");
    setStep(4);
    try {
      const { data } = await api.post(
        "/api/numbers/buy",
        {
          country: selectedCountry.id.toLowerCase(),
          product: selectedService.id,
          operator: "any",
        },
        { headers: { "x-transaction-pin": pin.join("") } }
      );
      setNumberResult(data.order || data);
      setStep(5);
      pollForOtp((data.order || data).orderId);
      refreshUser(); // update wallet balance
    } catch (err) {
      const msg = err?.response?.data?.message || "Purchase failed. Please try again.";
      setBuyError(msg);
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
          const latest = sms[sms.length - 1];
          setOtp(latest.code || latest.text);
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        } else if (data.status === "RECEIVED" && data.code) {
          setOtp(data.code);
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      } catch (_) {}
      if (attempts >= 30) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }, 10000);
  };

  const resetFlow = () => {
    setStep(1);
    setPin(["", "", "", ""]);
    setBuyError("");
    setNumberResult(null);
    setOtp(null);
  };

  const walletBalance = user?.walletBalance ?? user?.balance ?? 0;

  return (
    <DashboardLayout>
      {/* PIN reminder banner */}
      {user && !user.hasPin && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-sm mb-6">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <span className="text-base">🔐</span>
            <span>Haven't set your PIN yet?</span>
          </div>
          <Link href="/set-pin">
            <span className="text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer">
              Set it now →
            </span>
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Available Balance</div>
            <div className="text-3xl font-bold text-foreground">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : `₦${Number(walletBalance).toFixed(2)}`}
            </div>
            <div className="mt-4">
              <Button size="sm" variant="secondary" className="w-full" onClick={() => setLocation("/wallet")}>
                Fund Wallet
              </Button>
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
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Expiring in ~15 mins
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

        {/* Buy flow */}
        <div className="lg:col-span-7">
          <Card className="glass-card h-full border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-500" />
            <CardContent className="p-0">

              {/* Step tabs */}
              <div className="flex border-b border-border">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
                      step >= s ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {s === 1 ? "1. Country" : s === 2 ? "2. Service" : "3. Pay & Get OTP"}
                  </div>
                ))}
              </div>

              <div className="p-6">

                {/* Step 1 — Country */}
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search countries..."
                        className="pl-10 h-12 bg-background/50"
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                      {filteredCountries.map((country) => (
                        <div
                          key={country.id}
                          onClick={() => { setSelectedCountry(country); setStep(2); }}
                          className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedCountry?.id === country.id
                              ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                              : "border-border bg-background/30 hover:border-primary/50"
                          }`}
                        >
                          <img src={country.flag} alt={country.name} className="w-6 h-auto mr-3 rounded-sm shadow-sm" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{country.name}</div>
                            <div className="text-xs text-muted-foreground">{country.code}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2 — Service */}
                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 mb-6">
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="px-2 h-8">
                        Back to Countries
                      </Button>
                      <div className="flex-1" />
                      <div className="text-sm font-medium flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                        <img src={selectedCountry.flag} alt="" className="w-4" /> {selectedCountry.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => { setSelectedService(service); setStep(3); }}
                          className="flex flex-col items-center p-4 rounded-xl border border-border bg-background/30 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
                        >
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <img src={service.icon} alt={service.name} className="w-6 h-6 object-contain" />
                          </div>
                          <div className="font-medium text-sm">{service.name}</div>
                          <div className="text-primary font-bold mt-1">₦{service.price}</div>
                          <div className="text-[10px] text-muted-foreground mt-2 bg-background px-2 py-0.5 rounded-full">
                            {service.successRate}% Success
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3 — PIN + confirm */}
                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="px-2 h-8 mb-4">
                      Back to Services
                    </Button>

                    <div className="bg-card/50 border border-border rounded-xl p-5 mb-6">
                      <h3 className="font-semibold mb-4 border-b border-border pb-3">Order Summary</h3>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <img src={selectedCountry.flag} alt="" className="w-4 mr-2" /> Country
                        </div>
                        <div className="font-medium">{selectedCountry.name}</div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-muted-foreground">Service</div>
                        <div className="flex items-center font-medium">
                          <img src={selectedService.icon} alt="" className="w-4 mr-2" /> {selectedService.name}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
                        <div className="text-sm font-medium">Total Cost</div>
                        <div className="text-xl font-bold text-primary">₦{selectedService.price}</div>
                      </div>
                    </div>

                    {buyError && (
                      <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                        {buyError}
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground mb-4">Enter your 4-digit PIN to confirm purchase</p>
                      <div className="flex justify-center gap-3">
                        {[0, 1, 2, 3].map((i) => (
                          <input
                            key={i}
                            id={`pin-${i}`}
                            type="password"
                            maxLength={1}
                            value={pin[i]}
                            onChange={(e) => handlePinChange(i, e.target.value)}
                            className="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 text-lg"
                      onClick={submitOrder}
                      disabled={pin.join("").length < 4}
                    >
                      Pay & Get Number
                    </Button>
                  </div>
                )}

                {/* Step 4 — Loading */}
                {step === 4 && (
                  <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                    <h3 className="text-xl font-semibold mb-2">Awaiting SMS...</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                      We've generated your number. Please send the SMS from {selectedService.name}.
                    </p>
                    {numberResult && (
                      <div className="mt-8 p-4 bg-muted/30 rounded-xl border border-border w-full max-w-xs text-center">
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Your Number</div>
                        <div className="text-2xl font-mono tracking-widest text-foreground">
                          {numberResult.phone || numberResult.number || "Generating..."}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5 — Success */}
                {step === 5 && (
                  <div className="py-8 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{otp ? "OTP Received!" : "Number Ready!"}</h3>
                    <p className="text-muted-foreground mb-8">
                      {otp ? "Your verification code is ready." : "Waiting for SMS to arrive…"}
                    </p>

                    {numberResult && (
                      <div className="mb-4 p-4 bg-muted/30 rounded-xl border border-border w-full max-w-sm text-center">
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Your Number</div>
                        <div className="text-2xl font-mono tracking-widest text-foreground">
                          {numberResult.phone || numberResult.number}
                        </div>
                      </div>
                    )}

                    {otp ? (
                      <div className="bg-primary/10 border-2 border-primary border-dashed rounded-2xl p-8 w-full max-w-sm text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5" />
                        <div className="relative z-10">
                          <div className="text-sm font-medium text-primary mb-2 uppercase tracking-widest">Verification Code</div>
                          <div className="text-5xl font-mono font-bold tracking-[0.2em] text-foreground drop-shadow-md">{otp}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" /> Waiting for OTP…
                      </div>
                    )}

                    <Button variant="outline" className="mt-8 h-12 px-8" onClick={resetFlow}>
                      Buy Another Number
                    </Button>
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
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setLocation("/wallet")}>
                View All
              </Button>
            </div>
            <div className="flex-1 p-0 overflow-y-auto">
              {loadingStats ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  No transactions yet
                </div>
              ) : (
                transactions.map((tx, i) => (
                  <div
                    key={tx._id || tx.id || i}
                    className={`p-4 flex items-center justify-between border-b border-border hover:bg-white/5 transition-colors ${
                      i === transactions.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "Credit" || tx.type === "credit"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {tx.type === "Credit" || tx.type === "credit"
                          ? <ShieldCheck className="w-5 h-5" />
                          : <ChevronRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{tx.description || tx.narration || "Transaction"}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.date || tx.createdAt).toLocaleDateString()} • {tx.status}
                        </div>
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
    </DashboardLayout>
  );
}
