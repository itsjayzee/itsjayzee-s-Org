import React, { useState } from 'react';
import { CurrencyCode, CustomRates, Language, Translations } from '../types';
import { CURRENCIES, DEFAULT_RATES } from '../utils/loanLogic';
import { X, TrendingUp, RotateCcw, Check, DollarSign, Sparkles, AlertCircle } from 'lucide-react';

interface MarketRateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customRates: CustomRates;
  onSaveRates: (newRates: CustomRates) => void;
  onResetRates: () => void;
  language: Language;
  translations: Translations;
}

export const MarketRateEditorModal: React.FC<MarketRateEditorModalProps> = ({
  isOpen,
  onClose,
  customRates,
  onSaveRates,
  onResetRates,
  language,
  translations,
}) => {
  const [rates, setRates] = useState<CustomRates>(customRates);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRateChange = (code: CurrencyCode, valueStr: string) => {
    const val = parseFloat(valueStr);
    setRates((prev) => ({
      ...prev,
      [code]: isNaN(val) || val <= 0 ? 1 : val,
    }));
  };

  const handleApplyPreset = (code: CurrencyCode, rate: number) => {
    setRates((prev) => ({
      ...prev,
      [code]: rate,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRates(rates);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const editableCurrencies = CURRENCIES.filter((c) => c.code !== 'USD');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="market-rate-editor-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 id="market-rate-editor-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>{translations.dollarMarketRateTitle}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {translations.dollarMarketRateSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Inputs */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{translations.settingsSaved}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              {language === 'ar'
                ? 'تتيح لك هذه الميزة تعديل سعر صرف الدولار الحقيقي (سعر السوق الموازي أو بورصة الصيرفة) لضمان دقة كاملة في تحويل ديونك وحساب صافي ثروتك.'
                : 'Customize the exact market/street exchange price of 1 US Dollar. All dashboard totals and debt conversions update instantly in real time.'}
            </span>
          </div>

          {/* Currency list */}
          <div className="space-y-3">
            {editableCurrencies.map((c) => {
              const currentRate = rates[c.code] ?? c.rateToUSD;
              const isModified = currentRate !== DEFAULT_RATES[c.code];

              return (
                <div
                  key={c.code}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" role="img" aria-label={c.nameEn}>
                        {c.flag}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>{language === 'ar' ? c.nameAr : c.nameEn}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({c.code})</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          1 USD =
                        </div>
                      </div>
                    </div>

                    {isModified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {translations.customRateActive}
                      </span>
                    )}
                  </div>

                  {/* Input and Quick presets */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="any"
                        min="0.0001"
                        required
                        value={currentRate}
                        onChange={(e) => handleRateChange(c.code, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white font-mono text-sm outline-none"
                      />
                      <span className="absolute end-3 top-2 text-xs font-mono text-slate-500">
                        {c.code}
                      </span>
                    </div>

                    {/* Quick Market Presets */}
                    {c.code === 'IQD' && (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleApplyPreset('IQD', 1515)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
                          title="Baghdad Market Rate (~1,515)"
                        >
                          {translations.quickPresetBaghdad}
                        </button>
                      </div>
                    )}
                    {c.code === 'TRY' && (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleApplyPreset('TRY', 34.80)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
                          title="Istanbul Market (~34.80)"
                        >
                          {translations.quickPresetIstanbul}
                        </button>
                      </div>
                    )}
                    {c.code === 'IRR' && (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleApplyPreset('IRR', 650000)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
                          title="Tehran Market (~650,000)"
                        >
                          {translations.quickPresetTehran}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setRates(DEFAULT_RATES);
                onResetRates();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{translations.resetDefaultRates}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {translations.cancel}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>{translations.saveRates}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
