import { useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

/**
 * Shared Fund Wallet modal (Korapay only).
 * Props:
 *   isOpen   — boolean
 *   onClose  — () => void
 */
export default function FundWalletModal({ isOpen, onClose }) {
  const [fundAmount, setFundAmount] = useState("1000");
  const [funding, setFunding]       = useState(false);
  const [fundError, setFundError]   = useState("");

  const handleFund = async () => {
    const amount = parseFloat(fundAmount);
    if (!amount || amount < 100) { setFundError("Minimum amount is ₦100"); return; }
    setFundError("");
    setFunding(true);
    try {
      const { data } = await api.post("/api/wallet/fund/korapay", { amount });
      const url = data?.checkoutUrl || data?.data?.checkout_url;
      if (url) window.location.href = url;
      else throw new Error("No checkout URL returned");
    } catch (err) {
      setFundError(err?.response?.data?.message || "Payment initiation failed. Try again.");
    } finally {
      setFunding(false);
    }
  };

  const handleClose = () => {
    setFundError("");
    setFundAmount("1000");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold">Fund Wallet</h3>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Amount */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Amount to fund (₦)</label>
                <Input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="h-14 text-xl font-bold bg-background/50"
                />
                <div className="flex gap-2">
                  {["1000", "2000", "5000", "10000"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setFundAmount(amt)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        fundAmount === amt
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-background hover:bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      ₦{Number(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error banner */}
              {fundError && (
                <div
                  className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border"
                  style={{ backgroundColor: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.30)" }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                  <p className="text-sm leading-snug" style={{ color: "#f87171" }}>{fundError}</p>
                </div>
              )}

              {/* Pay button */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  Powered by Korapay — secure card &amp; bank payments
                </p>
                <button
                  onClick={handleFund}
                  disabled={funding}
                  className="w-full h-14 rounded-xl font-bold text-white text-base transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                >
                  {funding ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                  ) : (
                    <>Pay ₦{Number(fundAmount || 0).toLocaleString()} with Korapay</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
