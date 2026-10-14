import React from 'react';
import { X, Sparkles, ShieldCheck, Film, Layers, FileCheck, CheckCircle2 } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

export function PortfolioModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Column */}
        <div className="md:w-1/2 bg-gray-950 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden">
          <img
            src={item.media_url}
            alt={item.title}
            className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
            <span className="font-semibold uppercase tracking-wider">{item.content_type}</span>
            <span>{item.aspect_ratio || '16:9'} · {item.output_format || 'ProRes 422'}</span>
          </div>
        </div>

        {/* Metadata Details Column */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md bg-[#EEEAFE] text-[#5848E5] text-xs font-semibold uppercase tracking-wider">
                  {item.content_type}
                </span>
                {item.commercial_use_status && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {item.commercial_use_status}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h2>
            </div>

            {item.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Tools Breakdown */}
            {item.tools?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#6D5EF7]" />
                  AI Models & Tools Used
                </h4>
                <div className="space-y-2">
                  {item.tools.map((t, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-xs">
                      <span className="font-semibold text-gray-900 block">
                        {t.tool?.name || t.tool_name}
                      </span>
                      {t.usage_description && (
                        <p className="text-gray-600 mt-0.5 leading-relaxed">
                          {t.usage_description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Workflow Description */}
            {item.workflow_description && (
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#6D5EF7]" />
                  Production Pipeline & Workflow
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {item.workflow_description}
                </p>
              </div>
            )}

            {/* Verification Signals */}
            {item.verification_records?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Independent Verification Signals
                </h4>
                <div className="space-y-1.5">
                  {item.verification_records.map((v, idx) => (
                    <VerificationBadge key={idx} verification={v} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              CreatorAI Provenance Audited
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
