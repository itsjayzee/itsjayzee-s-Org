import React, { useState, useEffect } from 'react';
import { CurrencyCode, CustomRates, Language, Loan, LoanType, Translations } from '../types';
import { CURRENCIES, formatCardDebt } from '../utils/loanLogic';
import {
  X,
  Edit3,
  Check,
  Percent,
  Calendar,
  Phone,
  FileText,
  User,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  RotateCcw,
  PlusCircle,
  MinusCircle,
  Plus,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface EditLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onSaveLoan: (updatedLoan: Loan) => void;
  language: Language;
  translations: Translations;
  customRates?: CustomRates;
}

export const EditLoanModal: React.FC<EditLoanModalProps> = ({
  isOpen,
  onClose,
  loan,
  onSaveLoan,
  language,
  translations,
}) => {
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [type, setType] = useState<LoanType>('they_owe_me');
  const [dueDate, setDueDate] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'settled'>('active');

  // Multi-mode state: 'add_money' | 'repayment' | 'details'
  const [activeMode, setActiveMode] = useState<'add_money' | 'repayment' | 'details'>('add_money');
  const [extraAmount, setExtraAmount] = useState('');
  const [addNotice, setAddNotice] = useState(false);

  useEffect(() => {
    if (loan) {
      setPersonName(loan.personName);
      setAmount(String(loan.amount));
      setPaidAmount(String(loan.paidAmount || 0));
      setCurrency(loan.currency || 'USD');
      setType(loan.type);
      setDueDate(loan.dueDate || '');
      setPhone(loan.phone || '');
      setNotes(loan.notes || '');
      setStatus(loan.status);
      setExtraAmount('');
      setAddNotice(false);
    }
  }, [loan, isOpen]);

  if (!isOpen || !loan) return null;

  const totalNum = parseFloat(amount) || 0;
  const paidNum = Math.max(0, parseFloat(paidAmount) || 0);
  const remainingNum = Math.max(0, totalNum - paidNum);
  const paidPercent = totalNum > 0 ? Math.min(100, Math.round((paidNum / totalNum) * 100)) : 0;
  const isFullyPaid = totalNum > 0 && paidNum >= totalNum;

  // Add more money to the loan ("if i own more money i add more money")
  const handleApplyExtraMoney = (extraVal?: number) => {
    const valToAdd = extraVal !== undefined ? extraVal : parseFloat(extraAmount);
    if (!valToAdd || isNaN(valToAdd) || valToAdd <= 0) return;

    const newTotal = Math.round((totalNum + valToAdd) * 100) / 100;
    setAmount(String(newTotal));
    setExtraAmount('');
    setStatus('active'); // reactivate if was settled

    // Append to notes
    const today = new Date().toISOString().split('T')[0];
    const logEntry = `[+${valToAdd.toLocaleString()} ${currency} added on ${today}]`;
    setNotes((prev) => (prev ? `${prev} • ${logEntry}` : logEntry));

    setAddNotice(true);
    setTimeout(() => setAddNotice(false), 2500);
  };

  // Preset repayment ratio handlers
  const handleSetRatio = (ratio: number) => {
    if (totalNum <= 0) return;
    const calculated = Math.round(totalNum * ratio * 100) / 100;
    setPaidAmount(String(calculated));
    if (ratio >= 1) {
      setStatus('settled');
    } else {
      setStatus('active');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || totalNum <= 0) return;

    const newStatus = isFullyPaid ? 'settled' : status;

    const updatedLoan: Loan = {
      ...loan,
      personName: personName.trim(),
      amount: totalNum,
      paidAmount: paidNum,
      currency,
      type,
      dueDate: dueDate || undefined,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      status: newStatus,
      settledAt: newStatus === 'settled' ? (loan.settledAt || new Date().toISOString().split('T')[0]) : undefined,
    };

    onSaveLoan(updatedLoan);
    onClose();
  };

  const selectedCurr = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-loan-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0D121F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-[#080B11]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#080B11] rounded-[14px] flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 id="edit-loan-modal-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2 tracking-wide">
                <span>{translations.editLoanModalTitle}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {translations.editLoanModalSubtitle}
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

        {/* Mode Selector Tabs: + Add More Debt | - Pay Down Debt | ✏️ Edit Info */}
        <div className="flex border-b border-white/[0.06] bg-[#080B11]/40 p-2 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('add_money')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'add_money'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>{translations.addMoreDebtTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('repayment')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'repayment'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <MinusCircle className="w-4 h-4 text-emerald-400" />
            <span>{translations.logRepaymentTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('details')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'details'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Edit3 className="w-4 h-4 text-slate-400" />
            <span>{translations.editLoan}</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Live Balance Summary Header Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base select-none">{selectedCurr.flag}</span>
                <span className="font-bold text-sm text-white">{personName || loan.personName}</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                type === 'they_owe_me'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}>
                {type === 'they_owe_me' ? translations.theyOweMe : translations.iOweThem}
              </span>
            </div>

            {/* Numbers Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-800/80 text-xs">
              <div className="p-1.5 rounded-lg bg-slate-900/70">
                <span className="text-[10px] text-slate-400 block">{translations.originalDebt}</span>
                <span className="font-mono font-bold text-white text-xs sm:text-sm">
                  {formatCardDebt(totalNum, currency, language)}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900/70">
                <span className="text-[10px] text-slate-400 block">{translations.paidSoFar}</span>
                <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">
                  {formatCardDebt(paidNum, currency, language)}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400 block">{translations.remainingDebt}</span>
                <span className="font-mono font-extrabold text-emerald-300 text-xs sm:text-sm">
                  {formatCardDebt(remainingNum, currency, language)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${paidPercent}%` }}
              />
            </div>
          </div>

          {/* MODE 1: + ADD MORE MONEY / BORROW MORE */}
          {activeMode === 'add_money' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">{translations.addMoreDebtTab}</h4>
                    <p className="text-[11px] text-slate-400">{translations.addMoneyDesc}</p>
                  </div>
                </div>
              </div>

              {addNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{translations.amountAddedSuccess}</span>
                </div>
              )}

              {/* Input for Extra Money */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {translations.addAmountLabel}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={extraAmount}
                      onChange={(e) => setExtraAmount(e.target.value)}
                      placeholder="e.g., 50.00"
                      className="w-full ps-4 pe-14 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono text-sm text-white placeholder-slate-500 outline-none"
                    />
                    <span className="absolute end-3 top-2.5 text-xs font-mono font-bold text-amber-400 pointer-events-none">
                      {currency}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyExtraMoney()}
                    disabled={!extraAmount || parseFloat(extraAmount) <= 0}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {translations.addDebtBtn}
                  </button>
                </div>
              </div>

              {/* Quick Add Preset Buttons */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  {language === 'ar' ? 'إضافة سريعة بنقرة واحدة:' : '1-Click Quick Add:'}
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {(currency === 'IQD'
                    ? [10000, 25000, 50000, 100000, 250000]
                    : [10, 25, 50, 100, 250]
                  ).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleApplyExtraMoney(val)}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:bg-amber-500/15 transition-all cursor-pointer text-center font-mono"
                    >
                      +{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: - PAY DOWN DEBT / PARTIAL REPAYMENT */}
          {activeMode === 'repayment' && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/25 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{translations.paidAmountLabel}</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {paidPercent}% {translations.paidSoFar}
                </span>
              </div>

              {/* Direct Paid Input */}
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  max={totalNum || undefined}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full ps-4 pe-14 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm text-white placeholder-slate-500 outline-none"
                />
                <span className="absolute end-3 top-2.5 text-xs font-mono text-slate-400 pointer-events-none">
                  {currency}
                </span>
              </div>

              {/* 1-Click Partial Payment Shortcut Presets */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {language === 'ar' ? 'أزرار سداد سريعة بنقرة واحدة:' : 'Quick Repayment Shortcuts:'}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetRatio(0.25)}
                    className="px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-emerald-300 transition-all cursor-pointer text-center"
                    title="Pay 25% of debt"
                  >
                    25%
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetRatio(0.5)}
                    className="px-2 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer text-center"
                    title="Pay 50% (Half / النصف)"
                  >
                    {translations.payHalf}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetRatio(0.75)}
                    className="px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-emerald-300 transition-all cursor-pointer text-center"
                    title="Pay 75% of debt"
                  >
                    75%
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetRatio(1)}
                    className="px-2 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer text-center shadow-md shadow-emerald-600/20"
                    title="Pay in full (100% Settled)"
                  >
                    100%
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: ✏️ EDIT DETAILS & CORE INFORMATION */}
          {activeMode === 'details' && (
            <div className="space-y-3.5 animate-in fade-in">
              {/* Classification Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {translations.loanTypeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setType('they_owe_me')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      type === 'they_owe_me'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                    <span>{translations.theyOweMe}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('i_owe_them')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      type === 'i_owe_them'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300 ring-2 ring-rose-500/20 shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-rose-400" />
                    <span>{translations.iOweThem}</span>
                  </button>
                </div>
              </div>

              {/* Person Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{translations.nameLabel} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder={translations.namePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>

              {/* Total Debt Direct Input & Currency */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>{translations.customDebtTotal} *</span>
                  </label>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>{selectedCurr.flag}</span>
                    <span>{selectedCurr.nameEn}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 focus:border-emerald-500 outline-none cursor-pointer"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Common fields: Due date, Phone, Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{translations.dueDateLabel}</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{translations.phoneLabel}</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={translations.phonePlaceholder}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{translations.notesLabel}</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={translations.notesPlaceholder}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs text-white outline-none"
            />
          </div>

          {/* Status Override Toggle */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {language === 'ar' ? 'حالة السداد العامة:' : 'General Status:'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'active'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {translations.statusActive}
              </button>
              <button
                type="button"
                onClick={() => setStatus('settled')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'settled'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {translations.statusSettled}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {translations.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{translations.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
