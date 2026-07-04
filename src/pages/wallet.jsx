import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, CreditCard, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";

export default function WalletPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("1000");
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [funding, setFunding] = useState(false);
  const [fundError, setFundError] = useState("");

  // Fetch real transactions on mount
  useEffect(() => {
    api.get("/api/wallet/transactions")
      .then(({ data }) => {
        const list = data?.transactions || data?.data || (Array.isArray(data) ? data : []);
        setTransactions(list);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoadingTx(false));
  }, []);

  const handleFund = async (provider) => {
    const amount = parseFloat(fundAmount);
    if (!amount || amount < 100) { setFundError("Minimum amount is ₦100"); return; }
    setFundError("");
    setFunding(true);
    try {
      if (provider === "paystack") {
        const { data } = await api.post("/api/wallet/fund", { amount });
        const url = data?.authorizationUrl || data?.data?.authorization_url;
        if (url) window.location.href = url;
        else throw new Error("No URL returned");
      } else {
        const { data } = await api.post("/api/wallet/fund/korapay", { amount });
        const url = data?.checkoutUrl || data?.data?.checkout_url;
        if (url) window.location.href = url;
        else throw new Error("No URL returned");
      }
    } catch (err) {
      setFundError(err?.response?.data?.message || "Payment initiation failed. Try again.");
    } finally {
      setFunding(false);
    }
  };

  const balance = user?.balance ?? 0;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet & Billing</h1>
          <p className="text-muted-foreground mt-1">Manage your funds and view transactions.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="glow-effect">
          <WalletIcon className="w-4 h-4 mr-2" /> Fund Wallet
        </Button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="glass-card md:col-span-2 relative overflow-hidden bg-gradient-to-br from-card/80 to-card">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
              <div>
                <div className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wider">Total Balance</div>
                <div className="text-5xl font-bold text-foreground">
                  ₦{Number(balance).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="h-12 border-primary/20 text-primary hover:bg-primary/10">
                  Withdraw
                </Button>
                <Button className="h-12 glow-effect" onClick={() => setIsModalOpen(true)}>
                  Add Funds
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-dashed border-2 border-border/50 flex flex-col items-center justify-center p-8 text-center bg-transparent">
          <CreditCard className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-semibold text-muted-foreground mb-2">Auto-Recharge</h3>
          <p className="text-xs text-muted-foreground/70">Keep your balance topped up automatically.</p>
          <Button variant="link" className="mt-2 h-auto p-0">Configure setup</Button>
        </Card>
      </div>

      {/* Transaction table */}
      <Card className="glass-card">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-lg">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          {loadingTx ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No transactions yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left font-medium p-4">Description</th>
                  <th className="text-left font-medium p-4">Type</th>
                  <th className="text-left font-medium p-4">Amount</th>
                  <th className="text-left font-medium p-4">Status</th>
                  <th className="text-right font-medium p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id || tx.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{tx.description}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {tx.type === "credit" ? (
                          <><ArrowUpRight className="w-4 h-4 text-emerald-500" /> Credit</>
                        ) : (
                          <><ArrowDownRight className="w-4 h-4 text-primary" /> Debit</>
                        )}
                      </div>
                    </td>
                    <td className={`p-4 font-bold ${tx.type === "credit" ? "text-emerald-500" : ""}`}>
                      {tx.type === "credit" ? "+" : "-"}₦{tx.amount}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {new Date(tx.createdAt || tx.date).toLocaleDateString()}{" "}
                      {new Date(tx.createdAt || tx.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Fund Wallet modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-semibold">Fund Wallet</h3>
                <button onClick={() => { setIsModalOpen(false); setFundError(""); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
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
                        ₦{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {fundError && (
                  <p className="text-sm text-red-500">{fundError}</p>
                )}

                <div className="space-y-3 pt-4 border-t border-border">
                  <label className="text-sm font-medium">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleFund("paystack")}
                      disabled={funding}
                      className="h-16 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                    >
                      {funding ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <div className="font-bold text-lg group-hover:text-primary transition-colors">Paystack</div>
                      )}
                    </button>
                    <button
                      onClick={() => handleFund("korapay")}
                      disabled={funding}
                      className="h-16 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                    >
                      {funding ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <div className="font-bold text-lg group-hover:text-primary transition-colors">Korapay</div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
