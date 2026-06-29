import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight, Search, CheckCircle2, AlertCircle,
  ArrowLeft, ShieldCheck, Eye, EyeOff, Copy, Check
} from "lucide-react";

const GLIDE = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

/* Generate a VID from email (deterministic, for demo) */
function generateVID(email = "") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  let result = "VC-";
  for (let i = 0; i < 6; i++) {
    result += chars[hash % chars.length];
    hash = Math.floor(hash / chars.length) + i * 7;
  }
  return result;
}

/* Mock: lookup a VID (replace with real API call) */
function lookupVID(vid) {
  const mockUsers = {
    "VC-ABC123": { name: "Adewale K.",   avatar: "AK", balance: null },
    "VC-XY9K2M": { name: "Fatima U.",   avatar: "FU", balance: null },
    "VC-38KN2P": { name: "Chukwu E.",   avatar: "CE", balance: null },
    "VC-MN7P4Q": { name: "Blessing A.", avatar: "BA", balance: null },
  };
  return mockUsers[vid.toUpperCase()] || null;
}

/* PIN input */
function PinInput({ value, onChange, reveal }) {
  const inputs = useRef([]);

  const handleChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[i] = digit;
    onChange(arr.join(""));
    if (digit && i < 3) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      const arr = value.split("");
      arr[i - 1] = "";
      onChange(arr.join(""));
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type={reveal ? "text" : "password"}
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-14 h-14 text-center text-xl font-bold rounded-2xl border-2 transition-all outline-none bg-muted/50 ${
            value[i]
              ? "border-violet-500 bg-violet-500/10 text-foreground shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
              : "border-border text-foreground focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
          }`}
        />
      ))}
    </div>
  );
}

const STEP_RECIPIENT = "recipient";
const STEP_AMOUNT    = "amount";
const STEP_PIN       = "pin";
const STEP_SUCCESS   = "success";

/* Your own VID (swap with real user data from auth) */
const MY_EMAIL   = "user@example.com";
const MY_VID     = generateVID(MY_EMAIL);
const MY_BALANCE = 42.50;

export default function Transfer() {
  const [step, setStep]           = useState(STEP_RECIPIENT);
  const [vidInput, setVidInput]   = useState("");
  const [recipient, setRecipient] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [amount, setAmount]       = useState("");
  const [pin, setPin]             = useState("");
  const [reveal, setReveal]       = useState(false);
  const [pinError, setPinError]   = useState("");
  const [copied, setCopied]       = useState(false);

  const myPin = localStorage.getItem("txn_pin");

  const handleLookup = () => {
    setLookupError("");
    const found = lookupVID(vidInput.trim());
    if (!found) {
      setLookupError("No account found with this VID. Check and try again.");
      return;
    }
    if (vidInput.toUpperCase() === MY_VID) {
      setLookupError("You can't transfer to yourself.");
      return;
    }
    setRecipient(found);
    setStep(STEP_AMOUNT);
  };

  const handleAmount = () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) return;
    if (amt > MY_BALANCE) {
      return;
    }
    if (!myPin) {
      window.location.href = "/set-pin";
      return;
    }
    setStep(STEP_PIN);
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === myPin) {
        setStep(STEP_SUCCESS);
      } else {
        setPinError("Incorrect PIN. Try again.");
        setPin("");
      }
    }
  }, [pin, myPin]);

  const copyVID = () => {
    navigator.clipboard.writeText(MY_VID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep(STEP_RECIPIENT);
    setVidInput("");
    setRecipient(null);
    setLookupError("");
    setAmount("");
    setPin("");
    setPinError("");
  };

  const steps = [STEP_RECIPIENT, STEP_AMOUNT, STEP_PIN];
  const stepIdx = steps.indexOf(step);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={GLIDE} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transfer Funds</h1>
            <p className="text-muted-foreground text-sm">Send wallet balance to a VConnectHub friend</p>
          </div>
        </div>
      </motion.div>

      {/* Your VID card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...GLIDE, delay: 0.1 }}
        className="bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-2xl p-5 mb-6 shadow-lg shadow-violet-500/20"
      >
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Your VConnect ID</p>
        <div className="flex items-center justify-between">
          <span className="text-white text-2xl font-bold tracking-widest">{MY_VID}</span>
          <button onClick={copyVID} className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs border border-white/20 rounded-lg px-2.5 py-1.5 hover:bg-white/10 transition-all">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-white/60 text-xs mt-2">Share this ID so friends can send you funds</p>
      </motion.div>

      {/* Step progress */}
      {step !== STEP_SUCCESS && (
        <div className="flex gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= stepIdx ? "bg-violet-500" : "bg-border"
            }`} />
          ))}
        </div>
      )}

      {/* Steps */}
      <AnimatePresence mode="wait">

        {/* ── Step 1: Recipient ── */}
        {step === STEP_RECIPIENT && (
          <motion.div key="recipient" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={GLIDE}
            className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm"
          >
            <div>
              <h2 className="font-bold text-lg text-foreground">Who are you sending to?</h2>
              <p className="text-muted-foreground text-sm mt-1">Enter your friend's VConnect ID (e.g. VC-38KN2P)</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">VConnect ID</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="VC-XXXXXX"
                  value={vidInput}
                  onChange={(e) => { setVidInput(e.target.value.toUpperCase()); setLookupError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  maxLength={9}
                  className="w-full h-12 pl-4 pr-12 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-sm font-mono tracking-widest outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all uppercase"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>

              <AnimatePresence>
                {lookupError && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {lookupError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Demo hint */}
            <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Try these test IDs:</p>
              <div className="flex flex-wrap gap-1.5">
                {["VC-ABC123", "VC-XY9K2M", "VC-38KN2P"].map((id) => (
                  <button key={id} onClick={() => setVidInput(id)}
                    className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 font-mono hover:bg-violet-500/20 transition-colors"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleLookup}
              disabled={vidInput.length < 8}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:opacity-90 disabled:opacity-40 transition-all"
            >
              Find Account →
            </button>
          </motion.div>
        )}

        {/* ── Step 2: Amount ── */}
        {step === STEP_AMOUNT && recipient && (
          <motion.div key="amount" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={GLIDE}
            className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm"
          >
            {/* Recipient info */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">{recipient.avatar}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{recipient.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{vidInput.toUpperCase()}</p>
              </div>
              <button onClick={() => { setStep(STEP_RECIPIENT); setRecipient(null); }} className="ml-auto text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1.5 hover:bg-muted transition-all">
                Change
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Amount (₦)</label>
                <span className="text-xs text-muted-foreground">Balance: <span className="text-foreground font-semibold">₦{MY_BALANCE.toFixed(2)}</span></span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">₦</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max={MY_BALANCE}
                  className="w-full h-16 pl-10 pr-4 rounded-xl bg-muted/50 border border-border text-foreground text-2xl font-bold outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all"
                />
              </div>
              {parseFloat(amount) > MY_BALANCE && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Insufficient balance
                </p>
              )}

              {/* Quick amounts */}
              <div className="flex gap-2">
                {[100, 200, 500, 1000].map((amt) => (
                  <button key={amt} onClick={() => setAmount(String(amt))}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 transition-colors"
                  >
                    ₦{amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAmount}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > MY_BALANCE}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:opacity-90 disabled:opacity-40 transition-all"
            >
              Continue →
            </button>
          </motion.div>
        )}

        {/* ── Step 3: PIN ── */}
        {step === STEP_PIN && (
          <motion.div key="pin" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={GLIDE}
            className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-violet-500" />
            </div>

            <div>
              <h2 className="font-bold text-lg text-foreground">Enter your PIN</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Sending <span className="font-semibold text-foreground">₦{parseFloat(amount).toLocaleString()}</span> to <span className="font-semibold text-foreground">{recipient?.name}</span>
              </p>
            </div>

            <PinInput value={pin} onChange={(v) => { setPin(v); setPinError(""); }} reveal={reveal} />

            <AnimatePresence>
              {pinError && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-sm text-red-500 dark:text-red-400 flex items-center justify-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4" /> {pinError}
                </motion.p>
              )}
            </AnimatePresence>

            <button onClick={() => setReveal(!reveal)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mx-auto transition-colors">
              {reveal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {reveal ? "Hide" : "Show"} PIN
            </button>

            <div className="bg-muted/50 rounded-xl py-3 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Secured with end-to-end encryption
            </div>

            <button onClick={() => setStep(STEP_AMOUNT)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Go back
            </button>
          </motion.div>
        )}

        {/* ── Step 4: Success ── */}
        {step === STEP_SUCCESS && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={GLIDE}
            className="bg-card border border-border rounded-2xl p-8 space-y-5 shadow-sm text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </motion.div>

            <div>
              <h2 className="text-xl font-bold text-foreground">Transfer Successful!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                <span className="font-semibold text-emerald-500">₦{parseFloat(amount).toLocaleString()}</span> sent to <span className="font-semibold text-foreground">{recipient?.name}</span>
              </p>
            </div>

            {/* Receipt */}
            <div className="bg-muted/50 border border-border rounded-xl p-4 text-left space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-medium text-foreground">{recipient?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VConnect ID</span>
                <span className="font-mono text-foreground">{vidInput.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-emerald-500">₦{parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-emerald-500 font-medium">Completed ✓</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 h-11 rounded-xl border border-border bg-muted/50 text-foreground text-sm font-medium hover:bg-muted transition-all">
                New Transfer
              </button>
              <Link href="/dashboard" className="flex-1">
                <button className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm hover:opacity-90 transition-all">
                  Dashboard →
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}