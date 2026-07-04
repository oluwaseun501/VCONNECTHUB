import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function PageLoader() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(t);
  }, [location]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-violet-50/90 dark:bg-[#080b14]/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/logo.png"
          alt="VConnectHub"
          className="h-14 w-auto animate-pulse"
        />
        <div className="w-40 h-1 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
            style={{ animation: "loaderBar 0.5s ease-out forwards" }}
          />
        </div>
      </div>
      <style>{`
        @keyframes loaderBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}