import React from "react";
import { RefreshCcw, Clock, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { PublicNavbar, Footer } from "@/components/layout/PublicLayout";

const steps = [
  {
    icon: Clock,
    title: "Number Expires",
    desc: "Your virtual number reaches its validity end time without delivering an SMS code to you.",
  },
  {
    icon: RefreshCcw,
    title: "System Detects It",
    desc: "Our system automatically checks whether any SMS was received during the number's active period.",
  },
  {
    icon: Wallet,
    title: "Wallet Credited",
    desc: "If no SMS was received and the number has expired, the full amount is credited back to your VConnectHub wallet instantly — no request needed.",
  },
];

const notCovered = [
  "You received an SMS code but the code did not work on the third-party service.",
  "You purchased a number and an SMS was successfully delivered to your dashboard.",
  "You chose the wrong country or network for the service you were verifying.",
  "You did not use the number within its validity window (number was valid, just unused).",
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative overflow-hidden py-20 px-6 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent" />
          <div className="absolute -top-24 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -z-10" />
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-5">
              Refunds
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Refund Policy</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe you should only pay for a service that works. That's why our refund system
              is <span className="text-foreground font-semibold">fully automatic</span> — no forms,
              no waiting, no arguments.
            </p>
          </div>
        </section>

        {/* Automatic refund banner */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <div className="bg-gradient-to-r from-violet-600/10 to-fuchsia-500/10 border border-violet-500/20 rounded-3xl p-8 flex gap-5 items-start">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/25">
              <RefreshCcw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">Automatic Wallet Refund</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you purchase a virtual number and it expires before you receive any SMS code,
                you are <strong className="text-foreground">automatically refunded</strong> to your
                VConnectHub wallet. You don't need to contact support or submit a ticket. It happens
                on its own.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="space-y-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-violet-500" />
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 flex-1">
                  <div className="text-xs font-bold text-violet-500 mb-1">Step {i + 1}</div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's NOT covered */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold">What Is Not Covered</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              The following situations are <strong className="text-foreground">not eligible</strong> for a refund:
            </p>
            <ul className="space-y-3">
              {notCovered.map((item) => (
                <li key={item} className="flex gap-3 items-start text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Wallet note */}
        <section className="max-w-3xl mx-auto px-6 pb-24">
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-bold">Refunded to Your Wallet</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All refunds go directly to your VConnectHub wallet balance — not back to your card or
              bank account. You can use your wallet balance to purchase another number immediately.
              Wallet balances do not expire.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              If you have questions about a specific refund, contact us via WhatsApp with your
              transaction reference and we will look into it for you.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
