import React from 'react';
import { Language, Translations } from '../types';
import { Plus, WalletCards, Settings, Bot, Sparkles, Menu } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  translations: Translations;
  onOpenAddModal: () => void;
  onOpenSettings: () => void;
  onOpenTutorial?: () => void;
  onOpenRateEditor?: () => void;
  onOpenAiAssistant?: () => void;
  onOpenDrawer?: () => void;
  isAiOpen?: boolean;
  iqdRate?: number;
  profileName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  translations,
  onOpenAddModal,
  onOpenSettings,
  onOpenAiAssistant,
  onOpenDrawer,
  isAiOpen,
  profileName,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080B11]/80 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Single Bar Layout (sm and up) */}
        <div className="hidden sm:flex h-20 items-center justify-between gap-4">
          {/* Brand & Logo + Hamburger Menu Button */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Classic Hamburger Menu Icon (3 horizontal lines) with hover lift */}
            {onOpenDrawer && (
              <button
                type="button"
                onClick={onOpenDrawer}
                aria-label={translations.hamburgerMenu || 'Navigation Menu'}
                title={translations.hamburgerMenu || 'Menu'}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-200 cursor-pointer shadow-sm shrink-0 flex items-center justify-center btn-premium"
              >
                <Menu className="w-5 h-5 text-slate-300 transition-colors" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
                <div className="h-full w-full bg-[#080B11] rounded-[14px] flex items-center justify-center">
                  <WalletCards className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-white truncate font-sans">
                    {translations.appName}
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/25 tracking-wider">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {profileName ? `${profileName} · ${translations.tagline}` : translations.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* AI Assistant Button */}
            {onOpenAiAssistant && (
              <button
                type="button"
                onClick={onOpenAiAssistant}
                aria-label={translations.aiAssistantTitle}
                title={translations.aiAssistantTitle}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border btn-premium ${
                  isAiOpen
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-bold shadow-lg shadow-emerald-400/25'
                    : 'bg-white/[0.03] text-emerald-300 border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'ar' ? 'المساعد الذكي' : 'AI Guide'}</span>
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 hidden md:inline" />
              </button>
            )}

            {/* Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label={translations.settingsTitle}
              title={translations.settingsTitle}
              className="flex items-center gap-1.5 p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] transition-all cursor-pointer shadow-sm text-xs font-medium btn-premium"
            >
              <Settings className="w-4 h-4 text-slate-400 hover:text-emerald-400 transition-colors" />
            </button>

            {/* Add New Loan Button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              aria-label={translations.addNewLoan}
              title={translations.addNewLoan}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer btn-premium"
            >
              <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span className="font-bold">{translations.addNewLoan}</span>
            </button>
          </div>
        </div>

        {/* Mobile Two-Tier Spacious Layout (sm:hidden) */}
        <div className="sm:hidden py-3 space-y-2.5">
          {/* Mobile Top Row: Logo & Title + Hamburger & Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Classic Hamburger Menu Icon for Mobile */}
              {onOpenDrawer && (
                <button
                  type="button"
                  onClick={onOpenDrawer}
                  aria-label={translations.hamburgerMenu || 'Navigation Menu'}
                  title={translations.hamburgerMenu || 'Menu'}
                  className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] active:scale-95 transition-all cursor-pointer shrink-0 flex items-center justify-center btn-premium"
                >
                  <Menu className="w-4 h-4 text-slate-300" />
                </button>
              )}
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[1.5px] shadow-md shadow-emerald-500/20 flex items-center justify-center shrink-0">
                <div className="h-full w-full bg-[#080B11] rounded-[9px] flex items-center justify-center">
                  <WalletCards className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold tracking-tight text-white truncate">
                    {translations.appName}
                  </h1>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                    PRO
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Header Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* AI Assistant Button */}
              {onOpenAiAssistant && (
                <button
                  type="button"
                  onClick={onOpenAiAssistant}
                  aria-label={translations.aiAssistantTitle}
                  title={translations.aiAssistantTitle}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border btn-premium ${
                    isAiOpen
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-bold shadow-md shadow-emerald-400/20'
                      : 'bg-white/[0.04] text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px]">{language === 'ar' ? 'الذكاء' : 'AI'}</span>
                </button>
              )}

              {/* Settings Button */}
              <button
                type="button"
                onClick={onOpenSettings}
                aria-label={translations.settingsTitle}
                title={translations.settingsTitle}
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-colors btn-premium"
              >
                <Settings className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Mobile Bottom Row: Single Comprehensive Add New Loan Button */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={onOpenAddModal}
              aria-label={translations.addNewLoan}
              title={translations.addNewLoan}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 active:scale-[0.98] transition-all shadow-md shadow-emerald-500/20 border border-emerald-300/30 btn-premium"
            >
              <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{translations.addNewLoan}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
