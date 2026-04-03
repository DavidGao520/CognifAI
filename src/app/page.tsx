"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Upload,
  Shield,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, loading, signUp, signIn } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[#5b6ef5] animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError("Please enter your full name.");
          setSubmitting(false);
          return;
        }
        await signUp(email, password, name.trim());
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred.";
      if (message.includes("email-already-in-use")) {
        setError("This email is already registered. Try signing in.");
      } else if (message.includes("wrong-password") || message.includes("invalid-credential")) {
        setError("Invalid email or password.");
      } else if (message.includes("user-not-found")) {
        setError("No account found with this email.");
      } else if (message.includes("weak-password")) {
        setError("Password should be at least 6 characters.");
      } else if (message.includes("invalid-email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(message);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Gradient Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5b6ef5] to-[#3db9a4] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[200px] h-[200px] rounded-full bg-white/10" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-[10px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Cognif.ai</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome to your
            <br />
            intelligent workspace
          </h1>
          <p className="text-white/80 text-lg mb-12 max-w-md">
            Transform your engineering notes with AI-powered organization,
            verification, and study tools.
          </p>

          {/* Feature Bullets */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Seamless Import</h3>
                <p className="text-white/70 text-sm">
                  Import from Notion, OneNote, or start fresh with our
                  intelligent editor.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  AI-Powered Organization
                </h3>
                <p className="text-white/70 text-sm">
                  Let AI restructure, elaborate, and verify your notes
                  automatically.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Privacy First</h3>
                <p className="text-white/70 text-sm">
                  Your notes stay private. End-to-end encryption keeps your data
                  safe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/50 text-sm">
          &copy; 2026 Cognif.ai &bull; Privacy Policy &bull; Terms of Service
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-[#5b6ef5] rounded-[10px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#101828]">
              Cognif.ai
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#101828] mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-[#6a7282] mb-8">
            {isLogin
              ? "Sign in to continue to your workspace"
              : "Start organizing your engineering notes with AI"}
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name - only on signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#364153] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#99a1af]" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#364153] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#99a1af]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#364153] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#99a1af]" />
                <input
                  type="password"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
                />
              </div>
            </div>

            {/* Import divider - only on signup */}
            {!isLogin && (
              <>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e5e7eb]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-sm text-[#99a1af]">
                      Import existing notes (optional)
                    </span>
                  </div>
                </div>

                {/* Import Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm font-medium text-[#364153] hover:bg-[#f7f8fa] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h7v7H4V4z" fill="#111" />
                      <path d="M13 4h7v7h-7V4z" fill="#111" />
                      <path d="M4 13h7v7H4v-7z" fill="#111" />
                      <path d="M13 13h7v7h-7v-7z" fill="#111" opacity="0.5" />
                    </svg>
                    Sync Notion
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm font-medium text-[#364153] hover:bg-[#f7f8fa] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                        fill="#7B1FA2"
                      />
                      <path d="M8 8h8v8H8V8z" fill="white" />
                    </svg>
                    Sync OneNote
                  </button>
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-[#5b6ef5] text-white py-3 rounded-[10px] font-semibold text-sm shadow hover:bg-[#4a5cd4] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account & Continue"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          {!isLogin && (
            <p className="text-center text-sm text-[#99a1af] mt-6">
              By creating an account, you agree to our{" "}
              <span className="text-[#5b6ef5] cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-[#5b6ef5] cursor-pointer">
                Privacy Policy
              </span>
            </p>
          )}
          <p className="text-center text-sm text-[#6a7282] mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[#5b6ef5] font-medium cursor-pointer"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
