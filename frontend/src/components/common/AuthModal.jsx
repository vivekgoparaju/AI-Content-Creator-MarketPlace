import React, { useState } from 'react';
import { X, Sparkles, Building2, User, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AuthModal({ isOpen, onClose }) {
  const { login, register, quickDemoLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CREATOR');
  const [displayName, setDisplayName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          role,
          display_name: displayName,
          specialization,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin(demoRole);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEEAFE] text-[#6D5EF7] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Content Creator Marketplace</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Sign In to CreatorAI' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isLogin
              ? 'Access creator portfolios, AI brief tools, and active campaigns'
              : 'Join as a Creator or Brand to start commissioning AI media'}
          </p>
        </div>

        {/* Quick Demo Buttons for Hackathon Judges */}
        <div className="mb-6 p-3 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 rounded-2xl border border-indigo-100/80">
          <p className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider mb-2 text-center">
            ⚡ Quick Demo Sign-in (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('BRAND')}
              className="px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-900 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#6D5EF7]" />
              <span>Brand Account</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('CREATOR')}
              className="px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-900 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#6D5EF7]" />
              <span>Creator Account</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <>
              {/* Role Picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('CREATOR')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'CREATOR'
                        ? 'border-[#6D5EF7] bg-[#EEEAFE] text-[#5848E5]'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>AI Creator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('BRAND')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'BRAND'
                        ? 'border-[#6D5EF7] bg-[#EEEAFE] text-[#5848E5]'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Brand / Agency</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name / Organization
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={role === 'CREATOR' ? 'e.g. Kai Sterling' : 'e.g. Apex Creative Agency'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7] focus:ring-2 focus:ring-[#EEEAFE]"
                />
              </div>

              {role === 'CREATOR' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. AI Filmmaking & Runway Gen-3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7] focus:ring-2 focus:ring-[#EEEAFE]"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7] focus:ring-2 focus:ring-[#EEEAFE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7] focus:ring-2 focus:ring-[#EEEAFE]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white text-xs font-bold transition-all shadow-md shadow-[#6D5EF7]/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switcher */}
        <div className="mt-5 text-center text-xs text-gray-500">
          {isLogin ? "Don't have an account yet?" : 'Already registered?'}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="ml-1.5 font-bold text-[#6D5EF7] hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
