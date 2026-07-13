import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PublicNavbar, Footer } from "@/components/layout/PublicLayout";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By creating an account or using VConnectHub in any way, you agree to these Terms of Service. If you do not agree, please do not use the platform. We may update these terms at any time and will notify you by email or dashboard notice.`,
  },
  {
    title: "2. Eligibility",
    body: `You must be at least 18 years old to use VConnectHub. By registering, you confirm that you are 18 or older and that all information you provide is accurate and truthful. We reserve the right to terminate accounts where eligibility cannot be confirmed.`,
  },
  {
    title: "3. Account Responsibility",
    body: `You are responsible for keeping your account credentials secure. Do not share your password or PIN with anyone. Any activity that occurs under your account is your responsibility. If you suspect unauthorized access, contact us immediately via WhatsApp.`,
  },
  {
    title: "4. Virtual Numbers — Permitted Use",
    body: `Virtual numbers on VConnectHub are intended for legitimate verification purposes only — such as registering for apps and services that require phone number verification. You must not use virtual numbers for fraud, scams, harassment, illegal activity, or to impersonate another person or entity. Violation of this rule will result in immediate account suspension and may be reported to relevant authorities.`,
  },
  {
    title: "5. Wallet & Payments",
    body: `All wallet funding is final. We do not offer refunds for wallet top-ups. However, if a virtual number expires without delivering an SMS code to you, the cost of that number is automatically refunded to your wallet balance. Wallet balances do not expire and can be used for any future purchases on the platform.`,
  },
  {
    title: "6. Number Availability & Uptime",
    body: `Virtual number availability depends on our network providers. We do not guarantee that a specific country, network, or number will always be available. We aim for high uptime but do not guarantee uninterrupted service. In the event of service disruptions that prevent SMS delivery, our automatic refund policy applies.`,
  },
  {
    title: "7. Prohibited Activities",
    body: `You may not use VConnectHub to: bypass security systems, conduct fraudulent transactions, create fake identities, send spam, violate any applicable law or regulation, interfere with the platform's infrastructure, or resell our services without written permission. We monitor usage patterns and will terminate accounts engaged in prohibited activities.`,
  },
  {
    title: "8. Termination",
    body: `We reserve the right to suspend or terminate your account at any time, with or without notice, if we believe you have violated these terms or engaged in fraudulent activity. Upon termination, your wallet balance may be forfeited if the termination is due to a violation of these terms.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `VConnectHub is provided "as is." We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you for any claim shall not exceed the amount you paid for the specific service that caused the claim.`,
  },
  {
    title: "10. Contact",
    body: `If you have questions about these terms, please contact us via WhatsApp or through our Contact Us page. We're happy to clarify anything.`,
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

export default function TermsOfService() {
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
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: July 2025. Please read these terms carefully before using VConnectHub.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-24 space-y-3">
          {sections.map((s) => (
            <Accordion key={s.title} title={s.title} body={s.body} />
          ))}
          <p className="text-xs text-muted-foreground text-center pt-4">
            Questions?{" "}
            <a href="/contact" className="text-violet-500 hover:underline">Contact us</a> or chat with us on WhatsApp.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
