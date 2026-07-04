import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

const GLIDE = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
const AUTO_REDIRECT_SECONDS = 5;

export default function WalletVerify() {
  const [, navigate] = useLocation();
  const { refreshUser } = useAuth();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(null);
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    const provider = params.get("provider"); // "korapay" or absent (paystack)

    if (!reference) {
      setStatus("error");
      setMessage("Missing payment reference.");
      return;
    }

    const verify = async () => {
      try {
        const url =
          provider === "korapay"
            ? `/api/wallet/verify/korapay/${reference}`
            : `/api/wallet/verify/${reference}`;

        const { data } = await api.get(url);
        setBalance(data.balance ?? null);
        setStatus("success");
        setMessage(data.message || "Wallet funded successfully");
        await refreshUser();
      } catch (err) {
        setStatus("error");
        setMessage(err?.response?.data?.message || "Payment verification failed.");
      }
    };

    verify();
  }, []);

  // Auto-redirect to dashboard after success
  useEffect(() => {
    if (status !== "success") return;
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
        {status === "loading" && (
          <>
            <div className="w-20 h-20 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Verifying Payment…</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Please wait while we confirm your transaction.
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Payment Successful!</h2>
              <p className="text-muted-foreground text-sm mt-1">{message}</p>
              {balance !== null && (
                <p className="text-sm mt-2">
                  New balance:{" "}
                  <span className="font-semibold text-foreground">₦{Number(balance).toFixed(2)}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:opacity-90 transition-all"
            >
              Go to Dashboard
            </button>
            <p className="text-xs text-muted-foreground">
              Redirecting automatically in {countdown}s…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Verification Failed</h2>
              <p className="text-muted-foreground text-sm mt-1">{message}</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full h-11 rounded-xl bg-muted text-foreground font-semibold text-sm hover:bg-muted/70 transition-all"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}