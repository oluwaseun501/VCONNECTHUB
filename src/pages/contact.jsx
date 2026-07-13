import React, { useState } from "react";
import { ChevronDown, MessageCircle, Clock } from "lucide-react";
import { PublicNavbar, Footer } from "@/components/layout/PublicLayout";

const WHATSAPP_NUMBER = "12495314889";

const faqs = [
  {
    q: "How do I buy a virtual number?",
    a: "Go to the Purchase Number page, choose your preferred country and network, then confirm from your wallet. Your number is activated instantly.",
  },
  {
    q: "What if I don't receive my SMS code?",
    a: "If your number expires without receiving an SMS, you're automatically refunded to your wallet. No need to contact us — it's instant and automatic.",
  },
  {
    q: "How do I fund my wallet?",
    a: "Click Wallet & Billing in your dashboard, then select Fund Wallet. You can pay by card or bank transfer.",
  },
  {
    q: "How long does a virtual number stay active?",
    a: "It depends on the plan you pick — from a few minutes up to several hours. The countdown timer is shown on your number card.",
  },
  {
    q: "How do I reset my password?",
    a: "On the login page, click Forgot Password, enter your email address, and we'll send a reset link. The link expires in 15 minutes.",
  },
  {
    q: "Can I withdraw my wallet balance?",
    a: "Wallet balances can only be used within VConnectHub to purchase virtual numbers. Withdrawals to bank accounts are not supported at this time.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors gap-4"
      >
        <span className="text-sm font-medium text-foreground">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 pt-3 text-sm text-muted-foreground leading-relaxed border-t border-border">
          {a}
        </div>
      )}
    </div>
  );
}

export default function ContactUs() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I need help with VConnectHub.")}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative overflow-hidden py-20 px-6 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent" />
          <div className="absolute -top-24 right-0 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl -z-10" />
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-5">
              Support
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">We're Here to Help</h1>
            <p className="text-muted-foreground text-lg">
              Browse the common questions below. If you still need help, reach us directly on WhatsApp.
            </p>
          </div>
        </section>

        {/* Contact method cards */}
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* WhatsApp */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-500" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">WhatsApp</p>
                <p className="text-xs text-muted-foreground">Fastest response — chat with our team directly</p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors text-center"
              >
                Chat Now
              </a>
            </div>

            {/* Live Chat */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Live Chat</p>
                <p className="text-xs text-muted-foreground">Use the chat bubble at the bottom-right of any page</p>
              </div>
              <button
                onClick={() => window.dispatchEvent(new Event("open-support-chat"))}
                className="mt-auto w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
              >
                Open Chat
              </button>
            </div>

            {/* Hours */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Response Time</p>
                <p className="text-xs text-muted-foreground">We typically reply within a few minutes on WhatsApp</p>
              </div>
              <div className="mt-auto w-full py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium text-center">
                Mon – Sun, 8am – 10pm
              </div>
            </div>
          </div>
        </section>

        {/* Inline FAQ */}
        <section className="max-w-3xl mx-auto px-6 pb-10">
          <h2 className="text-xl font-bold mb-6 text-center">Common Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Need more?{" "}
            <a href="/faq" className="text-violet-500 hover:underline">
              Browse the full FAQ
            </a>
          </p>
        </section>

        {/* WhatsApp CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-24">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold mb-1">Still have a question?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Our support team is available on WhatsApp. We reply fast — usually within minutes.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
