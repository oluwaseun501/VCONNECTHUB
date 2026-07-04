import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SiGoogle } from "react-icons/si";
import { User, Mail, Lock, Eye, EyeOff, Check, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import AnimatedOrbs from "@/components/ui/animated-orbs";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [, setLocation] = useLocation();
  const { register: registerUser, googleLogin } = useAuth();

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
    try {
      await googleLogin(credential);
      setTimeout(() => setLocation("/dashboard"), 500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Google sign-in failed. Please try again.";
      setServerError(msg);
    }
  };

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await registerUser(data.name, data.email, data.password);
      setLocation("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registration failed. Please try again.";
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
              className="w-full h-11 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all flex items-center justify-center gap-3"
            >
              <SiGoogle className="w-4 h-4" />
              Continue with Google
            </button>
            <div className="absolute inset-0 opacity-0 overflow-hidden rounded-xl cursor-pointer">
              <GoogleLogin
                onSuccess={(r) => handleGoogleSuccess(r.credential)}
                onError={() => setServerError("Google sign-in failed. Please try again.")}
                width="500"
              />
            </div>
          </div>

          {/* Link */}
          <p className="text-center text-sm text-gray-500 dark:text-white/40">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-violet-600 dark:text-violet-400 hover:underline font-medium cursor-pointer transition-colors">Sign in</span>
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
