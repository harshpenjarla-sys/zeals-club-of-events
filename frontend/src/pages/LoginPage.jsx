import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, Shield, User, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setForgotMsg('');
    setLoading(true);

    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.data?.error || err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setForgotMsg('');
    setLoading(true);

    try {
      await login(demoEmail, demoPassword);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.data?.error || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-0.5 shadow-glow-purple items-center justify-center">
            <div className="w-full h-full bg-[#07090e] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Sign In to Zeal's
          </h1>
          <p className="text-xs text-slate-400">
            College Event Management & Student Engagement Platform
          </p>
        </div>

        {/* 1-Click Demo Login Box (Requested in Section 38) */}
        <div className="p-4 rounded-2xl glass-panel border border-purple-500/40 bg-purple-950/20 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
            DEMO ACCESS ACCOUNTS (1-CLICK TEST LOGIN):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student@zcoer.in', 'Zeal@123')}
              className="px-2 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 text-[11px] font-bold transition-all text-center"
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('organizer@zcoer.in', 'Zeal@123')}
              className="px-2 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-[11px] font-bold transition-all text-center"
            >
              Organizer Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@zcoer.in', 'Zeal@123')}
              className="px-2 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-[11px] font-bold transition-all text-center"
            >
              Principal Admin
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl bg-slate-950/80 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {forgotMsg && (
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
              {forgotMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@zcoer.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMsg('Demo accounts password is: Zeal@123')}
                  className="text-[11px] text-purple-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-glow-purple flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-purple-400 font-semibold hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
