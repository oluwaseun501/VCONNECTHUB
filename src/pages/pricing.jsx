import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { PublicNavbar, Footer } from "@/components/layout/PublicLayout";
import {
  SiWhatsapp, SiFacebook, SiTiktok, SiTelegram,
  SiInstagram, SiGmail, SiX, SiSnapchat, SiBinance,
} from "react-icons/si";
import { Phone, Zap, Shield, RefreshCw } from "lucide-react";

const GLIDE = { duration: 1.1, ease: [0.22, 1, 0.36, 1] };

const FADE = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: GLIDE },
};

const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const services = [
  {
    name: "WhatsApp",
    icon: SiWhatsapp,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    min: 1200, max: 1500,
    popular: true,
  },
  {
    name: "Facebook",
    icon: SiFacebook,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    min: 1000, max: 1400,
  },
  {
    name: "TikTok",
    icon: SiTiktok,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    min: 1300, max: 1600,
  },
  {
    name: "Telegram",
    icon: SiTelegram,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    min: 1000, max: 1300,
  },
  {
    name: "TextNow",
    icon: Phone,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    min: 1100, max: 1450,
  },
  {
    name: "Instagram",
    icon: SiInstagram,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    min: 1200, max: 1550,
  },
  {
    name: "Gmail",
    icon: SiGmail,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    min: 1000, max: 1250,
  },
  {
    name: "Twitter / X",
    icon: SiX,
    color: "text-gray-800 dark:text-white",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    min: 1400, max: 1800,
  },
  {
    name: "Snapchat",
    icon: SiSnapchat,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    min: 1100, max: 1400,
  },
  {
    name: "Binance",
    icon: SiBinance,
    color: "text-yellow-600",
    bg: "bg-yellow-600/10",
    border: "border-yellow-600/20",
    min: 1350, max: 1650,
  },
];

function useIsLoggedIn() {
  try { return !!localStorage.getItem("auth_token"); }
  catch { return false; }
}

export default function Pricing() {
  const isLoggedIn = useIsLoggedIn();
  const orderHref  = isLoggedIn ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNavbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Atmospheric blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[400px] rounded-full bg-violet-400/10 dark:bg-violet-600/15 blur-[110px]" />
          <div className="absolute top-10 right-1/4 w-[400px] h-[350px] rounded-full bg-fuchsia-400/10 dark:bg-fuchsia-600/10 blur-[90px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-medium mb-6"
          >
            <Zap className="w-3 h-3" />
            One-time purchase · No subscriptions
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Simple, transparent{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500">
              pricing
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-8"
          >
            Buy a virtual number, receive your OTP instantly, and you're done.
            Pay only for what you use — in Naira.
          </motion.p>

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              { icon: Zap,       label: "Instant delivery" },
              { icon: Shield,    label: "100% private" },
              { icon: RefreshCw, label: "50+ countries" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-violet-500" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Service cards ── */}
      <section className="max-w-6xl mx-auto w-full px-4 pb-24 flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.name}
                variants={FADE}
                className={`relative rounded-2xl border bg-card p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transition-transform ${
                  svc.popular
                    ? "border-violet-500/40 ring-1 ring-violet-500/20 shadow-md shadow-violet-500/10"
                    : "border-border"
                }`}
              >
                {/* Popular badge */}
                {svc.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white tracking-wide shadow-sm whitespace-nowrap">
                    Most Popular
                  </span>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${svc.bg} border ${svc.border} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${svc.color}`} />
                </div>

                {/* Name + price */}
                <div>
                  <h3 className="font-bold text-lg text-foreground">{svc.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Virtual number · OTP delivery</p>
                  <div className="mt-3 flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl font-extrabold text-foreground">
                      ₦{svc.min.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      — ₦{svc.max.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">per number · one-time</p>
                </div>

                {/* Features */}
                <ul className="space-y-1.5 text-sm text-muted-foreground flex-1">
                  {["Instant number", "OTP in < 5 seconds", "Works globally"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={orderHref}>
                  <button
                    className={`w-full h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      svc.popular
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/25 hover:opacity-90"
                        : "bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/25 hover:bg-violet-500/20"
                    }`}
                  >
                    Order Now →
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center space-y-4"
        >
          <p className="text-muted-foreground text-sm">
            Prices may vary slightly based on availability and country.{" "}
            All payments processed securely in <strong>Naira (₦)</strong>.
          </p>
          <Link href={orderHref}>
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:opacity-90 hover:shadow-violet-500/40 transition-all duration-200">
              Get Started Now →
            </button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}