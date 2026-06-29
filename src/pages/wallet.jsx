import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTransactions } from "@/lib/mock-data";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, CreditCard, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

export default function WalletPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("1000");

  return (/*#__PURE__*/
    _jsxDEV(DashboardLayout, { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-3xl font-bold tracking-tight", children: "Wallet & Billing" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-muted-foreground mt-1", children: "Manage your funds and view transactions." }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(Button, { onClick: () => setIsModalOpen(true), className: "glow-effect", children: [/*#__PURE__*/
          _jsxDEV(WalletIcon, { className: "w-4 h-4 mr-2" }, void 0, false), " Fund Wallet"] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-8", children: [/*#__PURE__*/
        _jsxDEV(Card, { className: "glass-card md:col-span-2 relative overflow-hidden bg-gradient-to-br from-card/80 to-card", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" }, void 0, false), /*#__PURE__*/
          _jsxDEV(CardContent, { className: "p-8", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex flex-col md:flex-row justify-between md:items-end gap-6", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("div", { className: "text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wider", children: "Total Balance" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-5xl font-bold text-foreground", children: "₦42.50" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex gap-4", children: [/*#__PURE__*/
                _jsxDEV(Button, { variant: "outline", className: "h-12 border-primary/20 text-primary hover:bg-primary/10", children: "Withdraw" }, void 0, false), /*#__PURE__*/
                _jsxDEV(Button, { className: "h-12 glow-effect", onClick: () => setIsModalOpen(true), children: "Add Funds" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV(Card, { className: "glass-card border-dashed border-2 border-border/50 flex flex-col items-center justify-center p-8 text-center bg-transparent", children: [/*#__PURE__*/
          _jsxDEV(CreditCard, { className: "w-8 h-8 text-muted-foreground mb-4 opacity-50" }, void 0, false), /*#__PURE__*/
          _jsxDEV("h3", { className: "font-semibold text-muted-foreground mb-2", children: "Auto-Recharge" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-muted-foreground/70", children: "Keep your balance topped up automatically." }, void 0, false), /*#__PURE__*/
          _jsxDEV(Button, { variant: "link", className: "mt-2 h-auto p-0", children: "Configure setup" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV(Card, { className: "glass-card", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-6 border-b border-border", children: /*#__PURE__*/
          _jsxDEV("h3", { className: "font-semibold text-lg", children: "Transaction History" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
          _jsxDEV("table", { className: "w-full text-sm", children: [/*#__PURE__*/
            _jsxDEV("thead", { children: /*#__PURE__*/
              _jsxDEV("tr", { className: "border-b border-border text-muted-foreground", children: [/*#__PURE__*/
                _jsxDEV("th", { className: "text-left font-medium p-4", children: "Description" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "text-left font-medium p-4", children: "Type" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "text-left font-medium p-4", children: "Amount" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "text-left font-medium p-4", children: "Status" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "text-right font-medium p-4", children: "Date" }, void 0, false)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("tbody", { children:
              mockTransactions.map((tx) => /*#__PURE__*/
              _jsxDEV("tr", { className: "border-b border-border/50 hover:bg-white/5 transition-colors", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "p-4 font-medium", children: tx.description }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "p-4", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children:
                    tx.type === "Credit" ? /*#__PURE__*/
                    _jsxDEV(_Fragment, { children: [/*#__PURE__*/_jsxDEV(ArrowUpRight, { className: "w-4 h-4 text-emerald-500" }, void 0, false), " Credit"] }, void 0, true) : /*#__PURE__*/

                    _jsxDEV(_Fragment, { children: [/*#__PURE__*/_jsxDEV(ArrowDownRight, { className: "w-4 h-4 text-primary" }, void 0, false), " Debit"] }, void 0, true) }, void 0, false

                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: `p-4 font-bold ${tx.type === "Credit" ? "text-emerald-500" : ""}`, children: [
                  tx.type === "Credit" ? "+" : "-", "₦", tx.amount] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "p-4", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500", children:
                    tx.status }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "p-4 text-right text-muted-foreground", children: [
                  new Date(tx.date).toLocaleDateString(), " ", new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] }, void 0, true
                )] }, tx.id, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        isModalOpen && /*#__PURE__*/
        _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            className: "bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "p-6 border-b border-border flex justify-between items-center", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-lg font-semibold", children: "Fund Wallet" }, void 0, false), /*#__PURE__*/
              _jsxDEV("button", { onClick: () => setIsModalOpen(false), className: "text-muted-foreground hover:text-foreground", children: /*#__PURE__*/
                _jsxDEV(X, { className: "w-5 h-5" }, void 0, false) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-6 space-y-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-sm font-medium", children: "Amount to fund (₦)" }, void 0, false), /*#__PURE__*/
                _jsxDEV(Input, {
                  type: "number",
                  value: fundAmount,
                  onChange: (e) => setFundAmount(e.target.value),
                  className: "h-14 text-xl font-bold bg-background/50" }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex gap-2", children:
                  ["1000", "2000", "5000", "10000"].map((amt) => /*#__PURE__*/
                  _jsxDEV("button", {

                    onClick: () => setFundAmount(amt),
                    className: `flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${fundAmount === amt ? 'bg-primary/20 border-primary text-primary' : 'bg-background hover:bg-muted border-border text-muted-foreground'}`, children: [
                    "₦",
                    amt] }, amt, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "space-y-3 pt-4 border-t border-border", children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-sm font-medium", children: "Select Payment Method" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [/*#__PURE__*/
                  _jsxDEV("button", { className: "h-16 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group", children: /*#__PURE__*/
                    _jsxDEV("div", { className: "font-bold text-lg group-hover:text-primary transition-colors", children: "Paystack" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", { className: "h-16 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group", children: /*#__PURE__*/
                    _jsxDEV("div", { className: "font-bold text-lg group-hover:text-primary transition-colors", children: "Korapay" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}