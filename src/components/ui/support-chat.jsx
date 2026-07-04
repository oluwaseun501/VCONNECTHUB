import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-support-chat", handler);
    return () => window.removeEventListener("open-support-chat", handler);
  }, []);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 hover:opacity-90 transition-all"
        style={{ width: 52, height: 52 }}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white dark:bg-[#0f1220] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 p-4">
            <p className="text-white font-semibold text-sm">Support Chat</p>
            <p className="text-white/70 text-xs mt-0.5">We're here 24/7 to help</p>
          </div>

          {/* Body */}
          <div className="p-4 min-h-[120px] flex items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-white/40 text-center">
              Hi! How can we help you today?
            </p>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 dark:border-white/10 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 h-9 px-3 rounded-lg text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-violet-500"
            />
            <button className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center text-white hover:bg-violet-700 transition-colors flex-shrink-0">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
