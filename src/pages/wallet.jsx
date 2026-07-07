import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownRight,
  CreditCard, Loader2, ArrowRightLeft, X, Copy, Check,
  CheckCircle2, Clock, XCircle, Hash, Calendar, Tag, FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import FundWalletModal from "@/components/FundWalletModal";
import { motion, AnimatePresence } from "framer-motion";

/* ── Helpers ── */
const fmtAmount = (amount) => {
  const n = Number(amount);
  if (isNaN(n)) return "—";
  return n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtDate = (val, opts = {}) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-NG", opts);
};

const fmtTime = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

/* ── Status badge ── */
function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const styles =
    s === "completed" || s === "success" || s === "successful"
      ? { background: "rgba(16,185,129,0.12)",  color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }
      : s === "pending"
      ? { background: "rgba(245,158,11,0.12)",  color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }
      : s === "failed"
      ? { background: "rgba(239,68,68,0.12)",   color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }
      : { background: "rgba(100,100,100,0.12)", color: "#888",    border: "1px solid rgba(100,100,100,0.25)" };

  return (
    <span className="px-2 py-1 rounded text-xs font-medium capitalize" style={styles}>
      {status || "unknown"}
    </span>
  );
}

/* ── Transaction Detail Modal ── */
function TxDetailModal({ tx, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);

  /* Escape key + focus management */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [isOpen, onClose]);

  const copyRef = useCallback(() => {
    navigator.clipboard.writeText(tx?.reference || tx?._id || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tx]);

  const isCredit  = (tx?.type || "").toLowerCase() === "credit";
  const s         = (tx?.status || "").toLowerCase();
  const dateRaw   = tx?.createdAt || tx?.date;

  const StatusIcon  =
    s === "completed" || s === "success" || s === "successful" ? CheckCircle2
    : s === "pending" ? Clock
    : XCircle;
  const statusColor =
    s === "completed" || s === "success" || s === "successful" ? "#10b981"
    : s === "pending" ? "#f59e0b"
    : "#ef4444";

  const rows = tx ? [
    { icon: Hash,     label: "Reference",   value: tx.reference || tx._id || "—", copyable: true },
    { icon: FileText, label: "Description", value: tx.description || "—" },
    { icon: Tag,      label: "Type",        value: isCredit ? "Credit" : "Debit" },
    { icon: Calendar, label: "Date",        value: fmtDate(dateRaw, { year: "numeric", month: "long", day: "numeric" }) },
    { icon: Clock,    label: "Time",        value: fmtTime(dateRaw) },
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && tx && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Transaction details"
        >
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Coloured header */}
            <div
              className="px-6 pt-6 pb-5 relative"
              style={{
                background: isCredit ? "rgba(16,185,129,0.08)" : "rgba(139,92,246,0.08)",
                borderBottom: "1px solid hsl(var(--border))",
              }}
            >
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: isCredit ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.15)" }}
                >
                  {isCredit
                    ? <ArrowUpRight className="w-6 h-6 text-emerald-500" />
                    : <ArrowDownRight className="w-6 h-6 text-violet-500" />}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {isCredit ? "Credit" : "Debit"}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: isCredit ? "#10b981" : "hsl(var(--foreground))" }}>
                    {isCredit ? "+" : "-"}₦{fmtAmount(tx.amount)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusIcon className="w-4 h-4" style={{ color: statusColor }} />
                <span className="text-sm font-medium capitalize" style={{ color: statusColor }}>{tx.status}</span>
              </div>
            </div>

            {/* Detail rows */}
            <div className="p-6 space-y-4">
              {rows.map(({ icon: Icon, label, value, copyable }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0 pt-0.5">
                    <Icon className="w-4 h-4 opacity-60" />
                    {label}
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-sm font-medium text-foreground break-all">{value}</span>
                    {copyable && (
                      <button
                        onClick={copyRef}
                        aria-label="Copy reference"
                        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                  <span>Transaction ID</span>
                  <span className="font-mono">{(tx._id || tx.id || "").slice(-12).toUpperCase() || "—"}</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════ */

export default function WalletPage() {
  const { user }        = useAuth();
  const [, navigate]    = useLocation();
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx]       = useState(true);
  const [selectedTx, setSelectedTx]     = useState(null);

  useEffect(() => {
    api.get("/api/wallet/transactions")
      .then(({ data }) => {
        const list = data?.transactions || data?.data || (Array.isArray(data) ? data : []);
        setTransactions(list);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoadingTx(false));
  }, []);

  const balance = user?.balance ?? user?.walletBalance ?? 0;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet & Billing</h1>
          <p className="text-muted-foreground mt-1">Manage your funds and view transactions.</p>
        </div>
        <Button onClick={() => setIsFundOpen(true)} className="glow-effect">
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
                <div className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wider">
                  Total Balance
                </div>
                <div className="text-5xl font-bold text-foreground">
                  ₦{fmtAmount(balance)}
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="h-12 border-primary/20 text-primary hover:bg-primary/10 gap-2"
                  onClick={() => navigate("/transfer")}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Transfer Funds
                </Button>
                <Button className="h-12 glow-effect" onClick={() => setIsFundOpen(true)}>
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
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-lg">Transaction History</h3>
          {transactions.length > 0 && (
            <span className="text-xs text-muted-foreground">Click any row for details</span>
          )}
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
                {transactions.map((tx) => {
                  const isCredit = (tx.type || "").toLowerCase() === "credit";
                  const dateRaw  = tx.createdAt || tx.date;
                  return (
                    <tr
                      key={tx._id || tx.id}
                      onClick={() => setSelectedTx(tx)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedTx(tx)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${tx.description}`}
                      className="border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <td className="p-4 font-medium group-hover:text-primary transition-colors">{tx.description || "—"}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {isCredit ? (
                            <><ArrowUpRight className="w-4 h-4 text-emerald-500" /> Credit</>
                          ) : (
                            <><ArrowDownRight className="w-4 h-4 text-primary" /> Debit</>
                          )}
                        </div>
                      </td>
                      <td className={`p-4 font-bold ${isCredit ? "text-emerald-500" : ""}`}>
                        {isCredit ? "+" : "-"}₦{fmtAmount(tx.amount)}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        {fmtDate(dateRaw)}{" "}
                        {fmtTime(dateRaw).replace(/:\d{2}$/, "")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Modals */}
      <FundWalletModal isOpen={isFundOpen} onClose={() => setIsFundOpen(false)} />
      <TxDetailModal
        tx={selectedTx}
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </DashboardLayout>
  );
}
