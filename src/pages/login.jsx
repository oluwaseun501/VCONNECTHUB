import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SiGoogle } from "react-icons/si";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import AnimatedOrbs from "@/components/ui/animated-orbs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import SEOHead from "@/components/SEOHead";


const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  <SEOHead noIndex={true} />
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [serverError, setServerError] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, googleLogin } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

 const handleGoogleSuccess = async (credential) => {
  setServerError("");
  setIsGoogleLoading(true);
  try {
    await googleLogin(credential);
    toast({
      description: (
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-semibold">Logged in with Google!</span>
        </div>
      ),
      duration: 3000,
    });
    setTimeout(() => setLocation("/dashboard"), 500);
  } catch (err) {
    const msg = err?.response?.data?.message || "Google sign-in failed. Please try again.";
    setServerError(msg);
  } finally {
    setIsGoogleLoading(false);
  }
};

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login(data.email, data.password);
      toast({
        description: (
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-semibold">Logged in successfully!</span>
          </div>
        ),
        duration: 3000,
      });
      setTimeout(() => setLocation("/dashboard"), 500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid email or password.";
      setServerError(msg);
    }
  };

  return (
    
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-violet-50 dark:bg-[#080b14] transition-colors duration-300">
      <AnimatedOrbs />

      {/* Back to Home */}
      <div className="relative z-10 p-5">
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white/90 transition-colors border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 rounded-lg px-3 py-1.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </Link>
      </div>

      {/* Centered card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-8 space-y-5">

          {/* Logo + title */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <img src="/logo.png" alt="VConnectHub" className="h-14 w-auto" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">
                  VConnectHub
                </span>
              </h1>
              <p className="text-gray-500 dark:text-white/50 text-sm mt-1">
                Sign in to your account and continue securely
              </p>
            </div>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-white/70">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 group-focus-within:text-violet-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register("email")}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm transition-all duration-200 outline-none focus:border-violet-500 dark:focus:border-violet-500/70 focus:bg-violet-50 dark:focus:bg-violet-500/8 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-gray-300 dark:hover:border-white/20"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-white/70">
                  Password
                </label>
                <Link href="/forgot-password">
                  <span className="text-xs text-violet-600 dark:text-violet-400 hover:underline cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 group-focus-within:text-violet-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm transition-all duration-200 outline-none focus:border-violet-500 dark:focus:border-violet-500/70 focus:bg-violet-50 dark:focus:bg-violet-500/8 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-gray-300 dark:hover:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>}
            </div>

            {/* Remember + Secure */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-white/20 accent-violet-600"
                />
                <span className="text-sm text-gray-500 dark:text-white/50">Remember me</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure connection
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:opacity-90 hover:shadow-violet-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In to Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-white/80 dark:bg-transparent text-gray-400 dark:text-white/30">or</span>
            </div>
          </div>

          {/* Google — overlay GoogleLogin (ID token) over our styled button */}
<div className="relative w-full h-11">
  <button
    type="button"
    disabled={isGoogleLoading}
    className="w-full h-11 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {isGoogleLoading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        Signing in…
      </>
    ) : (
      <>
        <SiGoogle className="w-4 h-4" />
        Continue with Google
      </>
    )}
  </button>
  {!isGoogleLoading && (
    <div className="absolute inset-0 opacity-0 overflow-hidden rounded-xl cursor-pointer">
      <GoogleLogin
        onSuccess={(r) => handleGoogleSuccess(r.credential)}
        onError={() => setServerError("Google sign-in failed. Please try again.")}
        width="500"
      />
    </div>
  )}
</div>

          {/* Link */}
          <p className="text-center text-sm text-gray-500 dark:text-white/40">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-violet-600 dark:text-violet-400 hover:underline font-medium cursor-pointer transition-colors">
                Create account
              </span>
            </Link>
          </p>

          {/* Need help */}
          <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-white/3">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white/80">Need help?</p>
              <p className="text-xs text-gray-500 dark:text-white/40">Our support team is here 24/7</p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new Event("open-support-chat"))}
              className="w-full h-9 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
