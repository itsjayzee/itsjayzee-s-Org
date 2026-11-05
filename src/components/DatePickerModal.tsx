import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, X, Check } from 'lucide-react';
import { Language, LoanType } from '../types';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  loanType?: LoanType;
  language: Language;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  loanType = 'they_owe_me',
  language,
}) => {
  const isAr = language === 'ar';

  // Initialize view year & month from selectedDate or today
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear() || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth() ?? new Date().getMonth());
  const [tempDate, setTempDate] = useState<string>(selectedDate || new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const weekdayNamesEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const weekdayNamesAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  const currentMonthName = isAr ? monthNamesAr[viewMonth] : monthNamesEn[viewMonth];
  const currentWeekdays = isAr ? weekdayNamesAr : weekdayNamesEn;

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const days: { day: number; currentMonth: boolean; dateStr: string }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 12 : viewMonth;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ day: d, currentMonth: false, dateStr });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const m = viewMonth + 1;
    const dateStr = `${viewYear}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({ day: i, currentMonth: true, dateStr });
  }

  // Next month leading days to complete full 35 or 42 grid
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= (remainingCells >= 7 ? remainingCells - 7 : remainingCells); i++) {
    const m = viewMonth === 11 ? 1 : viewMonth + 2;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({ day: i, currentMonth: false, dateStr });
  }

  // Quick preset shortcuts
  const applyPreset = (daysToAdd: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysToAdd);
    const dateStr = target.toISOString().split('T')[0];
    setTempDate(dateStr);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
  };

  const handleConfirm = () => {
    onSelectDate(tempDate);
    onClose();
  };

  const isEmerald = loanType === 'they_owe_me';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0D121F]/98 backdrop-blur-2xl border border-white/[0.09] shadow-2xl overflow-hidden text-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06] bg-[#080B11]/70">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-md ${
                isEmerald
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-rose-500/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 id="calendar-picker-title" className="text-sm font-bold text-white tracking-wide">
                {isAr ? 'تحديد تاريخ استحقاق الدين' : 'Debt Due Date'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {tempDate ? tempDate : todayStr}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Calendar"
            className="btn-premium p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets Carousel */}
        <div className="p-3 border-b border-white/[0.05] bg-[#080B11]/40">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            <button
              type="button"
              onClick={() => applyPreset(1)}
              className="btn-premium px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-all shrink-0"
            >
              {isAr ? 'غداً (+1)' : 'Tomorrow (+1d)'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(7)}
              className="btn-premium px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-all shrink-0"
            >
              {isAr ? 'أسبوع (+7)' : 'In 7 Days'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(15)}
              className="btn-premium px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-all shrink-0"
            >
              {isAr ? '١٥ يوماً (+15)' : 'In 15 Days'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(30)}
              className={`btn-premium px-2.5 py-1 rounded-xl border text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
                isEmerald
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5 inline me-1" />
              {isAr ? 'شهر (+30)' : 'In 30 Days'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(60)}
              className="btn-premium px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-all shrink-0"
            >
              {isAr ? 'شهران (+60)' : 'In 60 Days'}
            </button>
          </div>
        </div>

        {/* Month & Year Navigation */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            type="button"
            onClick={isAr ? handleNextMonth : handlePrevMonth}
            aria-label="Previous Month"
            className="btn-premium p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
            {currentMonthName} {viewYear}
          </span>
          <button
            type="button"
            onClick={isAr ? handlePrevMonth : handleNextMonth}
            aria-label="Next Month"
            className="btn-premium p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="px-4 pb-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {currentWeekdays.map((wd, idx) => (
              <span key={idx} className="text-[11px] font-bold text-slate-400">
                {wd}
              </span>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((item, idx) => {
              const isSelected = item.dateStr === tempDate;
              const isToday = item.dateStr === todayStr;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTempDate(item.dateStr)}
                  className={`btn-premium aspect-square rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${
                    isSelected
                      ? isEmerald
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/30 scale-105 z-10 ring-2 ring-emerald-400/50'
                        : 'bg-gradient-to-tr from-rose-500 to-pink-400 text-slate-950 font-extrabold shadow-lg shadow-rose-500/30 scale-105 z-10 ring-2 ring-rose-400/50'
                      : item.currentMonth
                      ? 'text-slate-200 hover:bg-white/10 hover:text-white'
                      : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.04]'
                  } ${isToday && !isSelected ? 'border border-amber-400/50 text-amber-300' : ''}`}
                >
                  <span>{item.day}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3.5 border-t border-white/[0.06] bg-[#080B11]/70">
          <button
            type="button"
            onClick={() => {
              setTempDate(todayStr);
              setViewYear(new Date().getFullYear());
              setViewMonth(new Date().getMonth());
            }}
            className="btn-premium px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            {isAr ? 'اليوم' : 'Today'}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-premium px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`btn-premium flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer ${
                isEmerald
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-rose-500 to-pink-400 text-slate-950 shadow-rose-500/25'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isAr ? 'تأكيد التاريخ' : 'Set Due Date'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
