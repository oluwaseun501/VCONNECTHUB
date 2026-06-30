import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLoader } from "@/components/PageLoader";


  

import LandingPage from '@/pages/landing';
import Login from '@/pages/login';
import Register from '@/pages/register';
import ForgotPassword from '@/pages/forgot-password';
import Dashboard from '@/pages/dashboard';
import MyNumbers from '@/pages/my-numbers';
import WalletPage from '@/pages/wallet';
import Settings from '@/pages/settings';
import NotFound from '@/pages/not-found';
import Pricing from "@/pages/pricing";
import SetPin from "@/pages/set-pin";
import SupportChat from "@/components/ui/support-chat";
import Transfer from "@/pages/transfer";
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

function Router() {
  return (
    <AnimatePresence mode="wait">
  <Switch>

  <Route path="/"                component={(props) => <AnimatedRoute component={LandingPage}    {...props} />} />
  <Route path="/login"           component={(props) => <AnimatedRoute component={Login}          {...props} />} />
  <Route path="/register"        component={(props) => <AnimatedRoute component={Register}       {...props} />} />
  <Route path="/forgot-password" component={(props) => <AnimatedRoute component={ForgotPassword} {...props} />} />
  <Route path="/pricing"         component={(props) => <AnimatedRoute component={Pricing}        {...props} />} />
  <Route path="/set-pin" component={(props) => <AnimatedRoute component={SetPin} {...props} />} />
<Route path="/transfer" component={(props) => <AnimatedRoute component={Transfer} {...props} />} />
  <Route path="/dashboard"       component={(props) => <AnimatedRoute component={Dashboard}      {...props} />} />
  <Route path="/my-numbers"      component={(props) => <AnimatedRoute component={MyNumbers}      {...props} />} />
  <Route path="/wallet"          component={(props) => <AnimatedRoute component={WalletPage}     {...props} />} />
  <Route path="/settings"        component={(props) => <AnimatedRoute component={Settings}       {...props} />} />
   <Route path="/purchase-number" component={(props) => <AnimatedRoute component={PurchaseNumber} {...props} />} />
  <Route                         component={(props) => <AnimatedRoute component={NotFound}       {...props} />} />

</Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
            <ScrollToTop />
            <PageLoader />
          </WouterRouter>
            <SupportChat />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;