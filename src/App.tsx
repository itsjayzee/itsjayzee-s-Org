/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CurrencyCode, Language, Loan, LoanType, ChatSession, ChatMessage, UserSettings, ThemeMode, FontSize, CustomRates } from './types';
import { translations, calculateTotals, defaultSettings, DEFAULT_RATES, CURRENCIES } from './utils/loanLogic';
import { playMoneyChime, playSettleChime, playSadChime } from './utils/soundEffects';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { CurrencyTicker } from './components/CurrencyTicker';
import { DashboardStats } from './components/DashboardStats';
import { EmptyState } from './components/EmptyState';
import { LoanCard } from './components/LoanCard';
import { AddLoanModal } from './components/AddLoanModal';
import { EditLoanModal } from './components/EditLoanModal';
import { ReminderModal } from './components/ReminderModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SettingsModal } from './components/SettingsModal';
import { BudgetAiFAB } from './components/BudgetAiFAB';
import { MarketRateEditorModal } from './components/MarketRateEditorModal';
import { TutorialModal } from './components/TutorialModal';
import { MoneyParticleEffect, ParticleAnimationType } from './components/MoneyParticleEffect';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, CheckCircle2, ListFilter, Check, Sparkles, Bell } from 'lucide-react';
import { registerNotificationServiceWorker, checkAndNotifyDueTodayLoans, showPoliteDueDateNotification } from './utils/notificationService';

const STORAGE_KEY = 'loan_budget_items_v2';
const SETTINGS_KEY = 'loan_budget_settings_v3';
const CHAT_SESSIONS_KEY = 'loan_budget_chat_sessions_v3';
const CUSTOM_RATES_KEY = 'loan_budget_custom_rates_v1';

export default function App() {
  // 1. Unified User Settings State
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      }
      // Migrate legacy individual preferences if present
      const legacyLang = localStorage.getItem('loan_budget_lang_pref');
      const legacyCurr = localStorage.getItem('loan_budget_currency_pref');
      const legacyTheme = localStorage.getItem('loan_budget_theme_pref');
      const legacyProf = localStorage.getItem('loan_budget_profile_pref');
      return {
        ...defaultSettings,
        language: legacyLang === 'ar' || legacyLang === 'en' ? legacyLang : defaultSettings.language,
        currency: (['USD', 'IQD', 'EUR', 'TRY', 'IRR'].includes(legacyCurr || '') ? legacyCurr : defaultSettings.currency) as CurrencyCode,
        theme: legacyTheme === 'light' || legacyTheme === 'emerald' || legacyTheme === 'dark' ? legacyTheme : defaultSettings.theme,
        profileName: legacyProf || defaultSettings.profileName,
      };
    } catch {
      return defaultSettings;
    }
  });

  // Partial settings updater
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Synchronize document direction and language attribute
  useEffect(() => {
    const isRtl = settings.language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  const t = translations[settings.language];

  // 2. Strict empty-state start: NO random mock data on initial load!
  // List ONLY populates when manually added via UI.
  const [loans, setLoans] = useState<Loan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return []; // Empty initial state as requested
  });

  // Persist loans in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
    } catch {
      // ignore
    }
  }, [loans]);

  // Automated Due Date Push Notification System (iOS, Android & Web)
  useEffect(() => {
    registerNotificationServiceWorker();
    if (settings.pushNotificationsEnabled) {
      checkAndNotifyDueTodayLoans(loans, settings.language);
    }
  }, [loans, settings.pushNotificationsEnabled, settings.language]);

  // 3. Chat Sessions State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_SESSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    // Initial default session
    return [
      {
        id: 'sess_' + Date.now(),
        title: settings.language === 'ar' ? 'محادثة المساعد المالي' : 'Budget Guide Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: 'msg_welcome',
            sender: 'assistant',
            text:
              settings.language === 'ar'
                ? 'مرحباً بك! أنا مرشد الميزانية الذكي (Budget AI Guide). كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن كيفية تسجيل الديون، أو تحليل استراتيجيات السداد (Snowball / Avalanche)، أو رفع صورة إيصال، أو الضغط على زر الميكروفون للتحدث معي صوتياً.'
                : 'Hello! I am your Budget AI Guide. How can I help you today? You can ask me how to manage your loans, plan repayment strategies (Snowball / Avalanche), upload receipt photos, or press the microphone to talk with me directly.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return chatSessions[0]?.id || 'sess_default';
  });

  // Persist sessions unless in incognito mode
  useEffect(() => {
    if (settings.incognitoMode) return;
    try {
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(chatSessions));
    } catch {
      // ignore
    }
  }, [chatSessions, settings.incognitoMode]);

  const activeSession = useMemo(() => {
    return chatSessions.find((s) => s.id === activeSessionId) || chatSessions[0];
  }, [chatSessions, activeSessionId]);

  const handleUpdateSessionMessages = (messages: ChatMessage[]) => {
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        // Derive dynamic session title from first user query if still generic
        let updatedTitle = s.title;
        const firstUserMsg = messages.find((m) => m.sender === 'user');
        if (firstUserMsg && (s.title.includes('Session') || s.title.includes('محادثة'))) {
          updatedTitle = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
        }
        return {
          ...s,
          title: updatedTitle,
          messages,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: 'sess_' + Date.now(),
      title: settings.language === 'ar' ? `محادثة جديدة #${chatSessions.length + 1}` : `New Chat #${chatSessions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_' + Date.now(),
          sender: 'assistant',
          text:
            settings.language === 'ar'
              ? 'أهلاً بك في جلسة جديدة! كيف أستطيع خدمتك في ميزانيتك اليوم؟'
              : 'Welcome to a fresh session! What financial question can I help you explore today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    setChatSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const fresh: ChatSession = {
          id: 'sess_' + Date.now(),
          title: settings.language === 'ar' ? 'محادثة المساعد المالي' : 'Budget Guide Session',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleClearAllSessions = () => {
    const fresh: ChatSession = {
      id: 'sess_' + Date.now(),
      title: settings.language === 'ar' ? 'محادثة جديدة' : 'New Chat Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setChatSessions([fresh]);
    setActiveSessionId(fresh.id);
    try {
      localStorage.removeItem(CHAT_SESSIONS_KEY);
    } catch {
      // ignore
    }
  };

  // Toast banner for AI loan addition
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Custom Rates state (e.g. Iraqi Dinar parallel market rate ~1,515 IQD)
  const [customRates, setCustomRates] = useState<CustomRates>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_RATES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_RATES, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_RATES;
  });

  // Persist custom rates
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_RATES_KEY, JSON.stringify(customRates));
    } catch {
      // ignore
    }
  }, [customRates]);

  // Modal & Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRateEditorOpen, setIsRateEditorOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [reminderLoan, setReminderLoan] = useState<Loan | null>(null);
  const [deleteTargetLoan, setDeleteTargetLoan] = useState<Loan | null>(null);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [newlyAddedLoanId, setNewlyAddedLoanId] = useState<string | null>(null);

  // Floating cash / sadness animation trigger state
  const [particleTrigger, setParticleTrigger] = useState<{ key: number; type: ParticleAnimationType }>({
    key: 0,
    type: 'they_owe',
  });

  const triggerMoneyAnimation = (type: ParticleAnimationType) => {
    setParticleTrigger({ key: Date.now(), type });
  };

  // Filter & Search states
  const [filterType, setFilterType] = useState<'all' | 'they_owe_me' | 'i_owe_them' | 'settled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dashboard Totals calculation with active currency normalization & breakdown with custom rates
  const totals = useMemo(
    () => calculateTotals(loans, settings.currency, customRates),
    [loans, settings.currency, customRates]
  );

  // Add Loan handler (Comprehensive single flow with mandatory due date and cascading drop-in entrance)
  const handleAddLoan = (data: {
    personName: string;
    amount: number;
    type: LoanType;
    currency?: CurrencyCode;
    dueDate?: string;
    phone?: string;
    notes?: string;
  }) => {
    const loanCurrency = data.currency || settings.currency;
    const newLoan: Loan = {
      id: 'loan_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      personName: data.personName,
      amount: data.amount,
      type: data.type,
      currency: loanCurrency,
      dueDate: data.dueDate,
      phone: data.phone,
      notes: data.notes,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setLoans((prev) => [newLoan, ...prev]);
    setNewlyAddedLoanId(newLoan.id);

    // Auto clear newly added status after animation completes
    setTimeout(() => {
      setNewlyAddedLoanId((curr) => (curr === newLoan.id ? null : curr));
    }, 3800);

    // Celebration or sad animation
    if (data.type === 'i_owe_them') {
      playSadChime(settings.soundEffectsEnabled);
      triggerMoneyAnimation('i_owe');
    } else {
      playMoneyChime(settings.soundEffectsEnabled);
      triggerMoneyAnimation('they_owe');
    }
  };

  // Add loan directly from AI suggestion / receipt extraction
  const handleAddLoanFromAi = (data: {
    personName: string;
    amount: number;
    type: LoanType;
    currency?: CurrencyCode;
    notes?: string;
  }) => {
    handleAddLoan(data);
    const usedCurr = data.currency || settings.currency;
    showToast(
      settings.language === 'ar'
        ? `تمت إضافة ${data.personName} (${data.amount} ${usedCurr}) بنجاح إلى سجلاتك!`
        : `Added ${data.personName} (${data.amount} ${usedCurr}) to your dashboard!`
    );
  };

  // Toggle active/settled status
  const handleToggleStatus = (id: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const newStatus = l.status === 'active' ? 'settled' : 'active';
        if (newStatus === 'settled') {
          playSettleChime(settings.soundEffectsEnabled);
          triggerMoneyAnimation('settle');
        } else if (l.type === 'i_owe_them') {
          playSadChime(settings.soundEffectsEnabled);
          triggerMoneyAnimation('i_owe');
        } else {
          playMoneyChime(settings.soundEffectsEnabled);
          triggerMoneyAnimation('they_owe');
        }
        return {
          ...l,
          status: newStatus,
          settledAt: newStatus === 'settled' ? new Date().toISOString().split('T')[0] : undefined,
        };
      })
    );
  };

  // Update loan (person details, notes, or partial / full repayment)
  const handleUpdateLoan = (updated: Loan) => {
    setLoans((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (updated.status === 'settled' && (!editingLoan || editingLoan.status !== 'settled')) {
      playSettleChime(settings.soundEffectsEnabled);
      triggerMoneyAnimation('settle');
    } else if (updated.type === 'i_owe_them') {
      playSadChime(settings.soundEffectsEnabled);
      triggerMoneyAnimation('i_owe');
    } else {
      playMoneyChime(settings.soundEffectsEnabled);
      triggerMoneyAnimation('they_owe');
    }
    showToast(
      settings.language === 'ar'
        ? `تم تحديث وتوثيق سداد ${updated.personName} بنجاح!`
        : `Updated payment & details for ${updated.personName}!`
    );
  };

  // Delete single loan
  const handleDeleteLoan = (id: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== id));
  };

  // Danger zone: Clear All Data
  const handleClearAllData = () => {
    setLoans([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Import backup from JSON file
  const handleImportBackup = (data: { loans?: any[]; settings?: Partial<UserSettings> }) => {
    if (data.loans && Array.isArray(data.loans)) {
      setLoans(data.loans);
    }
    if (data.settings) {
      handleUpdateSettings(data.settings);
    }
    showToast(
      settings.language === 'ar'
        ? 'تم استيراد النسخة الاحتياطية واستعادة البيانات بنجاح!'
        : 'Backup imported and data restored successfully!'
    );
  };

  // Active loans due today for instant awareness & 1-tap polite reminder
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const loansDueToday = useMemo(() => {
    return loans.filter((l) => l.status === 'active' && l.dueDate === todayStr);
  }, [loans, todayStr]);

  // Filtered, searched and sorted list
  const filteredLoans = useMemo(() => {
    const list = loans.filter((loan) => {
      // Filter tab
      if (filterType === 'they_owe_me' && (loan.type !== 'they_owe_me' || loan.status === 'settled')) {
        return false;
      }
      if (filterType === 'i_owe_them' && (loan.type !== 'i_owe_them' || loan.status === 'settled')) {
        return false;
      }
      if (filterType === 'settled' && loan.status !== 'settled') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = loan.personName.toLowerCase().includes(q);
        const matchesNotes = loan.notes?.toLowerCase().includes(q);
        const matchesPhone = loan.phone?.toLowerCase().includes(q);
        if (!matchesName && !matchesNotes && !matchesPhone) {
          return false;
        }
      }

      return true;
    });

    // Apply sort order
    return [...list].sort((a, b) => {
      switch (settings.sortOrder) {
        case 'oldest':
          return (a.createdAt || '').localeCompare(b.createdAt || '');
        case 'highest_amount':
          return b.amount - a.amount;
        case 'due_soonest': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        case 'name_asc':
          return a.personName.localeCompare(b.personName);
        case 'newest':
        default:
          return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
    });
  }, [loans, filterType, searchQuery, settings.sortOrder]);

  // Dynamic Theme & Font classes
  const themeContainerClass = useMemo(() => {
    switch (settings.theme) {
      case 'light':
        return 'theme-light bg-[#F8FAFC] text-[#0B1120]';
      case 'emerald':
        return 'theme-emerald bg-[#04120D] text-[#ECFDF5]';
      case 'sapphire':
        return 'theme-sapphire bg-[#050B17] text-[#F0F9FF]';
      case 'amethyst':
        return 'theme-amethyst bg-[#0D071A] text-[#FAF5FF]';
      case 'sunset':
        return 'theme-sunset bg-[#14070F] text-[#FFF1F2]';
      case 'custom':
        return 'theme-custom bg-[#080B11] text-[#F9FAFB]';
      case 'dark':
      default:
        return 'theme-dark bg-[#080B11] text-[#F3F5F9]';
    }
  }, [settings.theme]);

  const fontSizeClass = useMemo(() => {
    switch (settings.fontSize) {
      case 'small':
        return 'font-size-small';
      case 'large':
        return 'font-size-large';
      case 'medium':
      default:
        return 'font-size-medium';
    }
  }, [settings.fontSize]);

  return (
    <div
      dir={settings.language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative ${themeContainerClass} ${fontSizeClass} ${
        settings.language === 'ar' ? 'font-arabic' : ''
      }`}
    >
      {/* Sophisticated Ambient Mesh Glow Orbs (Subtle deep lighting) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-emerald-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] bg-indigo-500/[0.03] rounded-full blur-[140px]" />
      </div>
      {/* Dynamic Custom Background Layer (Uploads, Grids, Auroras & Wallpapers) */}
      {settings.customBgImage && (
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              settings.customBgImage.startsWith('data:') ||
              settings.customBgImage.startsWith('http') ||
              settings.customBgImage.startsWith('blob:')
                ? `url("${settings.customBgImage}")`
                : settings.customBgImage,
            opacity: settings.bgOpacity ?? 0.15,
            filter: settings.bgBlur ? `blur(${settings.bgBlur}px)` : undefined,
          }}
          aria-hidden="true"
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold shadow-xl shadow-emerald-500/20 text-xs sm:text-sm">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header with Hamburger Menu, Dollar in IQD changer, Tutorial, Settings ⚙️, Quick Loan & Add New */}
      <Header
        language={settings.language}
        onLanguageChange={(lang: Language) => handleUpdateSettings({ language: lang })}
        translations={t}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenRateEditor={() => setIsRateEditorOpen(true)}
        onOpenAiAssistant={() => setIsAiOpen((prev) => !prev)}
        isAiOpen={isAiOpen}
        iqdRate={customRates.IQD}
        profileName={settings.profileName}
      />

      {/* Main Content Area with generous mobile breathing space */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-32 sm:pb-24 space-y-5 sm:space-y-6">
        {/* 2. Expanded Currency Widget with Realistic Rates & Flags (🇺🇸 USD, 🇮🇶 IQD, 🇪🇺 EUR, 🇹🇷 TRY, 🇮🇷 IRR) */}
        <CurrencyTicker
          activeCurrency={settings.currency}
          onSelectCurrency={(cur: CurrencyCode) => handleUpdateSettings({ currency: cur })}
          language={settings.language}
          translations={t}
          customRates={customRates}
        />

        {/* Due Today Alert Banner with 1-Tap Polite Due Date Push Notification */}
        {loansDueToday.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-[#0D121F]/85 to-amber-500/5 backdrop-blur-2xl border border-amber-500/25 shadow-xl shadow-amber-950/20 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
                  <Bell className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide">
                    {settings.language === 'ar'
                      ? `تنبيه: لديك ${loansDueToday.length} ديون مستحقة اليوم!`
                      : `Reminder: You have ${loansDueToday.length} payment(s) due today!`}
                  </p>
                  <p className="text-[11px] text-amber-400/80 mt-0.5 font-medium">
                    {loansDueToday.map((l) => l.personName).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={async () => {
                    let sent = 0;
                    for (const l of loansDueToday) {
                      const ok = await showPoliteDueDateNotification(l, settings.language);
                      if (ok) sent++;
                    }
                    showToast(
                      settings.language === 'ar'
                        ? `تم إرسال إشعار تذكير أنيق لـ (${sent}) سداد مستحق!`
                        : `Sent polite due date push notification for (${sent}) payment(s)!`
                    );
                  }}
                  className="btn-premium px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 fill-slate-950" />
                  <span>
                    {settings.language === 'ar' ? 'إرسال إشعار فوري' : 'Send Push Reminder'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Dashboard Stats (Separated calculations with activeCurrency, customRates and Privacy Masking) */}
        <DashboardStats
          totals={totals}
          language={settings.language}
          translations={t}
          activeCurrency={settings.currency}
          customRates={customRates}
          maskBalances={settings.maskBalances}
          onToggleMask={() => handleUpdateSettings({ maskBalances: !settings.maskBalances })}
        />

        {/* 4. Empty State if loans array is empty */}
        {loans.length === 0 ? (
          <EmptyState
            translations={t}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div>
            {/* Search and Filters Bar with comfortable touch targets */}
            <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
              {/* Filter Tabs - Sleek segmented pill bar */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0D121F]/80 backdrop-blur-xl border border-white/[0.07] shadow-inner overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`btn-premium flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-white/10 text-white shadow-sm border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>{t.filterAll}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-mono">
                    {loans.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('they_owe_me')}
                  className={`btn-premium flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filterType === 'they_owe_me'
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.filterTheyOwe}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    {totals.activeTheyOweCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('i_owe_them')}
                  className={`btn-premium flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filterType === 'i_owe_them'
                      ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-sm shadow-rose-500/10'
                      : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.filterIOwe}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                    {totals.activeIOweCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('settled')}
                  className={`btn-premium flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filterType === 'settled'
                      ? 'bg-white/10 text-white shadow-sm border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.filterSettled}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-mono">
                    {totals.settledCount}
                  </span>
                </button>
              </div>

              {/* Search input with glowing obsidian styling */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full ps-10 pe-3.5 py-2.5 rounded-2xl bg-[#0D121F]/80 backdrop-blur-xl border border-white/[0.08] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Loans Grid */}
            {filteredLoans.length === 0 ? (
              <div className="p-12 text-center rounded-3xl glass-card">
                <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">
                  {settings.language === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No records match your filter'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredLoans.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    language={settings.language}
                    translations={t}
                    activeCurrency={settings.currency}
                    customRates={customRates}
                    viewMode={settings.viewMode}
                    isNewlyAdded={loan.id === newlyAddedLoanId}
                    onEdit={(l) => setEditingLoan(l)}
                    onSendReminder={(l) => setReminderLoan(l)}
                    onToggleStatus={handleToggleStatus}
                    onDelete={(l) => setDeleteTargetLoan(l)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 text-center text-xs text-slate-500">
        <p className="tracking-wide">
          {t.appName} &bull; {settings.language === 'ar' ? 'نظام مالي ذكي فائق الدقة والأمان' : 'Ultra-Precise & Private Personal Debt Intelligence'}
        </p>
      </footer>

      {/* Floating Cash Movement & Celebration Particles */}
      <MoneyParticleEffect triggerKey={particleTrigger.key} type={particleTrigger.type} />

      {/* 5. In-App AI Assistant (Budget AI Guide FAB & Chat with Voice, Receipts, Multi-Personality) */}
      <BudgetAiFAB
        language={settings.language}
        translations={t}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        activeSession={activeSession}
        onUpdateSessionMessages={handleUpdateSessionMessages}
        onNewSession={handleNewSession}
        allLoans={loans}
        onAddLoanFromAi={handleAddLoanFromAi}
        customRates={customRates}
        isExternalOpen={isAiOpen}
        onToggleExternalOpen={setIsAiOpen}
      />

      {/* 6. Comprehensive Add Loan Modal (Mandatory Due Date, Spring Physics, Emerald/Rose Accents) */}
      <AddLoanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLoan={handleAddLoan}
        translations={t}
        language={settings.language}
        defaultCurrency={settings.currency}
      />

      {/* 7. Smart Reminders & Social Sharing Modal (WhatsApp, Telegram, Viber) */}
      <ReminderModal
        isOpen={!!reminderLoan}
        onClose={() => setReminderLoan(null)}
        loan={reminderLoan}
        language={settings.language}
        translations={t}
        activeCurrency={settings.currency}
      />

      {/* 8. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetLoan}
        onClose={() => setDeleteTargetLoan(null)}
        loan={deleteTargetLoan}
        onConfirm={handleDeleteLoan}
        translations={t}
      />

      {/* 9. Advanced Settings Modal (Dashboard with 4 tabs, AI Controls, History, Privacy & Data) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        chatSessions={chatSessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        onClearAllData={handleClearAllData}
        onImportBackup={handleImportBackup}
        allLoans={loans}
        translations={t}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        onOpenTutorial={() => {
          setIsSettingsOpen(false);
          setIsTutorialOpen(true);
        }}
        onOpenAddModal={() => {
          setIsSettingsOpen(false);
          setIsAddModalOpen(true);
        }}
        onOpenRateEditor={() => {
          setIsSettingsOpen(false);
          setIsRateEditorOpen(true);
        }}
        customRates={customRates}
      />

      {/* 10. Dollar Market Price Editor Modal (change 1 USD in Iraqi IQD, TRY, EUR, IRR) */}
      <MarketRateEditorModal
        isOpen={isRateEditorOpen}
        onClose={() => setIsRateEditorOpen(false)}
        customRates={customRates}
        onSaveRates={(newRates) => setCustomRates(newRates)}
        onResetRates={() => setCustomRates(DEFAULT_RATES)}
        language={settings.language}
        translations={t}
      />

      {/* 11. Illustrated Guide / Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        language={settings.language}
        translations={t}
        onOpenAddLoan={() => {
          setIsTutorialOpen(false);
          setIsAddModalOpen(true);
        }}
        onOpenAiAssistant={() => {
          setIsTutorialOpen(false);
          setIsAiOpen(true);
        }}
        onOpenRateEditor={() => {
          setIsTutorialOpen(false);
          setIsRateEditorOpen(true);
        }}
      />

      {/* 12. Edit & Partial Repayment Modal (pay half 50%, quarter 25%, 75%, 100% or custom) */}
      <EditLoanModal
        isOpen={!!editingLoan}
        onClose={() => setEditingLoan(null)}
        loan={editingLoan}
        onSaveLoan={handleUpdateLoan}
        language={settings.language}
        translations={t}
        customRates={customRates}
      />

      {/* 13. Sleek Navigation Drawer (Hamburger Menu, RTL/LTR Adaptive) */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        language={settings.language}
        onLanguageChange={(lang) => handleUpdateSettings({ language: lang })}
        translations={t}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenRateEditor={() => setIsRateEditorOpen(true)}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        onFilterChange={(filter) => {
          setFilterType(filter);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        loansCount={{
          active: totals.activeTheyOweCount + totals.activeIOweCount,
          theyOwe: totals.activeTheyOweCount,
          iOwe: totals.activeIOweCount,
          settled: totals.settledCount,
        }}
        netBalance={totals.netBalance}
        currencySymbol={CURRENCIES.find((c) => c.code === settings.currency)?.symbol || '$'}
      />
    </div>
  );
}
