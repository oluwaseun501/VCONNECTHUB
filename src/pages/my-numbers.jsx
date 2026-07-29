import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import { Link } from "wouter";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  List,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  RefreshCw,
  Copy,
  Check,
  Loader2,
  MessageSquare,
  Download,
} from "lucide-react";

import {
  SiWhatsapp,
  SiTelegram,
  SiTiktok,
  SiFacebook,
  SiInstagram,
  SiX,
  SiSnapchat,
  SiGmail,
  SiBinance,
  SiSignal,
} from "react-icons/si";

import {
  DashboardLayout,
} from "@/components/layout/DashboardLayout";

import api from "@/lib/axios";


const GLIDE = {
  duration: 0.7,
  ease: [
    0.22,
    1,
    0.36,
    1,
  ],
};


// ============================================================
// SERVICE ICONS
// ============================================================
const SERVICE_ICONS = {
  whatsapp: {
    icon: SiWhatsapp,
    color: "#25D366",
  },

  telegram: {
    icon: SiTelegram,
    color: "#2AABEE",
  },

  tiktok: {
    icon: SiTiktok,
    color: "#010101",
  },

  facebook: {
    icon: SiFacebook,
    color: "#1877F2",
  },

  instagram: {
    icon: SiInstagram,
    color: "#E4405F",
  },

  twitter: {
    icon: SiX,
    color: "#000000",
  },

  snapchat: {
    icon: SiSnapchat,
    color: "#FFFC00",
  },

  gmail: {
    icon: SiGmail,
    color: "#EA4335",
  },

  binance: {
    icon: SiBinance,
    color: "#F3BA2F",
  },

  signal: {
    icon: SiSignal,
    color: "#3A76F0",
  },
};


// ============================================================
// TIME AGO
// ============================================================
function timeAgo(iso) {
  if (!iso) return "";

  const diff =
    Date.now() -
    new Date(iso).getTime();

  const m =
    Math.floor(
      diff / 60000
    );

  if (m < 1) {
    return "just now";
  }

  if (m < 60) {
    return `${m}m ago`;
  }

  const h =
    Math.floor(
      m / 60
    );

  if (h < 24) {
    return `${h}h ago`;
  }

  return `${Math.floor(
    h / 24
  )}d ago`;
}


// ============================================================
// COUNTDOWN HOOK
// ============================================================
function useCountdown(
  expiresAt,
  isActive
) {
  const [
    secsLeft,
    setSecsLeft,
  ] = useState(null);

  useEffect(() => {
    if (
      !isActive ||
      !expiresAt
    ) {
      setSecsLeft(null);
      return;
    }

    const tick = () => {
      const left = Math.max(
        0,
        Math.floor(
          (
            new Date(
              expiresAt
            ).getTime() -
            Date.now()
          ) / 1000
        )
      );

      setSecsLeft(left);
    };

    tick();

    const id =
      setInterval(
        tick,
        1000
      );

    return () =>
      clearInterval(id);
  }, [
    expiresAt,
    isActive,
  ]);

  return secsLeft;
}


// ============================================================
// NORMALIZE PROVIDER STATUS
// ============================================================
function normalizeStatus(
  status
) {
  switch (
    String(
      status || ""
    ).toUpperCase()
  ) {
    case "PENDING":
      return "waiting";

    case "RECEIVED":
      return "received";

    case "FINISHED":
    case "CANCELED":
    case "TIMEOUT":
    case "BANNED":
      return "expired";

    default:
      return "waiting";
  }
}


// ============================================================
// GET LATEST OTP
// ============================================================
function getOtp(order) {
  if (
    Array.isArray(
      order.sms
    ) &&
    order.sms.length > 0
  ) {
    const latest =
      order.sms[
        order.sms.length - 1
      ];

    return {
      code:
        latest.code ||
        null,

      text:
        latest.text ||
        null,
    };
  }

  return null;
}


// ============================================================
// CHECK IF ORDER HAS EXPIRED LOCALLY
// ============================================================
function getEffectiveStatus(
  entry
) {
  if (
    entry.status ===
      "expired"
  ) {
    return "expired";
  }

  // If OTP already arrived,
  // keep received status.
  if (
    entry.otp?.code
  ) {
    return "received";
  }

  // Check our backend expiry time
  if (
    entry.expiresAt &&
    Date.now() >=
      new Date(
        entry.expiresAt
      ).getTime()
  ) {
    return "expired";
  }

  return entry.status;
}


// ============================================================
// ACTIVE STATUS
// ============================================================
function isActive(
  status
) {
  return (
    status === "waiting" ||
    status === "received"
  );
}


// ============================================================
// COUNTDOWN BADGE
// ============================================================
function CountdownBadge({
  expiresAt,
  status,
}) {
  const secs =
    useCountdown(
      expiresAt,
      status === "waiting"
    );

  if (
    status !== "waiting" ||
    secs === null ||
    secs <= 0
  ) {
    return null;
  }

  const m =
    Math.floor(
      secs / 60
    );

  const s =
    secs % 60;

  const urgent =
    secs < 120;

  return (
    <span
      className={`flex items-center gap-1 text-xs font-mono font-semibold ${
        urgent
          ? "text-red-500"
          : "text-amber-500"
      }`}
    >
      <Clock className="w-3 h-3" />

      {m}:
      {String(s).padStart(
        2,
        "0"
      )}{" "}
      remaining
    </span>
  );
}


// ============================================================
// TIMER BAR
// ============================================================
function TimerBar({
  expiresAt,
  status,
}) {
  const active =
    isActive(status) &&
    status === "waiting" &&
    !!expiresAt;

  const secs =
    useCountdown(
      expiresAt,
      active
    );

  if (
    !active ||
    secs === null ||
    secs <= 0
  ) {
    return null;
  }

  const total =
    15 * 60;

  const pct =
    Math.max(
      0,
      Math.min(
        100,
        (
          secs /
          total
        ) * 100
      )
    );

  const m =
    Math.floor(
      secs / 60
    );

  const s =
    secs % 60;

  const urgent =
    secs < 120;

  const warning =
    secs < 300;

  const barColor =
    urgent
      ? "bg-red-500"
      : warning
        ? "bg-amber-500"
        : "bg-emerald-500";

  const textColor =
    urgent
      ? "text-red-500"
      : warning
        ? "text-amber-500"
        : "text-emerald-500";

  const bgColor =
    urgent
      ? "bg-red-500/10 border-red-500/20"
      : warning
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-emerald-500/10 border-emerald-500/20";

  return (
    <div
      className={`mt-3 rounded-xl border px-4 py-3 ${bgColor}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Clock
            className={`w-3.5 h-3.5 ${textColor}`}
          />

          <span
            className={`text-xs font-semibold ${textColor}`}
          >
            {urgent
              ? "Expiring soon!"
              : warning
                ? "Time running out"
                : "Number active"}
          </span>
        </div>

        <span
          className={`text-sm font-mono font-bold tabular-nums ${textColor}`}
        >
          {m}:
          {String(s).padStart(
            2,
            "0"
          )}
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor} ${
            urgent
              ? "animate-pulse"
              : ""
          }`}
          style={{
            width: `${pct}%`,
          }}
        />
      </div>

      <p className="text-[11px] text-muted-foreground mt-1.5">
        This number expires in{" "}
        {m} min {s}s — send
        the SMS now
      </p>
    </div>
  );
}


// ============================================================
// STATUS BADGE
// ============================================================
function StatusBadge({
  status,
}) {
  if (
    isActive(status)
  ) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/25">
      <XCircle className="w-3 h-3" />
      Expired
    </span>
  );
}


// ============================================================
// SMS SECTION
// ============================================================
function SmsSection({
  entry,
  onCheck,
  checking,
}) {
  const hasOtp =
    !!entry.otp?.code;

  const msgCount =
    entry.smsAll?.length ||
    (entry.otp ? 1 : 0);

  return (
    <div className="mt-3 border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />

          <span className="text-xs font-semibold text-foreground">
            SMS Verification Code
          </span>
        </div>

        <span className="text-xs text-muted-foreground">
          {msgCount} message
          {msgCount !== 1
            ? "s"
            : ""}{" "}
          received
        </span>
      </div>

      <div className="px-4 py-3">
        {hasOtp ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  OTP Code
                </p>

                <p className="text-lg font-bold text-emerald-500 tracking-[0.3em]">
                  {entry.otp.code}
                </p>

                {entry.otp.text && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {entry.otp.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>

            <p className="text-sm text-muted-foreground">
              No SMS code received yet
            </p>

            {isActive(
              entry.status
            ) && (
              <button
                onClick={() =>
                  onCheck(entry)
                }
                disabled={
                  checking
                }
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
              >
                {checking ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}

                Check for SMS
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================
export default function MyNumbers() {
  const [
    numbers,
    setNumbers,
  ] = useState([]);

  const [
    copied,
    setCopied,
  ] = useState(null);

  const [
    filter,
    setFilter,
  ] = useState("all");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    checkingId,
    setCheckingId,
  ] = useState(null);


  // ==========================================================
  // LOAD ORDERS
  // ==========================================================
  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data,
      } = await api.get(
        "/api/numbers/orders?page=1&limit=50"
      );

      const orders =
        data?.orders || [];

      const mapped =
        orders.map(
          (order) => {
            const otp =
              getOtp(order);

            const status =
              normalizeStatus(
                order.status
              );

            const mappedOrder = {
              id:
                order._id ||
                order.orderId,

              orderId:
                order.orderId,

              serviceId:
                (
                  order.product ||
                  ""
                ).toLowerCase(),

              service:
                order.product,

              country:
                order.country,

              price:
                order.price,

              number:
                order.phone,

              status,

              otp,

              smsAll:
                Array.isArray(
                  order.sms
                )
                  ? order.sms
                  : [],

              purchasedAt:
                order.createdAt ||
                null,

              expiresAt:
                order.expiresAt ||
                null,
            };

            mappedOrder.status =
              getEffectiveStatus(
                mappedOrder
              );

            return mappedOrder;
          }
        );

      setNumbers(
        mapped
      );

    } catch (err) {
      setError(
        err?.response?.data
          ?.message ||
          "Failed to load your numbers."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // COPY NUMBER
  // ==========================================================
  const copyNumber = async (
    number,
    id
  ) => {
    try {
      await navigator.clipboard.writeText(
        number
      );

      setCopied(id);

      setTimeout(
        () => {
          setCopied(null);
        },
        2000
      );

    } catch (error) {
      console.error(
        "Failed to copy number:",
        error
      );
    }
  };


  // ==========================================================
  // CHECK ONE ORDER FOR SMS
  // ==========================================================
  const checkSms = async (
    entry,
    showError = true
  ) => {
    try {
      const {
        data,
      } = await api.get(
        `/api/numbers/check/${entry.orderId}`
      );

      if (!data) {
        return null;
      }

      setNumbers(
        (prev) =>
          prev.map(
            (n) => {
              if (
                n.id !==
                entry.id
              ) {
                return n;
              }

              const updated = {
                ...n,

                status:
                  normalizeStatus(
                    data.status
                  ),

                otp:
                  getOtp(data),

                smsAll:
                  Array.isArray(
                    data.sms
                  )
                    ? data.sms
                    : n.smsAll,
              };

              updated.status =
                getEffectiveStatus(
                  updated
                );

              return updated;
            }
          )
      );

      return data;

    } catch (error) {
      console.error(
        `Failed to check SMS for order ${entry.orderId}:`,
        error
      );

      if (
        showError
      ) {
        setError(
          error?.response
            ?.data?.message ||
            "Failed to check for SMS."
        );
      }

      return null;
    }
  };


  // ==========================================================
  // MANUAL SMS CHECK
  // ==========================================================
  const handleManualCheckSms =
    async (
      entry
    ) => {
      setCheckingId(
        entry.id
      );

      try {
        await checkSms(
          entry,
          true
        );
      } finally {
        setCheckingId(
          null
        );
      }
    };


  // ==========================================================
  // AUTOMATIC SMS POLLING
  // ==========================================================
  useEffect(
    () => {
      if (
        numbers.length === 0
      ) {
        return;
      }

      const activeOrders =
        numbers.filter(
          (order) =>
            order.status ===
              "waiting" &&
            !order.otp?.code
        );

      if (
        activeOrders.length ===
        0
      ) {
        return;
      }

      let cancelled =
        false;

      const pollSms =
        async () => {
          for (
            const order of activeOrders
          ) {
            if (
              cancelled
            ) {
              return;
            }

            await checkSms(
              order,
              false
            );
          }
        };

      // Check immediately
      pollSms();

      // Then every 10 seconds
      const intervalId =
        setInterval(
          pollSms,
          10000
        );

      return () => {
        cancelled = true;

        clearInterval(
          intervalId
        );
      };
    },
    [numbers]
  );


  // ==========================================================
  // AUTO-EXPIRE FRONTEND ORDERS
  // ==========================================================
  useEffect(
    () => {
      const intervalId =
        setInterval(
          () => {
            setNumbers(
              (prev) =>
                prev.map(
                  (entry) => {
                    if (
                      entry.status ===
                      "waiting"
                    ) {
                      const updated = {
                        ...entry,
                      };

                      updated.status =
                        getEffectiveStatus(
                          updated
                        );

                      return updated;
                    }

                    return entry;
                  }
                )
            );
          },
          1000
        );

      return () =>
        clearInterval(
          intervalId
        );
    },
    []
  );


  // ==========================================================
  // FILTER TABS
  // ==========================================================
  const tabs = [
    {
      key: "all",
      label: "All Numbers",
    },
    {
      key: "active",
      label: "Active",
    },
    {
      key: "expired",
      label: "Expired",
    },
  ];


  // ==========================================================
  // COUNTS
  // ==========================================================
  const counts =
    useMemo(
      () => ({
        all:
          numbers.length,

        active:
          numbers.filter(
            (n) =>
              isActive(
                n.status
              )
          ).length,

        expired:
          numbers.filter(
            (n) =>
              n.status ===
              "expired"
          ).length,
      }),
      [numbers]
    );


  // ==========================================================
  // FILTERED ORDERS
  // ==========================================================
  const filtered =
    filter === "all"
      ? numbers
      : filter === "active"
        ? numbers.filter(
            (n) =>
              isActive(
                n.status
              )
          )
        : numbers.filter(
            (n) =>
              n.status ===
              "expired"
          );


  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={
            GLIDE
          }
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                <List className="w-5 h-5 text-violet-500" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  My Numbers
                </h1>

                <p className="text-muted-foreground text-sm">
                  All your purchased virtual numbers
                </p>
              </div>
            </div>

            <div className="flex gap-2">

              <button
                onClick={
                  load
                }
                disabled={
                  loading
                }
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground text-sm transition-all disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>

              <Link href="/purchase-number">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-all">
                  <ShoppingCart className="w-4 h-4" />
                  Buy Number
                </button>
              </Link>

            </div>
          </div>
        </motion.div>


        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-500 flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}


        {/* LOADING */}
        {loading &&
          numbers.length ===
            0 &&
          !error && (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading your numbers…
            </div>
          )}


        {/* FILTER TABS */}
        {!loading &&
          numbers.length >
            0 && (
            <div className="flex gap-2 mb-6 flex-wrap">

              {tabs.map(
                (tab) => (
                  <button
                    key={
                      tab.key
                    }
                    onClick={() =>
                      setFilter(
                        tab.key
                      )
                    }
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      filter ===
                      tab.key
                        ? "bg-violet-500/15 border-violet-500/30 text-violet-600 dark:text-violet-400"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {
                      tab.label
                    }

                    <span className="ml-1.5 text-xs opacity-70">
                      (
                      {
                        counts[
                          tab.key
                        ]
                      }
                      )
                    </span>
                  </button>
                )
              )}

            </div>
          )}


        {/* EMPTY STATE */}
        {!loading &&
          numbers.length ===
            0 &&
          !error && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={
                GLIDE
              }
              className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <List className="w-8 h-8 text-muted-foreground" />
              </div>

              <h3 className="font-bold text-foreground mb-2">
                No numbers yet
              </h3>

              <p className="text-muted-foreground text-sm mb-6">
                Purchase your first virtual number to get started with SMS verification
              </p>

              <Link href="/purchase-number">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-md hover:opacity-90 transition-all">
                  Buy Virtual Number →
                </button>
              </Link>
            </motion.div>
          )}


        {/* EMPTY FILTER */}
        {!loading &&
          numbers.length >
            0 &&
          filtered.length ===
            0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No{" "}
              {filter}{" "}
              numbers to show.
            </div>
          )}


        {/* NUMBERS */}
        <AnimatePresence>
          <div className="space-y-4">

            {filtered.map(
              (
                entry,
                i
              ) => {

                const svc =
                  SERVICE_ICONS[
                    entry.serviceId
                  ] || {
                    icon: List,
                    color:
                      "#8b5cf6",
                  };

                const Icon =
                  svc.icon;

                const isChecking =
                  checkingId ===
                  entry.id;

                return (
                  <motion.div
                    key={
                      entry.id
                    }
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      ...GLIDE,
                      delay:
                        i *
                        0.05,
                    }}
                    className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-violet-500/25 transition-all"
                  >

                    {/* TOP ROW */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">

                      <div className="flex items-center gap-3 min-w-0">

                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{
                            backgroundColor:
                              svc.color +
                              "22",
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{
                              color:
                                svc.color,
                            }}
                          />
                        </div>

                        <div className="min-w-0">

                          <div className="flex items-center gap-2 flex-wrap">

                            <code className="text-base font-bold text-foreground tracking-wide">
                              {
                                entry.number
                              }
                            </code>

                            <StatusBadge
                              status={
                                entry.status
                              }
                            />

                          </div>

                          <p className="text-xs text-muted-foreground capitalize mt-0.5">

                            Country:{" "}
                            <span className="capitalize">
                              {
                                entry.country
                              }
                            </span>

                            {" · "}

                            Service:{" "}
                            <span className="capitalize">
                              {
                                entry.service
                              }
                            </span>

                            {" · "}

                            {isActive(
                              entry.status
                            ) ? (
                              <CountdownBadge
                                expiresAt={
                                  entry.expiresAt
                                }
                                status={
                                  entry.status
                                }
                              />
                            ) : (
                              <span>
                                Expired
                              </span>
                            )}

                          </p>
                        </div>
                      </div>


                      {/* ACTIONS */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">

                        <button
                          onClick={() =>
                            copyNumber(
                              entry.number,
                              entry.id
                            )
                          }
                          title="Copy number"
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                        >
                          {copied ===
                          entry.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {isActive(
                          entry.status
                        ) && (
                          <button
                            onClick={() =>
                              handleManualCheckSms(
                                entry
                              )
                            }
                            disabled={
                              isChecking
                            }
                            title="Check for new SMS"
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                          >
                            <RefreshCw
                              className={`w-4 h-4 ${
                                isChecking
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </button>
                        )}

                      </div>
                    </div>


                    {/* TIMER */}
                    <TimerBar
                      expiresAt={
                        entry.expiresAt
                      }
                      status={
                        entry.status
                      }
                    />


                    {/* SMS */}
                    <SmsSection
                      entry={
                        entry
                      }
                      onCheck={
                        handleManualCheckSms
                      }
                      checking={
                        isChecking
                      }
                    />


                    {/* FOOTER */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">

                      <p className="text-xs text-muted-foreground">

                        Purchased:{" "}
                        {timeAgo(
                          entry.purchasedAt
                        )}

                        {entry.price
                          ? ` · Total cost: ₦${Number(
                              entry.price
                            ).toLocaleString()}`
                          : ""}

                      </p>

                      {entry.smsAll
                        ?.length >
                        0 && (
                        <button
                          onClick={() => {
                            const content =
                              entry.smsAll
                                .map(
                                  (
                                    s
                                  ) =>
                                    `Code: ${
                                      s.code ||
                                      ""
                                    }\n${
                                      s.text ||
                                      ""
                                    }`
                                )
                                .join(
                                  "\n---\n"
                                );

                            const blob =
                              new Blob(
                                [
                                  content,
                                ],
                                {
                                  type: "text/plain",
                                }
                              );

                            const url =
                              URL.createObjectURL(
                                blob
                              );

                            const a =
                              document.createElement(
                                "a"
                              );

                            a.href =
                              url;

                            a.download =
                              `sms-${entry.number}.txt`;

                            a.click();

                            URL.revokeObjectURL(
                              url
                            );
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />

                          Export SMS
                        </button>
                      )}

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}