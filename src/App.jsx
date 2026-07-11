import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLoader } from "@/components/PageLoader";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getMaintenanceStatus } from "@/lib/api"; // ← adjust path if needed
import MaintenancePage from "@/pages/maintenancePage";

import LandingPage from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import Dashboard from "@/pages/dashboard";
import MyNumbers from "@/pages/my-numbers";
import WalletPage from "@/pages/wallet";
import WalletVerify from "@/pages/wallet-verify";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Pricing from "@/pages/pricing";
import SetPin from "@/pages/set-pin";
import SupportChat from "@/components/ui/support-chat";
import Transfer from "@/pages/transfer";
import PurchaseNumber from "@/pages/purchase-number";

import AdminLogin from "@/pages/adminLogin";
import AdminDash from "@/pages/adminDashboard";
import Users from "@/pages/users";
import Transactions from "@/pages/allTransactions";
import AdminSettings from "@/pages/adminSettings";
import NumberPurchased from "@/pages/NumbersPurchased";
import UserDetails from "@/pages/userDetails";
import AdminProviders from "@/pages/adminProviders";
import AdminPricing from "@/pages/adminPricing";



const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

function AnimatedRoute({ component: Component }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Component />
    </motion.div>
  );
}

/* ── Guard: redirect to / if not logged in (user-facing app) ── */
function ProtectedRoute({ component: Component }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect to="/" />;
  return <AnimatedRoute component={Component} />;
}

/* ── Guard: redirect to /admin/login if not logged in as admin ── */
function ProtectedAdminRoute({ component: Component }) {
  const [, setLocation] = useLocation();
  const isAdmin = localStorage.getItem("admin_mock_auth") === "true";

  useEffect(() => {
    if (!isAdmin) setLocation("/admin/login");
  }, [isAdmin, setLocation]);

  if (!isAdmin) return null;
  return <AnimatedRoute component={Component} />;
}

/* ── Maintenance gate: blocks user-facing pages, never blocks /admin/* ── */
function MaintenanceGate({ children }) {
  const [location] = useLocation();
  const [status, setStatus] = useState(null); // null = still checking

  useEffect(() => {
    // Skip the check entirely for admin routes — admins must always get through
    if (location.startsWith("/admin")) {
      setStatus({ maintenanceMode: false });
      return;
    }
  
getMaintenanceStatus()
  .then((data) => setStatus(data))
  .catch(() => setStatus({ maintenanceMode: false }));
  }, [location]);

  // Still loading — render nothing briefly (PageLoader is already shown by App)
  if (status === null) return null;

  // Site is under maintenance and this is NOT an admin route
  if (status.maintenanceMode) {
    return <MaintenancePage message={status.maintenanceMessage} />;
  }

  return children;
}

function Router() {
  return (
    <MaintenanceGate>
      <AnimatePresence mode="wait">
        <Switch>

          {/* ── Public routes ── */}
          <Route path="/" component={(props) => <AnimatedRoute component={LandingPage} {...props} />} />
          <Route path="/login" component={(props) => <AnimatedRoute component={Login} {...props} />} />
          <Route path="/register" component={(props) => <AnimatedRoute component={Register} {...props} />} />
          <Route path="/forgot-password" component={(props) => <AnimatedRoute component={ForgotPassword} {...props} />} />
          <Route path="/pricing" component={(props) => <AnimatedRoute component={Pricing} {...props} />} />

          {/* ── Protected routes (login required, user-facing app) ── */}
          {/* /wallet/verify MUST come before /wallet so Wouter doesn't match /wallet first */}
          <Route path="/wallet/verify" component={(props) => <ProtectedRoute component={WalletVerify} {...props} />} />
          <Route path="/wallet" component={(props) => <ProtectedRoute component={WalletPage} {...props} />} />
          <Route path="/dashboard" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
          <Route path="/my-numbers" component={(props) => <ProtectedRoute component={MyNumbers} {...props} />} />
          <Route path="/purchase-number" component={(props) => <ProtectedRoute component={PurchaseNumber} {...props} />} />
          <Route path="/transfer" component={(props) => <ProtectedRoute component={Transfer} {...props} />} />
          <Route path="/set-pin" component={(props) => <ProtectedRoute component={SetPin} {...props} />} />
          <Route path="/settings" component={(props) => <ProtectedRoute component={Settings} {...props} />} />

          {/* ── Admin routes ── */}
          <Route path="/admin/login" component={(props) => <AnimatedRoute component={AdminLogin} {...props} />} />
          <Route path="/admin" component={(props) => <ProtectedAdminRoute component={AdminDash} {...props} />} />
          <Route path="/admin/users" component={(props) => <ProtectedAdminRoute component={Users} {...props} />} />
          <Route path="/admin/transactions" component={(props) => <ProtectedAdminRoute component={Transactions} {...props} />} />
          <Route path="/admin/settings" component={(props) => <ProtectedAdminRoute component={AdminSettings} {...props} />} />
          <Route path="/admin/numbers" component={(props) => <ProtectedAdminRoute component={NumberPurchased} {...props} />} />
          <Route path="/admin/users/:id" component={(props) => <ProtectedAdminRoute component={UserDetails} {...props} />} />
          <Route path="/admin/providers" component={(props) => <ProtectedAdminRoute component={AdminProviders} {...props} />} />
<Route path="/admin/pricing" component={(props) => <ProtectedAdminRoute component={AdminPricing} {...props} />} />


          {/* ── 404 catch-all (always last) ── */}
          <Route component={(props) => <AnimatedRoute component={NotFound} {...props} />} />
        </Switch>
      </AnimatePresence>
    </MaintenanceGate>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
                <ScrollToTop />
                <PageLoader />
              </WouterRouter>
              <SupportChat />
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </NextThemesProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
