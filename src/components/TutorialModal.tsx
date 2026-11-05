import React, { useState } from 'react';
import { Language, Translations } from '../types';
import {
  X,
  BookOpen,
  DollarSign,
  Zap,
  TrendingUp,
  MessageSquare,
  Bot,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  translations: Translations;
  onOpenAddLoan?: () => void;
  onOpenMarketRates?: () => void;
  onOpenAiGuide?: () => void;
  onOpenAiAssistant?: () => void;
  onOpenRateEditor?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  language,
  translations,
  onOpenAddLoan,
  onOpenMarketRates,
  onOpenAiGuide,
  onOpenAiAssistant,
  onOpenRateEditor,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const isAr = language === 'ar';

  const steps = [
    {
      icon: DollarSign,
      title: isAr ? '١. تسجيل الديون بالعملات المتعددة' : '1. Multi-Currency Debt Recording',
      badge: 'USD, IQD, TRY, EUR, IRR',
      summary: isAr
        ? 'يمكنك تسجيل أي دين بالعملة التي تم الإقراض بها فعلياً مع إظهار علم الدولة ورمز العملة.'
        : 'Record every loan in its exact lending currency (e.g. 🇮🇶 IQD, 🇺🇸 USD, 🇹🇷 TRY, 🇪🇺 EUR, 🇮🇷 IRR).',
      details: [
        isAr ? 'اختر العملة من القائمة المنسدلة عند إضافة أي قرض جديد.' : 'Select the currency from the dropdown when adding a loan.',
        isAr ? 'تظهر بطاقة الشخص المبلغ الدقيق مع علم الدولة (مثال: 🇮🇶 1,500,000 IQD).' : 'Each card displays the exact debt with its country flag (e.g., 🇮🇶 1,500,000 IQD).',
        isAr ? 'تتم تحويلات الصرف تلقائياً لحساب صافي ثروتك بدقة.' : 'Live conversions calculate your unified net position in real-time.',
      ],
      actionLabel: isAr ? 'إضافة سجل دين' : 'Add Debt Record',
      actionHandler: onOpenAddLoan,
    },
    {
      icon: TrendingUp,
      title: isAr ? '٢. تعديل سعر صرف الدولار الحقيقي' : '2. Custom Live Dollar Market Prices',
      badge: isAr ? 'سعر السوق الموازي' : 'Street & Market Rate',
      summary: isAr
        ? 'اضبط سعر صرف الدولار يدوياً ليتطابق مع سعر السوق الموازي في بلدك (مثل بورصة الكفاح أو سوق إسطنبول).'
        : 'Adjust the live market exchange rate of 1 US Dollar to match your local street or parallel exchange rate.',
      details: [
        isAr ? 'اضغط على زر "تعديل أسعار الدولار ✏️" في شريط أسعار الصرف بالأعلى.' : 'Click "Edit Dollar Rates ✏️" on the live ticker at the top.',
        isAr ? 'أدخل سعر الصرف الدقيق (مثلاً: 1 دولار = 1515 دينار عراقي أو 34.80 ليرة).' : 'Set the exact rate (e.g., 1 USD = 1,515 IQD or 34.80 TRY).',
        isAr ? 'تُحفظ أسعارك محلياً وتُعاد حساب جميع البطاقات والمجموع فوراً!' : 'All cards and dashboard totals update dynamically with your custom rate.',
      ],
      actionLabel: isAr ? 'تعديل أسعار السوق الآن' : 'Edit Market Rates',
      actionHandler: onOpenMarketRates,
    },
    {
      icon: Sparkles,
      title: isAr ? '٣. تاريخ الاستحقاق الإلزامي والتنبيه المتوهج' : '3. Mandatory Due Dates & Glow Alerts',
      badge: isAr ? 'تنبيه ذكي < 3 أيام' : 'Urgency Glow',
      summary: isAr
        ? 'تحديد موعد استحقاق إلزامي لكل دين مع منتقي تقويم مظلم أنيق وتنبيهات بصرية متوهجة.'
        : 'Mandatory due dates for all loans with a sleek dark calendar picker and urgency glow badges.',
      details: [
        isAr ? 'حقل استحقاق إلزامي مع خيارات سريعة (+7 أيام، +15 يوماً، +30 يوماً).' : 'Required due date field with handy +7d, +15d, +30d presets.',
        isAr ? 'توهج برتقالي نيون عند بقاء أقل من ٣ أيام، وتوهج أحمر عند الاستحقاق اليوم أو التأخر.' : 'Soft neon-orange glow when <3 days remain; crimson red when overdue or due today.',
        isAr ? 'حركات سلسة وسبرينج فيزيائي فاخر عند التبديل بين لك وعليك.' : 'Fluid physics-based spring transitions when toggling debt directions.',
      ],
      actionLabel: isAr ? 'إضافة دين جديد' : 'Add Loan Record',
      actionHandler: onOpenAddLoan,
    },
    {
      icon: MessageSquare,
      title: isAr ? '٤. تذكيرات واتساب وتيليجرام الذكية' : '4. Smart WhatsApp & Social Reminders',
      badge: 'WhatsApp, Telegram, Viber',
      summary: isAr
        ? 'صياغة رسائل تذكير مهذبة واحترافية للمدينين وإرسالها بضغطة زر واحدة.'
        : 'Generate polished, relationship-preserving reminder messages and send them in 1 click.',
      details: [
        isAr ? 'اختر النبرة المناسبة: ودية، رسمية، أو مستعجلة وحازمة.' : 'Choose from 3 tones: Friendly & Casual, Professional, or Firm & Urgent.',
        isAr ? 'تتضمن الرسالة المبلغ المحدد بعملته الأصلية واسم الشخص وتاريخ الاستحقاق.' : 'Includes the recipient name, exact debt with currency, and due date.',
        isAr ? 'تفتح تطبيق واتساب أو تيليجرام أو فايبر مباشرة مع الرسالة المجهزة.' : 'Directly launches WhatsApp, Telegram, or Viber ready to send.',
      ],
    },
    {
      icon: Bot,
      title: isAr ? '٥. مرشد الميزانية الذكي وقارئ الفواتير' : '5. Budget AI Guide & Receipt Scanner',
      badge: 'Gemini 3.8 Flash AI',
      summary: isAr
        ? 'مساعد مالي متقدم يجيب عن أي استفسار، يقترح خطط سداد، ويحلل الإيصالات المرفوعة.'
        : 'An advanced conversational AI that answers anything, drafts repayment plans, and analyzes bills.',
      details: [
        isAr ? 'يفهم جميع الأسئلة العامة والمالية ويدعم التحدث بالصوت.' : 'Understands general & financial queries and supports voice dialogue.',
        isAr ? 'أرفق صورة فاتورة ليقوم باستخراج تفاصيل القرض وإضافته بضغطة واحدة.' : 'Attach receipts or invoices to auto-detect and log loans with 1 click.',
        isAr ? 'زر مسح وإعادة تعيين المحادثة 🗑️ لتنظيف الجلسة متى ما رغبت.' : 'Reset chat button 🗑️ to clear conversation on exit or on demand.',
      ],
      actionLabel: isAr ? 'فتح المساعد الذكي' : 'Open AI Guide',
      actionHandler: onOpenAiGuide,
    },
  ];

  const current = steps[activeStep];
  const StepIcon = current.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Banner with Generated Visual Asset */}
        <div className="relative h-36 sm:h-44 w-full bg-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
          <img
            src="/src/assets/images/fintech_tutorial_guide_1793557445028.jpg"
            alt="Fintech Wealth & Debt Intelligence"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Banner Overlaid Header */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'دليل الاستخدام الشامل' : 'Interactive App Guide'}</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg bg-black/40 text-slate-300 hover:text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 id="tutorial-modal-title" className="text-lg sm:text-xl font-extrabold text-white">
                {translations.tutorialTitle}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-1">
                {translations.tutorialSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Step Carousel Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 overflow-x-auto shrink-0 p-2 gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeStep === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{s.title.split('.')[1] || s.title}</span>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-950/20">
              <StepIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  {current.title}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {current.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {current.summary}
              </p>
            </div>
          </div>

          {/* Details list */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isAr ? 'أهم المزايا والخطوات:' : 'Key Highlights & Tips:'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {current.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? 'السابق' : 'Previous'}</span>
            </button>
            <span className="text-xs font-mono text-slate-500">
              {activeStep + 1} / {steps.length}
            </span>
            <button
              type="button"
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {current.actionHandler && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  current.actionHandler?.();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {current.actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isAr ? 'إغلاق الدليل' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
