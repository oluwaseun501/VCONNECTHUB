import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Bot, ChevronRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const WA_NUMBER  = "2348000000000"; // ← replace with your real number
const WA_MESSAGE = encodeURIComponent("Hello! I need help with VConnectHub 👋");
const WA_LINK    = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const GLIDE = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

const FAQ = [
  {
    id: "pricing",
    question: "💰 How much does it cost?",
    answer: "Our virtual numbers start from **₦1,000** and go up to **₦1,800** depending on the service. WhatsApp numbers start at ₦1,200, Telegram at ₦1,000, TikTok at ₦1,300. All prices are one-time — no subscriptions!",
  },
  {
    id: "services",
    question: "📱 Which services are supported?",
    answer: "We support **WhatsApp, Facebook, TikTok, Telegram, TextNow, Instagram, Gmail, Twitter/X, Snapchat, Binance** and 100+ more! New services are added regularly. Check the Pricing page for the full list.",
  },
  {
    id: "otp",
    question: "⚡ How fast is OTP delivery?",
    answer: "OTP codes are delivered in **under 5 seconds** on average! If you don't receive a code within 2 minutes, the number may be blocked by the service — in that case we'll give you a free replacement.",
  },
  {
    id: "wallet",
    question: "💳 How do I fund my wallet?",
    answer: "You can fund your wallet using **Paystack** — debit/credit card, bank transfer, or USSD. Go to your Dashboard and click **'Fund Wallet'**. Minimum top-up is ₦500 and it reflects instantly.",
  },
  {
    id: "refund",
    question: "🔄 What's your refund policy?",
    answer: "If your number didn't receive an OTP within the valid window, you're entitled to a **free replacement number or a full refund** to your wallet. Contact our support team with your order ID.",
  },
  {
    id: "pin",
    question: "🔐 How does the transaction PIN work?",
    answer: "Your **4-digit transaction PIN** is required for every purchase — just like a bank PIN. You can set or change it anytime from the **'Set PIN'** option in your dashboard sidebar. Never share it with anyone!",
  },
  {
    id: "safe",
    question: "🛡️ Is my data safe?",
    answer: "Absolutely. All transactions are **end-to-end encrypted**, we never store OTP codes, and virtual numbers are for verification only — never linked to your personal identity.",
  },
  {
    id: "howto",
    question: "🚀 How do I get started?",
    answer: "Simple! **1.** Create a free account. **2.** Fund your wallet. **3.** Choose a country & service. **4.** Pay & get your virtual number. **5.** Receive your OTP in seconds. That's it!",
  },
];

function formatAnswer(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

const STATE_WELCOME  = "welcome";
const STATE_QUESTION = "question"; 
const STATE_ANSWERED = "answered";
const STATE_FOLLOWUP = "followup";

export default function SupportChat() {
  const [open, setOpen]   = useState(false);
  const [chatState, setChatState] = useState(STATE_WELCOME);
  const [messages, setMessages]   = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-support-chat", handler);
    return () => window.removeEventListener("open-support-chat", handler);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { from: "bot", text: "👋 Hi there! I'm the VConnectHub support bot. What can I help you with today?" },
      ]);
      setTimeout(() => setChatState(STATE_QUESTION), 400);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatState]);

  const handleQuestion = (faq) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: faq.question },
      { from: "bot",  text: faq.answer, isAnswer: true },
    ]);
    setChatState(STATE_ANSWERED);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Did that help? What would you like to do next?" },
      ]);
      setChatState(STATE_FOLLOWUP);
    }, 700);
  };

  const handleAskMore = () => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: "Ask another question" },
      { from: "bot",  text: "Sure! Here are some things you can ask about 👇" },
    ]);
    setChatState(STATE_QUESTION);
  };

  const handleEnd = () => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: "That's all, thanks!" },
      { from: "bot",  text: "Happy to help! 😊 If you ever need anything else, just click the chat bubble. Have a great day!" },
    ]);
    setChatState(STATE_WELCOME);
  };

  const handleReset = () => {
    setMessages([
      { from: "bot", text: "👋 Hi there! I'm the VConnectHub support bot. What can I help you with today?" },
    ]);
    setChatState(STATE_QUESTION);
  };

  return (
    <>
      {/* ── Floating button ── */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-6 h-6" /></motion.div>
            : <motion.div key="chat" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate:-90, opacity: 0 }} transition={{ duration: 0.2 }}><MessageCircle className="w-6 h-6" /></motion.div>
          }
        </AnimatePresence>
        {!open && <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 24, scale: 0.95 }}
            transition={GLIDE}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-card"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">VConnect Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-white/80 text-xs">Online · Replies instantly</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={handleReset} className="text-white/60 hover:text-white text-xs transition-colors">Restart</button>
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      msg.from === "bot"
                        ? "bg-violet-500/15 border border-violet-500/30"
                        : "bg-fuchsia-500/15 border border-fuchsia-500/30"
                    }`}>
                      {msg.from === "bot"
                        ? <Bot className="w-3.5 h-3.5 text-violet-500" />
                        : <span className="text-[10px] font-bold text-fuchsia-500">You</span>
                      }
                    </div>

                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                      dangerouslySetInnerHTML={
                        msg.from === "bot"
                          ? { __html: formatAnswer(msg.text) }
                          : undefined
                      }
                    >
                      {msg.from === "user" ? msg.text : undefined}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* ── Interactive options at bottom ── */}
            <div className="flex-shrink-0 border-t border-border px-3 py-3 space-y-2 bg-card">

              {/* Question chips */}
              {chatState === STATE_QUESTION && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={GLIDE}
                  className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1"
                >
                  {FAQ.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => handleQuestion(faq)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted/50 hover:bg-violet-500/10 hover:border-violet-500/30 text-sm text-left text-foreground transition-all group"
                    >
                      <span>{faq.question}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 transition-colors" />
                    </button>
                  ))}

                  {/* WhatsApp option always in the list */}
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-sm text-left text-emerald-600 dark:text-emerald-400 transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <SiWhatsapp className="w-4 h-4" />
                      Chat with us on WhatsApp
                    </span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.div>
              )}

              {/* Follow-up options after answering */}
              {chatState === STATE_FOLLOWUP && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={GLIDE}
                  className="space-y-2"
                >
                  <button
                    onClick={handleAskMore}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-sm text-violet-600 dark:text-violet-400 font-medium transition-all group"
                  >
                    <span>🙋 Ask another question</span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400 font-medium transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <SiWhatsapp className="w-4 h-4" />
                      Message us on WhatsApp
                    </span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <button
                    onClick={handleEnd}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                  >
                    ✅ That's all, thanks!
                  </button>
                </motion.div>
              )}

              {/* Ended state */}
              {chatState === STATE_WELCOME && messages.length > 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
                  <button
                    onClick={handleReset}
                    className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Start a new conversation →
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}