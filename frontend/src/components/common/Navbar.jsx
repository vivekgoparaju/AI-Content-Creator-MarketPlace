import React from 'react';
import { Sparkles, Compass, Wand2, FileText, LayoutDashboard, LogIn, LogOut, ShieldCheck, User, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ activePage, setActivePage, onOpenAuth }) {
  const { user, isAuthenticated, isCreator, isBrand, logout, quickDemoLogin } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D5EF7] to-[#8C7EFF] flex items-center justify-center text-white shadow-md shadow-[#6D5EF7]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-gray-950 font-sans">
              Creator<span className="text-[#6D5EF7]">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#EEEAFE] text-[#5848E5]">
              Marketplace
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActivePage('discover')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activePage === 'discover'
                ? 'bg-[#EEEAFE] text-[#5848E5]'
                : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover Creators</span>
          </button>

          <button
            onClick={() => setActivePage('ai-studio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activePage === 'ai-studio'
                ? 'bg-gradient-to-r from-[#6D5EF7] to-[#8C7EFF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>AI Brief Studio</span>
          </button>

          {isAuthenticated && isBrand && (
            <button
              onClick={() => setActivePage('briefs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activePage === 'briefs'
                  ? 'bg-[#EEEAFE] text-[#5848E5]'
                  : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Campaign Briefs</span>
            </button>
          )}

          {isAuthenticated && isCreator && (
            <button
              onClick={() => setActivePage('creator-studio')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activePage === 'creator-studio'
                  ? 'bg-[#EEEAFE] text-[#5848E5]'
                  : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/70'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Creator Studio</span>
            </button>
          )}
        </nav>

        {/* Right side: Auth & Demo Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl text-[11px] font-medium border border-gray-200/70">
            <span className="px-1.5 text-gray-400 font-semibold text-[10px]">DEMO:</span>
            <button
              onClick={() => quickDemoLogin('BRAND')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                isBrand
                  ? 'bg-white shadow-2xs font-bold text-[#5848E5]'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              Brand View
            </button>
            <button
              onClick={() => quickDemoLogin('CREATOR')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                isCreator
                  ? 'bg-white shadow-2xs font-bold text-[#5848E5]'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              Creator View
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-gray-50 border border-gray-200/80 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-[#EEEAFE] text-[#6D5EF7] flex items-center justify-center font-bold text-xs">
                  {user.role === 'CREATOR' ? <User className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-xs font-bold text-gray-900 leading-tight">
                    {user.email.split('@')[0]}
                  </span>
                  <span className="block text-[10px] font-semibold text-[#5848E5] uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-gray-100 py-2 px-2 bg-gray-50/90 text-xs font-semibold">
        <button
          onClick={() => setActivePage('discover')}
          className={`px-2.5 py-1.5 rounded-lg ${activePage === 'discover' ? 'text-[#6D5EF7] font-bold' : 'text-gray-600'}`}
        >
          Discover
        </button>
        <button
          onClick={() => setActivePage('ai-studio')}
          className={`px-2.5 py-1.5 rounded-lg ${activePage === 'ai-studio' ? 'text-[#6D5EF7] font-bold' : 'text-gray-600'}`}
        >
          AI Studio
        </button>
        {isBrand && (
          <button
            onClick={() => setActivePage('briefs')}
            className={`px-2.5 py-1.5 rounded-lg ${activePage === 'briefs' ? 'text-[#6D5EF7] font-bold' : 'text-gray-600'}`}
          >
            Briefs
          </button>
        )}
        {isCreator && (
          <button
            onClick={() => setActivePage('creator-studio')}
            className={`px-2.5 py-1.5 rounded-lg ${activePage === 'creator-studio' ? 'text-[#6D5EF7] font-bold' : 'text-gray-600'}`}
          >
            Studio
          </button>
        )}
      </div>
    </header>
  );
}
