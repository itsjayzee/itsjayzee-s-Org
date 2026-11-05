import React, { useState, useEffect } from 'react';
import { CurrencyCode, Language, Loan, ReminderTone, Translations } from '../types';
import { generateReminderMessage, getShareUrls, formatCurrency, formatCardDebt } from '../utils/loanLogic';
import { X, Send, Copy, Check, MessageSquareText, Sparkles } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  language: Language;
  translations: Translations;
  activeCurrency?: CurrencyCode;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  loan,
  language,
  translations,
  activeCurrency = 'USD',
}) => {
  const [tone, setTone] = useState<ReminderTone>('formal');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (loan) {
      const generated = generateReminderMessage(loan, language, tone, activeCurrency);
      setMessage(generated);
    }
  }, [loan, language, tone, activeCurrency]);

  if (!isOpen || !loan) return null;

  const handleToneChange = (newTone: ReminderTone) => {
    setTone(newTone);
    if (loan) {
      setMessage(generateReminderMessage(loan, language, newTone, activeCurrency));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = message;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const { whatsappUrl, telegramUrl, viberUrl } = getShareUrls(message, loan.phone);

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div>
              <h2 id="reminder-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>{translations.reminderModalTitle}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {translations.reminderModalSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Target Person Info Pill */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{translations.nameLabel}:</span>
              <span className="font-bold text-white">{loan.personName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{translations.amountLabel}:</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatCardDebt(loan.amount, loan.currency || activeCurrency, language)}
              </span>
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{translations.toneLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleToneChange('friendly')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  tone === 'friendly'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {translations.toneFriendly}
              </button>
              <button
                type="button"
                onClick={() => handleToneChange('formal')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  tone === 'formal'
                    ? 'bg-blue-500/15 border-blue-500/50 text-blue-300 font-semibold shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {translations.toneFormal}
              </button>
              <button
                type="button"
                onClick={() => handleToneChange('urgent')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  tone === 'urgent'
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 font-semibold shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {translations.toneUrgent}
              </button>
            </div>
          </div>

          {/* Message Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="reminder-message-text" className="text-xs font-semibold text-slate-300">
                {translations.reminderPreviewLabel}
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">{translations.messageCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>{translations.copyMessage}</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              id="reminder-message-text"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100 text-xs sm:text-sm leading-relaxed outline-none resize-none transition-all"
            />
          </div>

          {/* Social Sharing Branded Buttons: WhatsApp, Telegram, Viber */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">
              {translations.sendReminder} via
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* WhatsApp (Brand Green #25D366) */}
              <button
                type="button"
                onClick={() => openLink(whatsappUrl)}
                className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl font-semibold text-xs text-white bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
              >
                {/* Official WhatsApp SVG */}
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>{translations.sendViaWhatsApp}</span>
              </button>

              {/* Telegram (Brand Blue #229ED9) */}
              <button
                type="button"
                onClick={() => openLink(telegramUrl)}
                className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl font-semibold text-xs text-white bg-[#229ED9] hover:bg-[#1f8fc4] active:scale-95 shadow-lg shadow-[#229ED9]/20 transition-all cursor-pointer"
              >
                {/* Official Telegram SVG */}
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span>{translations.sendViaTelegram}</span>
              </button>

              {/* Viber (Brand Purple #7360F2) */}
              <button
                type="button"
                onClick={() => openLink(viberUrl)}
                className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl font-semibold text-xs text-white bg-[#7360F2] hover:bg-[#6250e0] active:scale-95 shadow-lg shadow-[#7360F2]/20 transition-all cursor-pointer"
              >
                {/* Official Viber SVG */}
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M19.124 16.592c-.378-.291-2.122-1.066-2.487-1.19-.364-.124-.627-.184-.891.187-.263.372-1.026 1.211-1.257 1.458-.232.247-.463.279-.841.093-.378-.186-1.597-.58-3.042-1.848-1.124-.988-1.884-2.209-2.103-2.581-.22-.372-.023-.573.166-.758.17-.166.378-.433.567-.65.189-.217.252-.372.378-.62.126-.248.063-.465-.032-.651-.095-.186-.85-2.019-1.164-2.763-.306-.724-.617-.626-.848-.638l-.723-.013c-.252 0-.661.093-1.008.465-.347.372-1.323 1.271-1.323 3.1 0 1.829 1.355 3.597 1.544 3.845.189.248 2.664 4.015 6.454 5.626.902.384 1.606.613 2.155.785.906.284 1.73.244 2.381.148.727-.107 2.235-.901 2.55-1.77.315-.869.315-1.613.22-1.77-.095-.156-.347-.248-.725-.439zM12 2C6.477 2 2 6.477 2 12c0 2.215.72 4.261 1.936 5.92L2.6 21.688l3.96-.865A9.95 9.95 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
                <span>{translations.sendViaViber}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
