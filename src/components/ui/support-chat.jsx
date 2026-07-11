import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "12495314889"; 

const FAQS = [
  {
    question: "How do I buy a virtual number?",
    answer: "Go to the Purchase Number page, choose your preferred network and plan, then pay from your wallet. Your number is activated instantly.",
  },
  {
    question: "How much does a virtual number cost?",
    answer: "Prices vary by network and validity period. Visit our Pricing page for the full breakdown.",
  },
  {
    question: "How do I fund my wallet?",
    answer: "Click on Wallet in your dashboard, then select Fund Wallet. You can pay via card or bank transfer.",
  },
  {
    question: "How long does it take to receive my number?",
    answer: "Activation is instant once payment is confirmed. Check My Numbers in your dashboard.",
  },
  {
    question: "What if I have a problem with my number?",
    answer: "Tap the WhatsApp button below to chat with our support team directly and we'll sort it out fast.",
  },
];

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-support-chat", handler);
    return () => window.removeEventListener("open-support-chat", handler);
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I need help with VconnectHub.")}`;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(!open); setSelected(null); }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 hover:opacity-90 transition-all"
        style={{ width: 52, height: 52 }}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white dark:bg-[#0f1220] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 p-4">
            <p className="text-white font-semibold text-sm">Support</p>
            <p className="text-white/70 text-xs mt-0.5">Select a question or chat with us</p>
          </div>

          {/* FAQ list or answer */}
          <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
            {selected === null ? (
              FAQS.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="w-full text-left text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white/80 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                >
                  {faq.question}
                </button>
              ))
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{FAQS[selected].question}</p>
                <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed">{FAQS[selected].answer}</p>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xs text-violet-500 hover:underline"
                >
                  ← Back to questions
                </button>
              </div>
            )}
          </div>

          {/* WhatsApp button */}
          <div className="p-3 border-t border-gray-100 dark:border-white/10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with Customer Service
            </a>
          </div>
        </div>
      )}
    </>
  );
}