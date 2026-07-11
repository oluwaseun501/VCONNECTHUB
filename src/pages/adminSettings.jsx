import { useState, useEffect } from "react";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import {
  Settings,
  Globe,
  DollarSign,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  ToggleRight,
  Loader2,
  AlertTriangle,
  Construction,
} from "lucide-react";
import { updatePassword, getAdminSettings, updateAdminSettings } from "./adminApi";

// ── These are UI-only toggles (no backend endpoints exist for them yet) ──
const INITIAL_CONFIG = {
  siteName: "VConnectHub",
  siteUrl: "https://vconnecthub.com",
  supportEmail: "support@vconnecthub.com",
  minDeposit: "5",
  maxDeposit: "1000",
  withdrawFee: "1.5",
  currency: "USD",
};

const INITIAL_FEATURES = {
  registration: true,
  googleLogin: true,
  walletFunding: true,
  withdrawals: false,
  p2pTransfer: true,
  supportChat: true,
};

const INITIAL_NOTIFICATIONS = {
  newUser: true,
  newDeposit: true,
  newOrder: false,
  failedPayment: true,
  lowBalance: false,
};

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-violet-600" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-border">
      <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4.5 h-4.5 text-violet-400" />
      </div>
      <div>
        <h2 className="font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [features, setFeatures] = useState(INITIAL_FEATURES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [saved, setSaved] = useState("");

  // ── Maintenance mode state ──
  const [maintenanceMode,    setMaintenanceMode]    = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [maintLoading,       setMaintLoading]       = useState(true);
  const [maintSaving,        setMaintSaving]        = useState(false);

  const [usdToNgn,     setUsdToNgn]     = useState(1600);
const [rateLoading,  setRateLoading]  = useState(true);
const [rateSaving,   setRateSaving]   = useState(false);

  // Load maintenance settings on mount
 useEffect(() => {
  getAdminSettings()
    .then(({ data }) => {
      setMaintenanceMode(data.maintenanceMode ?? false);
      setMaintenanceMessage(data.maintenanceMessage ?? "");
      setUsdToNgn(data.usdToNgn ?? 1600);
    })
    .catch(() => {})
    .finally(() => { setMaintLoading(false); setRateLoading(false); });
}, []);

  // UI-only: no backend endpoint for platform config yet
  const handleConfigSave = (e) => {
    e.preventDefault();
    showToast("Platform settings saved.");
  };


  const handleRateSave = async () => {
  setRateSaving(true);
  try {
    await updateAdminSettings({ usdToNgn: Number(usdToNgn) });
    showToast("Exchange rate updated.");
  } catch {
    showToast("Failed to save exchange rate.");
  } finally {
    setRateSaving(false);
  }
};


  // Real API: PUT /api/users/password
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwError("");
    if (!password.current) return setPwError("Current password is required.");
    if (password.next.length < 6) return setPwError("New password must be at least 6 characters.");
    if (password.next !== password.confirm) return setPwError("Passwords do not match.");

    setPwLoading(true);
    try {
      await updatePassword(password.current, password.next);
      setPassword({ current: "", next: "", confirm: "" });
      showToast("Password changed successfully.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password.";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  // Real API: save maintenance settings
  const handleMaintenanceSave = async () => {
    setMaintSaving(true);
    try {
      await updateAdminSettings({ maintenanceMode, maintenanceMessage });
      showToast(maintenanceMode ? "⚠️ Maintenance mode is now ON." : "✅ Site is back live.");
    } catch {
      showToast("Failed to save maintenance settings.");
    } finally {
      setMaintSaving(false);
    }
  };

  const showToast = (msg) => {
  setSaved(msg);
  setTimeout(() => setSaved(""), 3500);
};

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 space-y-6 overflow-auto max-w-3xl">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage platform configuration and preferences.</p>
          </div>

          {/* Toast */}
          {saved && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {saved}
            </div>
          )}

          {/* ── Platform Config ──────────────────────────────── */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <SectionHeader icon={Globe} title="Platform Configuration" description="Basic site settings and contact info." />
            <form onSubmit={handleConfigSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "siteName",     label: "Site Name",      type: "text" },
                  { key: "siteUrl",      label: "Site URL",        type: "url" },
                  { key: "supportEmail", label: "Support Email",   type: "email" },
                  { key: "currency",     label: "Currency Code",   type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={config[key]}
                      onChange={(e) => setConfig((c) => ({ ...c, [key]: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-border text-sm text-foreground outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all"
                    />
                  </div>
                ))}
              </div>

              <SectionHeader icon={DollarSign} title="Financial Limits" description="Deposit and fee configuration." />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: "minDeposit", label: "Min Deposit (₦)" },
                  { key: "maxDeposit", label: "Max Deposit (₦)" },
                  { key: "withdrawFee", label: "Withdraw Fee (%)" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={config[key]}
                      onChange={(e) => setConfig((c) => ({ ...c, [key]: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-border text-sm text-foreground outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.99] transition-all">
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
              </div>
            </form>
          </div>

          {/* ── Maintenance Mode ─────────────────────────────── */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <SectionHeader
              icon={Construction}
              title="Maintenance Mode"
              description="Put the site under maintenance. Regular users will see a maintenance page. Admins are unaffected."
            />

            {maintLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : (
              <div className="space-y-4">
                {/* Toggle row */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-border/50 hover:bg-white/[0.04] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">Site Status</p>
                    <p className={`text-xs mt-0.5 font-medium ${maintenanceMode ? "text-amber-400" : "text-emerald-400"}`}>
                      {maintenanceMode ? "🔴 Under Maintenance" : "🟢 Live & Operational"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode((v) => !v)}
                    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                      maintenanceMode ? "bg-amber-500" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                        maintenanceMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Custom message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    Maintenance Message
                  </label>
                  <textarea
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    rows={3}
                    placeholder="We are currently down for maintenance. Please check back soon."
                    className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground">Shown to users on the maintenance page.</p>
                </div>

                {/* Warning when on */}
                {maintenanceMode && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> Regular users cannot access the site while this is enabled.
                    </span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleMaintenanceSave}
                    disabled={maintSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {maintSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {maintSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Exchange Rate ─────────────────────────────── */}
<div className="glass-card rounded-2xl p-6 space-y-5">
  <SectionHeader
    icon={DollarSign}
    title="USD → NGN Exchange Rate"
    description="Used to convert provider prices (USD) to Naira before showing users. Update this when the rate changes."
  />
  {rateLoading ? (
    <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
    </div>
  ) : (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          1 USD = ₦
        </label>
        <input
          type="number"
          min="1"
          step="1"
          value={usdToNgn}
          onChange={(e) => setUsdToNgn(e.target.value)}
          className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-border text-sm text-foreground outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all"
        />
        <p className="text-[11px] text-muted-foreground">
          Current rate: $1 = ₦{Number(usdToNgn).toLocaleString()} — affects all service prices site-wide.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleRateSave}
          disabled={rateSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {rateSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {rateSaving ? "Saving…" : "Save Rate"}
        </button>
      </div>
    </div>
  )}
</div>

          {/* ── Feature Toggles ──────────────────────────────── */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <SectionHeader icon={ToggleRight} title="Feature Toggles" description="Enable or disable platform features instantly." />
            <div className="space-y-3">
              {Object.entries(features).map(([key, val]) => {
                const labels = {
                  registration:  { label: "User Registration",   desc: "Allow new users to sign up" },
                  googleLogin:   { label: "Google OAuth",         desc: "Enable Sign in with Google" },
                  walletFunding: { label: "Wallet Funding",       desc: "Allow users to top up their wallets" },
                  withdrawals:   { label: "Withdrawals",          desc: "Allow users to withdraw funds" },
                  p2pTransfer:   { label: "P2P Transfers",        desc: "Enable wallet-to-wallet transfers" },
                  supportChat:   { label: "Support Chat",         desc: "Show the support chat widget" },
                };
                const { label, desc } = labels[key];
                return (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-border/50 hover:bg-white/[0.04] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <Toggle enabled={val} onChange={(v) => { setFeatures((f) => ({ ...f, [key]: v })); showToast(`${label} ${v ? "enabled" : "disabled"}.`); }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Email Notifications ──────────────────────────── */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <SectionHeader icon={Bell} title="Email Notifications" description="Choose which events trigger admin email alerts." />
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, val]) => {
                const labels = {
                  newUser:       { label: "New User Registered",  desc: "Alert when a new account is created" },
                  newDeposit:    { label: "New Deposit",          desc: "Alert when a user funds their wallet" },
                  newOrder:      { label: "New Order Placed",     desc: "Alert on every number purchase" },
                  failedPayment: { label: "Failed Payment",       desc: "Alert on payment gateway failures" },
                  lowBalance:    { label: "Low System Balance",   desc: "Alert when system reserve is low" },
                };
                const { label, desc } = labels[key];
                return (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-border/50 hover:bg-white/[0.04] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <Toggle enabled={val} onChange={(v) => { setNotifications((n) => ({ ...n, [key]: v })); showToast(`"${label}" notification ${v ? "on" : "off"}.`); }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Change Password ──────────────────────────────── */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <SectionHeader icon={Lock} title="Change Password" description="Update your admin account password." />
            {pwError && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {pwError}
              </div>
            )}
            <form onSubmit={handlePasswordSave} className="space-y-4">
              {[
                { key: "current", label: "Current Password" },
                { key: "next",    label: "New Password" },
                { key: "confirm", label: "Confirm New Password" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</label>
                  <div className="relative">
                    <input
                      type={showPw[key] ? "text" : "password"}
                      value={password[key]}
                      onChange={(e) => setPassword((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full h-10 px-3.5 pr-11 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {pwLoading ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
