import React, { useEffect } from 'react';
import { Language, Translations, UserSettings, ThemeMode } from '../types';
import {
  X,
  WalletCards,
  LayoutDashboard,
  Plus,
  Bot,
  TrendingUp,
  BookOpen,
  Settings,
  FileSpreadsheet,
  Globe,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Palette,
  ShieldCheck,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  translations: Translations;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenAddModal: () => void;
  onOpenSettings: (tab?: 'general' | 'preferences' | 'ai' | 'guide' | 'history' | 'privacy') => void;
  onOpenTutorial: () => void;
  onOpenRateEditor: () => void;
  onOpenAiAssistant: () => void;
  onFilterChange?: (filter: 'all' | 'they_owe_me' | 'i_owe_them' | 'settled') => void;
  loansCount: {
    active: number;
    theyOwe: number;
    iOwe: number;
    settled: number;
  };
  netBalance: number;
  currencySymbol: string;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  translations,
  settings,
  onUpdateSettings,
  onOpenAddModal,
  onOpenSettings,
  onOpenTutorial,
  onOpenRateEditor,
  onOpenAiAssistant,
  onFilterChange,
  loansCount,
  netBalance,
  currencySymbol,
}) => {
  const isRtl = language === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  // Close on Escape key press & prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    onClose();
    setTimeout(() => {
      callback();
    }, 180);
  };

  const themeOptions: { id: ThemeMode; labelEn: string; labelAr: string; color: string }[] = [
    { id: 'dark', labelEn: 'Obsidian', labelAr: 'داكن', color: '#10B981' },
    { id: 'light', labelEn: 'Pure Light', labelAr: 'فاتح', color: '#F59E0B' },
    { id: 'emerald', labelEn: 'Emerald', labelAr: 'زمردي', color: '#059669' },
    { id: 'sapphire', labelEn: 'Sapphire', labelAr: 'ياقوت', color: '#3B82F6' },
    { id: 'amethyst', labelEn: 'Amethyst', labelAr: 'جمشت', color: '#8B5CF6' },
    { id: 'sunset', labelEn: 'Sunset', labelAr: 'غروب', color: '#F43F5E' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={translations.navDrawerTitle}
    >
      {/* Blurred Obsidian Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-[#04060A]/70 backdrop-blur-2xl transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container - Buttery-smooth easing with directional anchoring */}
      <div
        className={`fixed inset-y-0 ${
          isRtl ? 'right-0' : 'left-0'
        } w-[88vw] max-w-sm sm:max-w-md bg-[#0A0E18]/95 backdrop-blur-3xl text-slate-100 border-x border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col z-10 transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform translate-x-0`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.07] bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
              <div className="h-full w-full bg-[#080B11] rounded-[14px] flex items-center justify-center">
                <WalletCards className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {translations.appName}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/25 font-bold tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {translations.navDrawerSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={translations.closeDrawer}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer btn-premium"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
          {/* User Financial Snapshot Glass Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-lg shadow-black/30 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold truncate">
                {settings.profileName || (isRtl ? 'المحفظة المالية' : 'Executive Portfolio')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? 'آمن ومحلي' : '100% Private'}</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {translations.netPosition}
                </p>
                <p className={`text-2xl font-extrabold font-mono tracking-tight mt-0.5 ${
                  netBalance >= 0 ? 'metallic-emerald' : 'metallic-rose'
                }`}>
                  {netBalance >= 0 ? '+' : '-'}
                  {Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencySymbol}
                </p>
              </div>
              <div className="text-end">
                <p className="text-[11px] text-slate-400 font-medium">
                  {translations.activeLoansCount}
                </p>
                <p className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                  {loansCount.active}
                </p>
              </div>
            </div>

            {/* Quick Segmented Filter Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => handleAction(() => onFilterChange?.('they_owe_me'))}
                className="p-2 rounded-xl bg-emerald-500/[0.08] hover:bg-emerald-500/[0.15] border border-emerald-500/25 text-emerald-300 text-center transition-all cursor-pointer btn-premium"
              >
                <div className="font-extrabold font-mono text-sm">{loansCount.theyOwe}</div>
                <div className="text-[10px] text-emerald-400/90 truncate mt-0.5">
                  {isRtl ? 'تحصيل' : 'Receivable'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAction(() => onFilterChange?.('i_owe_them'))}
                className="p-2 rounded-xl bg-rose-500/[0.08] hover:bg-rose-500/[0.15] border border-rose-500/25 text-rose-300 text-center transition-all cursor-pointer btn-premium"
              >
                <div className="font-extrabold font-mono text-sm">{loansCount.iOwe}</div>
                <div className="text-[10px] text-rose-400/90 truncate mt-0.5">
                  {isRtl ? 'التزام' : 'Payable'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAction(() => onFilterChange?.('settled'))}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-center transition-all cursor-pointer btn-premium"
              >
                <div className="font-extrabold font-mono text-sm">{loansCount.settled}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {isRtl ? 'مسدد' : 'Settled'}
                </div>
              </button>
            </div>
          </div>

          {/* Section: Primary Actions */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              {isRtl ? 'العمليات السريعة' : 'Primary Actions'}
            </p>

            <button
              type="button"
              onClick={() => handleAction(() => onFilterChange?.('all'))}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.07] text-slate-200 hover:text-white transition-all cursor-pointer text-xs font-semibold btn-premium group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <span>{translations.navDashboard}</span>
              </div>
              <ChevronIcon className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>


            <button
              type="button"
              onClick={() => handleAction(onOpenAddModal)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all cursor-pointer text-xs font-bold shadow-lg shadow-emerald-500/20 btn-premium group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-700/50 flex items-center justify-center text-slate-950">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <span>{translations.navAddLoan}</span>
              </div>
              <ChevronIcon className="w-4 h-4 text-slate-950/70" />
            </button>
          </div>

          {/* Section: Intelligence & Tools */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              {isRtl ? 'الأدوات والمساعد الذكي' : 'Tools & Intelligence'}
            </p>

            <button
              type="button"
              onClick={() => handleAction(onOpenAiAssistant)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.07] text-slate-200 hover:text-white transition-all cursor-pointer text-xs font-medium btn-premium group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-slate-100">{translations.navAiAssistant}</div>
                  <div className="text-[10px] text-slate-400">
                    {isRtl ? 'مستشار سداد وقارئ الفواتير' : 'Payoff strategies & receipts'}
                  </div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={() => handleAction(onOpenRateEditor)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.07] text-slate-200 hover:text-white transition-all cursor-pointer text-xs font-medium btn-premium group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-slate-100">{translations.navMarketRates}</div>
                  <div className="text-[10px] text-slate-400">
                    {isRtl ? 'تعديل صرف الدولار مقابل الدينار' : 'Live USD / IQD ticker & editor'}
                  </div>
                </div>
              </div>
              <ChevronIcon className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              type="button"
              onClick={() => handleAction(onOpenTutorial)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.07] text-slate-200 hover:text-white transition-all cursor-pointer text-xs font-medium btn-premium group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-400/10 border border-purple-400/25 flex items-center justify-center text-purple-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-slate-100">{translations.navTutorial}</div>
                  <div className="text-[10px] text-slate-400">
                    {isRtl ? 'شرح مصور تفاعلي لكيفية الاستخدام' : 'Visual step-by-step walk-through'}
                  </div>
                </div>
              </div>
              <ChevronIcon className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              type="button"
              onClick={() => handleAction(() => onOpenSettings('general'))}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.07] text-slate-200 hover:text-white transition-all cursor-pointer text-xs font-medium btn-premium group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center text-emerald-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-slate-100">{translations.navExport}</div>
                  <div className="text-[10px] text-slate-400">
                    {isRtl ? 'كشف حساب رسمي PDF أو جدول CSV' : 'Official statements & Excel CSV'}
                  </div>
                </div>
              </div>
              <ChevronIcon className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>
          </div>

          {/* Section: Themes & Palette */}
          <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>{translations.themeSectionTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => handleAction(() => onOpenSettings('general'))}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer font-semibold"
              >
                {isRtl ? 'تخصيص كامل' : 'Customize'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: th.id })}
                  className={`p-2.5 rounded-xl text-center border text-[11px] font-semibold transition-all cursor-pointer btn-premium ${
                    settings.theme === th.id
                      ? 'border-emerald-400 bg-white/[0.08] text-emerald-300 ring-1 ring-emerald-400/40 shadow-sm font-bold'
                      : 'border-white/[0.06] text-slate-400 hover:border-white/[0.15] bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {th.id === 'light' ? (
                      <Sun className="w-3 h-3 text-amber-400" />
                    ) : (
                      <Moon className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{isRtl ? th.labelAr : th.labelEn}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Language Switcher */}
          <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'لغة الواجهة' : 'Language'}</span>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'ar'
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                عربي
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-white/[0.07] bg-white/[0.02] shrink-0">
          <button
            type="button"
            onClick={() => handleAction(() => onOpenSettings('general'))}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold border border-white/[0.1] transition-all cursor-pointer btn-premium"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>{translations.navSettings}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
