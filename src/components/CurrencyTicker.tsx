import React from 'react';
import { CurrencyCode, CurrencyItem, CustomRates, Language, Translations } from '../types';
import { getCurrenciesWithCustomRates, DEFAULT_RATES } from '../utils/loanLogic';
import { TrendingUp, TrendingDown, Edit3, Sparkles } from 'lucide-react';

interface CurrencyTickerProps {
  activeCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  language: Language;
  translations: Translations;
  customRates?: CustomRates;
  onOpenRateEditor?: () => void;
}

export const CurrencyTicker: React.FC<CurrencyTickerProps> = ({
  activeCurrency,
  onSelectCurrency,
  language,
  translations,
  customRates,
  onOpenRateEditor,
}) => {
  const currencies = getCurrenciesWithCustomRates(customRates);
  const hasCustomRates =
    customRates &&
    Object.keys(customRates).some(
      (k) => customRates[k as CurrencyCode] !== DEFAULT_RATES[k as CurrencyCode]
    );

  return (
    <div className="w-full mb-6">
      {/* Ticker Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 px-1 text-xs gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold text-[11px] tracking-wide shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="uppercase text-[10px] tracking-wider">{translations.liveRatesTicker}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-normal">{translations.baseCurrencyUSD}</span>
          </div>
          {hasCustomRates && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{translations.customRateActive}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onOpenRateEditor && (
            <button
              type="button"
              onClick={onOpenRateEditor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-emerald-400/50 text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm btn-premium"
              title={translations.editMarketRates}
            >
              <Edit3 className="w-3 h-3 text-emerald-400" />
              <span>{translations.editMarketRates}</span>
            </button>
          )}
          <span className="text-[11px] text-slate-500 hidden lg:inline">
            {translations.convertHelp}
          </span>
        </div>
      </div>

      {/* Elegant Pill-Shaped Currency Toggles with Glassmorphism */}
      <div className="p-1.5 sm:p-2 rounded-2xl bg-[#0D121F]/70 backdrop-blur-2xl border border-white/[0.07] shadow-xl shadow-black/40">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {currencies.map((curr: CurrencyItem) => {
            const isSelected = activeCurrency === curr.code;
            const isPositive = curr.change24h >= 0;
            const isCustom =
              customRates?.[curr.code] !== undefined &&
              customRates[curr.code] !== DEFAULT_RATES[curr.code];

            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => onSelectCurrency(curr.code)}
                className={`relative text-start p-3 sm:p-3.5 rounded-xl transition-all duration-200 cursor-pointer group btn-premium overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-500/[0.12] to-slate-900/90 border border-emerald-400/50 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                    : 'bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                {/* Subtle top ambient glow for active card */}
                {isSelected && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-10 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
                )}

                {/* Top Row: Flag Emoji & Currency Code & 24h change */}
                <div className="flex items-center justify-between gap-1 mb-1.5 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none select-none drop-shadow" role="img" aria-label={curr.nameEn}>
                      {curr.flag}
                    </span>
                    <span className={`font-bold text-xs tracking-wider font-sans ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {curr.code}
                    </span>
                  </div>

                  {/* 24h change badge or status indicator */}
                  <div
                    className={`flex items-center text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                      isCustom
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                        : curr.code === 'USD'
                        ? 'text-slate-500 font-mono text-[9px]'
                        : isPositive
                        ? 'text-emerald-400 font-mono'
                        : 'text-rose-400 font-mono'
                    }`}
                  >
                    {isCustom ? (
                      <span className="tracking-wider">LIVE</span>
                    ) : curr.code !== 'USD' ? (
                      <>
                        {isPositive ? (
                          <TrendingUp className="w-2.5 h-2.5 me-0.5 text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5 me-0.5 text-rose-400" />
                        )}
                        <span>{isPositive ? `+${curr.change24h}%` : `${curr.change24h}%`}</span>
                      </>
                    ) : (
                      <span>BASE</span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Exchange Rate & Symbol with Glowing Metallic Effect */}
                <div className="mt-1 relative z-10">
                  <div className="text-sm sm:text-base font-extrabold font-mono tracking-tight flex items-baseline gap-1">
                    <span className={isSelected ? 'metallic-emerald' : 'text-slate-100'}>
                      {curr.code === 'USD'
                        ? '$1.00'
                        : curr.rateToUSD >= 1000
                        ? curr.rateToUSD.toLocaleString()
                        : curr.rateToUSD.toFixed(3)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans font-medium">
                      {curr.symbol}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {language === 'ar' ? curr.nameAr : curr.nameEn}
                  </div>
                </div>

                {/* Active Indicator Gem */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
