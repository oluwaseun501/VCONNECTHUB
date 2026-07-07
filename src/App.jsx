import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLoader } from "@/components/PageLoader";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

import LandingPage    from '@/pages/landing';
import Login          from '@/pages/login';
import Register       from '@/pages/register';
import ForgotPassword from '@/pages/forgot-password';
import Dashboard      from '@/pages/dashboard';
import MyNumbers      from '@/pages/my-numbers';
import WalletPage     from '@/pages/wallet';
import WalletVerify   from '@/pages/wallet-verify';
import Settings       from '@/pages/settings';
import NotFound       from '@/pages/not-found';
import Pricing        from "@/pages/pricing";
import SetPin         from "@/pages/set-pin";
import SupportChat    from "@/components/ui/support-chat";
import Transfer       from "@/pages/transfer";
import PurchaseNumber from "@/pages/purchase-number";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

function AnimatedRoute({ component: Component }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Component />
    </motion.div>
  );
}

/* ── Guard: redirect to / if not logged in ── */
function ProtectedRoute({ component: Component }) {
  const { user, loading } = useAuth();

  // Still checking auth — render nothing (PageLoader handles the spinner globally)
  if (loading) return null;

  // Not logged in → send to home / landing page
  if (!user) return <Redirect to="/" />;

  return <AnimatedRoute component={Component} />;
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        {/* ── Public routes ── */}
        <Route path="/"                component={(props) => <AnimatedRoute component={LandingPage}     {...props} />} />
        <Route path="/login"           component={(props) => <AnimatedRoute component={Login}           {...props} />} />
        <Route path="/register"        component={(props) => <AnimatedRoute component={Register}        {...props} />} />
        <Route path="/forgot-password" component={(props) => <AnimatedRoute component={ForgotPassword}  {...props} />} />
        <Route path="/pricing"         component={(props) => <AnimatedRoute component={Pricing}         {...props} />} />

        {/* ── Protected routes (login required) ── */}
        {/* /wallet/verify MUST come before /wallet so Wouter doesn't match /wallet first */}
        <Route path="/wallet/verify"   component={(props) => <ProtectedRoute component={WalletVerify}   {...props} />} />
        <Route path="/wallet"          component={(props) => <ProtectedRoute component={WalletPage}      {...props} />} />
        <Route path="/dashboard"       component={(props) => <ProtectedRoute component={Dashboard}       {...props} />} />
        <Route path="/my-numbers"      component={(props) => <ProtectedRoute component={MyNumbers}       {...props} />} />
        <Route path="/purchase-number" component={(props) => <ProtectedRoute component={PurchaseNumber}  {...props} />} />
        <Route path="/transfer"        component={(props) => <ProtectedRoute component={Transfer}        {...props} />} />
        <Route path="/set-pin"         component={(props) => <ProtectedRoute component={SetPin}          {...props} />} />
        <Route path="/settings"        component={(props) => <ProtectedRoute component={Settings}        {...props} />} />

        {/* ── 404 catch-all (always last) ── */}
        <Route                         component={(props) => <AnimatedRoute component={NotFound}        {...props} />} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Router />
                <ScrollToTop />
                <PageLoader />
              </WouterRouter>
              <SupportChat />
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
