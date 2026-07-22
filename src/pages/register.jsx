import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SiGoogle } from "react-icons/si";
import { User, Mail, Lock, Eye, EyeOff, Check, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import AnimatedOrbs from "@/components/ui/animated-orbs";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string(),
    agreed: z.boolean().refine((v) => v === true, "You must agree to the terms"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function Register() {
  <SEOHead noIndex={true} />
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [, setLocation] = useLocation();
  const { register: registerUser, googleLogin } = useAuth();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirm: "", agreed: false },
  });

  const agreed = watch("agreed");

  const handleGoogleSuccess = async (credential) => {
  setServerError("");
  setIsGoogleLoading(true);
  try {
    const result = await googleLogin(credential);

    toast({
      description: (
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-semibold">
            {result?.isNewUser ? "Welcome to VConnectHub!" : "Welcome back!"}
          </span>
        </div>
      ),
      duration: 3000,
    });

    if (result?.isNewUser) {
      setRegistered(true); 
    } else {
      setLocation("/dashboard"); 
    }
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
      await registerUser(data.name, data.email, data.password);
      toast({
        description: (
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-semibold">Welcome to VConnectHub!</span>
          </div>
        ),
        duration: 3000,
      });
      setRegistered(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registration failed. Please try again.";
      setServerError(msg);
    }
  };

  useEffect(() => {
    if (!registered) return;
    if (countdown <= 0) {
      setLocation("/dashboard");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [registered, countdown, setLocation]);

  if (registered) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-violet-50 dark:bg-[#080b14] transition-colors duration-300">
        <AnimatedOrbs />
        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-8 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Account Created Successfully!
              </h2>
              <p className="text-gray-500 dark:text-white/50 text-sm mt-1">
                Welcome to VConnectHub. Taking you to your dashboard…
              </p>
            </div>
            <button
              onClick={() => setLocation("/dashboard")}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:opacity-90 transition-all"
            >
              Go to Dashboard
            </button>
            <p className="text-xs text-gray-400 dark:text-white/30">
              Redirecting automatically in {countdown}s…
            </p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-8 space-y-5">

          {/* Logo + title */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <img src="/logo.png" alt="VConnectHub" className="h-14 w-auto" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Join{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">
                  VConnectHub
                </span>
              </h1>
              <p className="text-gray-500 dark:text-white/50 text-sm mt-1">
                Start verifying your accounts in seconds
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

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-white/70">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 group-focus-within:text-violet-500 transition-colors" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm transition-all duration-200 outline-none focus:border-violet-500 dark:focus:border-violet-500/70 focus:bg-violet-50 dark:focus:bg-violet-500/8 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-gray-300 dark:hover:border-white/20"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 dark:text-red-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-white/70">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 group-focus-within:text-violet-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm transition-all duration-200 outline-none focus:border-violet-500 dark:focus:border-violet-500/70 focus:bg-violet-50 dark:focus:bg-violet-500/8 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-gray-300 dark:hover:border-white/20"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-white/70">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 group-focus-within:text-violet-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full h-11 pl-10 pr-9 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm transition-all duration-200 outline-none focus:border-violet-500 dark:focus:border-violet-500/70 focus:bg-violet-50 dark:focus:bg-violet-500/8 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-gray-300 dark:hover:border-white/20"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirm" className="text-sm font-medium text-gray-700 dark:text-white/70">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 group-focus-within:text-violet-500 transition-colors" />
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirm")}
                    className="w-full h-11 pl-10 pr-9 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm transition-all duration-200 outline-none focus:border-violet-500 dark:focus:border-violet-500/70 focus:bg-violet-50 dark:focus:bg-violet-500/8 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-gray-300 dark:hover:border-white/20"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
                    {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-xs text-red-500 dark:text-red-400">{errors.confirm.message}</p>}
              </div>
            </div>

            {/* Terms + Secure */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer" onClick={() => setValue("agreed", !agreed, { shouldValidate: true })}>
                  <button
                    type="button"
                    className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                      agreed
                        ? "bg-violet-600 border-violet-600"
                        : "bg-gray-50 dark:bg-white/5 border-gray-300 dark:border-white/20 hover:border-violet-400 dark:hover:border-white/40"
                    }`}
                  >
                    {agreed && <Check className="w-2.5 h-2.5 text-white" />}
                  </button>
                  <span className="text-sm text-gray-500 dark:text-white/50">
                    I agree to{" "}
                    <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline" onClick={(e) => e.stopPropagation()}>Terms</a>
                    {" & "}
                    <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline" onClick={(e) => e.stopPropagation()}>Privacy</a>
                  </span>
                </label>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure
                </div>
              </div>
              {errors.agreed && <p className="text-xs text-red-500 dark:text-red-400">{errors.agreed.message}</p>}
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
                  Creating account…
                </>
              ) : (
                "Create Account"
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
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-violet-600 dark:text-violet-400 hover:underline font-medium cursor-pointer transition-colors">
                Sign in
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}