import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PublicNavbar, Footer } from "@/components/layout/PublicLayout";

const sections = [
  {
    title: "1. Information We Collect",
    body: `When you register on VConnectHub, we collect your name, email address, and phone number. When you fund your wallet or make a purchase, we collect transaction details such as the amount, date, and payment method. We also collect basic usage data like pages visited and features used to help improve the platform. We do not store your card details — payments are processed securely by our payment providers.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use your information to create and manage your account, process wallet funding and number purchases, send you transactional emails (e.g. registration confirmation, password reset), provide customer support, and improve the platform based on usage patterns. We do not sell your information to third parties. We do not use your data for advertising.`,
  },
  {
    title: "3. Virtual Numbers & SMS Data",
    body: `Virtual numbers assigned to your account are temporary. SMS messages received on those numbers are displayed in your dashboard for the duration the number is active. Once a number expires, its SMS history may be deleted. We do not read, share, or store the contents of your received SMS messages beyond what is necessary to display them to you.`,
  },
  {
    title: "4. Data Security",
    body: `We use industry-standard encryption (HTTPS/TLS) to protect data in transit. Passwords are hashed and never stored in plain text. Your wallet PIN is encrypted before storage. We regularly review our security practices to protect your account.`,
  },
  {
    title: "5. Cookies",
    body: `We use session cookies to keep you logged in. We do not use tracking cookies or third-party advertising cookies. You can disable cookies in your browser settings, but doing so may affect your ability to use the platform.`,
  },
  {
    title: "6. Third-Party Services",
    body: `We use trusted third-party services to process payments and send emails. These providers only receive the data necessary to perform their function and are bound by their own privacy policies. We do not share your personal information with any other third parties.`,
  },
  {
    title: "7. Your Rights",
    body: `You have the right to access the personal data we hold about you, request corrections to inaccurate data, and request deletion of your account and associated data. To exercise any of these rights, contact us via WhatsApp or email and we will respond within 72 hours.`,
  },
  {
    title: "8. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. When we do, we will notify you by email or a notice on your dashboard. Continued use of the platform after changes means you accept the updated policy.`,
  },
];

function Accordion({ title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm md:text-base">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
          {body}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden py-20 px-6 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent" />
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-5">
              Legal
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: July 2025. We're committed to protecting your personal data and being
              transparent about how we use it.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-24 space-y-3">
          {sections.map((s) => (
            <Accordion key={s.title} title={s.title} body={s.body} />
          ))}
          <p className="text-xs text-muted-foreground text-center pt-4">
            Questions?{" "}
            <a href="/contact" className="text-violet-500 hover:underline">Contact us</a>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
