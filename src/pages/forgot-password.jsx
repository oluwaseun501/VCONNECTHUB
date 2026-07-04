import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import AnimatedOrbs from "@/components/ui/animated-orbs";
import api from "@/lib/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSubmitting(true);
    try {
      await api.post("/api/users/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
              <p className="text-gray-500 dark:text-white/50 text-sm mt-1">
                We'll send you a link to reset your password.
              </p>
            </div>
          </div>

          {!submitted ? (
            <>
              {serverError && (
                <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {serverError}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-white/70">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 group-focus-within:text-violet-500 transition-colors" />
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm transition-all duration-200 outline-none focus:border-violet-500 dark:focus:border-violet-500/70 focus:bg-violet-50 dark:focus:bg-violet-500/8 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-gray-300 dark:hover:border-white/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:opacity-90 hover:shadow-violet-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                <div className="text-center">
                  <Link href="/login">
                    <span className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back to login
                    </span>
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-gray-500 dark:text-white/50 text-sm">
                If an account exists for that email, we've sent password reset instructions.
              </p>
              <Link href="/login">
                <button className="w-full h-11 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
                  Return to login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}