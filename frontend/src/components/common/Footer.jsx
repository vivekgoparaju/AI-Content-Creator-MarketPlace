import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function Footer({ setActivePage }) {
  return (
    <footer className="bg-white border-t border-gray-200/80 mt-20 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#6D5EF7] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-gray-900">
                Creator<span className="text-[#6D5EF7]">AI</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              The AI content creator marketplace connecting modern brands and agencies with verified AI filmmakers, animators, and generative artists.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold text-[11px]">Evidence-Backed Tool & Workflow Provenance Verification</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
              Marketplace
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActivePage('discover')}
                  className="hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Discover AI Creators
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('ai-studio')}
                  className="hover:text-gray-900 transition-colors cursor-pointer"
                >
                  AI Brief Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('discover')}
                  className="hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Runway Gen-3 Specialists
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('discover')}
                  className="hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Flux & Midjourney Artists
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Standards */}
          <div>
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
              Standards
            </h4>
            <ul className="space-y-2">
              <li>Commercial Licensing Integrity</li>
              <li>Workflow Authenticity Audits</li>
              <li>AI Ethical Production Guidelines</li>
              <li>Privacy & Creative Asset IP</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400">
          <p>© 2026 CreatorAI Studio. All rights reserved. Built for the AI Content Creator Hackathon.</p>
          <p className="flex items-center gap-1.5 font-medium">
            <span>Powered by React, Vite, Tailwind CSS, FastAPI & MySQL</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
