import React from 'react';
import { ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export function VerificationBadge({ verification, compact = false }) {
  if (!verification) return null;

  const isVerified = verification.status === 'VERIFIED';
  const isPending = verification.status === 'PENDING';

  if (!isVerified && !isPending) return null;

  const label = verification.verification_type
    ? `${verification.verification_type.toLowerCase()} verified`
    : 'Verified';

  if (compact) {
    return (
      <span
        title={verification.verification_method || 'Verified through generation provenance'}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          isVerified
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}
      >
        {isVerified ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
        <span>{isVerified ? 'Verified' : 'Pending'}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
        isVerified
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
          : 'bg-amber-50 text-amber-800 border border-amber-200'
      }`}
    >
      {isVerified ? (
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-amber-600" />
      )}
      <span className="capitalize">{label}</span>
      {verification.verification_method && (
        <span className="text-gray-400 font-normal hidden sm:inline">
          · {verification.verification_method}
        </span>
      )}
    </div>
  );
}
