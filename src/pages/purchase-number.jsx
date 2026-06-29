import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronDown, ShoppingCart, CheckCircle2,
  AlertCircle, Globe, Zap, Shield
} from "lucide-react";
import {
  SiWhatsapp, SiTelegram, SiTiktok, SiFacebook,
  SiInstagram, SiX, SiSnapchat, SiGmail,
  SiBinance, SiSignal,
} from "react-icons/si";
import { DashboardLayout } from "@/components/layout/DashboardLayout";



const GLIDE = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

/* ── Countries ── */
const COUNTRIES = [
  { code: "NG", name: "Nigeria",       flag: "🇳🇬" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom",flag: "🇬🇧" },
  { code: "GH", name: "Ghana",         flag: "🇬🇭" },
  { code: "CA", name: "Canada",        flag: "🇨🇦" },
  { code: "IN", name: "India",         flag: "🇮🇳" },
  { code: "AU", name: "Australia",     flag: "🇦🇺" },
  { code: "DE", name: "Germany",       flag: "🇩🇪" },
  { code: "FR", name: "France",        flag: "🇫🇷" },
  { code: "BR", name: "Brazil",        flag: "🇧🇷" },
  { code: "JP", name: "Japan",         flag: "🇯🇵" },
  { code: "ZA", name: "South Africa",  flag: "🇿🇦" },
  { code: "KE", name: "Kenya",         flag: "🇰🇪" },
  { code: "EG", name: "Egypt",         flag: "🇪🇬" },
  { code: "MX", name: "Mexico",        flag: "🇲🇽" },
];

/* ── Services ── */
const SERVICES = [
  { id: "whatsapp",  name: "WhatsApp",          icon: SiWhatsapp,  price: 1200, color: "#25D366" },
  { id: "telegram",  name: "Telegram",          icon: SiTelegram,  price: 1000, color: "#2AABEE" },
  { id: "tiktok",    name: "TikTok",            icon: SiTiktok,    price: 1300, color: "#010101" },
  { id: "facebook",  name: "Facebook",          icon: SiFacebook,  price: 1100, color: "#1877F2" },
  { id: "instagram", name: "Instagram+Threads", icon: SiInstagram, price: 1200, color: "#E4405F" },
 { id: "twitter", name: "Twitter / X", icon: SiX, price: 1200, color: "#000000" },
  { id: "snapchat",  name: "Snapchat",          icon: SiSnapchat,  price: 1500, color: "#FFFC00" },
  { id: "gmail",     name: "Gmail",             icon: SiGmail,     price: 1400, color: "#EA4335" },
  { id: "binance",   name: "Binance",           icon: SiBinance,   price: 1800, color: "#F3BA2F" },
  { id: "signal",    name: "Signal",            icon: SiSignal,    price: 1000, color: "#3A76F0" },
];

const WALLET_BALANCE = 5000; // Replace with real balance from your auth/state

const STEP_SELECT   = "select";
const STEP_CONFIRM  = "confirm";
const STEP_OTP      = "otp";
const STEP_SUCCESS  = "success";

function generateFakeNumber(country) {
  const prefixes = { NG: "+234", US: "+1", UK: "+44", GH: "+233", CA: "+1", IN: "+91", AU: "+61" };
  const prefix = prefixes[country] || "+1";
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9) + 1).join("");
  return `${prefix} ${digits.slice(0,3)} ${digits.slice(3,6)} ${digits.slice(6)}`;
}

export default function PurchaseNumber() {
  const [, navigate] = useLocation();

  const [countrySearch, setCountrySearch]   = useState("");
  const [countryOpen, setCountryOpen]       = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [serviceSearch, setServiceSearch]   = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep]                     = useState(STEP_SELECT);
  const [otp, setOtp]                       = useState("");
  const [otpError, setOtpError]             = useState("");
  const [purchasedNumber, setPurchasedNumber] = useState("");

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filteredServices = SERVICES.filter((s) =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const canAfford = (price) => WALLET_BALANCE >= price;

const handlePurchase = () => {
  if (!selectedService) return;
  const number = generateFakeNumber(selectedCountry.code);
  setPurchasedNumber(number);

  const existing = JSON.parse(localStorage.getItem("purchased_numbers") || "[]");
  const newEntry = {
    id: Date.now(),
    number,
    service: selectedService.name,
    serviceId: selectedService.id,
    country: selectedCountry.name,
    countryFlag: selectedCountry.flag,
    price: selectedService.price,
    purchasedAt: new Date().toISOString(),
    status: "waiting",
    smsCode: null,
  };
  localStorage.setItem("purchased_numbers", JSON.stringify([newEntry, ...existing]));
  setStep(STEP_SUCCESS); // go straight to success, no OTP input
};

  const handleOtpSubmit = () => {
    if (!otp.trim()) { setOtpError("Please enter the OTP code you received"); return; }
    if (otp.length < 4) { setOtpError("OTP is too short — check and try again"); return; }

    /* Update entry with OTP */
    const existing = JSON.parse(localStorage.getItem("purchased_numbers") || "[]");
    const updated  = existing.map((n) =>
      n.id === parseInt(localStorage.getItem("latest_purchase_id"))
        ? { ...n, otp, status: "received" }
        : n
    );
    localStorage.setItem("purchased_numbers", JSON.stringify(updated));
    setStep(STEP_SUCCESS);
  };

  const goToMyNumbers = () => navigate("/my-numbers");

  return (
  <DashboardLayout>
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={GLIDE} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Virtual Numbers</h1>
            <p className="text-muted-foreground text-sm mt-1">Buy a temporary number for SMS verification in 190+ countries</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border shadow-sm">
            <Globe className="w-4 h-4 text-violet-500" />
            <div>
              <p className="text-xs text-muted-foreground leading-none mb-0.5">Available Countries</p>
              <p className="text-sm font-bold text-foreground">196</p>
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
              <p className="text-lg font-bold text-foreground">₦{WALLET_BALANCE.toLocaleString()}</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-all">
            + Add Funds
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── Step: Select ── */}
        {step === STEP_SELECT && (
          <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={GLIDE}
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

                <div className="relative">
                  <button
                    onClick={() => setCountryOpen(!countryOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-muted/50 hover:border-violet-500/40 transition-all"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                      <span className="text-xl">{selectedCountry.flag}</span>
                      {selectedCountry.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${countryOpen ? "rotate-180" : ""}`} />
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
                          {filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => { setSelectedCountry(c); setCountryOpen(false); setCountrySearch(""); }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted text-left transition-colors ${
                                selectedCountry.code === c.code ? "bg-violet-500/10 text-violet-600 dark:text-violet-400" : "text-foreground"
                              }`}
                            >
                              <span className="text-lg">{c.flag}</span>
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredServices.map((service) => {
                    const Icon     = service.icon;
                    const selected = selectedService?.id === service.id;
                    const afford   = canAfford(service.price);

                    return (
                      <button
                        key={service.id}
                        onClick={() => afford && setSelectedService(service)}
                        disabled={!afford}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                          selected
                            ? "border-violet-500 bg-violet-500/10 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                            : afford
                              ? "border-border hover:border-violet-500/40 hover:bg-muted/50 cursor-pointer"
                              : "border-border opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: service.color + "22" }}>
                          <Icon className="w-5 h-5" style={{ color: service.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{service.name}</p>
                          <p className={`text-xs font-bold ${afford ? "text-violet-600 dark:text-violet-400" : "text-red-500"}`}>
                            ₦{service.price.toLocaleString()}
                            {!afford && " — Low balance"}
                          </p>
                        </div>
                        {selected && <div className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
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
                      {selectedCountry.flag} {selectedCountry.name}
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
                      {selectedService ? `₦${selectedService.price.toLocaleString()}` : "—"}
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
                  onClick={handlePurchase}
                  disabled={!selectedService}
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

        {/* ── Step: Enter OTP ── */}
        {step === STEP_OTP && (
          <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={GLIDE}
            className="max-w-md mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6 text-center">
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Number Assigned!</h2>
                <p className="text-muted-foreground text-sm">Your virtual number is ready. Use it to verify your account, then enter the OTP here.</p>
              </div>

              {/* The number */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-600/10 to-fuchsia-500/10 border border-violet-500/20">
                <p className="text-xs text-muted-foreground mb-1">Your virtual number ({selectedCountry.flag} {selectedService?.name})</p>
                <p className="text-2xl font-bold text-foreground tracking-wide">{purchasedNumber}</p>
                <p className="text-xs text-emerald-500 mt-1 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Waiting for OTP…
                </p>
              </div>

              {/* OTP input */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-muted-foreground">Enter OTP Code (when received)</label>
                <input
                  type="text"
                  placeholder="e.g. 483920"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); setOtpError(""); }}
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border text-foreground text-xl font-bold text-center tracking-[0.3em] outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
                />
                <AnimatePresence>
                  {otpError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> {otpError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={goToMyNumbers}
                  className="flex-1 h-11 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted hover:text-foreground transition-all"
                >
                  View in My Numbers
                </button>
                <button
                  onClick={handleOtpSubmit}
                  disabled={!otp.trim()}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
                >
                  Submit OTP →
                </button>
              </div>
            </div>
          </motion.div>
        )}

     


{step === STEP_SUCCESS && (
  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={GLIDE}
    className="max-w-md mx-auto"
  >
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6 text-center">
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
        <p className="text-muted-foreground text-sm mt-1">Use this number to verify your {selectedService?.name} account</p>
      </div>

      {/* The number */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-500/10 border border-violet-500/20 space-y-2">
        <p className="text-xs text-muted-foreground">{selectedCountry.flag} {selectedService?.name} · {selectedCountry.name}</p>
        <p className="text-3xl font-bold text-foreground tracking-wide">{purchasedNumber}</p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Waiting for SMS code…
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2 text-sm">
        <p className="font-semibold text-foreground">What to do next:</p>
        <ol className="space-y-1.5 text-muted-foreground list-decimal list-inside">
          <li>Copy the number above</li>
          <li>Open {selectedService?.name} and enter it as your phone number</li>
          <li>Request the verification SMS</li>
          <li>Come back to <strong className="text-foreground">My Numbers</strong> — the code will appear there automatically</li>
        </ol>
      </div>

      <div className="flex gap-3">
        <button onClick={() => { setStep(STEP_SELECT); setSelectedService(null); }}
          className="flex-1 h-11 rounded-xl border border-border text-foreground text-sm hover:bg-muted transition-all"
        >
          Buy Another
        </button>
        <button onClick={goToMyNumbers}
          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm hover:opacity-90 transition-all"
        >
          My Numbers →
        </button>
      </div>
    </div>
  </motion.div>
)}
    
      </AnimatePresence>
        </div>
  </DashboardLayout>
  );
}