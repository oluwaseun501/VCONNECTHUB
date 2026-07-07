import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

const GLIDE = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
const SUCCESS_REDIRECT_SECONDS = 5;
const ERROR_REDIRECT_SECONDS   = 8;

export default function WalletVerify() {
  const [, navigate]   = useLocation();
  const { refreshUser } = useAuth();

  const [status, setStatus]       = useState("loading"); // loading | success | error
  const [message, setMessage]     = useState("");
  const [balance, setBalance]     = useState(null);
  const [countdown, setCountdown] = useState(SUCCESS_REDIRECT_SECONDS);

  /* ── Verify on mount ── */
  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    const reference = params.get("reference");

    if (!reference) {
      setStatus("error");
      setMessage("Missing payment reference. Please try funding your wallet again.");
      setCountdown(ERROR_REDIRECT_SECONDS);
      return;
    }

    // Always use Korapay — it's the only active provider
    const verify = async () => {
      try {
        const { data } = await api.get(`/api/wallet/verify/korapay/${reference}`);
        setBalance(data.balance ?? null);
        setStatus("success");
        setMessage(data.message || "Your wallet has been funded successfully.");
        setCountdown(SUCCESS_REDIRECT_SECONDS);
        await refreshUser();
      } catch (err) {
        setStatus("error");
        setMessage(err?.response?.data?.message || "We could not verify your payment. If money was deducted, contact support.");
        setCountdown(ERROR_REDIRECT_SECONDS);
      }
    };

    verify();
  }, []);

  /* ── Auto-redirect for both success AND error ── */
  useEffect(() => {
    if (status === "loading") return;
    if (countdown <= 0) {
      navigate("/dashboard");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={GLIDE}
        className="bg-card border border-border rounded-2xl p-8 text-center space-y-5 shadow-xl max-w-sm w-full"
      >

        {/* ── Loading ── */}
        {status === "loading" && (
          <>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.28)" }}
            >
              <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#7c3aed" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Verifying Payment…</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Please wait while we confirm your transaction.
              </p>
            </div>
          </>
        )}

        {/* ── Success ── */}
        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.28)" }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: "#10b981" }} />
            </motion.div>

            <div>
              <h2 className="text-xl font-bold text-foreground">Payment Successful! 🎉</h2>
              <p className="text-muted-foreground text-sm mt-1">{message}</p>
              {balance !== null && (
                <p className="text-sm mt-3 font-medium text-foreground">
                  New balance:{" "}
                  <span className="font-bold" style={{ color: "#10b981" }}>
                    ₦{Number(balance).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </p>
              )}
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full h-11 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              Go to Dashboard
            </button>

            <p className="text-xs text-muted-foreground">
              Redirecting automatically in <span className="font-semibold text-foreground">{countdown}s</span>…
            </p>
          </>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)" }}
            >
              <XCircle className="w-10 h-10" style={{ color: "#ef4444" }} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">Verification Failed</h2>
              <p className="text-muted-foreground text-sm mt-1">{message}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/wallet")}
                className="flex-1 h-11 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 h-11 rounded-xl text-sm font-semibold text-foreground transition-all hover:opacity-80"
                style={{ background: "rgba(100,100,100,0.15)" }}
              >
                Dashboard
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Redirecting to dashboard in <span className="font-semibold text-foreground">{countdown}s</span>…
            </p>
          </>
        )}

      </motion.div>
    </div>
  );
}
