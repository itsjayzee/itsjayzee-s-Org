import React from 'react';
import { CurrencyCode, CustomRates, Language, Loan, Translations } from '../types';
import { CURRENCIES, formatCardDebt, formatCurrency, convertBetweenCurrencies } from '../utils/loanLogic';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Calendar,
  Phone,
  FileText,
  Percent,
  Edit3,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface LoanCardProps {
  loan: Loan;
  language: Language;
  translations: Translations;
  activeCurrency?: CurrencyCode;
  customRates?: CustomRates;
  viewMode?: import('../types').ViewMode;
  isNewlyAdded?: boolean;
  onEdit?: (loan: Loan) => void;
  onSendReminder: (loan: Loan) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (loan: Loan) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  language,
  translations,
  activeCurrency = 'USD',
  customRates,
  viewMode = 'spacious',
  isNewlyAdded = false,
  onEdit,
  onSendReminder,
  onToggleStatus,
  onDelete,
}) => {
  const isTheyOweMe = loan.type === 'they_owe_me';
  const isSettled = loan.status === 'settled';
  const loanCurrency = loan.currency || 'USD';
  const currencyItem = CURRENCIES.find((c) => c.code === loanCurrency) || CURRENCIES[0];

  // Due date deadline calculation and dynamic glowing visual indicators
  const getDeadlineState = () => {
    if (!loan.dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(loan.dueDate);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (isSettled) {
      return {
        level: 'settled',
        label: `${translations.dueOn}: ${loan.dueDate}`,
        badge: translations.statusSettled,
        badgeClass: 'bg-white/[0.04] text-slate-400 border-white/[0.06]',
        glowClass: 'text-slate-400',
        containerClass: 'bg-white/[0.02] border-white/[0.05]',
      };
    }

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        level: 'overdue',
        label: `${translations.dueOn}: ${loan.dueDate}`,
        badge: language === 'ar' ? `متأخر منذ ${daysAgo} يوماً` : `Overdue by ${daysAgo}d`,
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50 glow-urgent-red font-bold',
        glowClass: 'text-rose-400 font-bold',
        containerClass: 'bg-rose-500/[0.09] border-rose-500/35 shadow-[0_0_15px_rgba(244,63,94,0.18)]',
      };
    }

    if (diffDays === 0) {
      return {
        level: 'today',
        label: `${translations.dueOn}: ${loan.dueDate}`,
        badge: language === 'ar' ? 'مستحق اليوم!' : 'Due Today!',
        badgeClass: 'bg-rose-500/25 text-rose-300 border-rose-500/60 glow-urgent-red font-bold',
        glowClass: 'text-rose-400 font-bold',
        containerClass: 'bg-rose-500/[0.1] border-rose-500/40 shadow-[0_0_18px_rgba(244,63,94,0.22)]',
      };
    }

    if (diffDays <= 3) {
      return {
        level: 'urgent',
        label: `${translations.dueOn}: ${loan.dueDate}`,
        badge: language === 'ar' ? `مستحق خلال ${diffDays} أيام` : `Due in ${diffDays}d`,
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50 glow-urgent-orange font-bold',
        glowClass: 'text-amber-300 font-bold',
        containerClass: 'bg-amber-500/[0.09] border-amber-500/35 shadow-[0_0_16px_rgba(245,158,11,0.18)]',
      };
    }

    return {
      level: 'normal',
      label: `${translations.dueOn}: ${loan.dueDate}`,
      badge: language === 'ar' ? `خلال ${diffDays} يوماً` : `In ${diffDays}d`,
      badgeClass: 'bg-white/[0.05] text-slate-300 border-white/[0.08]',
      glowClass: 'text-slate-300',
      containerClass: 'bg-white/[0.03] border-white/[0.06]',
    };
  };

  const deadline = getDeadlineState();
  const isOverdue = deadline?.level === 'overdue';

  // Partial Repayment calculations
  const paidAmount = loan.paidAmount || 0;
  const hasPartialPayment = paidAmount > 0 && !isSettled;
  const remainingAmount = Math.max(0, loan.amount - paidAmount);

  // Progress Percentage Calculation
  const progressPercent = isSettled
    ? 100
    : paidAmount > 0
    ? Math.min(100, Math.round((paidAmount / loan.amount) * 100))
    : 0;

  // Conversion into active display currency (if different)
  const convertedToActive = convertBetweenCurrencies(
    hasPartialPayment ? remainingAmount : loan.amount,
    loanCurrency,
    activeCurrency,
    customRates
  );
  const showConvertedSubtitle = loanCurrency !== activeCurrency;

  // Exact card debt format
  const formattedDebt = formatCardDebt(loan.amount, loanCurrency, language);
  const formattedRemaining = formatCardDebt(remainingAmount, loanCurrency, language);
  const formattedPaid = formatCardDebt(paidAmount, loanCurrency, language);

  if (viewMode === 'compact') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-200 p-3.5 sm:p-4 flex items-center justify-between gap-3 btn-premium ${
          isNewlyAdded ? 'animate-card-drop ring-2 ring-emerald-400/50' : ''
        } ${
          isSettled
            ? 'bg-white/[0.02] border-white/[0.05] opacity-60'
            : isTheyOweMe
            ? 'glass-card border-emerald-500/30 hover:border-emerald-400/60'
            : 'glass-card border-rose-500/30 hover:border-rose-400/60'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-xl select-none shrink-0 drop-shadow">{currencyItem.flag}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 dir="auto" className={`text-sm font-bold truncate ${isSettled ? 'line-through text-slate-400' : 'text-white'}`}>
                {loan.personName}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                isTheyOweMe ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25' : 'bg-rose-400/10 text-rose-300 border-rose-400/25'
              }`}>
                {isTheyOweMe ? translations.theyOweMe : translations.iOweThem}
              </span>
            </div>
            {deadline && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[11px] font-mono ${deadline.glowClass}`}>
                  {deadline.label}
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full border ${deadline.badgeClass}`}>
                  {deadline.badge}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-end">
            <span className={`font-mono font-bold text-sm sm:text-base ${
              isSettled ? 'text-slate-400 line-through' : isTheyOweMe ? 'metallic-emerald' : 'metallic-rose'
            }`}>
              {hasPartialPayment ? formattedRemaining : formattedDebt}
            </span>
            {hasPartialPayment && (
              <span className="text-[10px] text-amber-300 block font-mono">
                {translations.paidSoFar}: {formattedPaid}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(loan)}
                title={translations.editLoan}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {!isSettled && isTheyOweMe && (
              <button
                type="button"
                onClick={() => onSendReminder(loan)}
                title={translations.sendReminder}
                className="p-2 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onToggleStatus(loan.id)}
              title={isSettled ? translations.markAsActive : translations.markAsSettled}
              className={`p-2 rounded-xl cursor-pointer transition-colors ${
                isSettled ? 'text-amber-400 hover:bg-amber-500/15' : 'text-slate-400 hover:text-emerald-400 hover:bg-white/[0.08]'
              }`}
            >
              {isSettled ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => onDelete(loan)}
              title={translations.deleteLoan}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Spacious High-End Visual Card
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 group ${
        isNewlyAdded ? 'animate-card-drop ring-2 ring-emerald-400/50' : ''
      } ${
        isSettled
          ? 'bg-white/[0.02] border-white/[0.05] opacity-70 hover:opacity-100'
          : isTheyOweMe
          ? 'glass-card border-emerald-500/25 hover:border-emerald-400/50 shadow-xl shadow-emerald-950/15'
          : 'glass-card border-rose-500/25 hover:border-rose-400/50 shadow-xl shadow-rose-950/15'
      }`}
    >
      {/* Delicate Gradient Top Accent Line */}
      <div
        className={`h-1 w-full ${
          isSettled
            ? 'bg-slate-700/60'
            : isTheyOweMe
            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_8px_#10B981]'
            : 'bg-gradient-to-r from-rose-500 via-pink-400 to-rose-600 shadow-[0_0_8px_#F43F5E]'
        }`}
      />

      {/* Subtle Ambient Glow in Card Corner */}
      <div
        className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10 transition-all ${
          isSettled
            ? 'opacity-0'
            : isTheyOweMe
            ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20'
            : 'bg-rose-500/10 group-hover:bg-rose-500/20'
        }`}
      />

      <div className="p-5 sm:p-6">
        {/* Row 1: Person, Direction Badge & Amount */}
        <div className="flex items-start justify-between gap-3.5 mb-4">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {/* Monogram Avatar with Currency Flag */}
            <div className="relative shrink-0">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm tracking-wider border shadow-md ${
                  isSettled
                    ? 'bg-white/[0.04] border-white/[0.08] text-slate-400'
                    : isTheyOweMe
                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-400/40 text-emerald-300 shadow-emerald-950/30'
                    : 'bg-gradient-to-br from-rose-500/20 to-pink-500/10 border-rose-400/40 text-rose-300 shadow-rose-950/30'
                }`}
              >
                {loan.personName.trim().slice(0, 2).toUpperCase()}
              </div>
              <span
                className="absolute -bottom-1 -end-1 text-xs bg-[#080B11] rounded-full px-1 py-0.5 border border-white/[0.1] shadow"
                title={`${currencyItem.flag} ${currencyItem.code}`}
              >
                {currencyItem.flag}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h4 className="text-base sm:text-lg font-bold text-white truncate" dir="auto" title={loan.personName}>
                  {loan.personName}
                </h4>
                {isSettled && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                    {translations.statusSettled}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isTheyOweMe
                      ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25'
                      : 'bg-rose-400/10 text-rose-300 border-rose-400/25'
                  }`}
                >
                  {isTheyOweMe ? (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span>
                    {isTheyOweMe ? translations.theyOweMe : translations.iOweThem}
                  </span>
                </span>
                {isOverdue && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {translations.overdue}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Amount Display with Glowing Metallic Accent */}
          <div className="text-end shrink-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
              {hasPartialPayment ? translations.remainingDebt : translations.totalDebt}
            </div>
            <div
              className={`text-lg sm:text-xl font-extrabold tracking-tight font-mono flex items-center justify-end gap-1 ${
                isSettled
                  ? 'text-slate-400 line-through'
                  : isTheyOweMe
                  ? 'metallic-emerald'
                  : 'metallic-rose'
              }`}
            >
              <span>{hasPartialPayment ? formattedRemaining : formattedDebt}</span>
            </div>
            {hasPartialPayment ? (
              <div className="text-[11px] text-slate-400 font-mono mt-1 flex flex-col items-end gap-0.5">
                <span className="text-slate-500">
                  {translations.originalDebt}: {formattedDebt}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/30">
                  {translations.paidSoFar}: {formattedPaid} ({progressPercent}%)
                </span>
              </div>
            ) : showConvertedSubtitle ? (
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                ≈ {formatCurrency(convertedToActive, language, activeCurrency)}
              </div>
            ) : null}
          </div>
        </div>

        {/* Progress Bar with Percentage Indicator */}
        <div className="my-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Percent className="w-3.5 h-3.5 text-slate-500" />
              <span>{translations.settlementProgress}</span>
            </span>
            <span
              className={`font-bold font-mono text-xs ${
                isSettled
                  ? 'text-emerald-400'
                  : progressPercent > 0
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {progressPercent}% {isSettled ? `(${translations.statusSettled})` : `(${translations.statusActive})`}
            </span>
          </div>
          {/* Track and Fill */}
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSettled
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                  : progressPercent > 0
                  ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                  : isTheyOweMe
                  ? 'bg-emerald-500/30'
                  : 'bg-rose-500/30'
              }`}
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Prominent Due Date Deadline Indicator Banner */}
        {deadline && (
          <div className={`my-3 p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${deadline.containerClass}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {deadline.level === 'overdue' || deadline.level === 'today' ? (
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 shadow-sm shadow-rose-500/20">
                  <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                </div>
              ) : deadline.level === 'urgent' ? (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-sm shadow-amber-500/20">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-slate-400 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="min-w-0">
                <span className={`text-xs font-mono tracking-tight block truncate ${deadline.glowClass}`}>
                  {deadline.label}
                </span>
              </div>
            </div>

            <span className={`text-[10px] px-2.5 py-1 rounded-xl border flex items-center gap-1 shrink-0 ${deadline.badgeClass}`}>
              {(deadline.level === 'overdue' || deadline.level === 'today' || deadline.level === 'urgent') && (
                <Clock className="w-2.5 h-2.5" />
              )}
              <span>{deadline.badge}</span>
            </span>
          </div>
        )}

        {/* Optional Metadata Details (phone, notes) */}
        {(loan.phone || loan.notes) && (
          <div className="py-2.5 my-1 border-t border-white/[0.06] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
            {loan.phone && (
              <div className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span dir="ltr">{loan.phone}</span>
              </div>
            )}
            {loan.notes && (
              <div className="flex items-center gap-1.5 w-full text-slate-300">
                <FileText className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                <span className="truncate">{loan.notes}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls Toolbar */}
        <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] mt-1">
          {/* Left action: Polite Reminder (for They Owe Me) */}
          <div>
            {isTheyOweMe && !isSettled ? (
              <button
                type="button"
                onClick={() => onSendReminder(loan)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-400/20 active:scale-95 transition-all shadow-sm cursor-pointer btn-premium"
                title={translations.sendReminder}
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>{translations.sendReminder}</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono">
                {translations.createdOn}: {loan.createdAt}
              </span>
            )}
          </div>

          {/* Right actions: Edit, Settled Toggle & Delete */}
          <div className="flex items-center gap-1.5">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(loan)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.03] hover:bg-white/[0.08] text-amber-300 border border-amber-400/25 transition-all cursor-pointer shadow-sm btn-premium"
                title={translations.editLoan}
                aria-label={`${translations.editLoan} ${loan.personName}`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{translations.editLoan}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleStatus(loan.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer btn-premium border ${
                isSettled
                  ? 'bg-white/[0.04] text-slate-300 border-white/[0.1] hover:text-white'
                  : 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25 hover:bg-emerald-400/20'
              }`}
              title={isSettled ? translations.markAsActive : translations.markAsSettled}
            >
              {isSettled ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">{translations.markAsActive}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{translations.markAsSettled}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDelete(loan)}
              aria-label={`${translations.deleteLoan} ${loan.personName}`}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer btn-premium"
              title={translations.deleteLoan}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
