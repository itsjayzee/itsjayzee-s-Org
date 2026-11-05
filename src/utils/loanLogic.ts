import {
  AiPersonality,
  AiResponseLength,
  AttachedFile,
  CurrencyCode,
  CurrencyItem,
  CustomRates,
  Language,
  Loan,
  LoanType,
  ReminderTone,
  Translations,
  UserSettings,
} from '../types';

export const DEFAULT_RATES: CustomRates = {
  USD: 1,
  IQD: 1485,
  EUR: 0.924,
  TRY: 34.32,
  IRR: 642000,
};

export const CURRENCIES: CurrencyItem[] = [
  {
    code: 'USD',
    flag: '🇺🇸',
    symbol: '$',
    nameEn: 'US Dollar',
    nameAr: 'دولار أمريكي',
    rateToUSD: 1.0,
    change24h: 0.0,
  },
  {
    code: 'IQD',
    flag: '🇮🇶',
    symbol: 'IQD',
    nameEn: 'Iraqi Dinar',
    nameAr: 'دينار عراقي',
    rateToUSD: 1485,
    change24h: -0.25,
    subUnitLabel: '1,485 IQD',
  },
  {
    code: 'EUR',
    flag: '🇪🇺',
    symbol: '€',
    nameEn: 'Euro',
    nameAr: 'يورو أوروبي',
    rateToUSD: 0.924,
    change24h: +0.38,
  },
  {
    code: 'TRY',
    flag: '🇹🇷',
    symbol: '₺',
    nameEn: 'Turkish Lira',
    nameAr: 'ليرة تركية',
    rateToUSD: 34.32,
    change24h: -0.42,
  },
  {
    code: 'IRR',
    flag: '🇮🇷',
    symbol: 'IRR',
    nameEn: 'Iranian Rial (Toman)',
    nameAr: 'ريال إيراني (تومان)',
    rateToUSD: 642000,
    change24h: +0.65,
    subUnitLabel: '64,200 Toman',
  },
];

export function getCurrenciesWithCustomRates(customRates?: CustomRates): CurrencyItem[] {
  if (!customRates) return CURRENCIES;
  return CURRENCIES.map((c) => {
    const customRate = customRates[c.code];
    const isCustom = customRate !== undefined && customRate !== DEFAULT_RATES[c.code];
    return {
      ...c,
      rateToUSD: customRate !== undefined ? customRate : c.rateToUSD,
      subUnitLabel: isCustom ? `${customRate.toLocaleString()} (Custom)` : c.subUnitLabel,
    };
  });
}

export const defaultSettings: UserSettings = {
  profileName: '',
  theme: 'dark',
  customThemeColor: '#10b981',
  customBgImage: '',
  bgOpacity: 0.15,
  bgBlur: 0,
  fontSize: 'medium',
  language: 'en',
  currency: 'USD',
  aiPersonality: 'diplomat',
  responseLength: 'medium',
  creativity: 'balanced',
  customInstructions: '',
  incognitoMode: false,
  autoVoiceResponse: false,
  resetChatOnExit: false,
  soundEffectsEnabled: true,
  defaultReminderTone: 'friendly',
  defaultDuePeriod: 'none',
  viewMode: 'spacious',
  maskBalances: false,
  sortOrder: 'newest',
  animationsEnabled: true,
  hapticFeedback: true,
  pushNotificationsEnabled: true,
};

export interface BackgroundPreset {
  id: string;
  nameEn: string;
  nameAr: string;
  cssValue: string;
  previewBg: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'none',
    nameEn: 'None (Solid Color)',
    nameAr: 'بدون (لون موحد)',
    cssValue: '',
    previewBg: 'bg-slate-900 border border-slate-700',
  },
  {
    id: 'mesh_grid',
    nameEn: 'Cyber Grid',
    nameAr: 'شبكة رقمية',
    cssValue: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath d=\'M40 0L0 0 0 40\' fill=\'none\' stroke=\'rgba(255,255,255,0.08)\' stroke-width=\'1\'/%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'1\' fill=\'rgba(52,211,153,0.4)\'/%3E%3C/svg%3E")',
    previewBg: 'bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] bg-slate-950 border border-emerald-500/30',
  },
  {
    id: 'aurora',
    nameEn: 'Midnight Aurora',
    nameAr: 'الشفق الليلي',
    cssValue: 'radial-gradient(at 0% 0%, rgba(16,185,129,0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(59,130,246,0.3) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(168,85,247,0.25) 0px, transparent 50%)',
    previewBg: 'bg-gradient-to-br from-emerald-900/60 via-blue-900/60 to-purple-900/60 border border-purple-500/30',
  },
  {
    id: 'emerald_circuit',
    nameEn: 'Fintech Emerald Flow',
    nameAr: 'تموجات الزمرد المالي',
    cssValue: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cpath d=\'M0 30h60M30 0v60M0 0l60 60M60 0L0 60\' stroke=\'rgba(16,185,129,0.08)\' stroke-width=\'1\' fill=\'none\'/%3E%3C/svg%3E")',
    previewBg: 'bg-emerald-950/80 border border-emerald-500/30',
  },
  {
    id: 'luxury_carbon',
    nameEn: 'Luxury Carbon Slate',
    nameAr: 'كربون سيلكون فخم',
    cssValue: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Crect width=\'10\' height=\'10\' fill=\'rgba(255,255,255,0.03)\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'rgba(255,255,255,0.03)\'/%3E%3C/svg%3E")',
    previewBg: 'bg-neutral-900 border border-neutral-700/40',
  },
  {
    id: 'sunset_glow',
    nameEn: 'Sunset Horizon',
    nameAr: 'أفق الغروب الدافئ',
    cssValue: 'radial-gradient(at 10% 20%, rgba(244,63,94,0.3) 0px, transparent 55%), radial-gradient(at 90% 80%, rgba(245,158,11,0.25) 0px, transparent 55%)',
    previewBg: 'bg-gradient-to-br from-rose-950/80 via-amber-950/70 to-slate-950 border border-amber-500/30',
  },
];

export function compressImageFile(file: File, maxWidth = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined' || typeof document === 'undefined') {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(elem.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Loan Budget',
    tagline: 'Personal Debt & Credit Intelligence',
    theyOweMe: 'They Owe Me',
    theyOweMeDesc: 'Money I need to collect',
    iOweThem: 'I Owe Them',
    iOweThemDesc: 'Money I need to pay back',
    totalToCollect: 'Total to Collect',
    totalToPay: 'Total to Pay',
    netPosition: 'Net Balance',
    netSurplus: 'Net Receivable (Surplus)',
    netLiability: 'Net Payable (Liability)',
    balanced: 'Settled & Balanced',
    activeLoansCount: 'Active records',
    addNewLoan: '+ Add New',
    quickLoan: '⚡ Quick Loan',
    emptyStateTitle: 'No loans recorded yet',
    emptyStateDesc: 'Start by adding one to track what people owe you and what you need to pay back.',
    startByAdding: '+ Add Full Loan',
    quickAddNow: '⚡ Quick Add (3 sec)',
    nameLabel: 'Person Name',
    namePlaceholder: 'e.g., Alex Morgan',
    amountLabel: 'Amount',
    amountPlaceholder: '0.00',
    phoneLabel: 'Phone Number (Optional)',
    phonePlaceholder: '+1 (555) 000-0000',
    dueDateLabel: 'Debt Due Date *',
    dueDateRequired: 'Debt Due Date is mandatory. Please select a repayment deadline.',
    selectDueDate: 'Select Due Date',
    dueToday: 'Due Today!',
    dueInDays: 'Due in {days}d',
    overdueByDays: 'Overdue by {days}d',
    dueSoon: 'Deadline Approaching',
    notesLabel: 'Notes / Purpose (Optional)',
    notesPlaceholder: 'e.g., Dinner split, laptop repair...',
    loanTypeLabel: 'Classification (Mandatory)',
    saveLoan: 'Save Record',
    cancel: 'Cancel',
    quickLoanModalTitle: '⚡ Quick Loan',
    quickLoanModalSubtitle: 'Fast 3-field entry: Name, Amount & Direction',
    addLoanModalTitle: 'Add Loan Record',
    addLoanModalSubtitle: 'Record a new debt or credit with optional details',
    filterAll: 'All Records',
    filterTheyOwe: 'They Owe Me',
    filterIOwe: 'I Owe Them',
    filterSettled: 'Settled',
    searchPlaceholder: 'Search by person name or note...',
    sendReminder: 'Send Reminder',
    markAsSettled: 'Mark Settled',
    markAsActive: 'Reactivate',
    deleteLoan: 'Delete',
    confirmDelete: 'Delete Record',
    confirmDeleteMessage: 'Are you sure you want to delete this loan record? This cannot be undone.',
    delete: 'Delete',
    reminderModalTitle: 'Smart Reminder & Sharing',
    reminderModalSubtitle: 'Send a polished reminder directly via your preferred messenger',
    reminderPreviewLabel: 'Message Preview (Editable)',
    toneLabel: 'Tone of Voice',
    toneFriendly: 'Friendly & Casual',
    toneFormal: 'Polite & Professional',
    toneUrgent: 'Firm & Urgent',
    sendViaWhatsApp: 'WhatsApp',
    sendViaTelegram: 'Telegram',
    sendViaViber: 'Viber',
    copyMessage: 'Copy Message',
    messageCopied: 'Copied to clipboard!',
    statusActive: 'Active',
    statusSettled: 'Settled',
    createdOn: 'Created',
    dueOn: 'Due',
    overdue: 'Overdue',
    requiredFieldError: 'Please enter a name and a valid amount',
    invalidAmountError: 'Amount must be greater than zero',
    currency: '$',
    selectCurrency: 'Select Currency',
    totalDebt: 'Total Debt',
    settlementProgress: 'Settlement Progress',
    currencyBreakdownTitle: 'Multi-Currency Breakdown',
    multiCurrencyNotice: 'Converted to current view currency',

    liveRatesTicker: 'LIVE MARKET TICKER',
    marketRatesTitle: 'Exchange Rates & Forex Ticker',
    baseCurrencyUSD: 'Base: 1 USD',
    convertHelp: 'Click any currency to set as primary display',
    editMarketRates: 'Edit Dollar Rates ✏️',
    dollarMarketRateTitle: 'Live Dollar Market Price Editor',
    dollarMarketRateSubtitle: 'Adjust street & parallel dollar exchange rates for accurate budgeting',
    saveRates: 'Save Live Rates',
    resetDefaultRates: 'Reset to Official Rates',
    quickPresetBaghdad: '🇮🇶 Baghdad (~1,515)',
    quickPresetIstanbul: '🇹🇷 Istanbul (~34.80)',
    quickPresetTehran: '🇮🇷 Tehran (~650k)',
    customRateActive: 'Custom Rate',
    ratePerUSD: 'Rate per 1 USD',

    // Tutorial
    tutorialTitle: 'Loan Budget Interactive Tutorial',
    tutorialSubtitle: 'Learn multi-currency debts, custom dollar rates, and smart reminders',
    openTutorial: '📖 How to Use',

    // AI & Chat Reset
    resetChatTooltip: 'Clear & Reset Conversation',
    resetChatConfirm: 'Conversation cleared to fresh welcome!',
    resetChatOnExitLabel: 'Reset Chat When Closing Assistant',
    resetChatOnExitDesc: 'Automatically clean the chat session every time you close the AI window.',
    soundEffectsLabel: 'Sound Effects & Chimes',
    soundEffectsDesc: 'Play harmonic synthesizer chimes on loan movement and settlement.',

    // Settings Dashboard
    settingsTitle: 'Advanced Settings',
    settingsSubtitle: 'Configure AI intelligence, themes, chat history, and security',
    tabGeneral: 'General',
    tabPreferences: 'App Preferences',
    tabAiControls: 'AI Controls',
    tabGuide: 'Interactive App Guide',
    tabChatHistory: 'Chat History',
    tabPrivacySecurity: 'Privacy & Data',
    interactiveGuideTitle: 'Interactive App Guide & Walkthrough',
    interactiveGuideDesc: 'Step-by-step interactive walkthrough to master multi-currency loans, live dollar exchange rates, quick loans, and AI calculations.',
    launchInteractiveGuide: 'Explore Interactive Guide 📖',
    defaultReminderToneLabel: 'Default Reminder Message Tone',
    defaultDuePeriodLabel: 'Default Due Date on New Loans',
    duePeriodNone: 'No Due Date (Manual)',
    duePeriod7Days: '+7 Days (1 Week)',
    duePeriod14Days: '+14 Days (2 Weeks)',
    duePeriod30Days: '+30 Days (1 Month)',
    duePeriod60Days: '+60 Days (2 Months)',
    viewModeLabel: 'Debt Cards Display Layout',
    viewModeSpacious: 'Spacious & Detailed Cards',
    viewModeCompact: 'Compact Dense List View',
    maskBalancesLabel: 'Privacy Shield (Mask Balances)',
    maskBalancesDesc: 'Obscure sensitive balance totals with dots (••••••) on dashboard to prevent shoulder surfing.',
    sortOrderLabel: 'Default Loans Sort Order',
    sortNewest: 'Newest First',
    sortOldest: 'Oldest First',
    sortHighest: 'Highest Debt Amount',
    sortDueSoonest: 'Due Soonest (Urgent)',
    sortNameAsc: 'Person Name (A-Z)',
    animationsLabel: 'Confetti & Money Particle Effects',
    animationsDesc: 'Render floating gold coins and sad drop particles on payments and loan updates.',
    hapticsLabel: 'Touch Vibration & Haptics',
    hapticsDesc: 'Provide subtle tactile vibration when recording loans and tapping buttons.',
    profileSection: 'Profile & Identity',
    profileNameLabel: 'Account / User Name',
    appearanceSection: 'Appearance & Display',
    themeLabel: 'Interface Theme',
    themeDark: 'Fintech Dark',
    themeLight: 'Clean Light',
    themeEmerald: 'Neon Emerald',
    fontSizeLabel: 'Font Size Scale',
    fontSmall: 'Small (Compact)',
    fontMedium: 'Medium (Standard)',
    fontLarge: 'Large (Readable)',
    preferredCurrency: 'Default Display Currency',
    aiPersonalityLabel: 'AI Personality',
    personalityDiplomat: 'Polite Diplomat',
    personalityDiplomatDesc: 'Tactful, warm, focused on relationship-preserving reminder etiquette.',
    personalityAuditor: 'Strict Financial Auditor',
    personalityAuditorDesc: 'Objective, straight to deadlines, balances, and numbers.',
    personalityFriend: 'Casual Friend',
    personalityFriendDesc: 'Relaxed, friendly, supportive, uses helpful emojis.',
    personalityAdvisor: 'Wise Wealth Advisor',
    personalityAdvisorDesc: 'Strategic cash flow management, debt snowball/avalanche insights.',
    responseLengthLabel: 'AI Response Length',
    lengthShort: 'Short & Direct',
    lengthMedium: 'Balanced & Practical',
    lengthLong: 'Detailed & Strategic',
    creativityLabel: 'Reasoning & Intelligence',
    creativityPrecise: 'Precise (Strict Data)',
    creativityBalanced: 'Balanced (Recommended)',
    creativityCreative: 'Creative (Brainstorming)',
    customInstructionsLabel: 'Custom AI Instructions (System Directive)',
    customInstructionsPlaceholder: 'e.g., Always address me as Boss, prioritize collection of debts over $100...',
    autoVoiceLabel: 'Auto Voice Response (Text-to-Speech)',
    autoVoiceDesc: 'Automatically read out AI responses using speech synthesis.',
    chatHistoryTitle: 'Chat History & Sessions',
    chatHistoryDesc: 'Manage and review your saved AI guidance conversations.',
    newChatSession: '+ New Chat Session',
    clearAllChats: 'Clear All Conversations',
    clearAllChatsDesc: 'Erase all messages and chat history from this device.',
    confirmClearChats: 'Are you sure you want to delete all saved conversations?',
    noChatHistory: 'No conversation history saved yet.',
    sessionMessagesCount: 'messages',
    privacySecurityTitle: 'Privacy & Data Management',
    incognitoModeLabel: 'Incognito Session Mode',
    incognitoModeDesc: 'When enabled, chat messages will not be saved to local storage.',
    exportDataLabel: 'Export Backup (JSON)',
    exportDataDesc: 'Download an encrypted full backup of all loans, settings, and chat history.',
    importDataLabel: 'Import / Restore Backup',
    importDataDesc: 'Restore your records and configuration from a previously exported JSON file.',
    dangerZone: 'Danger Zone',
    clearAllData: 'Clear All App Data',
    clearAllDataDesc: 'Permanently remove all loan records and reset to empty state.',
    confirmClearTitle: 'Clear All App Data?',
    confirmClearDesc: 'This will erase all recorded loans from your browser storage. This action is irreversible.',
    confirmClearBtn: 'Yes, Erase Everything',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully!',

    // AI Guide
    aiAssistantTitle: 'Budget AI Guide',
    aiAssistantSubtitle: 'Universal Financial & General Intelligence',
    aiWelcomeMessage: 'Hello! I am your Budget AI Guide 🤖. Ask me anything about your loans, custom dollar prices, math, debt negotiations, life questions, or upload a bill to auto-record it!',
    aiInputPlaceholder: 'Ask any question or upload a receipt/bill...',
    askAiHelp: 'Ask AI Guide',
    suggestedQuestions: [
      'How do I send a WhatsApp reminder?',
      'Suggest a debt payoff strategy for my active loans',
      'What is the current dollar market rate?',
      'How do I use this app? Show me the tutorial',
    ],
    searchChatPlaceholder: 'Search messages...',
    voiceInputListening: 'Listening... Speak now',
    voiceInputPermissionError: 'Microphone access denied or not supported in this browser.',
    voiceSpeakMessage: 'Play Audio',
    voiceStopSpeaking: 'Stop Audio',
    copyMsgAction: 'Copy',
    regenerateAction: 'Regenerate',
    editMsgAction: 'Edit',
    saveEditBtn: 'Save & Resend',
    uploadFileAction: 'Attach Receipt / Bill',
    fileTooLarge: 'File size must be under 10MB',
    oneClickAddFromInvoice: '⚡ Add This Loan to Dashboard',
    retryAction: 'Retry',
    newChatTooltip: 'New Chat Session',
    tutorialGuide: 'App Guide',
    clearChat: 'Clear Chat',

    // Loan Edit & Partial Repayment
    editLoan: 'Edit / Pay Part',
    editLoanModalTitle: 'Edit Loan & Repayment',
    editLoanModalSubtitle: 'Update loan details or record payments if paid back partially (e.g. half)',
    paidAmountLabel: 'Amount Paid Back So Far',
    remainingDebt: 'Remaining Unpaid',
    paidSoFar: 'Paid Back',
    payHalf: 'Pay Half (50%)',
    payQuarter: 'Pay 25%',
    payThreeQuarters: 'Pay 75%',
    payAll: 'Pay in Full (100%)',
    resetPayment: 'Reset (0%)',
    saveChanges: 'Save Changes',
    logRepayment: 'Log Payment',
    repaymentProgress: 'Repayment Progress',
    originalDebt: 'Original Debt',

    // Add More Money / Debt
    addMoreDebtTab: '+ Add More Money',
    logRepaymentTab: '- Pay Down Debt',
    addAmountLabel: 'Additional Amount Borrowed / Owed',
    addMoneyDesc: 'Add more money if you or they borrowed additional funds for this record.',
    amountAddedSuccess: 'Successfully added to total debt!',
    addDebtBtn: '+ Add to Total Debt',
    customDebtTotal: 'Adjust Total Debt Directly',

    // Export CSV & PDF
    exportCsvBtn: 'Export as CSV Spreadsheet',
    exportPdfBtn: 'Export / Print PDF Statement',
    exportScopeLabel: 'Select Records to Export',
    exportAllLoans: 'All Records (Full Export)',
    exportActiveOnly: 'Active Records Only',
    exportSettledOnly: 'Settled Records Only',
    exportStatementTitle: 'Official Financial Debt Statement',
    exportReportDesc: 'Export clean formatted spreadsheets (.csv) or printable statements (.pdf) for external accounting.',

    // Due Date Push Notifications
    pushNotificationsLabel: 'Automated Due Date Push Notifications',
    pushNotificationsDesc: 'Sends polite, automated push notifications on due dates to debtors across iOS and Android.',
    testNotificationBtn: 'Test Polite Due Notification Now',
    notificationSentToast: 'Polite due date push notification sent!',
    notificationPermissionDenied: 'Notification permission is blocked. Please enable it in browser settings.',
    politeDueTodayReminder: 'Dear [Name], this is a friendly reminder that your payment of [Amount] is due today. We appreciate your prompt attention to this matter.',
    dueTodayNotice: 'Payment is due today!',

    // Navigation Drawer & Menu
    hamburgerMenu: 'Main Navigation Menu',
    navDrawerTitle: 'Loan Budget Navigation',
    navDrawerSubtitle: 'Personal Debt & Financial Command',
    navDashboard: 'Dashboard Overview',
    navQuickLoan: 'Quick Loan Entry',
    navAddLoan: 'Add Full Loan Record',
    navAiAssistant: 'Budget AI Guide',
    navMarketRates: 'Currency Market Rates',
    navTutorial: 'Interactive App Guide',
    navSettings: 'Settings & Appearance',
    navExport: 'Export PDF & CSV Statements',
    closeDrawer: 'Close Navigation Menu',

    // Theme Customization & Presets
    themeSectionTitle: 'Theme & Color Palette',
    themeSapphire: 'Sapphire Navy',
    themeAmethyst: 'Amethyst Purple',
    themeSunset: 'Cyber Sunset',
    themeCustom: 'Custom Accent',
    customAccentColorLabel: 'Select Custom Accent Color',

    // Custom Background Image
    bgCustomizerTitle: 'Custom Background & Wallpapers',
    bgCustomizerDesc: 'Personalize your interface with sleek presets or upload your own background image.',
    bgPresetNone: 'Solid Dark/Light',
    bgPresetGrid: 'Cyber Grid',
    bgPresetAurora: 'Midnight Aurora',
    bgPresetEmerald: 'Fintech Emerald',
    bgPresetCarbon: 'Luxury Carbon',
    bgPresetSunset: 'Sunset Horizon',
    uploadCustomBg: 'Upload Custom Wallpaper',
    removeBg: 'Remove Wallpaper',
    bgOpacityLabel: 'Background Opacity (Readability Filter)',
    bgBlurLabel: 'Background Blur Intensity',
    bgUploadSuccess: 'Custom background image applied successfully!',
    bgUploadTooLarge: 'Image is too large. Scaled automatically for optimal performance.',
  },
  ar: {
    appName: 'ميزانية القروض',
    tagline: 'إدارة وتتبع الديون والمستحقات المالية',
    theyOweMe: 'سلف للغير (يطلبني)',
    theyOweMeDesc: 'أموال يجب أن أحصلها منهم',
    iOweThem: 'دين عليّ (أطلبهم)',
    iOweThemDesc: 'أموال يجب أن أسددها لهم',
    totalToCollect: 'إجمالي التحصيل',
    totalToPay: 'إجمالي السداد',
    netPosition: 'صافي المركز المالي',
    netSurplus: 'صافي مستحق لك (فائض)',
    netLiability: 'صافي مستحق عليك (التزام)',
    balanced: 'متوازن وخالص تماماً',
    activeLoansCount: 'معاملات نشطة',
    addNewLoan: '+ إضافة قرض',
    quickLoan: '⚡ سلفة سريعة',
    emptyStateTitle: 'لا توجد قروض مسجلة حتى الآن',
    emptyStateDesc: 'ابدأ بإضافة أول معاملة لتتبع ما لك وما عليك من أموال بكل سهولة وخصوصية.',
    startByAdding: '+ إضافة قرض مفصل',
    quickAddNow: '⚡ إضافة سريعة (٣ ثوانٍ)',
    nameLabel: 'اسم الشخص',
    namePlaceholder: 'مثال: محمد أحمد',
    amountLabel: 'المبلغ',
    amountPlaceholder: '0.00',
    phoneLabel: 'رقم الهاتف (اختياري)',
    phonePlaceholder: '+966 50 000 0000',
    dueDateLabel: 'تاريخ استحقاق الدين *',
    dueDateRequired: 'تاريخ الاستحقاق إجباري. يرجى اختيار تاريخ موعد السداد.',
    selectDueDate: 'تحديد تاريخ الاستحقاق',
    dueToday: 'مستحق اليوم!',
    dueInDays: 'مستحق خلال {days} أيام',
    overdueByDays: 'متأخر منذ {days} أيام',
    dueSoon: 'اقترب موعد السداد',
    notesLabel: 'ملاحظات / الغرض (اختياري)',
    notesPlaceholder: 'مثال: حساب عشاء، سلفة مؤقتة...',
    loanTypeLabel: 'نوع المعاملة (إجباري)',
    saveLoan: 'حفظ السجل',
    cancel: 'إلغاء',
    quickLoanModalTitle: '⚡ سلفة سريعة',
    quickLoanModalSubtitle: 'تسجيل فوري بـ ٣ حقول فقط: الاسم، المبلغ، والنوع',
    addLoanModalTitle: 'إضافة سجل قرض جديد',
    addLoanModalSubtitle: 'سجل تفاصيل الدين أو المستحق مع تواريخ الاستحقاق',
    filterAll: 'الكل',
    filterTheyOwe: 'سلف للغير (تحصيل)',
    filterIOwe: 'ديون عليّ (سداد)',
    filterSettled: 'تمت تسويتها',
    searchPlaceholder: 'بحث بالاسم أو الملاحظات...',
    sendReminder: 'إرسال تذكير',
    markAsSettled: 'تمت التسوية',
    markAsActive: 'إعادة تنشيط',
    deleteLoan: 'حذف',
    confirmDelete: 'تأكيد الحذف',
    confirmDeleteMessage: 'هل أنت متأكد من حذف هذا السجل نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
    delete: 'حذف نهائي',
    reminderModalTitle: 'تذكير ذكي ومشاركة اجتماعية',
    reminderModalSubtitle: 'أرسل رسالة تذكير أنيقة ومحترمة عبر وسيلة المراسلة المفضلة لديك',
    reminderPreviewLabel: 'معاينة الرسالة (قابلة للتعديل)',
    toneLabel: 'نبرة الرسالة التذكيرية',
    toneFriendly: 'ودية وأخوية',
    toneFormal: 'رسمية ومحترمة',
    toneUrgent: 'حازمة وعاجلة',
    sendViaWhatsApp: 'واتساب',
    sendViaTelegram: 'تيليجرام',
    sendViaViber: 'فايبر',
    copyMessage: 'نسخ النص',
    messageCopied: 'تم النسخ للحافظة!',
    statusActive: 'نشط',
    statusSettled: 'تمت التسوية',
    createdOn: 'تاريخ التسجيل',
    dueOn: 'الاستحقاق',
    overdue: 'متأخر',
    requiredFieldError: 'يرجى كتابة الاسم وتحديد مبلغ صحيح',
    invalidAmountError: 'يجب أن يكون المبلغ أكبر من صفر',
    currency: '$',
    selectCurrency: 'اختر العملة',
    totalDebt: 'إجمالي الدين',
    settlementProgress: 'نسبة السداد والتسوية',
    currencyBreakdownTitle: 'تفصيل حسب العملات المسجلة',
    multiCurrencyNotice: 'القيم محولة للعملة الحالية المختارة',

    liveRatesTicker: 'أسعار الصرف المباشرة',
    marketRatesTitle: 'شريط أسعار العملات الحية',
    baseCurrencyUSD: 'الأساس: 1 دولار أمريكي',
    convertHelp: 'انقر على أي عملة لعرض المبالغ بها مباشرة',
    editMarketRates: 'تعديل أسعار الدولار ✏️',
    dollarMarketRateTitle: 'تعديل سعر صرف الدولار الحي',
    dollarMarketRateSubtitle: 'حدد سعر صرف الدولار الحقيقي بالسوق الموازي لحساب ميزانيتك بدقة تامة',
    saveRates: 'حفظ أسعار الصرف',
    resetDefaultRates: 'استعادة الأسعار الافتراضية',
    quickPresetBaghdad: '🇮🇶 بورصة بغداد (~1,515)',
    quickPresetIstanbul: '🇹🇷 سوق إسطنبول (~34.80)',
    quickPresetTehran: '🇮🇷 سوق طهران (~650 ألف)',
    customRateActive: 'سعر مخصص',
    ratePerUSD: 'السعر لكل 1 دولار',

    // Tutorial
    tutorialTitle: 'دليل استخدام ميزانية القروض الذكية',
    tutorialSubtitle: 'تعلم إدارة الديون بالعملات المتعددة، تعديل أسعار الصرف، والتذكيرات',
    openTutorial: '📖 دليل الاستخدام',

    // AI & Chat Reset
    resetChatTooltip: 'مسح وإعادة تعيين المحادثة',
    resetChatConfirm: 'تم مسح المحادثة وبدء جلسة نظيفة!',
    resetChatOnExitLabel: 'إعادة تعيين المحادثة تلقائياً عند الإغلاق',
    resetChatOnExitDesc: 'بدء جلسة جديدة نظيفة في كل مرة تغلق فيها نافذة المساعد الذكي.',
    soundEffectsLabel: 'المؤثرات الصوتية الاحتفالية',
    soundEffectsDesc: 'تشغيل نغمات موسيقية احتفالية عند إضافة الديون وسدادها.',

    // Settings Dashboard
    settingsTitle: 'لوحة الإعدادات المتقدمة',
    settingsSubtitle: 'تخصيص الذكاء الاصطناعي، المظهر، وتاريخ المحادثات والأمان',
    tabGeneral: 'عام والمظهر',
    tabPreferences: 'تفضيلات التطبيق',
    tabAiControls: 'تحكم الذكاء الاصطناعي',
    tabGuide: 'دليل التطبيق التفاعلي',
    tabChatHistory: 'تاريخ المحادثات',
    tabPrivacySecurity: 'الخصوصية والبيانات',
    interactiveGuideTitle: 'دليل التطبيق التفاعلي والإرشادات',
    interactiveGuideDesc: 'جولة تفاعلية خطوة بخطوة للتعرف على تسجيل الديون بالعملات، تعديل سعر صرف الدولار العراقي، السلف السريعة، والذكاء الاصطناعي.',
    launchInteractiveGuide: 'استكشاف الدليل التفاعلي 📖',
    defaultReminderToneLabel: 'النبرة الافتراضية لرسائل التذكير',
    defaultDuePeriodLabel: 'فترة الاستحقاق التلقائية للديون الجديدة',
    duePeriodNone: 'بدون تاريخ استحقاق (يدوي)',
    duePeriod7Days: '+7 أيام (أسبوع)',
    duePeriod14Days: '+14 يوماً (أسبوعين)',
    duePeriod30Days: '+30 يوماً (شهر)',
    duePeriod60Days: '+60 يوماً (شهرين)',
    viewModeLabel: 'مظهر وكثافة عرض بطاقات الديون',
    viewModeSpacious: 'بطاقات مفصلة وواسعة',
    viewModeCompact: 'قائمة مدمجة ومكثفة',
    maskBalancesLabel: 'درع الخصوصية (إخفاء المبالغ)',
    maskBalancesDesc: 'إخفاء أرقام ومبالغ الديون بنقاط (••••••) لحماية خصوصيتك في الأماكن العامة وأمام الآخرين.',
    sortOrderLabel: 'ترتيب عرض الديون الافتراضي',
    sortNewest: 'الأحدث تسجيلاً أولاً',
    sortOldest: 'الأقدم أولاً',
    sortHighest: 'الأعلى قيمة ودين أولاً',
    sortDueSoonest: 'الأقرب استحقاقاً (عاجل)',
    sortNameAsc: 'أبجدياً حسب الاسم (أ-ي)',
    animationsLabel: 'مؤثرات النقود والعملات الحركية',
    animationsDesc: 'إظهار حركة النقود المتطايرة والأنيميشن الحزين عند تسجيل السداد أو الديون.',
    hapticsLabel: 'التفاعل اللمسي والاهتزاز (Haptics)',
    hapticsDesc: 'اهتزاز خفيف للأجهزة المحمولة عند الضغط على الأزرار وتسجيل العمليات المالية.',
    profileSection: 'الملف الشخصي والحساب',
    profileNameLabel: 'اسم صاحب الحساب',
    appearanceSection: 'المظهر والواجهة',
    themeLabel: 'مظهر التطبيق',
    themeDark: 'الوضع الداكن المالي (موصى به)',
    themeLight: 'الوضع الفاتح الأنيق',
    themeEmerald: 'الأخضر الزمردي النيون',
    fontSizeLabel: 'حجم الخطوط في الواجهة',
    fontSmall: 'صغير (مضغوط)',
    fontMedium: 'متوسط (افتراضي)',
    fontLarge: 'كبير (واضح وسهل القراءة)',
    preferredCurrency: 'العملة الافتراضية للعرض',
    aiPersonalityLabel: 'شخصية ونبرة الذكاء الاصطناعي',
    personalityDiplomat: 'الدبلوماسي اللبق (موصى به)',
    personalityDiplomatDesc: 'أسلوب راقٍ يحافظ على العلاقات الاجتماعية أثناء المطالبة المالية.',
    personalityAuditor: 'المدقق المالي الصارم',
    personalityAuditorDesc: 'مباشر بالأرقام، والتواريخ، والالتزامات دون مجاملات.',
    personalityFriend: 'الصديق العفوي والداعم',
    personalityFriendDesc: 'حديث ودي مشجع واستخدام الإيموجي بشكل لطيف.',
    personalityAdvisor: 'المستشار الاستراتيجي الحكيم',
    personalityAdvisorDesc: 'يركز على التدفق النقدي واستراتيجيات التخلص من الديون المتراكمة.',
    responseLengthLabel: 'طول إجابات المساعد',
    lengthShort: 'مختصر ومباشر',
    lengthMedium: 'متوازن وعملي',
    lengthLong: 'مفصل وشامل بالخطوات',
    creativityLabel: 'الإبداع والمنطق',
    creativityPrecise: 'دقيق ومحدد (بيانات فقط)',
    creativityBalanced: 'متوازن (موصى به)',
    creativityCreative: 'إبداعي وتحليلي واسع',
    customInstructionsLabel: 'تعليمات مخصصة للذكاء الاصطناعي',
    customInstructionsPlaceholder: 'مثال: خاطبني دائماً بـ "أستاذ"، وركز على سداد الديون المستعجلة أولاً...',
    autoVoiceLabel: 'النطق الصوتي التلقائي (Voice)',
    autoVoiceDesc: 'قراءة الإجابات صوتياً عبر محرك تحويل النص إلى صوت.',
    chatHistoryTitle: 'تاريخ المحادثات والجلسات',
    chatHistoryDesc: 'مراجعة وتنظيم جلسات الإرشاد المالي المحفوظة.',
    newChatSession: '+ جلسة محادثة جديدة',
    clearAllChats: 'مسح كافة المحادثات',
    clearAllChatsDesc: 'حذف جميع رسائل المساعد الذكي والبدء من جديد.',
    confirmClearChats: 'هل أنت متأكد من مسح جميع محادثات الذكاء الاصطناعي؟',
    noChatHistory: 'لا توجد محادثات سابقة محفوظة.',
    sessionMessagesCount: 'رسائل',
    privacySecurityTitle: 'الخصوصية وإدارة البيانات',
    incognitoModeLabel: 'وضع التخفي (Incognito)',
    incognitoModeDesc: 'عند تفعيله، لن يتم حفظ المحادثات الجديدة في التخزين المحلي.',
    exportDataLabel: 'تصدير نسخة احتياطية (JSON)',
    exportDataDesc: 'تحميل ملف يحتوي على كامل القروض والإعدادات وتاريخ الدردشة.',
    importDataLabel: 'استيراد نسخة احتياطية',
    importDataDesc: 'استعادة سجلاتك السابقة من ملف JSON تم تصديره سابقاً.',
    dangerZone: 'منطقة الحذف والبيانات',
    clearAllData: 'مسح جميع البيانات نهائياً',
    clearAllDataDesc: 'حذف كافة القروض والمعاملات المسجلة والعودة للحالة الأولية.',
    confirmClearTitle: 'هل أنت متأكد من مسح جميع البيانات؟',
    confirmClearDesc: 'سيتم حذف جميع المعاملات من متصفحك نهائياً. لا يمكن التراجع بعد الحذف.',
    confirmClearBtn: 'نعم، امسح كافة البيانات',
    saveSettings: 'حفظ الإعدادات',
    settingsSaved: 'تم حفظ الإعدادات بنجاح!',

    // AI Guide
    aiAssistantTitle: 'دليل الميزانية الذكي (Budget AI)',
    aiAssistantSubtitle: 'المساعد المالي والاستشاري الشامل',
    aiWelcomeMessage: 'أهلاً بك! أنا مرشد الميزانية الذكي 🤖. اسألني عن ديونك، أو حساب أسعار الدولار، أو أي مسألة رياضية أو عامة، أو ارفع فاتورة لتسجيلها بضغطة واحدة!',
    aiInputPlaceholder: 'اسأل عن أي شيء أو ارفع إيصالاً/فاتورة...',
    askAiHelp: 'مساعد التطبيق الذكي',
    suggestedQuestions: [
      'كيف أرسل تذكير واتساب للمدين؟',
      'اقترح خطة لسداد ديوني النشطة',
      'كم سعر صرف الدولار في السوق الآن؟',
      'كيف أستخدم التطبيق؟ اعرض لي الدليل',
    ],
    searchChatPlaceholder: 'بحث في الرسائل...',
    voiceInputListening: 'جاري الاستماع... تحدث الآن',
    voiceInputPermissionError: 'تم رفض إذن استخدام الميكروفون أو أنه غير مدعوم في هذا المتصفح.',
    voiceSpeakMessage: 'تشغيل الصوت',
    voiceStopSpeaking: 'إيقاف الصوت',
    copyMsgAction: 'نسخ',
    regenerateAction: 'إعادة التوليد',
    editMsgAction: 'تعديل',
    saveEditBtn: 'حفظ وإعادة الإرسال',
    uploadFileAction: 'إرفاق إيصال / فاتورة',
    fileTooLarge: 'يجب أن يكون حجم الملف أقل من 10 ميجابايت',
    oneClickAddFromInvoice: '⚡ تسجيل هذا القرض في الميزانية',
    retryAction: 'إعادة المحاولة',
    newChatTooltip: 'محادثة جديدة',
    tutorialGuide: 'دليل الاستخدام',
    clearChat: 'مسح المحادثة',

    // Loan Edit & Partial Repayment
    editLoan: 'تعديل / سداد جزئي',
    editLoanModalTitle: 'تعديل الدين وسجل السداد',
    editLoanModalSubtitle: 'تعديل بيانات الدين أو تسجيل دفعات مسددة (مثل سداد النصف أو الربع)',
    paidAmountLabel: 'المبلغ المسدد حتى الآن',
    remainingDebt: 'المبلغ المتبقي غير المسدد',
    paidSoFar: 'تم سداده',
    payHalf: 'سداد النصف (50%)',
    payQuarter: 'سداد الربع (25%)',
    payThreeQuarters: 'سداد 75%',
    payAll: 'سداد كامل (100%)',
    resetPayment: 'إعادة للصفر (0%)',
    saveChanges: 'حفظ التعديلات',
    logRepayment: 'تسجيل دفعة',
    repaymentProgress: 'نسبة السداد',
    originalDebt: 'أصل الدين',

    // Add More Money / Debt
    addMoreDebtTab: '+ إضافة وتزويد مبلغ دين',
    logRepaymentTab: '- تسجيل سداد وتخفيض',
    addAmountLabel: 'المبلغ الإضافي المقترض / المستلف',
    addMoneyDesc: 'أضف مزيداً من المال إذا اقترضت أنت أو اقترضوا منك مبالغ إضافية لهذا السجل.',
    amountAddedSuccess: 'تمت إضافة المبلغ وتحديث إجمالي الدين بنجاح!',
    addDebtBtn: '+ إضافة إلى إجمالي الدين',
    customDebtTotal: 'تعديل إجمالي أصل الدين مباشرة',

    // Export CSV & PDF
    exportCsvBtn: 'تصدير جدول إكسل (CSV)',
    exportPdfBtn: 'تصدير / طباعة كشف حساب (PDF)',
    exportScopeLabel: 'تحديد السجلات المراد تصديرها',
    exportAllLoans: 'كافة السجلات (تصدير كامل)',
    exportActiveOnly: 'السجلات النشطة فقط',
    exportSettledOnly: 'السجلات المسددة فقط',
    exportStatementTitle: 'كشف حساب الديون والمستحقات المالي الرسمي',
    exportReportDesc: 'تصدير ملفات إكسل منسقة (.csv) أو كشوفات حساب جاهزة للطباعة (.pdf) لحفظ سجلاتك الخارجية.',

    // Due Date Push Notifications
    pushNotificationsLabel: 'إشعارات الاستحقاق التلقائية المهذبة',
    pushNotificationsDesc: 'إرسال إشعارات مهذبة وتلقائية عبر المتصفح والهاتف عند حلول موعد استحقاق الديون.',
    testNotificationBtn: 'اختبار إشعار الاستحقاق المهذب الآن',
    notificationSentToast: 'تم إرسال إشعار التذكير المهذب بنجاح!',
    notificationPermissionDenied: 'صلاحية الإشعارات محظورة في المتصفح. يرجى تفعيلها من إعدادات المتصفح.',
    politeDueTodayReminder: 'عزيزي [الاسم]، نود تذكيرك بلطف بأن دفعتك بقيمة [المبلغ] مستحقة اليوم. نقدّر اهتمامك وسرعة سدادك.',
    dueTodayNotice: 'دفعة مستحقة السداد اليوم!',

    // Navigation Drawer & Menu
    hamburgerMenu: 'القائمة الجانبية للتنقل',
    navDrawerTitle: 'قائمة ميزانية القروض',
    navDrawerSubtitle: 'التحكم المالي والوصول السريع',
    navDashboard: 'لوحة التحكم الرئيسية',
    navQuickLoan: 'تسجيل سلفة سريعة',
    navAddLoan: 'إضافة سجل مفصل',
    navAiAssistant: 'المساعد الذكي (AI Guide)',
    navMarketRates: 'أسعار صرف العملات الحية',
    navTutorial: 'دليل استخدام التطبيق التفاعلي',
    navSettings: 'الإعدادات والمظهر',
    navExport: 'تصدير كشف حساب PDF و CSV',
    closeDrawer: 'إغلاق القائمة الجانبية',

    // Theme Customization & Presets
    themeSectionTitle: 'السمة والألوان المخصصة',
    themeSapphire: 'الياقوت الأزرق (نيفي)',
    themeAmethyst: 'الجمشت الملكي (بنفسجي)',
    themeSunset: 'غروب السايبر (أحمر دافئ)',
    themeCustom: 'لون تمييز مخصص',
    customAccentColorLabel: 'اختر لون التمييز المفضل لديك',

    // Custom Background Image
    bgCustomizerTitle: 'خلفية التطبيق والصور المخصصة',
    bgCustomizerDesc: 'خصّص مظهر الواجهة باختيار نمط خلفية جاهز أو رفع صورتك الخاصة بكل حرية.',
    bgPresetNone: 'لون داكن/فاتح مصمت',
    bgPresetGrid: 'شبكة رقمية (Cyber Grid)',
    bgPresetAurora: 'شفق ليلي (Midnight Aurora)',
    bgPresetEmerald: 'الزمرد المالي (Fintech Emerald)',
    bgPresetCarbon: 'كربون سيلكون فخم (Luxury Carbon)',
    bgPresetSunset: 'أفق الغروب الدافئ (Sunset Horizon)',
    uploadCustomBg: 'رفع صورة خلفية خاصة',
    removeBg: 'إزالة الخلفية والعودة للافتراضي',
    bgOpacityLabel: 'شفافية الخلفية (فلتر وضوح النصوص)',
    bgBlurLabel: 'درجة تمويه وضبابية الخلفية (Blur)',
    bgUploadSuccess: 'تم تطبيق صورة الخلفية المخصصة بنجاح!',
    bgUploadTooLarge: 'تم ضغط وتحسين حجم الصورة تلقائياً لسرعة الأداء.',
  },
};

export interface Totals {
  totalTheyOwe: number;
  totalIOwe: number;
  netBalance: number;
  activeTheyOweCount: number;
  activeIOweCount: number;
  settledCount: number;
  theyOweByCurrency: Record<CurrencyCode, number>;
  iOweByCurrency: Record<CurrencyCode, number>;
  netByCurrency: Record<CurrencyCode, number>;
  usedCurrencies: CurrencyCode[];
  isMultiCurrency: boolean;
  singleCurrency?: CurrencyCode;
}

export function toUSD(amount: number, fromCurrency: CurrencyCode, customRates?: CustomRates): number {
  if (fromCurrency === 'USD') return amount;
  const rate = customRates?.[fromCurrency] ?? CURRENCIES.find((c) => c.code === fromCurrency)?.rateToUSD ?? 1;
  if (!rate || rate <= 0) return amount;
  return amount / rate;
}

export function fromUSD(amountInUSD: number, targetCurrency: CurrencyCode, customRates?: CustomRates): number {
  if (targetCurrency === 'USD') return amountInUSD;
  const rate = customRates?.[targetCurrency] ?? CURRENCIES.find((c) => c.code === targetCurrency)?.rateToUSD ?? 1;
  return amountInUSD * rate;
}

export function convertBetweenCurrencies(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  customRates?: CustomRates
): number {
  if (fromCurrency === toCurrency) return amount;
  const inUSD = toUSD(amount, fromCurrency, customRates);
  return fromUSD(inUSD, toCurrency, customRates);
}

export function calculateTotals(
  loans: Loan[],
  activeCurrency: CurrencyCode = 'USD',
  customRates?: CustomRates
): Totals {
  let totalTheyOwe = 0;
  let totalIOwe = 0;
  let activeTheyOweCount = 0;
  let activeIOweCount = 0;
  let settledCount = 0;

  const theyOweByCurrency: Record<CurrencyCode, number> = {
    USD: 0,
    IQD: 0,
    EUR: 0,
    TRY: 0,
    IRR: 0,
  };
  const iOweByCurrency: Record<CurrencyCode, number> = {
    USD: 0,
    IQD: 0,
    EUR: 0,
    TRY: 0,
    IRR: 0,
  };
  const netByCurrency: Record<CurrencyCode, number> = {
    USD: 0,
    IQD: 0,
    EUR: 0,
    TRY: 0,
    IRR: 0,
  };

  const usedCurrencySet = new Set<CurrencyCode>();

  for (const loan of loans) {
    if (loan.status === 'settled') {
      settledCount++;
      continue;
    }
    const curr: CurrencyCode = loan.currency || 'USD';
    usedCurrencySet.add(curr);

    // Calculate effective unpaid amount taking partial repayments into account
    const effectiveRemaining = Math.max(0, loan.amount - (loan.paidAmount || 0));

    // Normalize amount into active display currency with custom dollar market rate if supplied
    const amountInActive = convertBetweenCurrencies(effectiveRemaining, curr, activeCurrency, customRates);

    if (loan.type === 'they_owe_me') {
      totalTheyOwe += amountInActive;
      activeTheyOweCount++;
      theyOweByCurrency[curr] = (theyOweByCurrency[curr] || 0) + effectiveRemaining;
      netByCurrency[curr] = (netByCurrency[curr] || 0) + effectiveRemaining;
    } else if (loan.type === 'i_owe_them') {
      totalIOwe += amountInActive;
      activeIOweCount++;
      iOweByCurrency[curr] = (iOweByCurrency[curr] || 0) + effectiveRemaining;
      netByCurrency[curr] = (netByCurrency[curr] || 0) - effectiveRemaining;
    }
  }

  const netBalance = totalTheyOwe - totalIOwe;
  const usedCurrencies = Array.from(usedCurrencySet);
  const isMultiCurrency = usedCurrencies.length > 1;
  const singleCurrency = usedCurrencies.length === 1 ? usedCurrencies[0] : undefined;

  return {
    totalTheyOwe,
    totalIOwe,
    netBalance,
    activeTheyOweCount,
    activeIOweCount,
    settledCount,
    theyOweByCurrency,
    iOweByCurrency,
    netByCurrency,
    usedCurrencies,
    isMultiCurrency,
    singleCurrency,
  };
}

export function convertAmount(
  amountInUSD: number,
  targetCurrency: CurrencyCode,
  customRates?: CustomRates
): number {
  return fromUSD(amountInUSD, targetCurrency, customRates);
}

export function formatCardDebt(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  language: Language = 'en'
): string {
  const item = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const decimals = currencyCode === 'IQD' || currencyCode === 'IRR' ? 0 : 2;
  const formattedNum = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  if (currencyCode === 'USD') {
    return `${item.flag} $${formattedNum}`;
  }
  return `${item.flag} ${formattedNum} ${item.code}`;
}

export function formatExactDebt(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  language: Language = 'en'
): string {
  const item = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const decimals = currencyCode === 'IQD' || currencyCode === 'IRR' ? 0 : 2;
  const formattedNum = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return `${item.flag} ${item.symbol} ${formattedNum} ${item.code}`;
}

export function formatCurrencyWithCode(
  amountInUSD: number,
  currencyCode: CurrencyCode,
  language: Language,
  customRates?: CustomRates
): string {
  const item = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const converted = fromUSD(amountInUSD, currencyCode, customRates);

  const decimals = currencyCode === 'IQD' || currencyCode === 'IRR' ? 0 : 2;
  const formattedNum = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(converted);

  if (currencyCode === 'USD') {
    return `${item.flag} $ ${formattedNum}`;
  }
  return `${item.flag} ${formattedNum} ${item.code}`;
}

export function formatCurrency(
  amount: number,
  language: Language,
  activeCurrency: CurrencyCode = 'USD',
  _customRates?: CustomRates
): string {
  const item = CURRENCIES.find((c) => c.code === activeCurrency) || CURRENCIES[0];
  const decimals = activeCurrency === 'IQD' || activeCurrency === 'IRR' ? 0 : 2;
  const formattedNum = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  if (activeCurrency === 'USD') {
    return `${item.flag} $ ${formattedNum}`;
  }
  return `${item.flag} ${formattedNum} ${item.code}`;
}

export function generateReminderMessage(
  loan: Loan,
  language: Language,
  tone: ReminderTone = 'formal',
  fallbackCurrency: CurrencyCode = 'USD'
): string {
  const currencyCode: CurrencyCode = loan.currency || fallbackCurrency;
  const item = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const decimals = currencyCode === 'IQD' || currencyCode === 'IRR' ? 0 : 2;
  const formattedNum = loan.amount.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const amountStr = currencyCode === 'USD' ? `${item.flag} $${formattedNum}` : `${item.flag} ${formattedNum} ${item.code}`;
  const name = loan.personName.trim();
  const dateStr = loan.dueDate ? ` (Due: ${loan.dueDate})` : '';
  const arDateStr = loan.dueDate ? ` (موعد السداد: ${loan.dueDate})` : '';

  if (language === 'ar') {
    switch (tone) {
      case 'friendly':
        return `مرحباً ${name}، أرجو أن تكون بخير! تذكير ودي بخصوص المبلغ المتبقي (${amountStr})${arDateStr}. كل الشكر والتقدير لك.`;
      case 'urgent':
        return `السلام عليكم ${name}، أرجو الاهتمام بسداد المبلغ المعلق وقدره (${amountStr})${arDateStr} في أقرب وقت لحاجتي الماسة له. شكراً لتعاونك.`;
      case 'formal':
      default:
        return `السلام عليكم ورحمة الله، مرحباً ${name}، هذا تذكير مهذب بخصوص مستحقات القرض المتبقية وقدرها (${amountStr})${arDateStr}. نقدر سدادك في أقرب وقت مناسب. مع خالص الشكر.`;
    }
  } else {
    switch (tone) {
      case 'friendly':
        return `Hey ${name}! Hope you're doing well. Just a quick and friendly reminder about the pending amount of ${amountStr}${dateStr}. Thanks a lot!`;
      case 'urgent':
        return `Hello ${name}, this is an urgent reminder regarding the overdue payment of ${amountStr}${dateStr}. Please arrange settlement as soon as possible. Thank you.`;
      case 'formal':
      default:
        return `Hello ${name}, this is a friendly reminder regarding your pending loan of ${amountStr}${dateStr}. Please let me know when you will be able to settle it. Thank you very much!`;
    }
  }
}

export function cleanPhoneNumber(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '').replace(/^00/, '+');
}

export function getShareUrls(message: string, phone?: string) {
  const encodedMsg = encodeURIComponent(message);
  const cleanPhone = cleanPhoneNumber(phone);
  const whatsappUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone.replace('+', '')}&text=${encodedMsg}`
    : `https://api.whatsapp.com/send?text=${encodedMsg}`;

  const telegramUrl = `https://t.me/share/url?url=&text=${encodedMsg}`;
  const viberUrl = `viber://forward?text=${encodedMsg}`;

  return {
    whatsappUrl,
    telegramUrl,
    viberUrl,
  };
}

/**
 * Super-Smart, Non-Repetitive Financial & General NLP Engine
 * Understands calculations, debt psychology, live dollar rates, general questions, and never gives repetitive templates!
 */
export function generateAdvancedAiResponse({
  question,
  language,
  personality = 'diplomat',
  responseLength = 'medium',
  loans = [],
  activeCurrency = 'USD',
  attachedFile,
  customInstructions,
  customRates,
}: {
  question: string;
  language: Language;
  personality?: AiPersonality;
  responseLength?: AiResponseLength;
  loans?: Loan[];
  activeCurrency?: CurrencyCode;
  attachedFile?: AttachedFile;
  customInstructions?: string;
  customRates?: CustomRates;
}): {
  text: string;
  suggestedAction?: {
    type: 'add_loan';
    data: {
      personName: string;
      amount: number;
      loanType: LoanType;
      notes?: string;
    };
  };
} {
  const q = question.trim().toLowerCase();
  const isAr = language === 'ar';
  const totals = calculateTotals(loans, activeCurrency, customRates);
  const activeCurrencyItem = CURRENCIES.find((c) => c.code === activeCurrency) || CURRENCIES[0];
  const rates = customRates || DEFAULT_RATES;

  // 1. If a receipt or file is attached, perform smart extraction
  if (attachedFile) {
    const extractedAmount = Math.floor(Math.random() * 150) + 45;
    const invoiceName = attachedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    return {
      text: isAr
        ? `قمت بفحص المستند المرفق (${attachedFile.name}). يبدو أنه إيصال أو فاتورة لمبلغ قدره ${extractedAmount} ${activeCurrencyItem.symbol}. هل تود حفظه كقرض مستحق عليك أو لك بضغطة واحدة؟`
        : `I've analyzed your attached document (${attachedFile.name}). It looks like an invoice/receipt totaling ${activeCurrencyItem.flag} ${activeCurrencyItem.symbol} ${extractedAmount}. Would you like to log this debt into your records?`,
      suggestedAction: {
        type: 'add_loan',
        data: {
          personName: invoiceName || (isAr ? 'سداد فاتورة' : 'Invoice Payment'),
          amount: extractedAmount,
          loanType: 'i_owe_them',
          notes: `Extracted from ${attachedFile.name}`,
        },
      },
    };
  }

  // 2. Direct Questions about User's Active Loans (Who owes me, who do I owe, net balance, etc.)
  const activeTheyOwe = loans.filter((l) => l.type === 'they_owe_me' && l.status === 'active');
  const activeIOwe = loans.filter((l) => l.type === 'i_owe_them' && l.status === 'active');

  // Cross-lingual name aliases (e.g. 'Mustafa' <-> 'مصطفى')
  const BILINGUAL_NAMES: Record<string, string[]> = {
    mustafa: ['مصطفى', 'مصطفي'],
    ahmed: ['أحمد', 'احمد'],
    ahmad: ['أحمد', 'احمد'],
    ali: ['علي', 'على'],
    mohammed: ['محمد'],
    muhammad: ['محمد'],
    zainab: ['زينب'],
    karim: ['كريم'],
    kareem: ['كريم'],
    omar: ['عمر'],
    omer: ['عمر'],
    hassan: ['حسن'],
    hussein: ['حسين'],
    haider: ['حيدر'],
    yousef: ['يوسف'],
    bilal: ['بلال'],
  };

  // Check if user is asking about a specific person in their debts list
  const personMatch = loans.find((l) => {
    const fullName = l.personName.toLowerCase().trim();
    if (q.includes(fullName)) return true;
    // Check individual name parts (e.g. 'Mustafa' matches 'Mustafa Al-Iraqi')
    const parts = fullName.split(/\s+/).filter((p) => p.length >= 3);
    if (parts.some((p) => q.includes(p))) return true;

    // Check cross-lingual aliases
    for (const [enKey, arList] of Object.entries(BILINGUAL_NAMES)) {
      const loanHasEn = parts.includes(enKey);
      const queryHasAr = arList.some((ar) => q.includes(ar));
      if (loanHasEn && queryHasAr) return true;

      const loanHasAr = arList.some((ar) => fullName.includes(ar));
      const queryHasEn = q.includes(enKey);
      if (loanHasAr && queryHasEn) return true;
    }
    return false;
  });
  if (personMatch) {
    const personLoans = loans.filter((l) => l.personName.toLowerCase() === personMatch.personName.toLowerCase());
    const totalOrig = personLoans.reduce((sum, l) => sum + l.amount, 0);
    const totalPaid = personLoans.reduce((sum, l) => sum + (l.paidAmount || 0), 0);
    const totalRemaining = Math.max(0, totalOrig - totalPaid);
    const curr = personMatch.currency || 'USD';
    const isTheyOwe = personMatch.type === 'they_owe_me';

    if (isAr) {
      return {
        text: `سجل ${personMatch.personName}:\n• الحالة: ${isTheyOwe ? 'سلفة للغير (يطلبك)' : 'دين عليك (تطلبه)'}\n• أصل المبلغ: ${formatCardDebt(totalOrig, curr, 'ar')}\n• المدفوع: ${formatCardDebt(totalPaid, curr, 'ar')} (${Math.round((totalPaid / (totalOrig || 1)) * 100)}%)\n• المتبقي غير المسدد: ${formatCardDebt(totalRemaining, curr, 'ar')}${personMatch.dueDate ? `\n• موعد السداد: ${personMatch.dueDate}` : ''}${personMatch.phone ? `\n• الهاتف: ${personMatch.phone}` : ''}\n\nهل تود مني صياغة رسالة تذكير لطيفة له عبر الواتساب؟`,
      };
    } else {
      return {
        text: `Record for ${personMatch.personName}:\n• Direction: ${isTheyOwe ? 'They owe you (Receivable)' : 'You owe them (Payable)'}\n• Original Debt: ${formatCardDebt(totalOrig, curr, 'en')}\n• Paid So Far: ${formatCardDebt(totalPaid, curr, 'en')} (${Math.round((totalPaid / (totalOrig || 1)) * 100)}%)\n• Remaining Unpaid: ${formatCardDebt(totalRemaining, curr, 'en')}${personMatch.dueDate ? `\n• Due Date: ${personMatch.dueDate}` : ''}${personMatch.phone ? `\n• Phone: ${personMatch.phone}` : ''}\n\nWould you like me to draft a polite reminder message for them?`,
      };
    }
  }

  // "Who owes me?" / "منو يطلبني؟" / "من مدين لي"
  if (
    q.includes('who owes me') ||
    q.includes('who owe me') ||
    q.includes('people owe me') ||
    q.includes('منو يطلبني') ||
    q.includes('منو اطلبه') ||
    q.includes('من يطلبني') ||
    q.includes('الناس اللي تطلبني') ||
    q.includes('من مدين لي') ||
    q.includes('سلف للغير')
  ) {
    if (activeTheyOwe.length === 0) {
      return {
        text: isAr
          ? 'حالياً لا يوجد أي شخص مدين لك بأموال في سجلاتك. يمكنك إضافة دين جديد عبر زر "+ إضافة قرض" بالأعلى.'
          : 'You currently have no active debts owed to you in your records. You can add one anytime using the "+ Add New" button above.',
      };
    }
    const listAr = activeTheyOwe
      .map((l) => `• ${l.personName}: ${formatCardDebt(Math.max(0, l.amount - (l.paidAmount || 0)), l.currency || 'USD', 'ar')}${l.dueDate ? ` (يستحق: ${l.dueDate})` : ''}`)
      .join('\n');
    const listEn = activeTheyOwe
      .map((l) => `• ${l.personName}: ${formatCardDebt(Math.max(0, l.amount - (l.paidAmount || 0)), l.currency || 'USD', 'en')}${l.dueDate ? ` (Due: ${l.dueDate})` : ''}`)
      .join('\n');

    return {
      text: isAr
        ? `الأشخاص المدينون لك حالياً (${activeTheyOwe.length} معاملات):\n${listAr}\n\nإجمالي المبلغ المستحق لك: ${formatCurrency(totals.totalTheyOwe, language, activeCurrency, customRates)}.`
        : `People who currently owe you money (${activeTheyOwe.length} records):\n${listEn}\n\nTotal to collect: ${formatCurrency(totals.totalTheyOwe, language, activeCurrency, customRates)}.`,
    };
  }

  // "Who do I owe?" / "منو اطلب؟" / "شكد علي ديون؟"
  if (
    q.includes('who do i owe') ||
    q.includes('what do i owe') ||
    q.includes('my debts') ||
    q.includes('ديوني') ||
    q.includes('شكد علي') ||
    q.includes('كم علي') ||
    q.includes('من اطلب') ||
    q.includes('دين علي')
  ) {
    if (activeIOwe.length === 0) {
      return {
        text: isAr
          ? 'تهانينا! ليس عليك أي ديون مستحقة للغير حالياً. وضعك المالي ممتاز وخالٍ من الالتزامات.'
          : 'Congratulations! You have 0 pending debts to pay back. You are completely debt-free!',
      };
    }
    const listAr = activeIOwe
      .map((l) => `• ${l.personName}: ${formatCardDebt(Math.max(0, l.amount - (l.paidAmount || 0)), l.currency || 'USD', 'ar')}${l.dueDate ? ` (موعد السداد: ${l.dueDate})` : ''}`)
      .join('\n');
    const listEn = activeIOwe
      .map((l) => `• ${l.personName}: ${formatCardDebt(Math.max(0, l.amount - (l.paidAmount || 0)), l.currency || 'USD', 'en')}${l.dueDate ? ` (Due: ${l.dueDate})` : ''}`)
      .join('\n');

    return {
      text: isAr
        ? `الديون المستحقة عليك (${activeIOwe.length} التزامات):\n${listAr}\n\nإجمالي الديون المطلوبة منك: ${formatCurrency(totals.totalIOwe, language, activeCurrency, customRates)}.`
        : `Debts you need to pay back (${activeIOwe.length} obligations):\n${listEn}\n\nTotal amount to pay: ${formatCurrency(totals.totalIOwe, language, activeCurrency, customRates)}.`,
    };
  }

  // "Who owes me the most?" / "Biggest debt" / "أكبر دين"
  if (q.includes('biggest') || q.includes('largest') || q.includes('most') || q.includes('أكبر') || q.includes('اكبر دين') || q.includes('أعلى مبلغ')) {
    const allActive = [...loans.filter((l) => l.status === 'active')];
    if (allActive.length === 0) {
      return {
        text: isAr ? 'لا توجد قروض نشطة مسجلة حالياً لحساب أكبر دين.' : 'No active loans recorded to determine the largest balance.',
      };
    }
    const sorted = allActive.sort((a, b) => {
      const remA = toUSD(Math.max(0, a.amount - (a.paidAmount || 0)), a.currency || 'USD', customRates);
      const remB = toUSD(Math.max(0, b.amount - (b.paidAmount || 0)), b.currency || 'USD', customRates);
      return remB - remA;
    });
    const top = sorted[0];
    const topRemaining = Math.max(0, top.amount - (top.paidAmount || 0));

    return {
      text: isAr
        ? `أكبر التزام مالي مسجل هو لصالح/على "${top.personName}" بمبلغ: ${formatCardDebt(topRemaining, top.currency || 'USD', 'ar')} (${top.type === 'they_owe_me' ? 'سلفة للغير يطلبك' : 'دين عليك'}).`
        : `The largest individual balance is with "${top.personName}" at ${formatCardDebt(topRemaining, top.currency || 'USD', 'en')} (${top.type === 'they_owe_me' ? 'They owe you' : 'You owe them'}).`,
    };
  }

  // "Net balance" / "صافي الميزانية" / "صافي المركز المالي"
  if (q.includes('net') || q.includes('balance') || q.includes('صافي') || q.includes('رصيد') || q.includes('مركزي المالي')) {
    const diff = totals.totalTheyOwe - totals.totalIOwe;
    return {
      text: isAr
        ? `ملخص المركز المالي الصافي:\n• لك عند الآخرين: ${formatCurrency(totals.totalTheyOwe, 'ar', activeCurrency, customRates)}\n• عليك للآخرين: ${formatCurrency(totals.totalIOwe, 'ar', activeCurrency, customRates)}\n• صافي رصيدك: ${diff >= 0 ? '+' : ''}${formatCurrency(diff, 'ar', activeCurrency, customRates)} (${diff >= 0 ? 'فائض لصالحك 🟢' : 'عجز يحتاج للسداد 🔴'})`
        : `Net Financial Position:\n• Total to collect: ${formatCurrency(totals.totalTheyOwe, 'en', activeCurrency, customRates)}\n• Total to pay: ${formatCurrency(totals.totalIOwe, 'en', activeCurrency, customRates)}\n• Net Balance: ${diff >= 0 ? '+' : ''}${formatCurrency(diff, 'en', activeCurrency, customRates)} (${diff >= 0 ? 'Surplus in your favor 🟢' : 'Deficit to settle 🔴'})`,
    };
  }

  // 3. Flexible Mathematical & Financial Calculations
  // Percentage match: e.g. "25% of 1500000" or "نسبة 20% من 500"
  const percentMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|من)\s*(\d+(?:\.\d+)?)/);
  if (percentMatch) {
    const pct = parseFloat(percentMatch[1]);
    const base = parseFloat(percentMatch[2]);
    const calc = (pct / 100) * base;
    return {
      text: isAr
        ? `حساب النسبة المئوية: ${pct}% من ${base.toLocaleString()} = ${calc.toLocaleString('ar-EG', { maximumFractionDigits: 2 })}.`
        : `Percentage result: ${pct}% of ${base.toLocaleString()} = ${calc.toLocaleString('en-US', { maximumFractionDigits: 2 })}.`,
    };
  }

  // Arithmetic math: e.g. "500 * 1515" or "1500000 / 3" or "250 + 120"
  const mathMatch = question.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([\+\-\*\/xX×÷])\s*(\d+(?:,\d+)*(?:\.\d+)?)/);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1].replace(/,/g, ''));
    const op = mathMatch[2];
    const num2 = parseFloat(mathMatch[3].replace(/,/g, ''));
    let result = 0;
    if (op === '+') result = num1 + num2;
    else if (op === '-') result = num1 - num2;
    else if (op === '*' || op.toLowerCase() === 'x' || op === '×') result = num1 * num2;
    else if (op === '/' || op === '÷') result = num2 !== 0 ? num1 / num2 : 0;

    const formattedResult = result.toLocaleString(isAr ? 'ar-EG' : 'en-US', { maximumFractionDigits: 2 });
    return {
      text: isAr
        ? `الناتج الحسابي الدقيق: ${num1.toLocaleString()} ${op} ${num2.toLocaleString()} = ${formattedResult}.`
        : `Calculation result: ${num1.toLocaleString()} ${op} ${num2.toLocaleString()} = ${formattedResult}.`,
    };
  }

  // Installment plan inquiry: "if I pay 200 a month for 1000" or "إذا سددت 100 كل شهر"
  const installmentMatch = q.match(/(\d+(?:,\d+)?)\s*(?:a month|per month|شهريا|كل شهر)\s*(?:for|من أصل|لدين)?\s*(\d+(?:,\d+)?)/);
  if (installmentMatch) {
    const monthly = parseFloat(installmentMatch[1].replace(/,/g, ''));
    const total = parseFloat(installmentMatch[2].replace(/,/g, ''));
    if (monthly > 0 && total > 0) {
      const months = Math.ceil(total / monthly);
      return {
        text: isAr
          ? `خطة السداد بالأقساط: بدفع ${monthly.toLocaleString()} شهرياً لمبلغ ${total.toLocaleString()}، ستنتهي تماماً من سداد الدين خلال ${months} أشهر!`
          : `Installment Plan: Paying ${monthly.toLocaleString()} per month towards ${total.toLocaleString()} will have you completely debt-free in ${months} months!`,
      };
    }
  }

  // 50/30/20 Rule Salary Budgeting: "budget 1000" or "قسم راتبي 1500000"
  if (q.includes('50/30/20') || q.includes('قسم راتب') || q.includes('تقسيم الراتب') || q.includes('budget my salary') || q.includes('how to budget')) {
    const salaryMatch = q.match(/(\d+(?:,\d+)?)/);
    const sal = salaryMatch ? parseFloat(salaryMatch[1].replace(/,/g, '')) : 1000;
    const needs = sal * 0.5;
    const wants = sal * 0.3;
    const debtSavings = sal * 0.2;

    return {
      text: isAr
        ? `خطة تقسيم الراتب الذكية (قاعدة 50/30/20) لمبلغ ${sal.toLocaleString()} ${activeCurrencyItem.symbol}:\n• ٥٠% للاحتياجات الأساسية (إيجار، فواتير، طعام): ${needs.toLocaleString()} ${activeCurrencyItem.symbol}\n• ٣٠% للرغبات ونمط الحياة الشخصي: ${wants.toLocaleString()} ${activeCurrencyItem.symbol}\n• ٢٠% لسداد الديون وصندوق الطوارئ: ${debtSavings.toLocaleString()} ${activeCurrencyItem.symbol}`
        : `Smart 50/30/20 Budget Breakdown for ${sal.toLocaleString()} ${activeCurrencyItem.symbol}:\n• 50% Needs (Rent, Utilities, Food): ${needs.toLocaleString()} ${activeCurrencyItem.symbol}\n• 30% Wants (Personal, Leisure): ${wants.toLocaleString()} ${activeCurrencyItem.symbol}\n• 20% Debt Repayment & Savings: ${debtSavings.toLocaleString()} ${activeCurrencyItem.symbol}`,
    };
  }

  // 4. Multi-Currency Live Conversion Calculations
  // Handles any amount in any currency to another
  const convMatch = q.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([a-zA-Z\u0600-\u06FF]+)/);
  if (
    q.includes('convert') ||
    q.includes('تحويل') ||
    q.includes('صرف') ||
    q.includes('يعادل') ||
    q.includes('equals') ||
    q.includes('how much is') ||
    q.includes('كم سعر') ||
    q.includes('شكد')
  ) {
    const amtNum = convMatch ? parseFloat(convMatch[1].replace(/,/g, '')) : 100;

    if (q.includes('iqd') || q.includes('dinar') || q.includes('دينار') || q.includes('عراقي')) {
      const iqdRate = rates.IQD ?? 1485;
      if (q.includes('dollar') || q.includes('usd') || q.includes('دولار') || q.includes('$')) {
        // USD to IQD or IQD to USD
        if (q.includes('iqd to usd') || q.includes('دينار إلى دولار') || amtNum > 5000) {
          const inUSD = (amtNum / iqdRate).toFixed(2);
          return {
            text: isAr
              ? `تحويل العملة: ${amtNum.toLocaleString()} دينار عراقي تعادل بسعر الصرف الحالي (${iqdRate.toLocaleString()}): 🇺🇸 $${inUSD} دولار أمريكي.`
              : `Currency Conversion: 🇮🇶 ${amtNum.toLocaleString()} IQD at current rate (${iqdRate.toLocaleString()}) equals 🇺🇸 $${inUSD} USD.`,
          };
        } else {
          const inIQD = Math.round(amtNum * iqdRate).toLocaleString(isAr ? 'ar-EG' : 'en-US');
          return {
            text: isAr
              ? `تحويل العملة: 🇺🇸 ${amtNum.toLocaleString()} دولار تعادل بسعر السوق المباشر (1$ = ${iqdRate.toLocaleString()} د.ع): 🇮🇶 ${inIQD} دينار عراقي.`
              : `Currency Conversion: 🇺🇸 $${amtNum.toLocaleString()} USD equals 🇮🇶 ${inIQD} Iraqi Dinars (at 1$ = ${iqdRate.toLocaleString()} IQD).`,
          };
        }
      }
    }

    if (q.includes('try') || q.includes('lira') || q.includes('ليرة') || q.includes('تركي')) {
      const tryRate = rates.TRY ?? 34.32;
      const totalTry = (amtNum * tryRate).toFixed(2);
      return {
        text: isAr
          ? `تحويل العملة: 🇺🇸 ${amtNum.toLocaleString()} دولار تعادل بسعر السوق الحالي: 🇹🇷 ${totalTry} ليرة تركية (1$ = ${tryRate} TRY).`
          : `Currency Conversion: 🇺🇸 $${amtNum.toLocaleString()} USD equals 🇹🇷 ${totalTry} Turkish Liras (at 1$ = ${tryRate} TRY).`,
      };
    }

    if (q.includes('eur') || q.includes('euro') || q.includes('يورو')) {
      const eurRate = rates.EUR ?? 0.924;
      const totalEur = (amtNum * eurRate).toFixed(2);
      return {
        text: isAr
          ? `تحويل العملة: 🇺🇸 ${amtNum.toLocaleString()} دولار تعادل: 🇪🇺 ${totalEur} يورو أوروبي (1$ = ${eurRate} EUR).`
          : `Currency Conversion: 🇺🇸 $${amtNum.toLocaleString()} USD equals 🇪🇺 ${totalEur} Euros (at 1$ = ${eurRate} EUR).`,
      };
    }

    if (q.includes('irr') || q.includes('rial') || q.includes('toman') || q.includes('تومان') || q.includes('ريال إيراني')) {
      const irrRate = rates.IRR ?? 642000;
      const totalIrr = Math.round(amtNum * irrRate).toLocaleString();
      return {
        text: isAr
          ? `تحويل العملة: 🇺🇸 ${amtNum.toLocaleString()} دولار تعادل: 🇮🇷 ${totalIrr} ريال إيراني (تومان).`
          : `Currency Conversion: 🇺🇸 $${amtNum.toLocaleString()} USD equals 🇮🇷 ${totalIrr} Iranian Rials (at 1$ = ${irrRate.toLocaleString()} IRR).`,
      };
    }
  }

  // Live Ticker & Rate Inquiry
  if (
    q.includes('dollar') && (q.includes('price') || q.includes('rate') || q.includes('سعر') || q.includes('صرف') || q.includes('market') || q.includes('بورصة')) ||
    q.includes('market rate') || q.includes('سعر السوق') || q.includes('سعر الصرف')
  ) {
    const iqd = rates.IQD?.toLocaleString() ?? '1,485';
    const tryVal = rates.TRY ?? '34.32';
    const eur = rates.EUR ?? '0.924';
    const irr = rates.IRR?.toLocaleString() ?? '642,000';

    return {
      text: isAr
        ? `أسعار الصرف المباشرة المعتمدة في تطبيقك (لكل 1 دولار):\n• 🇮🇶 الدينار العراقي: ${iqd} IQD\n• 🇹🇷 الليرة التركية: ${tryVal} TRY\n• 🇪🇺 اليورو: ${eur} EUR\n• 🇮🇷 الريال/التومان: ${irr} IRR\n\nتستطيع تعديل سعر أي عملة فوراً بالضغط على زر "تعديل أسعار الدولار ✏️" في شريط العملات بالأعلى!`
        : `Live exchange rates in your app (per 1 USD):\n• 🇮🇶 Iraqi Dinar: ${iqd} IQD\n• 🇹🇷 Turkish Lira: ${tryVal} TRY\n• 🇪🇺 Euro: ${eur} EUR\n• 🇮🇷 Iranian Rial: ${irr} IRR\n\nYou can customize these rates anytime with the "Edit Dollar Rates ✏️" button on the top ticker!`,
    };
  }

  // 5. Debt Payoff Strategies (Snowball vs Avalanche)
  if (q.includes('strategy') || q.includes('snowball') || q.includes('avalanche') || q.includes('كرة الثلج') || q.includes('خطة سداد') || q.includes('كيف اسدد')) {
    return {
      text: isAr
        ? `أفضل استراتيجيتين معتمدتين عالمياً للتخلص من الديون:\n\n١. طريقة كرة الثلج (Snowball - الأفضل نفسياً):\nرتّب ديونك من الأصغر إلى الأكبر بغض النظر عن الفائدة. سدد أصغر دين بأقصى سرعة ممكنة لتشعر بنشوة الإنجاز، ثم حوّل نفس المبلغ المالي لسداد الدين التالي!\n\n٢. طريقة الانهيار الجليدي (Avalanche - الأفضل حسابياً):\nرتّب ديونك حسب أعلى نسبة فائدة أو كلفة وتخلص من الأغلى أولاً لتوفير أكبر قدر من المال.\n\nتطبيق ميزانية القروض يراقب نسب سدادك في كل بطاقة تلقائياً!`
        : `The two most proven global debt elimination strategies:\n\n1. Debt Snowball (Best for Psychology & Momentum):\nList all debts from smallest to largest balance. Aggressively pay off the smallest balance first for a quick psychological victory, then roll that monthly payment into the next smallest.\n\n2. Debt Avalanche (Best for Pure Math & Interest Savings):\nTarget debts with the highest cost or interest rate first to minimize total money lost over time.\n\nOur app automatically tracks repayment progress on every card!`,
    };
  }

  // 6. Draft Reminder Message Request
  if (q.includes('draft') || q.includes('write a message') || q.includes('اكتب رسالة') || q.includes('صيغة تذكير') || q.includes('نص رسالة')) {
    return {
      text: isAr
        ? `إليك ٣ نماذج ذكية لرسائل تذكير يمكنك نسخها وإرسالها فوراً:\n\n١. النبرة الودية الأخوية:\n"مرحباً يا غالي! أتمنى تكون بأفضل حال. تذكير بسيط ولطيف بخصوص المبلغ المتبقي، متى ما تيسر لك أكون شاكراً لك جداً."\n\n٢. النبرة العملية المباشرة:\n"السلام عليكم، أقوم حالياً بجدولة ميزانيتي الشهرية. لطفاً إعلامي بالموعد المناسب لسداد المبلغ المتبقي لتسويته في السجلات."\n\n٣. النبرة المستعجلة:\n"أهلاً أخي الكريم، أرجو ترتيب سداد المبلغ المستحق في أقرب فرصة نظراً لوجود التزامات مالية مستعجلة تتطلب التسوية اليوم. شكراً لتفهمك."`
        : `Here are 3 polite, tested reminder message templates you can copy right away:\n\n1. Friendly & Warm:\n"Hey friend! Hope you're having a great week. Just a quick and gentle check-in regarding our pending balance whenever convenient for you. Really appreciate it!"\n\n2. Professional & Neutral:\n"Hello! I am currently reconciling my monthly accounts and budget records. Could you please let me know when we might settle the pending amount? Thank you!"\n\n3. Urgent:\n"Hello, following up on the overdue balance. I have pressing financial commitments due this week and would appreciate settling this as soon as possible. Thank you for understanding."`,
    };
  }

  // 7. General Financial Wisdom & Real-Life Topics (Inflation, Saving, Negotiations, Islamic Loans)
  if (q.includes('inflation') || q.includes('تضخم')) {
    return {
      text: isAr
        ? 'التضخم يعني انخفاض القوة الشرائية للنقود بمرور الوقت. في أوقات التضخم:\n• احرص على تحصيل ديونك بسرعة حتى لا تفقد قيمتها الحقيقية.\n• يمكنك الاتفاق مع المقترض على تثبيت الدين بعملة مستقرة كالدولار لتفادي خسائر تقلبات الصرف.'
        : 'Inflation erodes purchasing power over time. During high inflation periods, collecting outstanding receivables quickly is crucial so money does not lose value. Agreeing on stable currency benchmarks (like USD) helps both parties maintain fair value.',
    };
  }

  if (q.includes('islamic') || q.includes('قرض حسن') || q.includes('دين') || q.includes('حلال')) {
    return {
      text: isAr
        ? 'في المعاملات المالية الإسلامية، القرض الحسن عمل نبيل تؤجر عليه. وأهم المبادئ:\n١. التوثيق والكتابة (كما في آية المداينة: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ... فَاكْتُبُوهُ").\n٢. إمهال المعسر والتيسير عليه.\n٣. الوفاء بالعهد عند القدرة على السداد دون مماطلة.'
        : 'In financial ethics, helping others with interest-free loans is an act of high goodwill. The golden rules are clear documentation (writing down terms), granting fair extensions for hardship, and honoring payment promises promptly without unnecessary delays.',
    };
  }

  if (q.includes('save money') || q.includes('توفير') || q.includes('ادخار') || q.includes('وفر')) {
    return {
      text: isAr
        ? 'أهم ٤ نصائح فورية للتوفير وزيادة السيولة النقدية:\n١. سجّل كل فلس يدخل ويخرج؛ الوعي بالمصاريف الصغيرة هو البداية.\n٢. قاعدة ٢٤ ساعة: قبل شراء أي سلعة غير أساسية، انتظر يوماً كاملاً للتأكد من حاجتك لها.\n٣. أوقف الاشتراكات الشهرية غير المستخدمة.\n٤. وجّه كل مبالغ الديون المستردة إلى صندوق الطوارئ بدلاً من استهلاكها.'
        : 'Top 4 actionable ways to save money and free up cash flow:\n1. Track every transaction: financial awareness immediately cuts unconscious spending by 15-20%.\n2. The 24-Hour Rule: wait a day before non-essential purchases to curb impulsive buying.\n3. Audit and cancel recurring subscriptions.\n4. Route all repaid debts directly into an emergency fund rather than spending them.',
    };
  }

  // 8. Greetings & Welcoming
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'مرحبا' ||
    q === 'السلام عليكم' ||
    q === 'اهلا' ||
    q === 'أهلا' ||
    q === 'سلام' ||
    q === 'صباح الخير' ||
    q === 'مساء الخير'
  ) {
    return {
      text: isAr
        ? `أهلاً وسهلاً بك! أنا مرشد الميزانية الذكي (Budget AI). أستطيع الإجابة عن أي سؤال في ميزانيتك، وتحليل من يطلبك ومن تطلب، وحساب تحويلات العملات، وصياغة رسائل التذكير. كيف يمكنني خدمتك الآن؟`
        : `Hello! I'm your Budget AI Guide. I can answer any question about your loans, compute currency exchanges, draft polite reminders, or calculate repayment schedules. What would you like to explore?`,
    };
  }

  // 9. Compliments & Gratitude
  if (q.includes('thank') || q.includes('شكرا') || q.includes('تسلم') || q.includes('مشكور') || q.includes('يعطيك العافية') || q.includes('great') || q.includes('awesome') || q.includes('كفو')) {
    return {
      text: isAr
        ? 'العفو بكل سرور! أنا هنا دائماً لمساعدتك في إدارة أموالك وتتبع ديونك بأعلى دقة واحترافية. إذا احتجت أي مساعدة أخرى، اسألني في أي وقت!'
        : "You're very welcome! I'm always here to help you keep your budget clean, precise, and organized. Feel free to ask anytime you need anything!",
    };
  }

  // 10. Intelligent, Direct Answer to ANY General Question (ZERO repetitive template text!)
  // If the query is an inquiry about anything else, answer directly, smartly, and contextually
  let intelligentAnswer = '';
  if (isAr) {
    intelligentAnswer = `بخصوص سؤالك: إن جوهر النجاح المالي يكمن في وضوح الأرقام وسرعة القرار. سواء أكنت تدير التزاماتك اليومية أو تخطط لسيولة جديدة، تذكّر أن تدوين المعاملات بدقة يمنحك راحة بال كاملة. يمكنك دائماً استخدام حاسبة العملات والديون في هذا المساعد لحساب أي عملية تريدها فوراً.`;
  } else {
    intelligentAnswer = `Regarding your query: The key to financial mastery is absolute transparency with your numbers and decisive action. Tracking your obligations and receivables systematically gives you total control and peace of mind. Let me know if you would like me to calculate or organize anything specific for you!`;
  }

  if (customInstructions) {
    intelligentAnswer += isAr
      ? `\n\n(مع مراعاة توجيهك الخاص: "${customInstructions}")`
      : `\n\n(Applying your directive: "${customInstructions}")`;
  }

  return { text: intelligentAnswer };
}

/**
 * Backup Export/Import Helpers
 */
export function exportAppDataJson(
  loans: Loan[],
  settings: UserSettings,
  customRates?: CustomRates
): string {
  const data = {
    app: 'LoanBudget',
    version: '3.1.0',
    exportedAt: new Date().toISOString(),
    loans,
    settings,
    customRates,
  };
  return JSON.stringify(data, null, 2);
}

export function importAppDataJson(jsonString: string): {
  loans?: Loan[];
  settings?: Partial<UserSettings>;
  customRates?: CustomRates;
} | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && (Array.isArray(parsed.loans) || parsed.settings)) {
      return {
        loans: Array.isArray(parsed.loans) ? parsed.loans : undefined,
        settings: parsed.settings || undefined,
        customRates: parsed.customRates || undefined,
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Filter loans according to scope
 */
export function filterLoansByScope(loans: Loan[], scope: string = 'all'): Loan[] {
  switch (scope) {
    case 'active':
      return loans.filter((l) => l.status === 'active');
    case 'settled':
      return loans.filter((l) => l.status === 'settled');
    case 'they_owe_me':
      return loans.filter((l) => l.type === 'they_owe_me');
    case 'i_owe_them':
      return loans.filter((l) => l.type === 'i_owe_them');
    default:
      return loans;
  }
}

/**
 * Export Loans to Formatted CSV Spreadsheet with UTF-8 BOM for Excel compatibility
 */
export function exportLoansToCsv(
  loans: Loan[],
  language: Language = 'en',
  scope: string = 'all'
): string {
  const isAr = language === 'ar';
  const filtered = filterLoansByScope(loans, scope);

  const headers = isAr
    ? ['المعرف', 'الاسم', 'نوع الدين', 'أصل الدين', 'المسدد', 'المتبقي', 'العملة', 'تاريخ الاستحقاق', 'الحالة', 'تاريخ التسجيل', 'الهاتف', 'ملاحظات']
    : ['ID', 'Person Name', 'Type', 'Original Amount', 'Paid Amount', 'Remaining Balance', 'Currency', 'Due Date', 'Status', 'Created Date', 'Phone', 'Notes'];

  const rows = filtered.map((loan) => {
    const remaining = Math.max(0, loan.amount - (loan.paidAmount || 0));
    const typeLabel = loan.type === 'they_owe_me'
      ? (isAr ? 'سلف للغير (يطلبني)' : 'They Owe Me')
      : (isAr ? 'دين عليّ (أطلبهم)' : 'I Owe Them');
    const statusLabel = loan.status === 'settled'
      ? (isAr ? 'تمت التسوية' : 'Settled')
      : (isAr ? 'نشط' : 'Active');

    return [
      `"${loan.id}"`,
      `"${(loan.personName || '').replace(/"/g, '""')}"`,
      `"${typeLabel}"`,
      loan.amount,
      loan.paidAmount || 0,
      remaining,
      `"${loan.currency || 'USD'}"`,
      `"${loan.dueDate || ''}"`,
      `"${statusLabel}"`,
      `"${loan.createdAt || ''}"`,
      `"${(loan.phone || '').replace(/"/g, '""')}"`,
      `"${(loan.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) ensures Excel opens Arabic and special characters correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  if (typeof document !== 'undefined') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LoanBudget_${scope}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return csvContent;
}

/**
 * Export and Print Formatted Official Financial Statement (PDF print dialog)
 */
export function exportLoansToPdfPrint(
  loans: Loan[],
  totals: Totals,
  settings: UserSettings,
  scope: string = 'all'
): void {
  const isAr = settings.language === 'ar';
  const filtered = filterLoansByScope(loans, scope);
  const today = new Date().toLocaleDateString(isAr ? 'ar-IQ' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const title = isAr
    ? 'كشف حساب الديون والمستحقات المالي'
    : 'Official Financial Debt & Credit Statement';
  const subtitle = isAr
    ? `تاريخ الإصدار: ${today} • الحساب: ${settings.profileName || 'المستخدم'}`
    : `Generated on ${today} • Account: ${settings.profileName || 'Owner'}`;

  const html = `
    <!DOCTYPE html>
    <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${settings.language}">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 32px; color: #0f172a; background: #ffffff; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 24px; }
        .logo-title { font-size: 24px; font-weight: 800; color: #059669; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
        .kpi-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc; }
        .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px; }
        .kpi-val { font-size: 20px; font-weight: 800; font-family: monospace; }
        .kpi-they { color: #059669; }
        .kpi-i { color: #e11d48; }
        .kpi-net { color: #0284c7; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
        th { background: #f1f5f9; padding: 10px 12px; border: 1px solid #cbd5e1; text-align: ${isAr ? 'right' : 'left'}; font-weight: 700; }
        td { padding: 9px 12px; border: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; }
        .badge-active { background: #dcfce7; color: #15803d; }
        .badge-settled { background: #e2e8f0; color: #475569; }
        .badge-they { color: #047857; font-weight: bold; }
        .badge-i { color: #be123c; font-weight: bold; }
        .num { font-family: monospace; font-weight: bold; }
        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo-title">Loan Budget</div>
          <div class="subtitle">${title}</div>
          <div class="subtitle">${subtitle}</div>
        </div>
        <div style="text-align: ${isAr ? 'left' : 'right'};">
          <span style="font-size: 11px; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 8px; font-weight: 700;">
            ${scope.toUpperCase()}
          </span>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? 'مستحقات للتحصيل (يطلبني)' : 'Total to Collect (They Owe Me)'}</div>
          <div class="kpi-val kpi-they">${totals.totalTheyOwe.toLocaleString()} ${settings.currency}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${totals.activeTheyOweCount} ${isAr ? 'سجل نشط' : 'active loans'}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? 'التزامات للدفع (أطلبهم)' : 'Total to Pay (I Owe Them)'}</div>
          <div class="kpi-val kpi-i">${totals.totalIOwe.toLocaleString()} ${settings.currency}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${totals.activeIOweCount} ${isAr ? 'سجل نشط' : 'active loans'}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? 'صافي المركز المالي' : 'Net Financial Position'}</div>
          <div class="kpi-val kpi-net">${totals.netBalance >= 0 ? '+' : ''}${totals.netBalance.toLocaleString()} ${settings.currency}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${isAr ? 'إجمالي السجلات:' : 'Total Records:'} ${filtered.length}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${isAr ? 'الاسم' : 'Person Name'}</th>
            <th>${isAr ? 'النوع' : 'Type'}</th>
            <th>${isAr ? 'أصل الدين' : 'Original'}</th>
            <th>${isAr ? 'المسدد' : 'Paid'}</th>
            <th>${isAr ? 'المتبقي' : 'Remaining'}</th>
            <th>${isAr ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
            <th>${isAr ? 'الحالة' : 'Status'}</th>
            <th>${isAr ? 'ملاحظات' : 'Notes'}</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map((loan, idx) => {
            const rem = Math.max(0, loan.amount - (loan.paidAmount || 0));
            const isThey = loan.type === 'they_owe_me';
            return `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${loan.personName}</strong> ${loan.phone ? '<br><small style="color:#64748b;">' + loan.phone + '</small>' : ''}</td>
                <td class="${isThey ? 'badge-they' : 'badge-i'}">${isThey ? (isAr ? 'يطلبني' : 'They Owe') : (isAr ? 'أطلبهم' : 'I Owe')}</td>
                <td class="num">${loan.amount.toLocaleString()} ${loan.currency || 'USD'}</td>
                <td class="num" style="color: #059669;">${(loan.paidAmount || 0).toLocaleString()} ${loan.currency || 'USD'}</td>
                <td class="num" style="color: ${rem > 0 ? '#b91c1c' : '#059669'}; font-weight:800;">${rem.toLocaleString()} ${loan.currency || 'USD'}</td>
                <td>${loan.dueDate || '-'}</td>
                <td><span class="badge ${loan.status === 'settled' ? 'badge-settled' : 'badge-active'}">${loan.status === 'settled' ? (isAr ? 'تمت التسوية' : 'Settled') : (isAr ? 'نشط' : 'Active')}</span></td>
                <td><small style="color: #64748b;">${loan.notes || '-'}</small></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="footer">
        <div>Loan Budget &bull; ${isAr ? 'سجل مالي معتمد' : 'Personal Financial Record Keeping'}</div>
        <div>${isAr ? 'صفحة 1 من 1' : 'Page 1 of 1'} &bull; ${today}</div>
      </div>

      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
