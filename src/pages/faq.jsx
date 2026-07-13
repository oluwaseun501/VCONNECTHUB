import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { PublicNavbar, Footer } from "@/components/layout/PublicLayout";

const categories = [
  {
    label: "Getting Started",
    faqs: [
      {
        q: "What is VConnectHub?",
        a: "VConnectHub is a platform that gives you instant access to virtual phone numbers from multiple countries. You can use these numbers to receive SMS verification codes for apps and services — without using your real phone number.",
      },
      {
        q: "How do I create an account?",
        a: "Click Register on the homepage, fill in your name, email, and password, then verify your email address. Once verified, you can fund your wallet and start buying virtual numbers.",
      },
      {
        q: "Is VConnectHub free to use?",
        a: "Registration is free. You only pay when you purchase a virtual number. Pricing varies by country and network — check the Purchase Number page for the full list.",
      },
    ],
  },
  {
    label: "Virtual Numbers",
    faqs: [
      {
        q: "How do I buy a virtual number?",
        a: "Go to the Purchase Number page in your dashboard, select the country and network you need, then confirm the purchase. Your number is activated instantly and appears under My Numbers.",
      },
      {
        q: "How long does a number stay active?",
        a: "Validity depends on the plan you choose — it can range from a few minutes to a few hours. The remaining time is displayed on your number card in the dashboard.",
      },
      {
        q: "Can I receive multiple SMS codes on one number?",
        a: "Yes, as long as the number is still active. All incoming SMS messages are shown in your dashboard in real time.",
      },
      {
        q: "What if the service I want isn't available for my chosen country?",
        a: "Try a different country or network. Some services only work with numbers from specific countries. If you're unsure which to pick, chat with us on WhatsApp and we'll advise you.",
      },
    ],
  },
  {
    label: "Wallet & Payments",
    faqs: [
      {
        q: "How do I fund my wallet?",
        a: "Go to Wallet & Billing in your dashboard and click Fund Wallet. You can pay using a debit/credit card or bank transfer. Funds are credited to your wallet instantly.",
      },
      {
        q: "Is my wallet balance safe?",
        a: "Yes. Your wallet balance is tied to your account and secured. It never expires and can be used at any time for future purchases.",
      },
      {
        q: "Can I withdraw my wallet balance to my bank account?",
        a: "Currently, wallet balances can only be used within VConnectHub to purchase virtual numbers. We don't support cash withdrawals at this time.",
      },
    ],
  },
  {
    label: "Refunds",
    faqs: [
      {
        q: "What happens if I don't receive an SMS code?",
        a: "If your virtual number expires without receiving any SMS code, you are automatically refunded the full amount to your VConnectHub wallet. You don't need to contact support — it's completely automatic.",
      },
      {
        q: "How long does a refund take?",
        a: "Automatic refunds are processed as soon as your number expires. You should see the credit in your wallet instantly after expiry.",
      },
      {
        q: "What if I received an SMS but the code didn't work?",
        a: "If the SMS was delivered to your dashboard, the number technically worked. In this case, the purchase is not eligible for a refund since the issue is with the third-party service, not our platform.",
      },
      {
        q: "Can I get a refund for wallet top-ups?",
        a: "No. Wallet funding is final and non-refundable. Only unused number purchases (where no SMS was received) are eligible for automatic refunds.",
      },
    ],
  },
  {
    label: "Account & Security",
    faqs: [
      {
        q: "How do I reset my password?",
        a: "On the login page, click Forgot Password, enter your email, and we'll send you a reset link. The link expires in 15 minutes.",
      },
      {
        q: "What is the wallet PIN for?",
        a: "Your PIN is an extra layer of security for wallet-related actions. You can set it from the Set PIN page in your dashboard. We recommend setting it immediately after registering.",
      },
      {
        q: "Can I change my email address?",
        a: "Email changes are currently handled by our support team. Chat with us on WhatsApp with your current email and the new one you'd like to use.",
      },
    ],
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

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(null);

  const filtered = categories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.faqs.length > 0);

  const displayed = search
    ? filtered
    : activeTab
    ? categories.filter((c) => c.label === activeTab)
    : categories;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative overflow-hidden py-20 px-6 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent" />
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-5">
              Help Center
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground mb-8">
              Find answers to the most common questions about VConnectHub.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
          </div>
        </section>

        {/* Category tabs */}
        {!search && (
          <section className="max-w-4xl mx-auto px-6 pb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveTab(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === null
                    ? "bg-violet-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-violet-500/40"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveTab(cat.label === activeTab ? null : cat.label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === cat.label
                      ? "bg-violet-600 text-white"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-violet-500/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* FAQ list */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          {displayed.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No results found</p>
              <p className="text-sm">Try different keywords or browse by category.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {displayed.map((cat) => (
                <div key={cat.label}>
                  <h2 className="text-lg font-bold mb-4 text-foreground">{cat.label}</h2>
                  <div className="space-y-2">
                    {cat.faqs.map((faq) => (
                      <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Still need help */}
        <section className="max-w-3xl mx-auto px-6 pb-24">
          <div className="bg-gradient-to-r from-violet-600/10 to-fuchsia-500/10 border border-violet-500/20 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Can't find what you're looking for? Our team is available on WhatsApp.
            </p>
            <a
              href={`https://wa.me/12495314889?text=${encodeURIComponent("Hi, I need help with VConnectHub.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-green-500/25"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
