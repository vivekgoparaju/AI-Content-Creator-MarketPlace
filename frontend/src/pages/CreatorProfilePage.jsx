import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Sparkles, Layers, Briefcase, Calendar, CheckCircle2, User, Play, Edit3 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PortfolioCard } from '../components/common/PortfolioCard';
import { PortfolioModal } from '../components/common/PortfolioModal';
import { VerificationBadge } from '../components/common/VerificationBadge';

export function CreatorProfilePage({ creatorId, onBack, onOpenEditor }) {
  const { user } = useAuth();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);

  useEffect(() => {
    if (!creatorId) return;
    setLoading(true);
    api.getCreatorById(creatorId)
      .then((data) => {
        setCreator(data);
      })
      .catch((err) => {
        console.error('Failed to load creator:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [creatorId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#6D5EF7] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-gray-500">Loading creator portfolio...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Creator Not Found</h2>
        <p className="text-xs text-gray-500">The requested creator profile does not exist.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold"
        >
          Back to Creators
        </button>
      </div>
    );
  }

  const isOwner = user?.role === 'CREATOR' && user?.id === creator.user_id;

  const filteredPortfolio = (creator.portfolio_items || []).filter((item) => {
    if (activeFilter === 'all') return true;
    return item.content_type?.toLowerCase() === activeFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-950 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Discover</span>
        </button>

        {isOwner && (
          <button
            onClick={onOpenEditor}
            className="px-4 py-2 rounded-xl bg-[#EEEAFE] hover:bg-[#6D5EF7] text-[#5848E5] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit My Profile</span>
          </button>
        )}
      </div>

      {/* Creator Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
          <img
            src={creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={creator.display_name}
            className="w-24 h-24 sm:w-28 sm:resize rounded-2xl border-2 border-gray-100 object-cover shadow-md shrink-0"
          />

          <div className="space-y-3 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                {creator.display_name}
              </h1>
              {creator.verification_records?.some((v) => v.status === 'VERIFIED') && (
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Creator</span>
                </div>
              )}
            </div>

            <p className="text-sm font-semibold text-[#6D5EF7]">
              {creator.specialization || 'AI Content Specialist'}
              {creator.experience_years && (
                <span className="text-gray-400 font-normal"> · {creator.experience_years} years production experience</span>
              )}
            </p>

            {creator.bio && (
              <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
                {creator.bio}
              </p>
            )}

            {/* Skills & Tools Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {creator.skills?.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Signals Banner */}
        {creator.verification_records?.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-2 text-left">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Authenticity Records
            </h4>
            <div className="flex flex-wrap gap-2">
              {creator.verification_records.map((verif) => (
                <VerificationBadge key={verif.id} verification={verif} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Showcase Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-950">
              Creative Portfolio ({creator.portfolio_items?.length || 0})
            </h2>
            <p className="text-xs text-gray-500">
              Browse cinematic videos, animations, and generative visuals created by {creator.display_name}.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
            {['all', 'video', 'animation', 'image', 'motion_graphics'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  activeFilter === type
                    ? 'bg-[#6D5EF7] text-white font-bold shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {type === 'all' ? 'All Work' : type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        {filteredPortfolio.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-xs text-gray-500">
            No portfolio items found for "{activeFilter}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                onSelect={(itm) => setSelectedPortfolioItem(itm)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Portfolio Item Detail Modal */}
      {selectedPortfolioItem && (
        <PortfolioModal
          item={selectedPortfolioItem}
          onClose={() => setSelectedPortfolioItem(null)}
        />
      )}
    </div>
  );
}
