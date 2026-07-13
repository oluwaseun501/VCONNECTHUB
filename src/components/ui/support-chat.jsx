import { useState, useEffect } from "react";
import { MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

const WHATSAPP_NUMBER = "12495314889";

const FAQS = [
  {
    question: "How do I buy a virtual number?",
    answer:
      "Go to the Purchase Number page, choose your preferred country and network, then confirm from your wallet. Your number is activated instantly.",
  },
  {
    question: "What if I don't receive an SMS code?",
    answer:
      "If your number expires without receiving an SMS, you're automatically refunded the full amount to your wallet. No need to contact us — it's instant and automatic.",
  },
  {
    question: "How do I fund my wallet?",
    answer:
      "Go to Wallet & Billing in your dashboard and click Fund Wallet. You can pay by card or bank transfer.",
  },
  {
    question: "How long does a virtual number stay active?",
    answer:
      "It depends on the plan you choose — from a few minutes to several hours. The countdown is shown on your number card in the dashboard.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "On the login page, click Forgot Password, enter your email, and we'll send a reset link. The link expires in 15 minutes.",
  },
  {
    question: "What is the wallet PIN?",
    answer:
      "Your PIN is an extra security layer for wallet actions. Set it from the Set PIN page in your dashboard — we recommend doing it right after registering.",
  },
];

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi, I need help with VConnectHub."
)}`;

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Allow other parts of the app to open the chat programmatically
  useEffect(() => {
    const handler = () => { setOpen(true); setSelected(null); };
    window.addEventListener("open-support-chat", handler);
    return () => window.removeEventListener("open-support-chat", handler);
  }, []);

  const handleClose = () => { setOpen(false); setSelected(null); };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => { setOpen((v) => !v); setSelected(null); }}
        aria-label="Support chat"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-xl shadow-violet-500/30 hover:opacity-90 active:scale-95 transition-all"
        style={{ width: 54, height: 54 }}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {/* Pulse badge when closed */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-background animate-pulse" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[340px] rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 flex flex-col"
          style={{ maxHeight: "480px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Agent avatar */}
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                V
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">VConnectHub Support</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  <span className="text-white/70 text-[11px]">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-background dark:bg-[#0d1117]">
            {selected === null ? (
              <div className="p-4 space-y-2">
                {/* Greeting bubble */}
                <div className="flex gap-2 items-start mb-4">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                    V
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-foreground leading-relaxed">
                      👋 Hi there! I'm here to help. Select a question below or chat with us directly on WhatsApp.
                    </p>
                  </div>
                </div>

                {/* FAQ buttons */}
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold px-1 mb-2">
                  Common Questions
                </p>
                {FAQS.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className="w-full text-left text-sm px-4 py-3 rounded-2xl border border-border bg-card text-foreground hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex items-center justify-between gap-2 group"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-violet-500 transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Back */}
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back to questions
                </button>

                {/* Question bubble (user side) */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-white leading-snug">{FAQS[selected].question}</p>
                  </div>
                </div>

                {/* Answer bubble (agent side) */}
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                    V
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-foreground leading-relaxed">{FAQS[selected].answer}</p>
                  </div>
                </div>

                {/* Still need help nudge */}
                <div className="bg-muted/50 rounded-2xl px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Still need help?</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-500 hover:text-green-400 transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp footer */}
          <div className="px-4 py-3 bg-background dark:bg-[#0d1117] border-t border-border flex-shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-lg shadow-green-500/20"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat with Customer Service
            </a>
          </div>
        </div>
      )}
    </>
  );
}
