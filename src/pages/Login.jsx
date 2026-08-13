import React, { useState, useEffect } from 'react';
import { Mail, Lock, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { interviewApi } from '../services/interviewApi';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-login trigger: if there is already a token in localStorage, bypass
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await interviewApi.login(email, password);
      setIsSubmitting(false);
      if (data && onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setIsSubmitting(false);
      setError('Incorrect email or security credentials. Please try again.');
    }
  };

  const handleAutoLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const data = await interviewApi.login('demo@stella.ai', 'demo1234');
      setIsSubmitting(false);
      if (data && onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to trigger auto login engine.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md space-y-8 bg-slate-850 p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle radial lights background */}
        <div className="absolute right-0 top-0 h-64 w-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 h-64 w-64 bg-slate-950/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Logo in center */}
        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight">
              Stella AI Portal
            </h1>
            <p className="text-xs text-slate-400">
              Enterprise Conversational Screening Dashboard
            </p>
          </div>
        </div>

        {/* Error messaging consistency wrapper */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs animate-shake">
            <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
            <p className="leading-relaxed font-semibold">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Email field */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@stella.ai"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Access Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Authorizing Session...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center text-xs text-slate-500 justify-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="mx-3 uppercase font-bold tracking-widest text-[9px]">or quick access</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Auto Log instant access button */}
        <button
          onClick={handleAutoLogin}
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          disabled={isSubmitting}
        >
          <Sparkles size={14} className="text-blue-400" />
          <span>Instant Demo Auto-Login</span>
        </button>

        <div className="text-center">
          <p className="text-[10px] text-slate-500">
            Secure workspace. JWT tokens generated comply with security parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
