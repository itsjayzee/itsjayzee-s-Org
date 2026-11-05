import React, { useState, useRef } from 'react';
import {
  AiCreativity,
  AiPersonality,
  AiResponseLength,
  ChatSession,
  CurrencyCode,
  FontSize,
  Language,
  ThemeMode,
  Translations,
  UserSettings,
} from '../types';
import {
  CURRENCIES,
  exportAppDataJson,
  importAppDataJson,
  exportLoansToCsv,
  exportLoansToPdfPrint,
  calculateTotals,
  BACKGROUND_PRESETS,
  compressImageFile,
} from '../utils/loanLogic';
import {
  requestPushPermission,
  showPoliteDueDateNotification,
  getNotificationPermission,
} from '../utils/notificationService';
import {
  Settings,
  X,
  User,
  Sun,
  Moon,
  Globe,
  Coins,
  AlertOctagon,
  Check,
  Trash2,
  Bot,
  MessageSquare,
  Shield,
  Sliders,
  Type,
  Download,
  Upload,
  Volume2,
  Sparkles,
  Layers,
  RotateCcw,
  BookOpen,
  DollarSign,
  TrendingUp,
  Zap,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Calendar,
  ArrowUpDown,
  Smartphone,
  LayoutGrid,
  List,
  Bell,
  FileSpreadsheet,
  Printer,
  Table,
  Palette,
  Image as ImageIcon,
  SlidersHorizontal,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  chatSessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions: () => void;
  onClearAllData: () => void;
  onImportBackup: (data: { loans?: any[]; settings?: Partial<UserSettings> }) => void;
  allLoans: any[];
  translations: Translations;
  onOpenAiAssistant?: () => void;
  onOpenTutorial?: () => void;
  onOpenAddModal?: () => void;
  onOpenRateEditor?: () => void;
  customRates?: import('../types').CustomRates;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  chatSessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onClearAllSessions,
  onClearAllData,
  onImportBackup,
  allLoans,
  translations,
  onOpenAiAssistant,
  onOpenTutorial,
  onOpenAddModal,
  onOpenRateEditor,
  customRates,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'preferences' | 'ai' | 'guide' | 'history' | 'privacy'>('general');
  const [guideStep, setGuideStep] = useState(0);
  const [profileNameInput, setProfileNameInput] = useState(settings.profileName);
  const [customPromptInput, setCustomPromptInput] = useState(settings.customInstructions);
  const [savedNotice, setSavedNotice] = useState(false);
  const [exportScope, setExportScope] = useState<'all' | 'active' | 'settled' | 'they_owe_me' | 'i_owe_them'>('all');
  const [notificationPermissionState, setNotificationPermissionState] = useState<string>(() => getNotificationPermission());
  const [testNotificationToast, setTestNotificationToast] = useState(false);
  const [showClearChatsConfirm, setShowClearChatsConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [bgUploadNotice, setBgUploadNotice] = useState<string | null>(null);

  const handleCustomBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1600, 0.78);
      onUpdateSettings({
        customBgImage: dataUrl,
        bgOpacity: settings.bgOpacity || 0.15,
        bgBlur: settings.bgBlur || 0,
      });
      setBgUploadNotice(translations.bgUploadSuccess);
      setTimeout(() => setBgUploadNotice(null), 3000);
    } catch {
      alert(translations.bgUploadTooLarge);
    }
  };

  const handleTestPushNotification = async () => {
    const perm = await requestPushPermission();
    setNotificationPermissionState(perm);
    if (perm === 'granted') {
      const sampleLoan = allLoans[0] || {
        id: 'test_sample',
        personName: settings.language === 'ar' ? 'أحمد العراقي' : 'Alex Morgan',
        amount: 250,
        paidAmount: 0,
        currency: settings.currency,
        type: 'they_owe_me',
        status: 'active',
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
      };
      await showPoliteDueDateNotification(sampleLoan, settings.language);
      setTestNotificationToast(true);
      setTimeout(() => setTestNotificationToast(false), 3000);
    } else {
      alert(translations.notificationPermissionDenied);
    }
  };

  if (!isOpen) return null;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      profileName: profileNameInput.trim(),
      customInstructions: customPromptInput.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleExportBackup = () => {
    const jsonStr = exportAppDataJson(allLoans, settings);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LoanBudget_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importAppDataJson(content);
      if (imported) {
        onImportBackup(imported);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2000);
      } else {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isAr = settings.language === 'ar';

  const guideSteps = [
    {
      id: 'currency',
      icon: DollarSign,
      title: isAr ? '١. تسجيل الديون بالعملات المتعددة' : '1. Multi-Currency Debt Records',
      badge: 'USD, IQD, EUR, TRY, IRR',
      summary: isAr
        ? 'سجّل كل دين بعملته الحقيقية (دينار عراقي، دولار أمريكي، ليرة تركية، يورو، وتومان إيراني) مع إظهار العلم والرمز.'
        : 'Track debts in their actual transaction currency (USD, IQD, EUR, TRY, IRR) with flag badges and live conversion.',
      points: [
        isAr ? 'اختر العملة بسهولة من القائمة المنسدلة عند إضافة سلفة جديدة.' : 'Pick currency during debt entry.',
        isAr ? 'تُعرض بطاقة الشخص بالعملة الأصلية مثل (🇮🇶 1,500,000 IQD).' : 'Cards display the exact borrowed currency.',
        isAr ? 'تحويل فوري يحسب مجموع ديونك وصافي ثروتك بالعملة الافتراضية.' : 'Live conversion computes total net position in your active currency.',
      ],
      actionLabel: isAr ? 'إضافة سلفة جديدة ➕' : 'Add Debt Record ➕',
      actionHandler: () => {
        onClose();
        onOpenAddModal?.();
      },
    },
    {
      id: 'rate',
      icon: TrendingUp,
      title: isAr ? '٢. تعديل سعر صرف الدولار الحقيقي (العراق)' : '2. Real Dollar Market Rate (IQD)',
      badge: isAr ? 'سعر السوق الموازي' : 'Parallel Market Rate',
      summary: isAr
        ? 'عدّل سعر صرف الدولار يدوياً ليتطابق فوراً مع بورصة الكفاح وأسواق الصرافة (مثل 1,485 أو 1,515 دينار).'
        : 'Adjust the live 1 USD exchange rate to match street and parallel market prices in real time.',
      points: [
        isAr ? 'اضغط على زر سعر الصرف في الأعلى أو من شريط العملات.' : 'Tap the rate badge in the header or currency ticker.',
        isAr ? 'حدد السعر الحقيقي بدقة وتُحفظ التعديلات في متصفحك.' : 'Set the street price and changes persist locally.',
        isAr ? 'تُحدَّث بطاقات الديون والأرقام الإجمالية فورياً دون أخطاء.' : 'Cards and totals update automatically with zero calculation distortion.',
      ],
      actionLabel: isAr ? 'تعديل سعر الدولار ✏️' : 'Edit Dollar Rate ✏️',
      actionHandler: () => {
        onClose();
        onOpenRateEditor?.();
      },
    },
    {
      id: 'duedate',
      icon: Calendar,
      title: isAr ? '٣. تاريخ الاستحقاق الإلزامي ومتابعة المواعيد' : '3. Due Dates & Deadline Tracking',
      badge: isAr ? 'تنبيه ذكي < 3 أيام' : 'Smart Glow < 3 Days',
      summary: isAr
        ? 'تحديد موعد استحقاق إلزامي لكل دين مع منتقي تقويم عصري ومؤشر ملون متوهج عند اقتراب الأجل.'
        : 'Mandatory due date for every record with a modern dark calendar picker and glowing urgency indicators.',
      points: [
        isAr ? 'حقل استحقاق إلزامي لك وللآخرين مع أزرار سريعة للأيام القادمة.' : 'Mandatory due date field with quick presets (+7d, +15d, +30d).',
        isAr ? 'توهج برتقالي هادئ عندما يتبقى أقل من ٣ أيام، وأحمر للمتأخرات واليوم.' : 'Soft orange glow when due in <3 days, red glow for overdue & due today.',
        isAr ? 'سداد جزئي مرن (50%، 25%) مع شريط إنجاز مئوي وتحديث فوري.' : 'Flexible partial repayments (50%, 25%) with visual progress bars.',
      ],
      actionLabel: isAr ? 'إضافة سجل دين ➕' : 'Add Debt Record ➕',
      actionHandler: () => {
        onClose();
        onOpenAddModal?.();
      },
    },
    {
      id: 'reminders',
      icon: MessageSquare,
      title: isAr ? '٤. تذكيرات واتساب وتيليجرام الذكية' : '4. Smart WhatsApp & Social Reminders',
      badge: 'WhatsApp, Telegram, Viber',
      summary: isAr
        ? 'أنشئ رسائل تذكير مهذبة ومجهزة بالاسم والمبلغ والعملة وأرسلها عبر الواتساب مباشرة.'
        : 'Draft relationship-friendly reminder messages and share via WhatsApp, Telegram, or Viber in 1 tap.',
      points: [
        isAr ? '٣ نبرات مدروسة: ودية، رسمية، أو مستعجلة وحازمة.' : '3 calibrated tones: Friendly, Professional, Urgent.',
        isAr ? 'تتضمن الرسالة المبلغ المتبقي الدقيق وتاريخ الاستحقاق.' : 'Auto-embeds person name, exact remaining debt, and due date.',
        isAr ? 'تفتح تطبيق المراسلة مباشرة مع الرسالة المكتوبة وجاهزة للإرسال.' : 'Directly opens the messaging app with the text pre-filled.',
      ],
      actionLabel: isAr ? 'عرض الدليل الشامل 📖' : 'View Full Guide 📖',
      actionHandler: () => {
        onClose();
        onOpenTutorial?.();
      },
    },
    {
      id: 'ai',
      icon: Bot,
      title: isAr ? '٥. المساعد المالي الذكي (ذكاء مخصص)' : '5. Smart Budget AI Assistant',
      badge: 'Gemini 3.8 AI & Math',
      summary: isAr
        ? 'يجيب عن أي سؤال بخصوص ديونك، من يطلبك، العمليات الحسابية والنسب المئوية، ويدعم التحدث بالصوت.'
        : 'Answers any question about who owes you, calculates percentages (e.g. 20% of 1.5M), and supports voice dialogue.',
      points: [
        isAr ? 'اسأله عن أي شخص (مثلاً: "شكد يطلبني مصطفى؟") ليجيبك فوراً.' : 'Ask about specific people (e.g., "What is Mustafa\'s balance?").',
        isAr ? 'حاسبة مالية ذكية تفهم النسب والتقسيط والميزانيات.' : 'Instant math calculations, percentages, and installment timelines.',
        isAr ? 'إمكانية إرفاق صور الفواتير والإيصالات وإضافتها بضغطة واحدة.' : 'Upload receipt images to auto-extract and log loans in 1 click.',
      ],
      actionLabel: isAr ? 'محادثة المساعد الذكي 🤖' : 'Chat with AI 🤖',
      actionHandler: () => {
        onClose();
        onOpenAiAssistant?.();
      },
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0D121F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-[#080B11]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#080B11] rounded-[14px] flex items-center justify-center">
                <Settings className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 id="settings-dashboard-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2 tracking-wide">
                <span>{translations.settingsTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  v3.0 PRO
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {translations.settingsSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="btn-premium p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex items-center border-b border-white/[0.06] bg-[#080B11]/40 px-3 overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'general'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{translations.tabGeneral}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{translations.tabPreferences}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              New
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'ai'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{translations.tabAiControls}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{translations.tabGuide}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Interactive
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{translations.tabChatHistory}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
              {chatSessions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{translations.tabPrivacySecurity}</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {savedNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{translations.settingsSaved}</span>
            </div>
          )}

          {/* TAB 1: GENERAL & APPEARANCE */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* 1. Language & Layout Direction (Moved to Top as requested) */}
              <section className="space-y-2.5 p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>{settings.language === 'ar' ? 'لغة التطبيق واتجاه الواجهة (RTL / LTR)' : 'Application Language & Layout'}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold">
                    {settings.language === 'ar' ? 'العربية نشطة' : 'English Active'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ language: 'en' })}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      settings.language === 'en'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">🇺🇸</span>
                    <span>English (LTR)</span>
                    {settings.language === 'en' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ language: 'ar' })}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      settings.language === 'ar'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">🇮🇶</span>
                    <span>العربية (RTL)</span>
                    {settings.language === 'ar' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              </section>

              {/* Profile Name */}
              <section className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>{translations.profileSection}</span>
                </div>
                <form onSubmit={handleSaveGeneral} className="flex gap-2.5">
                  <input
                    type="text"
                    value={profileNameInput}
                    onChange={(e) => setProfileNameInput(e.target.value)}
                    placeholder={translations.namePlaceholder}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    {translations.saveSettings}
                  </button>
                </form>
              </section>

              {/* Full Theme Customization: Dark, Light, & Custom Color Themes */}
              <section className="space-y-3.5 border-t border-slate-800/80 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Palette className="w-4 h-4 text-emerald-400" />
                    <span>{translations.themeSectionTitle}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                    {settings.theme}
                  </span>
                </div>

                {/* Theme Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {/* 1. Dark Mode */}
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.theme === 'dark'
                        ? 'bg-slate-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20 shadow-md font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Moon className="w-5 h-5 mx-auto mb-1.5 text-emerald-400" />
                    <span className="text-xs block">{translations.themeDark}</span>
                    <span className="text-[9px] text-slate-500 block">Fintech Slate</span>
                  </button>

                  {/* 2. Light Mode */}
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'light' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.theme === 'light'
                        ? 'bg-slate-200 border-emerald-500 text-slate-950 ring-2 ring-emerald-500/20 shadow-md font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Sun className="w-5 h-5 mx-auto mb-1.5 text-amber-500" />
                    <span className="text-xs block">{translations.themeLight}</span>
                    <span className="text-[9px] text-slate-500 block">Clean White</span>
                  </button>

                  {/* 3. Emerald Glow */}
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'emerald' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.theme === 'emerald'
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/30 shadow-md font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-emerald-400" />
                    <span className="text-xs block">{translations.themeEmerald}</span>
                    <span className="text-[9px] text-emerald-500/70 block">Forest Radiance</span>
                  </button>

                  {/* 4. Sapphire Navy */}
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'sapphire' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.theme === 'sapphire'
                        ? 'bg-blue-950/60 border-blue-400 text-blue-200 ring-2 ring-blue-400/30 shadow-md font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-5 h-5 mx-auto mb-1.5 rounded-full bg-blue-500/30 border border-blue-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                    <span className="text-xs block">{translations.themeSapphire}</span>
                    <span className="text-[9px] text-blue-400/70 block">Oceanic Deep</span>
                  </button>

                  {/* 5. Amethyst Purple */}
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'amethyst' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.theme === 'amethyst'
                        ? 'bg-purple-950/60 border-purple-400 text-purple-200 ring-2 ring-purple-400/30 shadow-md font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-5 h-5 mx-auto mb-1.5 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                    </div>
                    <span className="text-xs block">{translations.themeAmethyst}</span>
                    <span className="text-[9px] text-purple-400/70 block">Royal Obsidian</span>
                  </button>

                  {/* 6. Cyber Sunset */}
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'sunset' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.theme === 'sunset'
                        ? 'bg-rose-950/60 border-rose-400 text-rose-200 ring-2 ring-rose-400/30 shadow-md font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-5 h-5 mx-auto mb-1.5 rounded-full bg-rose-500/30 border border-rose-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-rose-400" />
                    </div>
                    <span className="text-xs block">{translations.themeSunset}</span>
                    <span className="text-[9px] text-rose-400/70 block">Ember Glow</span>
                  </button>

                  {/* 7. Custom Accent Color Theme */}
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'custom' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.theme === 'custom'
                        ? 'bg-slate-950 border-amber-400 text-amber-300 ring-2 ring-amber-400/30 shadow-md font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-5 h-5 mx-auto mb-1.5 rounded-full shadow-sm border border-white/30"
                      style={{ backgroundColor: settings.customThemeColor || '#10b981' }}
                    />
                    <span className="text-xs block">{translations.themeCustom}</span>
                    <span className="text-[9px] text-slate-500 block">Personalized</span>
                  </button>
                </div>

                {/* Custom Color Swatches & Native Picker (Active when custom or general accent) */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      {translations.customAccentColorLabel}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {settings.customThemeColor || '#10b981'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { hex: '#10b981', label: 'Emerald' },
                      { hex: '#06b6d4', label: 'Cyan' },
                      { hex: '#3b82f6', label: 'Sapphire' },
                      { hex: '#8b5cf6', label: 'Purple' },
                      { hex: '#ec4899', label: 'Pink' },
                      { hex: '#f43f5e', label: 'Rose' },
                      { hex: '#f59e0b', label: 'Amber' },
                      { hex: '#84cc16', label: 'Lime' },
                    ].map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() =>
                          onUpdateSettings({
                            customThemeColor: swatch.hex,
                            theme: 'custom',
                          })
                        }
                        title={swatch.label}
                        aria-label={swatch.label}
                        className={`w-7 h-7 rounded-full transition-transform active:scale-95 cursor-pointer flex items-center justify-center border ${
                          settings.customThemeColor === swatch.hex
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 border-white'
                            : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {settings.customThemeColor === swatch.hex && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        )}
                      </button>
                    ))}

                    {/* Exact Color Picker */}
                    <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="color"
                        value={settings.customThemeColor || '#10b981'}
                        onChange={(e) =>
                          onUpdateSettings({
                            customThemeColor: e.target.value,
                            theme: 'custom',
                          })
                        }
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[11px]">Picker</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Custom Background Image & Wallpapers */}
              <section className="space-y-3.5 border-t border-slate-800/80 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>{translations.bgCustomizerTitle}</span>
                  </div>
                  {settings.customBgImage && (
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ customBgImage: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer transition-colors"
                    >
                      {translations.removeBg}
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {translations.bgCustomizerDesc}
                </p>

                {bgUploadNotice && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{bgUploadNotice}</span>
                  </div>
                )}

                {/* Background Preset Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BACKGROUND_PRESETS.map((preset) => {
                    const isSelected =
                      (preset.id === 'none' && !settings.customBgImage) ||
                      settings.customBgImage === preset.cssValue;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          onUpdateSettings({
                            customBgImage: preset.cssValue,
                            bgOpacity: settings.bgOpacity || 0.15,
                            bgBlur: settings.bgBlur || 0,
                          })
                        }
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-slate-900 shadow-md'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
                        }`}
                      >
                        {/* Mini preview box */}
                        <div
                          className={`w-full h-12 rounded-xl mb-2 flex items-center justify-center transition-transform group-hover:scale-[1.02] ${preset.previewBg}`}
                        >
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-200 block truncate">
                          {settings.language === 'ar' ? preset.nameAr : preset.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Upload Custom Image Button */}
                <div className="pt-1">
                  <input
                    ref={bgFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomBgUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bgFileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/50 transition-all text-xs font-bold cursor-pointer shadow-sm group"
                  >
                    <Upload className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>{translations.uploadCustomBg}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      (PNG, JPG, WebP)
                    </span>
                  </button>
                </div>

                {/* Opacity & Blur Sliders (Active when a custom wallpaper or preset is loaded) */}
                {settings.customBgImage && (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 animate-in fade-in">
                    {/* Opacity Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">
                          {translations.bgOpacityLabel}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {Math.round((settings.bgOpacity ?? 0.15) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.45"
                        step="0.01"
                        value={settings.bgOpacity ?? 0.15}
                        onChange={(e) =>
                          onUpdateSettings({ bgOpacity: parseFloat(e.target.value) })
                        }
                        className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                      />
                      <p className="text-[10px] text-slate-500">
                        {settings.language === 'ar'
                          ? 'تحكم في شفافية الخلفية للحفاظ على وضوح نصوص وسجلات الديون بنسبة 100%.'
                          : 'Balances background visibility while maintaining high contrast for cards and text.'}
                      </p>
                    </div>

                    {/* Blur Slider */}
                    <div className="space-y-1.5 border-t border-slate-900 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">
                          {translations.bgBlurLabel}
                        </span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {settings.bgBlur ?? 0}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="16"
                        step="1"
                        value={settings.bgBlur ?? 0}
                        onChange={(e) =>
                          onUpdateSettings({ bgBlur: parseInt(e.target.value, 10) })
                        }
                        className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                      />
                      <p className="text-[10px] text-slate-500">
                        {settings.language === 'ar'
                          ? 'تأثير ضبابي فخم وناعم لمنع تشتيت الانتباه أثناء مراجعة الحسابات.'
                          : 'Adds a soft frosted-glass blur so detailed photos do not distract from figures.'}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Font Size Scaling */}
              <section className="space-y-2.5 border-t border-slate-800/80 pt-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Type className="w-4 h-4 text-cyan-400" />
                  <span>{translations.fontSizeLabel}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: size })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        settings.fontSize === size
                          ? 'bg-slate-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {size === 'small' && translations.fontSmall}
                      {size === 'medium' && translations.fontMedium}
                      {size === 'large' && translations.fontLarge}
                    </button>
                  ))}
                </div>
              </section>

              {/* Sound Effects & Celebration Chimes */}
              <section className="border-t border-slate-800/80 pt-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>{translations.soundEffectsLabel}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{translations.soundEffectsDesc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ soundEffectsEnabled: !settings.soundEffectsEnabled })}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                    settings.soundEffectsEnabled ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.soundEffectsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </section>

              {/* Preferred Currency */}
              <section className="space-y-2.5 border-t border-slate-800/80 pt-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{translations.preferredCurrency}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => onUpdateSettings({ currency: curr.code })}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        settings.currency === curr.code
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-base select-none">{curr.flag}</span>
                        <span>{curr.code}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Interactive App Guide Section */}
              <section className="space-y-3 border-t border-slate-800/80 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>{translations.interactiveGuideTitle}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                    {settings.language === 'ar' ? 'تفاعلي 📖' : 'Interactive 📖'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300 font-medium">
                      {translations.interactiveGuideDesc}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {settings.language === 'ar'
                        ? '٥ خطوات مصورة وسريعة لإتقان كافة ميزات التطبيق والعملات.'
                        : '5 interactive steps to master multi-currency debts, parallel rates, and AI calculations.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('guide')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>{translations.launchInteractiveGuide}</span>
                    </button>
                    {onOpenTutorial && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenTutorial();
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
                        title={settings.language === 'ar' ? 'عرض الدليل الكامل في نافذة مستقلة' : 'Open Full Walkthrough Modal'}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden xs:inline">{settings.language === 'ar' ? 'نافذة كاملة' : 'Modal'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB: APP PREFERENCES (NEW SETTINGS) */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 1. Privacy Shield: Mask Sensitive Balances */}
              <section className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      {settings.maskBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{translations.maskBalancesLabel}</span>
                        {settings.maskBalances && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {translations.maskBalancesDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ maskBalances: !settings.maskBalances })}
                    role="switch"
                    aria-checked={settings.maskBalances}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.maskBalances ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.maskBalances ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                {/* Live Privacy Simulation */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-sans text-[11px]">Preview:</span>
                  <span className="font-bold text-indigo-300">
                    {settings.maskBalances ? '••••••••' : '$1,485.00 USD'}
                  </span>
                </div>
              </section>

              {/* AUTOMATED DUE DATE PUSH NOTIFICATIONS (iOS & Android) */}
              <section className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/30 space-y-3.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{translations.pushNotificationsLabel}</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                          iOS & Android
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {translations.pushNotificationsDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!settings.pushNotificationsEnabled) {
                        const perm = await requestPushPermission();
                        setNotificationPermissionState(perm);
                        onUpdateSettings({ pushNotificationsEnabled: true });
                      } else {
                        onUpdateSettings({ pushNotificationsEnabled: false });
                      }
                    }}
                    role="switch"
                    aria-checked={settings.pushNotificationsEnabled}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.pushNotificationsEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.pushNotificationsEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Template Message Preview */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{settings.language === 'ar' ? 'صيغة الإشعار المهذبة المعتمدة:' : 'Official Polite Due Message Template:'}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Status: {notificationPermissionState}</span>
                  </div>
                  <blockquote className="p-2.5 rounded-lg bg-slate-900 border-l-2 rtl:border-l-0 rtl:border-r-2 border-amber-400 text-slate-300 italic text-xs leading-relaxed">
                    &ldquo;{translations.politeDueTodayReminder}&rdquo;
                  </blockquote>
                </div>

                {/* Test Push Notification Button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    {settings.language === 'ar' ? 'اختبر ظهور الإشعار الفوري على جهازك' : 'Verify instant push delivery on this device'}
                  </span>
                  <button
                    type="button"
                    onClick={handleTestPushNotification}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95 transition-all cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{translations.testNotificationBtn}</span>
                  </button>
                </div>

                {testNotificationToast && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{translations.notificationSentToast}</span>
                  </div>
                )}
              </section>

              {/* 2. Default Due Date on New Loans */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{translations.defaultDuePeriodLabel}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: translations.duePeriodNone },
                    { id: '7days', label: translations.duePeriod7Days },
                    { id: '14days', label: translations.duePeriod14Days },
                    { id: '30days', label: translations.duePeriod30Days },
                    { id: '60days', label: translations.duePeriod60Days },
                  ].map((item) => {
                    const isSelected = (settings.defaultDuePeriod || 'none') === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onUpdateSettings({ defaultDuePeriod: item.id as any })}
                        className={`p-3 rounded-xl border text-xs font-semibold text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 3. Default Reminder Message Tone */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{translations.defaultReminderToneLabel}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'friendly',
                      label: translations.toneFriendly,
                      desc: settings.language === 'ar' ? 'أخوية وودية دافئة' : 'Warm, polite & relaxed',
                      icon: '🤝',
                    },
                    {
                      id: 'formal',
                      label: translations.toneFormal,
                      desc: settings.language === 'ar' ? 'مهنية ورسمية محترمة' : 'Professional & business-like',
                      icon: '💼',
                    },
                    {
                      id: 'urgent',
                      label: translations.toneUrgent,
                      desc: settings.language === 'ar' ? 'حازمة وسريعة السداد' : 'Direct & deadline-focused',
                      icon: '⚡',
                    },
                  ].map((tone) => {
                    const isSelected = (settings.defaultReminderTone || 'friendly') === tone.id;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => onUpdateSettings({ defaultReminderTone: tone.id as any })}
                        className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base select-none">{tone.icon}</span>
                          <span className="text-xs font-bold text-slate-100">{tone.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 ms-auto" />}
                        </div>
                        <p className="text-[11px] text-slate-400">{tone.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 4. Debt Cards Display Density & Layout */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <LayoutGrid className="w-4 h-4 text-emerald-400" />
                  <span>{translations.viewModeLabel}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'spacious',
                      label: translations.viewModeSpacious,
                      desc: settings.language === 'ar' ? 'بطاقات عريضة مع أشرطة السداد وتفاصيل الاتصال' : 'Full cards with progress bars and quick actions',
                      icon: LayoutGrid,
                    },
                    {
                      id: 'compact',
                      label: translations.viewModeCompact,
                      desc: settings.language === 'ar' ? 'قائمة مكثفة ومدمجة لمشاهدة عدد أكبر من الديون' : 'Dense slim rows to view multiple debts on one screen',
                      icon: List,
                    },
                  ].map((mode) => {
                    const isSelected = (settings.viewMode || 'spacious') === mode.id;
                    const IconComp = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => onUpdateSettings({ viewMode: mode.id as any })}
                        className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-100">{mode.label}</h5>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{mode.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 5. Default Loan Sorting Order */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <ArrowUpDown className="w-4 h-4 text-emerald-400" />
                  <span>{translations.sortOrderLabel}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'newest', label: translations.sortNewest },
                    { id: 'oldest', label: translations.sortOldest },
                    { id: 'highest_amount', label: translations.sortHighest },
                    { id: 'due_soonest', label: translations.sortDueSoonest },
                    { id: 'name_asc', label: translations.sortNameAsc },
                  ].map((s) => {
                    const isSelected = (settings.sortOrder || 'newest') === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onUpdateSettings({ sortOrder: s.id as any })}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{s.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 6 & 7: Animations and Haptics Toggles */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-800/80 pt-5">
                {/* Money & Confetti Particle Effects */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-100">{translations.animationsLabel}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{translations.animationsDesc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ animationsEnabled: !settings.animationsEnabled })}
                    role="switch"
                    aria-checked={settings.animationsEnabled}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.animationsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.animationsEnabled ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Haptic Vibration */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-100">{translations.hapticsLabel}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{translations.hapticsDesc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ hapticFeedback: !settings.hapticFeedback })}
                    role="switch"
                    aria-checked={settings.hapticFeedback}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.hapticFeedback ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.hapticFeedback ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: AI CONTROLS */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              {/* Quick AI Launch Card */}
              {onOpenAiAssistant && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{translations.aiAssistantTitle}</h4>
                      <p className="text-[11px] text-slate-400">{translations.tagline}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAiAssistant();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{settings.language === 'ar' ? 'فتح المحادثة 💬' : 'Open Chat 💬'}</span>
                  </button>
                </div>
              )}

              {/* AI Personality Selection */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>{translations.aiPersonalityLabel}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'diplomat' as AiPersonality,
                      title: translations.personalityDiplomat,
                      desc: translations.personalityDiplomatDesc,
                      emoji: '🤝',
                    },
                    {
                      id: 'auditor' as AiPersonality,
                      title: translations.personalityAuditor,
                      desc: translations.personalityAuditorDesc,
                      emoji: '📊',
                    },
                    {
                      id: 'friend' as AiPersonality,
                      title: translations.personalityFriend,
                      desc: translations.personalityFriendDesc,
                      emoji: '🤗',
                    },
                    {
                      id: 'advisor' as AiPersonality,
                      title: translations.personalityAdvisor,
                      desc: translations.personalityAdvisorDesc,
                      emoji: '💡',
                    },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onUpdateSettings({ aiPersonality: p.id })}
                      className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                        settings.aiPersonality === p.id
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-xs text-white">
                          <span className="text-base">{p.emoji}</span>
                          <span>{p.title}</span>
                        </div>
                        {settings.aiPersonality === p.id && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </section>

              {/* Response Length */}
              <section className="space-y-2.5 border-t border-slate-800/80 pt-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>{translations.responseLengthLabel}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['short', 'medium', 'long'] as AiResponseLength[]).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => onUpdateSettings({ responseLength: len })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        settings.responseLength === len
                          ? 'bg-slate-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {len === 'short' && translations.lengthShort}
                      {len === 'medium' && translations.lengthMedium}
                      {len === 'long' && translations.lengthLong}
                    </button>
                  ))}
                </div>
              </section>

              {/* Creativity & Reasoning */}
              <section className="space-y-2.5 border-t border-slate-800/80 pt-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{translations.creativityLabel}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['precise', 'balanced', 'creative'] as AiCreativity[]).map((cr) => (
                    <button
                      key={cr}
                      type="button"
                      onClick={() => onUpdateSettings({ creativity: cr })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        settings.creativity === cr
                          ? 'bg-slate-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cr === 'precise' && translations.creativityPrecise}
                      {cr === 'balanced' && translations.creativityBalanced}
                      {cr === 'creative' && translations.creativityCreative}
                    </button>
                  ))}
                </div>
              </section>

              {/* Custom AI Instructions */}
              <section className="space-y-2.5 border-t border-slate-800/80 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{translations.customInstructionsLabel}</span>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={customPromptInput}
                  onChange={(e) => setCustomPromptInput(e.target.value)}
                  placeholder={translations.customInstructionsPlaceholder}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={handleSaveGeneral}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
                >
                  {translations.saveSettings}
                </button>
              </section>

              {/* Voice Response Toggle */}
              <section className="border-t border-slate-800/80 pt-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <span>{translations.autoVoiceLabel}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{translations.autoVoiceDesc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ autoVoiceResponse: !settings.autoVoiceResponse })}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                    settings.autoVoiceResponse ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.autoVoiceResponse ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </section>

              {/* Reset Chat on Exit Toggle ("me reset chats when u go out just ai chat") */}
              <section className="border-t border-slate-800/80 pt-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    <span>{translations.resetChatOnExitLabel}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{translations.resetChatOnExitDesc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ resetChatOnExit: !settings.resetChatOnExit })}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                    settings.resetChatOnExit ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.resetChatOnExit ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </section>
            </div>
          )}

          {/* TAB: INTERACTIVE APP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Header with Step Tracker */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      {translations.interactiveGuideTitle}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {settings.language === 'ar' ? `الخطوة ${guideStep + 1} من ${guideSteps.length}` : `Step ${guideStep + 1} of ${guideSteps.length}`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {translations.interactiveGuideDesc}
                </p>

                {/* Progress Bar Track */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${((guideStep + 1) / guideSteps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Navigation Pill Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {guideSteps.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setGuideStep(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      guideStep === idx
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{s.badge}</span>
                  </button>
                ))}
              </div>

              {/* Active Step Showcase Card */}
              {(() => {
                const step = guideSteps[guideStep];
                const StepIcon = step.icon;
                return (
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-xl space-y-4">
                    {/* Step Title & Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-white">{step.title}</h4>
                          <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-0.5 border border-emerald-500/20">
                            {step.badge}
                          </span>
                        </div>
                      </div>

                      {/* Step Action Button */}
                      {step.actionHandler && (
                        <button
                          type="button"
                          onClick={step.actionHandler}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-md shadow-emerald-600/25 transition-all cursor-pointer shrink-0"
                        >
                          <span>{step.actionLabel}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {step.summary}
                    </p>

                    {/* Key Capabilities List */}
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      {step.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Step-specific Interactive Simulation Widget */}
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                      {guideStep === 0 && (
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="text-xs text-slate-400">
                            {settings.language === 'ar' ? 'عملتك المفضلة الحالية:' : 'Active Lending Currency:'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {CURRENCIES.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => onUpdateSettings({ currency: c.code })}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  settings.currency === c.code
                                    ? 'bg-emerald-500 text-slate-950 font-bold'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {c.flag} {c.code}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {guideStep === 1 && (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇮🇶</span>
                            <div>
                              <div className="text-xs font-bold text-white">
                                1 USD = {customRates?.IQD?.toLocaleString() || '1,485'} IQD
                              </div>
                              <span className="text-[10px] text-amber-400">
                                {settings.language === 'ar' ? 'سعر صرف السوق الموازي' : 'Parallel Street Rate'}
                              </span>
                            </div>
                          </div>
                          {onOpenRateEditor && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenRateEditor();
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
                            >
                              {settings.language === 'ar' ? 'تعديل السعر ✏️' : 'Edit Price ✏️'}
                            </button>
                          )}
                        </div>
                      )}

                      {guideStep === 2 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{settings.language === 'ar' ? 'نموذج السداد الجزئي (50% مسدد):' : 'Partial Repayment Demo (50% Paid):'}</span>
                            <span className="text-emerald-400 font-mono font-bold">50%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div className="w-1/2 h-full bg-gradient-to-r from-amber-500 to-emerald-400" />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>{settings.language === 'ar' ? 'المسدد: 750,000 د.ع' : 'Paid: 750,000 IQD'}</span>
                            <span>{settings.language === 'ar' ? 'المتبقي: 750,000 د.ع' : 'Remaining: 750,000 IQD'}</span>
                          </div>
                        </div>
                      )}

                      {guideStep === 3 && (
                        <div className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                          {settings.language === 'ar'
                            ? '"مرحباً أحمد، تذكير ودي بخصوص المبلغ المتبقي (🇮🇶 750,000 IQD). كل الشكر والتقدير لك."'
                            : '"Hey Ahmed! Quick and friendly reminder about the pending amount of 🇮🇶 750,000 IQD. Thanks a lot!"'}
                        </div>
                      )}

                      {guideStep === 4 && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-slate-400">
                            {settings.language === 'ar' ? 'اسأل الذكاء مثلاً:' : 'Try asking AI:'} <span className="text-emerald-400 font-semibold">{settings.language === 'ar' ? '"شكد يطلبني مصطفى؟"' : '"what is 20% of 1.5M?"'}</span>
                          </div>
                          {onOpenAiAssistant && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenAiAssistant();
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer whitespace-nowrap"
                            >
                              {settings.language === 'ar' ? 'فتح المحادثة 💬' : 'Open Chat 💬'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Navigation Footer (Previous, Step Dots, Next, Full Modal) */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={guideStep === 0}
                  onClick={() => setGuideStep((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  {settings.language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  <span>{settings.language === 'ar' ? 'السابق' : 'Previous'}</span>
                </button>

                {/* Step Dots */}
                <div className="flex items-center gap-1.5">
                  {guideSteps.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGuideStep(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        guideStep === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                      }`}
                      aria-label={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>

                {guideStep < guideSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setGuideStep((prev) => Math.min(guideSteps.length - 1, prev + 1))}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-md shadow-emerald-400/20"
                  >
                    <span>{settings.language === 'ar' ? 'التالي' : 'Next'}</span>
                    {settings.language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenTutorial) {
                        onClose();
                        onOpenTutorial();
                      } else {
                        setActiveTab('general');
                      }
                    }}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer shadow-md shadow-emerald-600/25"
                  >
                    <span>{settings.language === 'ar' ? 'إتمام الجولة ✨' : 'Finish Guide ✨'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CHAT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">{translations.chatHistoryTitle}</h3>
                  <p className="text-[11px] text-slate-400">{translations.chatHistoryDesc}</p>
                </div>
                {chatSessions.length > 0 && !showClearChatsConfirm && (
                  <button
                    type="button"
                    onClick={() => setShowClearChatsConfirm(true)}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    {translations.clearAllChats}
                  </button>
                )}
              </div>

              {showClearChatsConfirm && (
                <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs space-y-2.5">
                  <p className="text-rose-200">{translations.confirmClearChats}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowClearChatsConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                    >
                      {translations.cancel}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClearAllSessions();
                        setShowClearChatsConfirm(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold"
                    >
                      {translations.clearAllChats}
                    </button>
                  </div>
                </div>
              )}

              {chatSessions.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-500 text-xs">
                  {translations.noChatHistory}
                </div>
              ) : (
                <div className="space-y-2">
                  {chatSessions.map((s) => (
                    <div
                      key={s.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        activeSessionId === s.id
                          ? 'bg-slate-950 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSession(s.id);
                          onClose();
                        }}
                        className="flex-1 text-start min-w-0 cursor-pointer"
                      >
                        <h4 className="text-xs font-bold truncate text-white">{s.title}</h4>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{s.updatedAt}</span>
                          <span>&bull;</span>
                          <span>{s.messages.length} {translations.sessionMessagesCount}</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteSession(s.id)}
                        aria-label="Delete Session"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRIVACY & SECURITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              {/* Incognito Mode */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>{translations.incognitoModeLabel}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {translations.incognitoModeDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ incognitoMode: !settings.incognitoMode })}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.incognitoMode ? 'bg-cyan-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.incognitoMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Export Backup */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{translations.exportDataLabel}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {translations.exportDataDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors cursor-pointer shrink-0"
                >
                  {translations.exportDataLabel}
                </button>
              </div>

              {/* Import Backup */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{translations.importDataLabel}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {translations.importDataDesc}
                  </p>
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="import-backup-file"
                  />
                  <label
                    htmlFor="import-backup-file"
                    className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    {translations.importDataLabel}
                  </label>
                </div>
              </div>

              {/* NEW: Formatted PDF & CSV Export Section for External Record Keeping */}
              <section className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{translations.exportStatementTitle}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                          CSV & PDF
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {translations.exportReportDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter Scope Selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    {translations.exportScopeLabel}:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: 'all', label: translations.exportAllLoans },
                      { id: 'active', label: translations.exportActiveOnly },
                      { id: 'settled', label: translations.exportSettledOnly },
                      { id: 'they_owe_me', label: translations.theyOweMe },
                      { id: 'i_owe_them', label: translations.iOweThem },
                    ].map((scope) => {
                      const isSel = exportScope === scope.id;
                      return (
                        <button
                          key={scope.id}
                          type="button"
                          onClick={() => setExportScope(scope.id as any)}
                          className={`p-2 rounded-xl text-[11px] font-semibold text-center transition-all cursor-pointer border truncate ${
                            isSel
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {scope.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Export Buttons: CSV and PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-800/80">
                  {/* CSV Export */}
                  <button
                    type="button"
                    onClick={() => exportLoansToCsv(allLoans, settings.language, exportScope)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer shadow-sm"
                  >
                    <Table className="w-4 h-4 text-emerald-400" />
                    <span>{translations.exportCsvBtn}</span>
                  </button>

                  {/* Formatted PDF Statement */}
                  <button
                    type="button"
                    onClick={() => exportLoansToPdfPrint(allLoans, calculateTotals(allLoans), settings, exportScope)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{translations.exportPdfBtn}</span>
                  </button>
                </div>
              </section>

              {/* Danger Zone: Clear All Data */}
              <section className="space-y-3 border-t border-rose-500/30 pt-5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                  <AlertOctagon className="w-4 h-4" />
                  <span>{translations.dangerZone}</span>
                </div>

                {!showClearConfirm ? (
                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-rose-300">
                        {translations.clearAllData}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {translations.clearAllDataDesc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition-all shrink-0 cursor-pointer"
                    >
                      {translations.clearAllData}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span>{translations.confirmClearTitle}</span>
                    </div>
                    <p className="text-xs text-rose-200/80 leading-relaxed">
                      {translations.confirmClearDesc}
                    </p>
                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        {translations.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onClearAllData();
                          setShowClearConfirm(false);
                          onClose();
                        }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/30 cursor-pointer"
                      >
                        {translations.confirmClearBtn}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
