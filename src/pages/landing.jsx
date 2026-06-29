import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { PublicNavbar, Footer } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, Zap, Globe2, ArrowRight, Check,
  RefreshCw, Copy, CreditCard
} from "lucide-react";
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring, useInView
} from "framer-motion";
import { services, countries } from "@/lib/mock-data";
import AnimatedOrbs from "@/components/ui/animated-orbs";



const GLIDE      = { duration: 1.1, ease: [0.22, 1, 0.36, 1] };
const GLIDE_FAST = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: GLIDE },
};

function GlideSection({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const initial = {
    opacity: 0,
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
  };
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ ...GLIDE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const DEMO_STEPS = ["country", "service", "confirm", "active", "otp"];
const DEMO_DELAY = 2800;
const demoCountry = { name: "United States", code: "+1", flag: "https://flagcdn.com/w40/us.png" };
const demoService = services[0];
const demoNumber  = "+1 849 201 9934";
const demoOtp     = "591152";

function LiveOrderDemo() {
  const [step, setStep]     = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step >= DEMO_STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), DEMO_DELAY);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== DEMO_STEPS.length - 1) return;
    const t = setTimeout(() => { setStep(0); setCopied(false); }, 4000);
    return () => clearTimeout(t);
  }, [step]);

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const stepLabel = ["1. Select Country", "2. Select Service", "3. Confirm Order", "Number Active", "SMS Received!"];

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />
      <div className="relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-sm font-semibold text-foreground">Live Order System</span>
          </div>
          {step > 0 && (
            <button
              onClick={() => { setStep(0); setCopied(false); }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Start Over
            </button>
          )}
        </div>

        <div className="px-5 pt-4 pb-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="text-xs font-semibold text-muted-foreground uppercase tracking-widest"
            >
              {stepLabel[step]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="px-5 pb-5 min-h-[240px]">
          <AnimatePresence mode="wait">

            {step === 0 && (
              <motion.div key="country" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={GLIDE_FAST} className="space-y-2 mt-2">
                {countries.slice(0, 5).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      c.id === "us" ? "border-primary bg-primary/10" : "border-border bg-muted/40"
                    }`}
                  >
                    <img src={c.flag} alt={c.name} className="w-6 h-4 rounded-sm object-cover" />
                    <span className="text-sm text-foreground flex-1">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.code}</span>
                    {c.id === "us" && <Check className="w-4 h-4 text-primary" />}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={GLIDE_FAST} className="mt-2">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <img src={demoCountry.flag} alt="US" className="w-5 h-3 rounded-sm object-cover" />
                  <span className="text-xs text-muted-foreground">{demoCountry.name}</span>
                  <span className="text-xs text-primary ml-auto cursor-pointer">Change</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {services.slice(0, 6).map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border transition-all ${
                        s.id === "telegram" ? "border-primary bg-primary/10" : "border-border bg-muted/40"
                      }`}
                    >
                      <img src={s.icon} alt={s.name} className="w-5 h-5 object-contain" />
                      <div>
                        <div className="text-xs text-foreground font-medium">{s.name}</div>
                        <div className="text-[10px] text-muted-foreground">₦{s.price}</div>
                      </div>
                      {s.id === "telegram" && <Check className="w-3 h-3 text-primary ml-auto" />}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={GLIDE_FAST} className="mt-3 space-y-3">
                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <img src={demoCountry.flag} className="w-5 h-3 object-cover rounded-sm" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Country</div>
                      <div className="text-sm text-foreground font-medium">{demoCountry.name}</div>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <img src={demoService.icon} className="w-5 h-5 object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Service</div>
                      <div className="text-sm text-foreground font-medium">{demoService.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</div>
                      <div className="text-sm text-primary font-bold">₦{demoService.price}</div>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25"
                >
                  Purchase Number
                </motion.button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="active" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35, type: "spring" }} className="flex flex-col items-center justify-center py-6 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
                >
                  <img src={demoCountry.flag} className="w-8 h-5 rounded object-cover" />
                </motion.div>
                <div className="text-center">
                  <div className="text-foreground font-bold text-lg">Number Active</div>
                  <div className="text-muted-foreground text-xs mt-1">Your number is ready. Send the SMS from {demoService.name} now.</div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted border border-border rounded-xl px-6 py-3 text-center"
                >
                  <div className="text-xl font-mono font-bold text-foreground tracking-widest">{demoNumber}</div>
                </motion.div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs animate-pulse">
                  <div className="w-3 h-3 rounded-full border-2 border-border border-t-primary animate-spin" />
                  Waiting for SMS…
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="otp" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, type: "spring" }} className="flex flex-col items-center justify-center py-6 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 220 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-emerald-500" />
                </motion.div>
                <div className="text-center">
                  <div className="text-foreground font-bold text-lg">SMS Received!</div>
                  <div className="text-muted-foreground text-xs mt-1">From {demoService.name}</div>
                </div>
                <div className="w-full bg-muted border border-border rounded-xl p-4 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Your OTP Code</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-mono font-bold text-foreground tracking-[0.3em]"
                  >
                    {demoOtp}
                  </motion.div>
                  <button
                    onClick={handleCopy}
                    className="mt-3 flex items-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : "Copy code"}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-4">
          {DEMO_STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === step ? 20 : 6, opacity: i <= step ? 1 : 0.3 }}
              transition={{ duration: 0.4 }}
              className={`h-1.5 rounded-full ${i === step ? "bg-primary" : i < step ? "bg-primary/50" : "bg-border"}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group bg-card border border-card-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-foreground font-semibold text-base mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/25 mb-4">
        {number}
      </div>
      <h3 className="text-foreground font-semibold text-base mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">{description}</p>
    </motion.div>
  );
}

function StatItem({ value, label }) {
  return (
    <motion.div variants={itemVariants} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

function SectionHeading({ badge, title, subtitle }) {
  return (
    <GlideSection className="text-center mb-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-xs font-medium mb-4">
        {badge}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-lg max-w-xl mx-auto">{subtitle}</p>}
    </GlideSection>
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const blob1Y      = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), { stiffness: 60, damping: 20 });
  const blob2Y      = useSpring(useTransform(scrollYProgress, [0, 1], [0, -60]),  { stiffness: 60, damping: 20 });
  const heroY       = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]),   { stiffness: 60, damping: 20 });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <motion.div style={{ y: blob1Y }} className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
        <motion.div style={{ y: blob2Y }} className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...GLIDE_FAST, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <AnimatedOrbs />
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                API v2.0 is now live
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...GLIDE, delay: 0.2 }}
                className="text-5xl md:text-6xl font-extrabold text-foreground leading-[1.1] mb-6"
              >
                Instant virtual{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  numbers & OTPs.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...GLIDE, delay: 0.35 }}
                className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md"
              >
                Bypass SMS verification instantly. Premium, private numbers for Telegram, WhatsApp, OpenAI, and 100+ more services globally.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...GLIDE, delay: 0.45 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white border-0 shadow-lg shadow-violet-500/25 px-6">
                    Start Building <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button size="lg" variant="outline" className="px-6">
                    Read Documentation
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...GLIDE, delay: 0.55 }}
                className="flex items-center gap-5"
              >
                {[
                  { icon: Zap,         label: "Instant Delivery" },
                  { icon: ShieldCheck, label: "100% Private" },
                  { icon: Globe2,      label: "50+ Countries" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...GLIDE, delay: 0.3 }}
            >
              <LiveOrderDemo />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <StatItem value="10k+"  label="Active Users" />
            <StatItem value="250k+" label="Numbers Provided" />
            <StatItem value="50+"   label="Supported Services" />
            <StatItem value="< 5s"  label="Average OTP Time" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why VConnectHub"
          title={<>Everything you need, <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">nothing you don't</span></>}
          subtitle="Built for developers, creators, and businesses who need reliable SMS verification at scale."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <FeatureCard icon={Zap}         title="Instant Numbers"  description="Get a virtual number in seconds. No waiting, no queues — just instant access." />
          <FeatureCard icon={ShieldCheck} title="100% Private"     description="Your real number stays hidden. We never store your personal data or OTPs." />
          <FeatureCard icon={Globe2}      title="Global Coverage"  description="Numbers from 50+ countries for 100+ services including Telegram, WhatsApp, and OpenAI." />
          <FeatureCard icon={CreditCard}  title="Pay as You Go"    description="Top up your wallet and only pay for what you use. No subscriptions, no hidden fees." />
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="How it Works"
            title={<>Up and running in <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">under a minute</span></>}
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-60px" }}
            className="relative grid sm:grid-cols-3 gap-10"
          >
            <div className="hidden sm:block absolute top-6 left-[calc(16.6%+1.5rem)] right-[calc(16.6%+1.5rem)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <StepCard number="1" title="Create an Account"  description="Sign up free in under 30 seconds. No credit card required to get started." />
            <StepCard number="2" title="Top Up Your Wallet" description="Add funds via card, bank transfer, or crypto. Minimum ₦100." />
            <StepCard number="3" title="Get Your Number"    description="Pick a country and service, receive your number instantly, get the OTP." />
          </motion.div>
        </div>
      </section>

      {/* Supported Services */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Supported Apps"
          title="Works with your favourite apps"
          subtitle="100+ platforms and growing every week."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-60px" }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
        >
          {services.slice(0, 12).map((s) => (
            <motion.div
              key={s.id}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors group cursor-default"
            >
              <img src={s.icon} alt={s.name} className="w-8 h-8 object-contain" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">{s.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <GlideSection>
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-violet-600/10 to-fuchsia-500/10 border border-primary/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join 10,000+ users receiving OTPs in under 5 seconds. No setup fees, no commitments.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white border-0 shadow-lg shadow-violet-500/25 px-8">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </GlideSection>
      </section>

      <Footer />
    </div>
  );
}