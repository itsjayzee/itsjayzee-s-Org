import React from 'react';
import { CurrencyCode, Language, Translations } from '../types';
import { Totals, formatCardDebt, formatCurrency } from '../utils/loanLogic';
import { ArrowDownLeft, ArrowUpRight, Scale, TrendingUp, TrendingDown, Layers, Eye, EyeOff } from 'lucide-react';

interface DashboardStatsProps {
  totals: Totals;
  language: Language;
  translations: Translations;
  activeCurrency?: CurrencyCode;
  customRates?: import('../types').CustomRates;
  maskBalances?: boolean;
  onToggleMask?: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totals,
  language,
  translations,
  activeCurrency = 'USD',
  maskBalances = false,
  onToggleMask,
}) => {
  const isNetPositive = totals.netBalance > 0;
  const isNetNegative = totals.netBalance < 0;

  const displayVal = (val: number) => {
    if (maskBalances) return '••••••••';
    return formatCurrency(val, language, activeCurrency);
  };

  // Filter currencies with active debt amounts
  const activeTheyOweCurrencies = (Object.keys(totals.theyOweByCurrency) as CurrencyCode[]).filter(
    (code) => (totals.theyOweByCurrency[code] || 0) > 0
  );

  const activeIOweCurrencies = (Object.keys(totals.iOweByCurrency) as CurrencyCode[]).filter(
    (code) => (totals.iOweByCurrency[code] || 0) > 0
  );

  return (
    <div className="mb-6 space-y-4">
      {/* 3 Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 sm:gap-5">
        {/* 1. They Owe Me (To Collect) - Glowing Neon-Mint / Emerald Green */}
        <div className="relative overflow-hidden rounded-3xl glass-glow-emerald p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12 group-hover:bg-emerald-500/15 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                  <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block font-sans">
                    {translations.theyOweMe}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {translations.totalToCollect}
                  </span>
                </div>
              </div>

              {/* Record count badge */}
              <div className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 font-mono">
                {totals.activeTheyOweCount} {translations.activeLoansCount}
              </div>
            </div>

            <div className="mt-2">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono metallic-emerald">
                {displayVal(totals.totalTheyOwe)}
              </div>
            </div>
          </div>

          {/* Per-Currency Breakdown for They Owe Me */}
          {!maskBalances && activeTheyOweCurrencies.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-white/[0.08]">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2 flex items-center justify-between">
                <span>{translations.currencyBreakdownTitle}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeTheyOweCurrencies.map((code) => {
                  const amt = totals.theyOweByCurrency[code];
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium shadow-sm"
                    >
                      <span>{formatCardDebt(amt, code, language)}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. I Owe Them (To Pay) - Soft Sophisticated Neon-Rose / Coral */}
        <div className="relative overflow-hidden rounded-3xl glass-glow-rose p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12 group-hover:bg-rose-500/15 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-400/15 border border-rose-400/30 flex items-center justify-center text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.2)]">
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block font-sans">
                    {translations.iOweThem}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {translations.totalToPay}
                  </span>
                </div>
              </div>

              {/* Record count badge */}
              <div className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-400/10 text-rose-300 border border-rose-400/20 font-mono">
                {totals.activeIOweCount} {translations.activeLoansCount}
              </div>
            </div>

            <div className="mt-2">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono metallic-rose">
                {displayVal(totals.totalIOwe)}
              </div>
            </div>
          </div>

          {/* Per-Currency Breakdown for I Owe Them */}
          {!maskBalances && activeIOweCurrencies.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-white/[0.08]">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2 flex items-center justify-between">
                <span>{translations.currencyBreakdownTitle}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeIOweCurrencies.map((code) => {
                  const amt = totals.iOweByCurrency[code];
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono font-medium shadow-sm"
                    >
                      <span>{formatCardDebt(amt, code, language)}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Net Liquidity / Position - Metallic Obsidian */}
        <div
          className={`relative overflow-hidden rounded-3xl glass-card p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 ${
            isNetPositive
              ? 'border-emerald-500/35 shadow-emerald-950/20'
              : isNetNegative
              ? 'border-rose-500/35 shadow-rose-950/20'
              : 'border-white/[0.08]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isNetPositive
                      ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30'
                      : isNetNegative
                      ? 'bg-rose-400/15 text-rose-300 border border-rose-400/30'
                      : 'bg-white/[0.05] text-slate-300 border border-white/[0.1]'
                  }`}
                >
                  <Scale className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block font-sans">
                    {translations.netPosition}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                    {isNetPositive ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {translations.netSurplus}
                      </span>
                    ) : isNetNegative ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {translations.netLiability}
                      </span>
                    ) : (
                      <span className="text-slate-400">{translations.balanced}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Privacy Mask & Status pill */}
              <div className="flex items-center gap-2">
                {onToggleMask && (
                  <button
                    type="button"
                    onClick={onToggleMask}
                    aria-label={maskBalances ? 'Show Balances' : 'Hide Balances'}
                    title={maskBalances ? 'Show Balances' : 'Privacy Shield (Hide)'}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all btn-premium cursor-pointer"
                  >
                    {maskBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2">
              <div
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
                  isNetPositive
                    ? 'metallic-emerald'
                    : isNetNegative
                    ? 'metallic-rose'
                    : 'text-slate-200'
                }`}
              >
                {displayVal(Math.abs(totals.netBalance))}
              </div>
            </div>
          </div>

          {/* Multi-currency notice */}
          {totals.isMultiCurrency && (
            <div className="mt-4 pt-3.5 border-t border-white/[0.08] text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{translations.multiCurrencyNotice} ({activeCurrency})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
