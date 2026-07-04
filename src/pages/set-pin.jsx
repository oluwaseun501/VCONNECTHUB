import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { KeyRound, ShieldCheck, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const GLIDE = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

/* ── Single 4-box PIN input row — your original component, unchanged ── */
function PinInput({ value, onChange, label, disabled = false, reveal = false }) {
  const inputs = useRef([]);

  const handleChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[i] = digit;
    const next = arr.join("");
    onChange(next);
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

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    onChange(pasted.padEnd(4, "").slice(0, 4));
    inputs.current[Math.min(pasted.length, 3)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-muted-foreground text-center">{label}</p>}
      <div className="flex gap-3 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type={reveal ? "text" : "password"}
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={value[i] || ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={`w-14 h-14 text-center text-xl font-bold rounded-2xl border-2 transition-all duration-200 outline-none bg-muted/50
              ${value[i]
                ? "border-violet-500 bg-violet-500/10 text-foreground shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
                : "border-border text-foreground focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
              }
              ${disabled ? "opacity-40 cursor-not-allowed" : ""}
            `}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Steps ── */
const STEP_NEW     = "new";
const STEP_CONFIRM = "confirm";
const STEP_SUCCESS = "success";

export default function SetPin() {
  const { user, refreshUser } = useAuth();
  const pinAlreadySet = user?.hasPin ?? false;

  const [step, setStep]       = useState(STEP_NEW);
  const [newPin, setNewPin]   = useState("");
  const [confPin, setConfPin] = useState("");
  const [reveal, setReveal]   = useState(false);
  const [error, setError]     = useState("");
  const [saving, setSaving]   = useState(false);
  const [, navigate]          = useLocation();

  useEffect(() => {
    if (newPin.length === 4 && step === STEP_NEW) {
      setTimeout(() => setStep(STEP_CONFIRM), 300);
    }
  }, [newPin, step]);

  useEffect(() => {
    if (confPin.length === 4 && step === STEP_CONFIRM) {
      if (confPin === newPin) {
        savePin(confPin);
      } else {
        setError("PINs don't match. Try again.");
        setConfPin("");
      }
    }
  }, [confPin, newPin, step]);

  const savePin = async (pin) => {
    setSaving(true);
    setError("");
    try {
      await api.post("/api/users/set-pin", { pin });
      await refreshUser();
      setStep(STEP_SUCCESS);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save PIN. Please try again.");
      setConfPin("");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setNewPin("");
    setConfPin("");
    setError("");
    setStep(STEP_NEW);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center px-4 py-12">

        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">

            {/* ── Success ── */}
            {step === STEP_SUCCESS && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...GLIDE }}
                className="bg-card border border-border rounded-2xl p-8 text-center space-y-5 shadow-xl"
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
                  <h2 className="text-xl font-bold text-foreground">PIN {pinAlreadySet ? "Updated" : "Set"} Successfully!</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your 4-digit transaction PIN is now active.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl py-3">
                  <ShieldCheck className="w-4 h-4" />
                  Secured with end-to-end encryption
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:opacity-90 transition-all"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}

            {/* ── Set / Confirm PIN ── */}
            {step !== STEP_SUCCESS && (
              <motion.div
                key="pin-form"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={GLIDE}
                className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-xl"
              >
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 mx-auto">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      {pinAlreadySet ? "Change Your PIN" : "Set Transaction PIN"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step === STEP_NEW
                        ? "Choose a 4-digit PIN for purchases"
                        : "Re-enter your PIN to confirm"}
                    </p>
                  </div>
                </div>

                {/* Step indicators */}
                <div className="flex gap-2 justify-center">
                  {[STEP_NEW, STEP_CONFIRM].map((s, i) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        step === s
                          ? "w-8 bg-violet-500"
                          : i < [STEP_NEW, STEP_CONFIRM].indexOf(step)
                            ? "w-4 bg-violet-500/50"
                            : "w-4 bg-border"
                      }`}
                    />
                  ))}
                </div>

                {/* PIN input */}
                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: step === STEP_CONFIRM ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: step === STEP_CONFIRM ? -30 : 30 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <PinInput
                        value={step === STEP_NEW ? newPin : confPin}
                        onChange={step === STEP_NEW ? setNewPin : setConfPin}
                        reveal={reveal}
                        label={step === STEP_NEW ? "Enter new PIN" : "Confirm PIN"}
                        disabled={saving}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Saving indicator */}
                  {saving && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving your PIN…
                    </div>
                  )}

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-sm text-red-500 dark:text-red-400 font-medium"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Reveal toggle */}
                  <button
                    type="button"
                    onClick={() => setReveal(!reveal)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mx-auto transition-colors"
                  >
                    {reveal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {reveal ? "Hide PIN" : "Show PIN"}
                  </button>
                </div>

                {/* Security note */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-xl py-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Never share your PIN with anyone
                </div>

                {/* Reset */}
                {step === STEP_CONFIRM && (
                  <button
                    onClick={handleReset}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                  >
                    ← Start over
                  </button>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}