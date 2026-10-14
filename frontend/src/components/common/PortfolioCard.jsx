import React from 'react';
import { Play, Sparkles, ShieldCheck } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

export function PortfolioCard({ item, onSelect }) {
  const isVideo = item.content_type?.toLowerCase() === 'video' || item.content_type?.toLowerCase() === 'animation';
  const hasVerification = item.verification_records?.some((v) => v.status === 'VERIFIED');

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#6D5EF7]/40 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Media Box */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-900">
        <img
          src={item.media_url}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-80" />

        {/* Content Type tag */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white uppercase tracking-wider flex items-center gap-1">
          {isVideo && <Play className="w-2.5 h-2.5 fill-white" />}
          <span>{item.content_type}</span>
        </div>

        {/* Aspect Ratio / Format tag */}
        {item.aspect_ratio && (
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-gray-800">
            {item.aspect_ratio}
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-white font-bold text-base leading-snug group-hover:text-indigo-200 transition-colors">
            {item.title}
          </h4>
        </div>
      </div>

      {/* Details footer */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
        {item.description && (
          <p className="text-gray-600 text-xs line-clamp-2 mb-2.5 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-gray-100">
          {/* Tools */}
          <div className="flex flex-wrap gap-1">
            {item.tools?.slice(0, 2).map((t, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-[#EEEAFE] text-[#5848E5] text-[10px] font-medium flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5" />
                {t.tool?.name || t.tool_name}
              </span>
            ))}
          </div>

          {/* Verification indicator */}
          {hasVerification && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
