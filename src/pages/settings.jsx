import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { User, Shield, Bell, Trash2, Loader2, UserPlus, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";

const TABS = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "security", icon: Shield, label: "Security & PIN" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "danger", icon: Trash2, label: "Danger Zone", danger: true },
];

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [notifsErr, setNotifsErr] = useState("");

  const initials = (user?.name || user?.email || "??")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    if (activeTab !== "notifications") return;
    const loadTransactions = async () => {
      setLoadingNotifs(true);
      setNotifsErr("");
      try {
        const { data } = await api.get("/api/users/transactions?page=1&limit=20");
        setTransactions(data.transactions || []);
      } catch (err) {
        setNotifsErr(err?.response?.data?.message || "Failed to load activity.");
      } finally {
        setLoadingNotifs(false);
      }
    };
    loadTransactions();
  }, [activeTab]);

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg("");
    setProfileErr("");
    try {
      await api.put("/api/users/profile", { name, email });
      await refreshUser();
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileErr(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async () => {
    setPasswordMsg("");
    setPasswordErr("");
    if (!currentPassword || !newPassword) {
      setPasswordErr("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr("New passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      await api.put("/api/users/password", { currentPassword, newPassword });
      setPasswordMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordErr(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    setDeleteErr("");
    try {
      await api.delete("/api/users/me");
      localStorage.removeItem("vn_token");
      navigate("/login");
    } catch (err) {
      setDeleteErr(err?.response?.data?.message || "Failed to delete account.");
      setDeleting(false);
    }
  };

  const accountCreatedEvent = user?.createdAt
    ? {
        id: "account-created",
        icon: UserPlus,
        color: "text-violet-500 bg-violet-500/10",
        title: "Account created",
        subtitle: `Welcome to VConnectHub, ${user?.name || user?.email}!`,
        date: user.createdAt,
      }
    : null;

  const transactionEvents = transactions.map((tx) => ({
    id: tx._id || tx.reference,
    icon: tx.type === "credit" ? ArrowDownCircle : ArrowUpCircle,
    color:
      tx.type === "credit"
        ? "text-emerald-500 bg-emerald-500/10"
        : "text-red-500 bg-red-500/10",
    title: tx.description || (tx.type === "credit" ? "Wallet funded" : "Wallet debited"),
    subtitle: `₦${Number(tx.amount).toFixed(2)} • ${tx.status}`,
    date: tx.createdAt,
  }));

  const feed = [accountCreatedEvent, ...transactionEvents]
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-1">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? tab.danger
                    ? "bg-destructive/10 text-destructive font-medium"
                    : "bg-primary/10 text-primary font-medium"
                  : tab.danger
                  ? "hover:bg-destructive/10 text-destructive/80 hover:text-destructive"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </div>
          ))}
        </div>

        <div className="lg:col-span-9 space-y-8">
          {/* Profile */}
          {activeTab === "profile" && (
            <Card className="glass-card">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Profile Information
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-8 items-start mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold text-white shadow-xl flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Name</Label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Email Address</Label>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                    <Button onClick={saveProfile} disabled={savingProfile}>
                      {savingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                    {profileMsg && <p className="text-sm text-emerald-500">{profileMsg}</p>}
                    {profileErr && <p className="text-sm text-red-500">{profileErr}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security & PIN */}
          {activeTab === "security" && (
            <Card className="glass-card">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Security & PIN
                </h3>
              </div>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Change Password
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Current Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">New Password</Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Confirm New Password</Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={updatePassword} disabled={savingPassword}>
                    {savingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Update Password
                  </Button>
                  {passwordMsg && <p className="text-sm text-emerald-500">{passwordMsg}</p>}
                  {passwordErr && <p className="text-sm text-red-500">{passwordErr}</p>}
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-1">
                        Transaction PIN
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Change your 4-digit PIN used for confirming purchases.
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/set-pin")}>
                      Change PIN
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <Card className="glass-card">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" /> Notifications
                </h3>
              </div>
              <CardContent className="p-6">
                {loadingNotifs && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-8">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading activity…
                  </div>
                )}
                {notifsErr && <p className="text-sm text-red-500">{notifsErr}</p>}
                {!loadingNotifs && !notifsErr && feed.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No activity yet.</p>
                )}
                {!loadingNotifs && feed.length > 0 && (
                  <div className="space-y-3">
                    {feed.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {item.date ? new Date(item.date).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <Card className="glass-card">
              <div className="p-6 border-b border-border text-destructive">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Trash2 className="w-5 h-5" /> Danger Zone
                </h3>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. All your active numbers,
                  wallet balance, and transaction history will be permanently deleted.
                </p>
                {!confirmingDelete ? (
                  <Button variant="destructive" onClick={() => setConfirmingDelete(true)}>
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-destructive">
                      Are you sure? This cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="destructive" onClick={deleteAccount} disabled={deleting}>
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Yes, delete my account
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setConfirmingDelete(false)}
                        disabled={deleting}
                      >
                        Cancel
                      </Button>
                    </div>
                    {deleteErr && <p className="text-sm text-red-500">{deleteErr}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}