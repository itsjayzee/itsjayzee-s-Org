import React, { useState, useEffect } from 'react';
import { CurrencyCode, Language, LoanType, Translations } from '../types';
import { CURRENCIES } from '../utils/loanLogic';
import { Plus, X, ArrowDownLeft, ArrowUpRight, Check, Calendar, Phone, FileText, Sparkles, Clock } from 'lucide-react';
import { DatePickerModal } from './DatePickerModal';

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLoan: (data: {
    personName: string;
    amount: number;
    type: LoanType;
    currency: CurrencyCode;
    dueDate: string;
    phone?: string;
    notes?: string;
  }) => void;
  translations: Translations;
  defaultCurrency?: CurrencyCode;
  language?: Language;
}

export const AddLoanModal: React.FC<AddLoanModalProps> = ({
  isOpen,
  onClose,
  onAddLoan,
  translations,
  defaultCurrency = 'USD',
  language = 'en',
}) => {
  // Default due date: 30 days from today
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<LoanType>('they_owe_me');
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);
  const [dueDate, setDueDate] = useState(getDefaultDueDate());
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setDueDate(getDefaultDueDate());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: LoanType) => {
    if (newType !== type) {
      setType(newType);
      setAnimKey((prev) => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = personName.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedName || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(translations.requiredFieldError);
      return;
    }

    if (!dueDate) {
      setError(translations.dueDateRequired);
      return;
    }

    onAddLoan({
      personName: trimmedName,
      amount: parsedAmount,
      type,
      currency,
      dueDate,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setPersonName('');
    setAmount('');
    setType('they_owe_me');
    setCurrency(defaultCurrency);
    setDueDate(getDefaultDueDate());
    setPhone('');
    setNotes('');
    setError(null);
    onClose();
  };

  const selectedCurrencyItem = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  // Calculate relative days for due date preview
  const getRelativeDaysNotice = (dateStr: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return language === 'ar' ? 'مستحق اليوم!' : 'Due Today!';
    if (diffDays === 1) return language === 'ar' ? 'مستحق غداً' : 'Due tomorrow';
    if (diffDays > 1) return language === 'ar' ? `خلال ${diffDays} يوماً` : `In ${diffDays} days`;
    return language === 'ar' ? `متأخر منذ ${Math.abs(diffDays)} يوماً` : `${Math.abs(diffDays)}d overdue`;
  };

  const isTheyOweMe = type === 'they_owe_me';

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-loan-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      >
        <div
          key={animKey}
          className={`relative w-full max-w-lg rounded-3xl backdrop-blur-2xl border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors duration-500 ${
            isTheyOweMe
              ? 'animate-spring-upwash bg-gradient-to-b from-emerald-500/[0.13] via-[#0D121F] to-[#0D121F] border-emerald-500/35 shadow-[0_16px_45px_-12px_rgba(16,185,129,0.25)]'
              : 'animate-spring-depthwash bg-gradient-to-b from-rose-500/[0.13] via-[#0D121F] to-[#0D121F] border-rose-500/35 shadow-[0_16px_45px_-12px_rgba(244,63,94,0.25)]'
          }`}
        >
          {/* Top Header with dynamic accent wash */}
          <div
            className={`flex items-center justify-between p-5 border-b border-white/[0.06] shrink-0 transition-colors duration-500 ${
              isTheyOweMe ? 'bg-[#080B11]/70' : 'bg-[#080B11]/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-300 ${
                  isTheyOweMe
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/15'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/15'
                }`}
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 id="add-loan-title" className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <span>{translations.addLoanModalTitle}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                      isTheyOweMe
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {isTheyOweMe ? translations.theyOweMe : translations.iOweThem}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {translations.addLoanModalSubtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="btn-premium p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-in shake duration-200">
                {error}
              </div>
            )}

            {/* 1. Mandatory Two Strict Options Toggle with Fluid Physics-Based Animations */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {translations.loanTypeLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Option A: They Owe Me (Smooth Upward-Sliding Transition + Emerald Wash) */}
                <button
                  type="button"
                  onClick={() => handleTypeChange('they_owe_me')}
                  className={`btn-premium relative flex flex-col p-3.5 rounded-2xl border text-start transition-all cursor-pointer ${
                    isTheyOweMe
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/15 scale-[1.01]'
                      : 'bg-[#080B11]/60 border-white/[0.06] text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                      <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      <span>{translations.theyOweMe}</span>
                    </div>
                    {isTheyOweMe && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    {translations.theyOweMeDesc}
                  </span>
                </button>

                {/* Option B: I Owe Them (Depth-Scaling Effect + Crimson/Rose Shift) */}
                <button
                  type="button"
                  onClick={() => handleTypeChange('i_owe_them')}
                  className={`btn-premium relative flex flex-col p-3.5 rounded-2xl border text-start transition-all cursor-pointer ${
                    !isTheyOweMe
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-200 ring-2 ring-rose-500/30 shadow-lg shadow-rose-500/15 scale-[1.01]'
                      : 'bg-[#080B11]/60 border-white/[0.06] text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                      <ArrowUpRight className="w-4 h-4 text-rose-400" />
                      <span>{translations.iOweThem}</span>
                    </div>
                    {!isTheyOweMe && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-slate-950 flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    {translations.iOweThemDesc}
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Person Name */}
            <div>
              <label htmlFor="add-person-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                {translations.nameLabel} <span className="text-rose-400">*</span>
              </label>
              <input
                id="add-person-name"
                type="text"
                required
                autoFocus
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder={translations.namePlaceholder}
                className="w-full px-4 py-3 rounded-2xl bg-[#080B11]/90 border border-white/[0.08] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
              />
            </div>

            {/* 3. Amount & Multi-Currency Selection with Flags */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="add-amount" className="block text-xs font-semibold text-slate-300">
                  {translations.amountLabel} <span className="text-rose-400">*</span>
                </label>
                <label htmlFor="add-currency" className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span>{selectedCurrencyItem.flag}</span>
                  <span>{translations.selectCurrency}</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="add-amount"
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={translations.amountPlaceholder}
                    className="w-full px-4 py-3 rounded-2xl bg-[#080B11]/90 border border-white/[0.08] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all font-mono tabular-nums shadow-inner"
                  />
                </div>

                {/* Currency Dropdown with Flags */}
                <div className="relative min-w-[145px]">
                  <select
                    id="add-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3.5 py-3 rounded-2xl bg-[#080B11]/90 border border-white/[0.08] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer shadow-inner"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#0D121F] text-white">
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {translations.currency}: {selectedCurrencyItem.flag} {selectedCurrencyItem.nameEn}
              </p>
            </div>

            {/* 4. MANDATORY Debt Due Date with Sleek Dark Theme Calendar Date-Picker Modal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="due-date-trigger" className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{translations.dueDateLabel}</span>
                  <span className="text-rose-400">*</span>
                </label>
                {dueDate && (
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{getRelativeDaysNotice(dueDate)}</span>
                  </span>
                )}
              </div>

              {/* Trigger Button opening Sleek Calendar Date-Picker */}
              <button
                id="due-date-trigger"
                type="button"
                onClick={() => setIsDatePickerOpen(true)}
                className={`btn-premium w-full px-4 py-3 rounded-2xl border text-start flex items-center justify-between transition-all cursor-pointer shadow-inner ${
                  isTheyOweMe
                    ? 'bg-[#080B11]/90 border-white/[0.08] hover:border-emerald-500/50 text-white'
                    : 'bg-[#080B11]/90 border-white/[0.08] hover:border-rose-500/50 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isTheyOweMe ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-sm font-mono font-bold tracking-wide">
                      {dueDate ? dueDate : translations.selectDueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs px-2.5 py-1 rounded-xl bg-white/[0.06] text-slate-300 font-medium">
                    {language === 'ar' ? 'تغيير' : 'Change'}
                  </span>
                </div>
              </button>
            </div>

            {/* 5. Phone Number (Optional) */}
            <div>
              <label htmlFor="add-phone" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{translations.phoneLabel}</span>
              </label>
              <input
                id="add-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={translations.phonePlaceholder}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#080B11]/90 border border-white/[0.08] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
              />
            </div>

            {/* 6. Notes / Purpose (Optional) */}
            <div>
              <label htmlFor="add-notes" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>{translations.notesLabel}</span>
              </label>
              <textarea
                id="add-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={translations.notesPlaceholder}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#080B11]/90 border border-white/[0.08] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all resize-none shadow-inner"
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="btn-premium px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {translations.cancel}
              </button>
              <button
                type="submit"
                className={`btn-premium flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer ${
                  isTheyOweMe
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-slate-950 shadow-rose-500/25'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{translations.saveLoan}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sleek Dark Theme Calendar Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDate={dueDate}
        onSelectDate={(newDate) => setDueDate(newDate)}
        loanType={type}
        language={language}
      />
    </>
  );
};
