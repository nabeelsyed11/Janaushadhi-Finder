import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Pill, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { signUpWithEmail, signInWithEmail } from "../lib/firebase";

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use": return "This email is already registered. Try logging in.";
      case "auth/invalid-email": return "Please enter a valid email address.";
      case "auth/weak-password": return "Password must be at least 6 characters.";
      case "auth/user-not-found": return "No account found with this email.";
      case "auth/wrong-password": return "Incorrect password. Please try again.";
      case "auth/invalid-credential": return "Invalid email or password.";
      case "auth/too-many-requests": return "Too many attempts. Please try again later.";
      default: return "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;
      if (isSignUp) {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        user = await signUpWithEmail(email, password, name);
      } else {
        user = await signInWithEmail(email, password);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(getErrorMessage(err.code || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 overflow-auto">
      {/* Top Branding Section */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center pt-16 pb-8 px-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-white/15 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-black/20 border border-white/20"
        >
          <Pill size={40} className="text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-display font-bold text-white text-center"
        >
          Jan<span className="text-emerald-300">-Aushadhi</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-teal-200 text-sm mt-2 text-center"
        >
          Affordable healthcare at your fingertips
        </motion.p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-6 shadow-2xl"
      >
        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
          <button
            onClick={() => { setIsSignUp(false); setError(""); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              !isSignUp ? "bg-white text-teal-700 shadow-md" : "text-slate-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(""); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              isSignUp ? "bg-white text-teal-700 shadow-md" : "text-slate-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl"
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span className="text-xs font-medium leading-relaxed">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name Field (Sign Up only) */}
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Field */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Create a password (min 6 chars)" : "Enter your password"}
                required
                minLength={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-14 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-teal-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-2xl text-sm shadow-lg shadow-teal-200/50 flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-teal-200/70"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                {isSignUp ? "Create Account" : "Login to Account"}
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="text-teal-600 font-bold ml-1 hover:underline"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-300 leading-relaxed">
            By continuing, you agree to our Terms of Service<br />and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
