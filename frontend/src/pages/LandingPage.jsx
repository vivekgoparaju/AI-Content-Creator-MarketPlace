import React, { useState } from 'react';
import { ArrowRight, Sparkles, Wand2, Compass, ShieldCheck, Film, Play, Layers, Star, CheckCircle2 } from 'lucide-react';
import { CreatorCard } from '../components/common/CreatorCard';

export function LandingPage({ onExplore, onOpenStudio, onSelectCreator, featuredCreators = [] }) {
  const [quickPrompt, setQuickPrompt] = useState(
    'Create a premium 20-second cinematic product video for a new luxury electric hypercar launch with futuristic lighting for YouTube widescreen.'
  );

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEAFE] text-[#5848E5] text-xs font-bold border border-[#6D5EF7]/20 shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#6D5EF7]" />
                <span>The AI Content Creator Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.08]">
                Find the creators behind your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5EF7] via-[#8C7EFF] to-indigo-600">
                  next big idea.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                Discover AI filmmakers, generative visual artists, and motion designers. Turn your rough campaign idea into a structured, production-ready brief with AI assistance.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onExplore}
                  className="px-6 py-3.5 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white font-bold text-sm transition-all shadow-lg shadow-[#6D5EF7]/25 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Creators</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenStudio}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 text-[#6D5EF7]" />
                  <span>Build a Creative Brief with AI</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-gray-200/80 flex flex-wrap items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Verified Workflows</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#6D5EF7]" />
                  <span className="font-semibold text-gray-700">Runway, Flux & ComfyUI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Commercial Licensing Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow Backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#6D5EF7]/20 to-purple-500/20 rounded-3xl blur-2xl opacity-70 -z-10" />

                {/* Main Showcase Card */}
                <div className="bg-white rounded-3xl p-3 shadow-2xl border border-gray-200/80 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-gray-950">
                    <img
                      src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80"
                      alt="Featured AI Artwork"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Generation Pipeline</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                        Cinematic AI Commercial
                      </span>
                      <h3 className="font-bold text-lg leading-tight mt-0.5">
                        Aura Horizon: Electric Hypercar
                      </h3>
                      <p className="text-xs text-gray-300 mt-1 flex items-center gap-2">
                        <span>Tools: Runway Gen-3 Alpha · Midjourney v6</span>
                      </p>
                    </div>
                  </div>

                  {/* Creator Bar Below Preview */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                        alt="Elena Rostova"
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                      <div className="text-left">
                        <span className="block font-bold text-xs text-gray-900">Elena Rostova</span>
                        <span className="block text-[11px] text-gray-500">AI Director & Filmmaker</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectCreator(1)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#EEEAFE] hover:bg-[#6D5EF7] text-[#5848E5] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-gray-200/90 shadow-xl hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-xs text-gray-900">Provenance Audited</span>
                    <span className="block text-[10px] text-gray-500">Raw seed & prompt logs verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div className="text-left">
            <span className="text-xs font-bold text-[#6D5EF7] uppercase tracking-wider">
              Talent Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
              Top AI Creators & Portfolios
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Filter by specific generative tools, production workflows, and output formats.
            </p>
          </div>
          <button
            onClick={onExplore}
            className="mt-4 sm:mt-0 font-bold text-xs text-[#6D5EF7] hover:text-[#5848E5] flex items-center gap-1 cursor-pointer"
          >
            <span>Browse all creators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCreators.slice(0, 3).map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onSelect={onSelectCreator}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-gray-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-[#6D5EF7] uppercase tracking-wider">
            Streamlined Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 mb-12">
            From Raw Idea to Commercial Delivery in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-[#F8F9FC] border border-gray-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEEAFE] text-[#5848E5] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-gray-900">
                1. Describe Your Vision
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enter your rough creative idea in plain language. Our AI Brief Builder structures it into clear deliverables, visual styles, and aspect ratios.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F9FC] border border-gray-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEEAFE] text-[#5848E5] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-gray-900">
                2. Discover Verified Creators
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Filter by specialized tools like Runway Gen-3, Kling, Flux, or ComfyUI. Evaluate provenance evidence, verified workflows, and rich portfolios.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F9FC] border border-gray-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEEAFE] text-[#5848E5] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-gray-900">
                3. Commission & Deliver
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Share your confirmed brief with commercial licensing terms clearly agreed. Receive master ProRes or 4K assets ready for distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Brief Studio Interactive Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-gray-950 via-gray-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive AI Studio</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Turn your creative prompt into an actionable campaign brief.
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              No more tedious 10-page creative forms. Test the prompt-to-brief converter below and review generated visual styles, deliverables, and missing requirement alerts.
            </p>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3">
              <label className="block text-xs font-medium text-gray-300">
                Sample Campaign Idea:
              </label>
              <textarea
                rows={3}
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={onOpenStudio}
                  className="px-5 py-2.5 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch in Brief Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
