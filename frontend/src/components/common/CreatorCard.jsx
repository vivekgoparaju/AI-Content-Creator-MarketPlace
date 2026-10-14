import React from 'react';
import { ShieldCheck, Sparkles, Layers, ArrowRight } from 'lucide-react';

export function CreatorCard({ creator, onSelect }) {
  const primaryThumb = creator.sample_portfolio?.[0]?.media_url ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      onClick={() => onSelect(creator.id)}
      className="group relative bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#6D5EF7]/40 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Portfolio Cover Image with aspect ratio */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
        <img
          src={primaryThumb}
          alt={creator.display_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-80" />

        {/* Verification badge on cover if verified */}
        {creator.is_verified && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified AI Creator</span>
          </div>
        )}

        {/* Portfolio count tag */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
          <Layers className="w-3 h-3 text-indigo-300" />
          <span>{creator.portfolio_count} works</span>
        </div>

        {/* Floating Avatar & Creator Name */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
          <img
            src={creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={creator.display_name}
            className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md"
          />
          <div className="min-w-0">
            <h3 className="text-white font-bold text-base truncate group-hover:text-indigo-200 transition-colors">
              {creator.display_name}
            </h3>
            <p className="text-gray-200 text-xs truncate">
              {creator.specialization || 'AI Content Specialist'}
            </p>
          </div>
        </div>
      </div>

      {/* Body content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {creator.bio && (
          <p className="text-gray-600 text-xs line-clamp-2 mb-3 leading-relaxed">
            {creator.bio}
          </p>
        )}

        {/* Tools and Skills */}
        <div className="space-y-2 mt-auto">
          {/* AI Tools */}
          {creator.tools?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {creator.tools.slice(0, 3).map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-[#EEEAFE] text-[#5848E5] text-[11px] font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {tool}
                </span>
              ))}
              {creator.tools.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px]">
                  +{creator.tools.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Skills */}
          {creator.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {creator.skills.slice(0, 2).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#6D5EF7] group-hover:text-[#5848E5]">
          <span>View Creator Portfolio</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
}
