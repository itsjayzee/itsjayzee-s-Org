import React from 'react';
import { Translations } from '../types';
import { Plus, ShieldCheck } from 'lucide-react';

interface EmptyStateProps {
  translations: Translations;
  onOpenAddModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  translations,
  onOpenAddModal,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0D121F]/60 backdrop-blur-2xl p-8 sm:p-16 text-center my-6 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Fintech Icon Badge */}
      <div className="relative mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-amber-500/10 blur-xl animate-pulse" />
        <div className="relative w-full h-full rounded-2xl border border-white/[0.12] bg-[#080B11]/90 backdrop-blur-xl flex items-center justify-center shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-400/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 font-sans">
        {translations.emptyStateTitle}
      </h3>
      <p className="max-w-md mx-auto text-sm text-slate-400 leading-relaxed mb-8">
        {translations.emptyStateDesc}
      </p>

      {/* Streamlined single primary action button */}
      <div className="flex justify-center max-w-xs mx-auto">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-xl shadow-emerald-500/25 border border-emerald-300/30 cursor-pointer btn-premium"
        >
          <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>{translations.startByAdding}</span>
        </button>
      </div>
    </div>
  );
};
