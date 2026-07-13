import React from "react";
import { Link } from "wouter";
import { ShieldCheck, Zap, Globe2, HeartHandshake } from "lucide-react";
import { PublicNavbar, Footer } from "@/components/layout/PublicLayout";

const values = [
  {
    icon: Zap,
    title: "Instant Activation",
    desc: "Numbers are activated the moment payment is confirmed — no waiting, no delays.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    desc: "Your real phone number stays private. Use virtual numbers for any app or service, worry-free.",
  },
  {
    icon: Globe2,
    title: "Global Coverage",
    desc: "Numbers from multiple countries and networks so you can verify on any platform worldwide.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Promise",
    desc: "If your number expires before you receive an SMS, you're automatically refunded — no questions asked.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 px-6 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl -z-10" />

          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-6">
              Who We Are
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
              Virtual Numbers,{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Real Results
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              VConnectHub gives you instant access to virtual phone numbers from around the world.
              Whether you need to verify an app, protect your identity, or access a service that
              requires a local number — we've got you covered.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 space-y-5">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              We started VConnectHub because we experienced firsthand how frustrating it is to
              get locked out of apps and services just because you don't have the right phone
              number. International SIM cards are expensive, slow, and unreliable.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              So we built a platform that makes it simple: fund your wallet, pick a country and
              network, and get a working virtual number in seconds. No SIM card. No long
              contracts. No hassle.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, thousands of users trust VConnectHub to receive OTP codes, verify accounts,
              and stay anonymous online — all from the comfort of their dashboard.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <h2 className="text-2xl font-bold text-center mb-10">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-2xl p-6 flex gap-4 hover:border-violet-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-24 px-6">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of users already using VConnectHub.</p>
          <Link href="/register">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25">
              Create Free Account
            </button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
