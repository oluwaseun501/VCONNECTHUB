import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Zap, Search, Loader2, ExternalLink, RefreshCw,
  ChevronDown, Info, Lock, CheckCircle2, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import FundWalletModal from "@/components/FundWalletModal";

import SEOHead from "@/components/SEOHead";

// ── Status styles ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  PENDING:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PROCESSING:  "bg-blue-500/10  text-blue-400  border-blue-500/20",
  IN_PROGRESS: "bg-blue-500/10  text-blue-400  border-blue-500/20",
  FINISHED:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELED:    "bg-red-500/10   text-red-400   border-red-500/20",
  PARTIAL:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

// ── Brand SVG Icons ────────────────────────────────────────────────────────────
const Icons = {
  TikTok: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
    </svg>
  ),
  Instagram: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Facebook: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  YouTube: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  ),
  Twitter: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  WhatsApp: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  ),
  Telegram: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  Snapchat: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.622-.01.143-.02.284-.027.418.142.07.34.138.565.138.215 0 .44-.065.645-.202.1-.07.208-.1.316-.1.225 0 .43.14.486.34.06.22-.025.48-.417.67-.055.03-.132.06-.237.096-.154.056-.377.138-.557.365-.09.115-.208.43-.087.876.088.318.629 1.826 2.043 3.226.484.48.742.98.742 1.485 0 .67-.499 1.22-1.197 1.458-.696.238-1.61.26-2.815.07l-.125-.018-.35.65c-.124.23-.232.417-.345.603-.137.22-.278.447-.447.71-.082.127-.17.257-.265.39-.206.288-.44.578-.716.847-.28.272-.604.527-.987.75-.49.287-1.05.474-1.67.56-.44.06-.902.083-1.39.083-.49 0-.95-.023-1.393-.083a5.81 5.81 0 0 1-1.672-.56c-.382-.223-.706-.478-.986-.75-.276-.27-.51-.56-.716-.847-.094-.133-.183-.263-.265-.39-.17-.263-.31-.49-.447-.71-.113-.186-.22-.373-.344-.603l-.35-.65-.126.018c-1.204.19-2.12.168-2.814-.07-.698-.237-1.197-.788-1.197-1.458 0-.505.258-1.006.742-1.485 1.414-1.4 1.955-2.907 2.043-3.226.12-.445.003-.76-.088-.875-.18-.228-.403-.31-.557-.366-.106-.036-.183-.065-.237-.096-.393-.19-.477-.45-.418-.67a.49.49 0 0 1 .487-.34c.108 0 .216.03.316.1.205.137.43.2.645.202.226 0 .423-.067.565-.138-.008-.134-.017-.275-.027-.418-.088-1.403-.213-3.429.317-4.622C7.86 1.07 11.215.793 12.206.793z" />
    </svg>
  ),
  Spotify: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
  LinkedIn: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

// ── Platform brand colors ──────────────────────────────────────────────────────
const PLATFORM_COLOR = {
  tiktok:    "#000000",
  instagram: "#E1306C",
  facebook:  "#1877F2",
  youtube:   "#FF0000",
  twitter:   "#000000",
  whatsapp:  "#25D366",
  telegram:  "#26A5E4",
  snapchat:  "#FFFC00",
  spotify:   "#1DB954",
  linkedin:  "#0A66C2",
};

// ── Top platforms for Nigeria ─────────────────────────────────────────────────
const PLATFORMS = [
  { key: "tiktok",    label: "TikTok",    Icon: Icons.TikTok,    match: ["tiktok"] },
  { key: "instagram", label: "Instagram", Icon: Icons.Instagram, match: ["instagram"] },
  { key: "facebook",  label: "Facebook",  Icon: Icons.Facebook,  match: ["facebook"] },
  { key: "youtube",   label: "YouTube",   Icon: Icons.YouTube,   match: ["youtube"] },
  { key: "twitter",   label: "Twitter",   Icon: Icons.Twitter,   match: ["twitter", " x "] },
  { key: "whatsapp",  label: "WhatsApp",  Icon: Icons.WhatsApp,  match: ["whatsapp"] },
  { key: "telegram",  label: "Telegram",  Icon: Icons.Telegram,  match: ["telegram"] },
  { key: "snapchat",  label: "Snapchat",  Icon: Icons.Snapchat,  match: ["snapchat"] },
  { key: "spotify",   label: "Spotify",   Icon: Icons.Spotify,   match: ["spotify"] },
  { key: "linkedin",  label: "LinkedIn",  Icon: Icons.LinkedIn,  match: ["linkedin"] },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n ?? 0).toLocaleString()}`;
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

function matchesPlatform(service, platformKey) {
  const p = PLATFORMS.find((p) => p.key === platformKey);
  if (!p) return true;
  const hay = ((service.category || "") + " " + (service.name || "")).toLowerCase();
  return p.match.some((kw) => hay.includes(kw));
}

// ── 4-box PIN input ───────────────────────────────────────────────────────────
function PinInput({ value, onChange, disabled }) {
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const digits = (value + "    ").slice(0, 4).split("");

  const handleKey = (i, e) => {
    const d = e.key.replace(/\D/g, "");
    if (d) {
      const next = value.slice(0, i) + d + value.slice(i + 1);
      onChange(next.slice(0, 4));
      if (i < 3) refs[i + 1].current?.focus();
    } else if (e.key === "Backspace") {
      onChange(value.slice(0, i) + value.slice(i + 1));
      if (i > 0) refs[i - 1].current?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {refs.map((ref, i) => (
        <input
          key={i}
          ref={ref}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digits[i].trim()}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(i, e)}
          disabled={disabled}
          className={`w-12 h-12 rounded-xl border text-center text-xl font-bold text-foreground outline-none transition-all
            ${digits[i].trim()
              ? "bg-fuchsia-500/10 border-fuchsia-500/60 shadow-[0_0_0_2px_rgba(217,70,239,0.15)]"
              : "bg-white/[0.04] border-border"}
            focus:border-fuchsia-500/60 focus:shadow-[0_0_0_2px_rgba(217,70,239,0.15)]
            disabled:opacity-40 disabled:cursor-not-allowed`}
        />
      ))}
    </div>
  );
}

// ── Select wrapper ─────────────────────────────────────────────────────────────
function Select({ value, onChange, options, placeholder, disabled }) {

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-11 pl-4 pr-10 rounded-xl bg-white/[0.04] border border-border text-sm
          text-foreground outline-none focus:border-fuchsia-500/50 transition-all
          appearance-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <option value="" disabled className="bg-background text-muted-foreground">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-background">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BoostingPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("order");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePlatform, setActivePlatform] = useState("tiktok");
  const [catSearch, setCatSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pin, setPin] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  const [showFundModal, setShowFundModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ── Fetch services ────────────────────────────────────────────────────────
  useEffect(() => {
    api
      .get("/boost/services")
      .then((res) => {
        const data = res.data;
        setServices(Array.isArray(data) ? data : data?.services ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Auto-select first category + service when data or platform changes ─────
  useEffect(() => {
    if (services.length === 0) return;
    const svcs = services.filter((s) => matchesPlatform(s, activePlatform));
    const cats = [...new Set(svcs.map((s) => s.category).filter(Boolean))].sort();
    const firstCat = cats[0] ?? "";
    setSelectedCategory(firstCat);
    const firstSvc = svcs.find((s) => s.category === firstCat);
    setSelectedServiceId(firstSvc?._id ?? "");
    setLink(""); setQuantity(""); setPin("");
    setOrderError(""); setOrderSuccess("");
  }, [services, activePlatform]);

  // ── Fetch history ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== "history" || history.length > 0) return;
    setHistoryLoading(true);
    api.get("/boost/orders")
      .then((res) => {
        const data = res.data;
        setHistory(Array.isArray(data) ? data : data?.orders ?? []);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [tab]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const availablePlatforms = useMemo(
    () => PLATFORMS.filter((p) => services.some((s) => matchesPlatform(s, p.key))),
    [services]
  );

  const platformServices = useMemo(
    () => services.filter((s) => matchesPlatform(s, activePlatform)),
    [services, activePlatform]
  );

  const categories = useMemo(() => {
    const raw = [...new Set(platformServices.map((s) => s.category).filter(Boolean))].sort();
    return catSearch.trim()
      ? raw.filter((c) => c.toLowerCase().includes(catSearch.toLowerCase()))
      : raw;
  }, [platformServices, catSearch]);

  const categoryServices = useMemo(
    () => platformServices.filter((s) => s.category === selectedCategory),
    [platformServices, selectedCategory]
  );

  const selectedService = useMemo(
    () => categoryServices.find((s) => s._id === selectedServiceId) ?? null,
    [categoryServices, selectedServiceId]
  );

  const unitPrice = selectedService?.ngnPrice ?? selectedService?.customPrice ?? 0;
  const totalPrice =
    selectedService && quantity ? ((unitPrice / 1000) * Number(quantity)).toFixed(2) : null;

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const first = platformServices.find((s) => s.category === cat);
    setSelectedServiceId(first?._id ?? "");
    setLink(""); setQuantity(""); setPin("");
    setOrderError(""); setOrderSuccess("");
  };

  const handleServiceChange = (id) => {
    setSelectedServiceId(id);
    setLink(""); setQuantity(""); setPin("");
    setOrderError(""); setOrderSuccess("");
  };

  const canPlace = selectedService && link.trim() && quantity && pin.length === 4 && !placing;

  const handlePlaceOrder = async () => {
    if (!canPlace) return;
    const qty = Number(quantity);
    if (qty < selectedService.minOrder || qty > selectedService.maxOrder) {
      setOrderError(
        `Quantity must be between ${selectedService.minOrder.toLocaleString()} and ${selectedService.maxOrder.toLocaleString()}`
      );
      return;
    }
    setOrderError("");
    setPlacing(true);
    try {
      await api.post(
        "/boost/order",
        { serviceId: selectedService._id, link: link.trim(), quantity: qty },
        { headers: { "x-transaction-pin": pin } }
      );
      setOrderSuccess("Order placed! Check your order history for status updates.");
      setLink(""); setQuantity(""); setPin("");
      setHistory([]);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order. Check your PIN or wallet balance.");
    } finally {
      setPlacing(false);
    }
  };

  const refreshHistory = () => {
    setHistory([]);
    setHistoryLoading(true);
    api.get("/boost/orders")
      .then((res) => {
        const data = res.data;
        setHistory(Array.isArray(data) ? data : data?.orders ?? []);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  };

  const activePlatformObj = PLATFORMS.find((p) => p.key === activePlatform);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>

      <SEOHead
      title="Buy SMM Services Nigeria – TikTok, Instagram, YouTube | VConnectHub"
      description="Get real TikTok followers, Instagram likes and YouTube views instantly. Nigeria's #1 SMM panel."
      url="https://www.vconnecthub.com/boosting"
    />
      {/* Wallet bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-white/[0.03] border border-border mb-6">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Wallet Balance
          </p>
          <p className="text-2xl font-bold text-foreground mt-0.5 tracking-tight">
            ₦{Number(user?.walletBalance ?? user?.balance ?? 0).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => setShowFundModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold
            bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white
            hover:from-violet-500 hover:to-fuchsia-500 transition-all
            shadow-lg shadow-fuchsia-500/20 whitespace-nowrap self-start sm:self-auto"
        >
          + Add Funds
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16 space-y-4">

        {/* Page header + tabs */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-fuchsia-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground tracking-tight leading-none">Place Order</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Social media growth services</p>
            </div>
          </div>
          <div className="flex gap-0.5 p-1 rounded-xl bg-white/[0.03] border border-border flex-shrink-0">
            {[["order", "New Order"], ["history", "My Orders"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTab(val)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  tab === val ? "bg-fuchsia-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════ NEW ORDER TAB ══════════ */}
        {tab === "order" && (
          <>
            {/* Platform tabs — horizontal scrollable row */}
            <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
              <div className="flex gap-1.5 w-max pb-0.5">
                {loading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-fuchsia-400" />
                    <span className="text-xs text-muted-foreground">Loading…</span>
                  </div>
                ) : (
                  availablePlatforms.map((p) => {
                    const isActive = activePlatform === p.key;
                    const brandColor = PLATFORM_COLOR[p.key] ?? "#a855f7";
                    return (
                      <button
                        key={p.key}
                        onClick={() => setActivePlatform(p.key)}
                        style={isActive ? { backgroundColor: brandColor, borderColor: brandColor, color: "#fff" } : {}}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold
                          whitespace-nowrap border transition-all flex-shrink-0 ${
                            isActive
                              ? "shadow-sm"
                              : "bg-white/[0.03] text-muted-foreground border-border hover:text-foreground hover:bg-white/[0.06]"
                          }`}
                      >
                        <span style={isActive ? { color: "#fff" } : { color: brandColor }}>
                          <p.Icon size={14} />
                        </span>
                        {p.label}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border border-border bg-white/[0.02] overflow-hidden divide-y divide-border/60">

              {/* Search categories */}
              <div className="px-5 py-4">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Search Categories
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={catSearch}
                    onChange={(e) => setCatSearch(e.target.value)}
                    placeholder="Search categories…"
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-border text-sm
                      text-foreground placeholder:text-muted-foreground outline-none focus:border-fuchsia-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="px-5 py-4">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Category
                </label>
                {loading ? (
                  <div className="flex items-center gap-2 h-11">
                    <Loader2 className="w-4 h-4 animate-spin text-fuchsia-400" />
                    <span className="text-sm text-muted-foreground">Loading services…</span>
                  </div>
                ) : (
                  <Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder="— Select a category —"
                    disabled={categories.length === 0}
                    options={categories.map((c) => ({ value: c, label: c }))}
                  />
                )}
              </div>

              {/* Service */}
              {selectedCategory && (
                <div className="px-5 py-4">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Service
                  </label>
                  <Select
                    value={selectedServiceId}
                    onChange={handleServiceChange}
                    placeholder="— Select a service —"
                    disabled={categoryServices.length === 0}
                    options={categoryServices.map((s) => ({
                      value: s._id,
                      label: `${s.name} — ${fmt(s.ngnPrice ?? s.customPrice)}/1K`,
                    }))}
                  />
                </div>
              )}

              {/* Description */}
              {selectedService && (
                <div className="px-5 py-4">
                  <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/[0.06] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {activePlatformObj && (
                        <span style={{ color: PLATFORM_COLOR[activePlatformObj.key] ?? "#a855f7" }}>
                          <activePlatformObj.Icon size={14} />
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-widest">
                        Description
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug mb-3">
                      {selectedService.name}
                    </p>
                    <ul className="space-y-1.5">
                      {[
                        "Link your profile or post URL",
                        `Min: ${selectedService.minOrder?.toLocaleString()} | Max: ${selectedService.maxOrder?.toLocaleString()}`,
                        null, // price — rendered separately
                        "Orders cannot be cancelled after placement",
                      ].map((item, i) =>
                        i === 2 ? (
                          <li key={i} className="text-xs text-muted-foreground flex gap-2">
                            <span className="text-fuchsia-400/50 flex-shrink-0">•</span>
                            Price per 1,000:{" "}
                            <span className="font-semibold text-fuchsia-300">
                              {fmt(selectedService.ngnPrice ?? selectedService.customPrice)}
                            </span>
                          </li>
                        ) : (
                          <li key={i} className="text-xs text-muted-foreground flex gap-2">
                            <span className="text-fuchsia-400/50 flex-shrink-0">•</span>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Link */}
              {selectedService && (
                <div className="px-5 py-4">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Link
                  </label>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter a profile or post link"
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-border text-sm
                      text-foreground placeholder:text-muted-foreground outline-none focus:border-fuchsia-500/50 transition-all"
                  />
                </div>
              )}

              {/* Quantity */}
              {selectedService && (
                <div className="px-5 py-4">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min={selectedService.minOrder}
                    max={selectedService.maxOrder}
                    placeholder={`Min: ${selectedService.minOrder?.toLocaleString()} — Max: ${selectedService.maxOrder?.toLocaleString()}`}
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-border text-sm
                      text-foreground placeholder:text-muted-foreground outline-none focus:border-fuchsia-500/50 transition-all"
                  />
                </div>
              )}

              {/* Total */}
              {totalPrice && (
                <div className="px-5 py-3.5 flex items-center justify-between bg-white/[0.015]">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Total Charge
                  </span>
                  <span className="text-lg font-bold text-fuchsia-400 tracking-tight">
                    {fmt(totalPrice)}
                  </span>
                </div>
              )}

              {/* PIN */}
              {selectedService && (
                <div className="px-5 py-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Transaction PIN
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your 4-digit PIN to authorise this order.
                  </p>
                  <PinInput value={pin} onChange={setPin} disabled={placing} />
                </div>
              )}

              {/* Feedback */}
              {(orderError || orderSuccess) && (
                <div className="px-5 py-3">
                  {orderError && (
                    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{orderError}</p>
                    </div>
                  )}
                  {orderSuccess && (
                    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-400">{orderSuccess}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Place Order button */}
              {selectedService && (
                <div className="px-5 py-5">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!canPlace}
                    className="w-full h-12 rounded-xl text-sm font-bold tracking-wide
                      bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white
                      hover:from-fuchsia-500 hover:to-violet-500
                      disabled:opacity-30 disabled:cursor-not-allowed
                      transition-all flex items-center justify-center gap-2
                      shadow-lg shadow-fuchsia-500/20"
                  >
                    {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {placing ? "Placing Order…" : totalPrice ? `Place Order · ${fmt(totalPrice)}` : "Place Order"}
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Your balance:{" "}
                    <span className="font-semibold text-foreground">
                      ₦{Number(user?.walletBalance ?? user?.balance ?? 0).toLocaleString()}
                    </span>
                  </p>
                </div>
              )}

              {/* Loading / empty state */}
              {loading && (
                <div className="px-5 py-10 flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-fuchsia-400" />
                  <p className="text-sm text-muted-foreground">Loading services…</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════ MY ORDERS TAB ══════════ */}
        {tab === "history" && (
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-border">
              <h2 className="text-sm font-bold text-foreground tracking-tight">My Boost Orders</h2>
              <button
                onClick={refreshHistory}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>
            {historyLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-5 h-5 animate-spin text-fuchsia-400" />
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No boost orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase tracking-widest text-[10px]">
                      <th className="text-left px-5 py-3 font-semibold">Service</th>
                      <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Link</th>
                      <th className="text-left px-4 py-3 font-semibold">Qty</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Date</th>
                      <th className="text-right px-5 py-3 font-semibold">Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((o, i) => (
                      <tr
                        key={o._id}
                        className={`border-b border-border/50 hover:bg-white/[0.03] transition-colors ${
                          i === history.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="px-5 py-3.5 text-foreground max-w-[140px]">
                          <span className="block truncate font-medium">
                            {typeof o.service === "object" ? o.service?.name : o.serviceName ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell max-w-[120px]">
                          <a href={o.link} target="_blank" rel="noreferrer"
                            className="text-fuchsia-400 hover:underline flex items-center gap-1 truncate">
                            {o.link} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </td>
                        <td className="px-4 py-3.5 text-foreground font-medium">{o.quantity?.toLocaleString()}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            STATUS_STYLES[o.status] ?? "bg-white/5 text-muted-foreground border-border"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground hidden lg:table-cell">{formatDate(o.createdAt)}</td>
                        <td className="px-5 py-3.5 text-right font-bold text-red-400">
                          -{fmt(o.charge ?? o.totalPrice ?? 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showFundModal && <FundWalletModal onClose={() => setShowFundModal(false)} />}
    </DashboardLayout>
  );
}
