import React, { useState, useRef, useEffect } from 'react';
import {
  AiPersonality,
  AttachedFile,
  ChatMessage,
  ChatSession,
  CustomRates,
  Language,
  Loan,
  LoanType,
  Translations,
  UserSettings,
} from '../types';
import { generateAdvancedAiResponse } from '../utils/loanLogic';
import { playResetChime } from '../utils/soundEffects';
import {
  Bot,
  Sparkles,
  X,
  Send,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Edit2,
  Paperclip,
  Search,
  PlusCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  Maximize2,
  Minimize2,
  Trash2,
} from 'lucide-react';

interface BudgetAiFABProps {
  language: Language;
  translations: Translations;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  activeSession: ChatSession;
  onUpdateSessionMessages: (messages: ChatMessage[]) => void;
  onNewSession: () => void;
  allLoans: Loan[];
  onAddLoanFromAi: (data: { personName: string; amount: number; type: LoanType; notes?: string }) => void;
  customRates?: CustomRates;
  isExternalOpen?: boolean;
  onToggleExternalOpen?: (open: boolean) => void;
  showFloatingFab?: boolean;
}

export const BudgetAiFAB: React.FC<BudgetAiFABProps> = ({
  language,
  translations,
  settings,
  onUpdateSettings,
  activeSession,
  onUpdateSessionMessages,
  onNewSession,
  allLoans,
  onAddLoanFromAi,
  customRates,
  isExternalOpen,
  onToggleExternalOpen,
  showFloatingFab = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isExternalOpen !== undefined ? isExternalOpen : internalOpen;

  const setOpenState = (open: boolean) => {
    if (onToggleExternalOpen) {
      onToggleExternalOpen(open);
    }
    setInternalOpen(open);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInputText, setEditInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const messages = activeSession.messages;

  // Handle immediate chat reset
  const handleResetCurrentChat = () => {
    const welcomeMsg: ChatMessage = {
      id: 'msg_welcome_' + Date.now(),
      sender: 'assistant',
      text:
        language === 'ar'
          ? 'تم تفريغ المحادثة بنجاح! أنا المساعد المالي الذكي (Budget AI). كيف يمكنني مساعدتك في حساباتك وديونك الآن؟'
          : 'Chat has been reset! I am your Budget AI Guide. How can I help you with your loans, currency rates, or financial budget now?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onUpdateSessionMessages([welcomeMsg]);
    playResetChime(settings.soundEffectsEnabled);
  };

  // Handle assistant close with auto-reset if resetChatOnExit is enabled
  const handleCloseAssistant = () => {
    if (settings.resetChatOnExit) {
      handleResetCurrentChat();
    }
    setOpenState(false);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Clean up speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  // Handle Speech-to-Text Voice Input
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(translations.voiceInputPermissionError);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputValue(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Handle Text-to-Speech Output
  const speakMessage = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Handle Copy Message
  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  // Handle File Upload (Receipts, Invoices, Images)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(translations.fileTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachedFile({
        name: file.name,
        type: file.type,
        base64,
        size: file.size,
        previewUrl: file.type.startsWith('image/') ? base64 : undefined,
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Core Send Message Function
  const handleSendMessage = async (textToSend?: string, overrideHistory?: ChatMessage[]) => {
    const query = (textToSend || inputValue).trim();
    if (!query && !attachedFile) return;

    const userMessage: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFile: attachedFile || undefined,
    };

    const currentHistory = overrideHistory || messages;
    const updatedMessages = [...currentHistory, userMessage];
    onUpdateSessionMessages(updatedMessages);

    setInputValue('');
    const currentAttachment = attachedFile;
    setAttachedFile(null);
    setIsLoading(true);

    try {
      // 1. Attempt server-side Gemini AI call with timeout signal
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout ? AbortSignal.timeout(9000) : undefined,
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
          systemInstruction: settings.customInstructions,
          personality: settings.aiPersonality,
          responseLength: settings.responseLength,
          creativity: settings.creativity,
          language,
          loansContext: allLoans,
          customRates,
          attachedFile: currentAttachment
            ? {
                base64: currentAttachment.base64,
                mimeType: currentAttachment.type,
                name: currentAttachment.name,
              }
            : undefined,
        }),
      });

      let aiResultText = '';
      let suggestedAction: any = undefined;

      if (response.ok) {
        const data = await response.json();
        if (data.fallback || !data.text) {
          // Use intelligent local engine fallback
          const localRes = generateAdvancedAiResponse({
            question: query,
            language,
            personality: settings.aiPersonality,
            responseLength: settings.responseLength,
            loans: allLoans,
            activeCurrency: settings.currency,
            attachedFile: currentAttachment || undefined,
            customInstructions: settings.customInstructions,
            customRates,
          });
          aiResultText = localRes.text;
          suggestedAction = localRes.suggestedAction;
        } else {
          aiResultText = data.text;
        }
      } else {
        // Fallback on HTTP error
        const localRes = generateAdvancedAiResponse({
          question: query,
          language,
          personality: settings.aiPersonality,
          responseLength: settings.responseLength,
          loans: allLoans,
          activeCurrency: settings.currency,
          attachedFile: currentAttachment || undefined,
          customInstructions: settings.customInstructions,
          customRates,
        });
        aiResultText = localRes.text;
        suggestedAction = localRes.suggestedAction;
      }

      const aiMessage: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'assistant',
        text: aiResultText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      onUpdateSessionMessages([...updatedMessages, aiMessage]);

      // Auto-voice response if setting enabled
      if (settings.autoVoiceResponse) {
        speakMessage(aiMessage.id, aiResultText);
      }
    } catch {
      // Graceful offline fallback
      const localRes = generateAdvancedAiResponse({
        question: query,
        language,
        personality: settings.aiPersonality,
        responseLength: settings.responseLength,
        loans: allLoans,
        activeCurrency: settings.currency,
        attachedFile: currentAttachment || undefined,
        customInstructions: settings.customInstructions,
        customRates,
      });

      const aiMessage: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'assistant',
        text: localRes.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: localRes.suggestedAction,
      };

      onUpdateSessionMessages([...updatedMessages, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate Response
  const handleRegenerate = () => {
    if (messages.length < 2) return;
    // Find last user message
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.sender === 'user');
    if (lastUserIndex === -1) return;

    const actualIndex = messages.length - 1 - lastUserIndex;
    const lastUserMsg = messages[actualIndex];
    const historyBefore = messages.slice(0, actualIndex);

    handleSendMessage(lastUserMsg.text, historyBefore);
  };

  // Edit Message
  const handleSaveEditedMessage = (messageId: string) => {
    const targetIdx = messages.findIndex((m) => m.id === messageId);
    if (targetIdx === -1) return;

    const newHistory = messages.slice(0, targetIdx);
    setEditingMessageId(null);
    handleSendMessage(editInputText, newHistory);
  };

  // Filter messages based on search query
  const displayedMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    return m.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getPersonalityLabel = (p: AiPersonality) => {
    switch (p) {
      case 'diplomat':
        return { name: translations.personalityDiplomat, emoji: '🤝' };
      case 'auditor':
        return { name: translations.personalityAuditor, emoji: '📊' };
      case 'friend':
        return { name: translations.personalityFriend, emoji: '🤗' };
      case 'advisor':
      default:
        return { name: translations.personalityAdvisor, emoji: '💡' };
    }
  };

  const personalityInfo = getPersonalityLabel(settings.aiPersonality);

  return (
    <>
      {/* 1. Optional Floating Action Button (Only if enabled) */}
      {showFloatingFab && (
        <div className="fixed bottom-5 end-5 z-40">
          <button
            type="button"
            onClick={() => setOpenState(!isOpen)}
            aria-label={translations.aiAssistantTitle}
            title={translations.aiAssistantTitle}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-emerald-400/40 group"
          >
            {/* Subtle Ambient Pulse Ring */}
            <span className="absolute -inset-1.5 rounded-full bg-emerald-500/25 blur-lg group-hover:bg-emerald-500/45 transition-all pointer-events-none animate-pulse" />

            {isOpen ? (
              <X className="w-6 h-6 text-white shrink-0 relative z-10" />
            ) : (
              <div className="relative z-10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white shrink-0" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -end-1.5 fill-amber-300 animate-bounce" />
              </div>
            )}
          </button>
        </div>
      )}

      {/* 2. Glassmorphism Chat Interface (Anchored directly under the header controls) */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="budget-ai-modal-title"
          className={`fixed z-40 transition-all duration-300 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-2.5 sm:inset-10 max-w-5xl mx-auto'
              : 'top-20 bottom-3 inset-x-2.5 sm:inset-auto sm:top-22 sm:end-6 sm:w-[450px] sm:h-[620px] max-h-[92vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div className="min-w-0">
                <h3 id="budget-ai-modal-title" className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                  <span>{translations.aiAssistantTitle}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    3.8 AI
                  </span>
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 truncate">
                  <button
                    type="button"
                    onClick={() => {
                      const next: Record<AiPersonality, AiPersonality> = {
                        diplomat: 'auditor',
                        auditor: 'friend',
                        friend: 'advisor',
                        advisor: 'diplomat',
                      };
                      onUpdateSettings({ aiPersonality: next[settings.aiPersonality] });
                    }}
                    className="flex items-center gap-1 hover:text-emerald-300 transition-colors cursor-pointer"
                    title="Switch Personality"
                  >
                    <span>{personalityInfo.emoji}</span>
                    <span className="font-semibold text-emerald-400">{personalityInfo.name}</span>
                  </button>
                  {settings.incognitoMode && (
                    <span className="text-[10px] text-cyan-400 font-semibold px-1 rounded bg-cyan-950/60 border border-cyan-800/40">
                      Incognito
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchVisible((prev) => !prev)}
                aria-label="Search Messages"
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isSearchVisible ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Clear Current Chat ("me reset chats when u go out just ai chat") */}
              <button
                type="button"
                onClick={handleResetCurrentChat}
                aria-label={translations.clearChat}
                title={translations.clearChat}
                className="p-1.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* New Session Button */}
              <button
                type="button"
                onClick={onNewSession}
                aria-label={translations.newChatSession}
                title={translations.newChatTooltip}
                className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
              </button>

              {/* Expand / Minimize Window */}
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-label={isExpanded ? 'Minimize' : 'Expand'}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close (Triggers auto-reset if resetChatOnExit is enabled) */}
              <button
                type="button"
                onClick={handleCloseAssistant}
                aria-label="Close Assistant"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Header Bar (If Active) */}
          {isSearchVisible && (
            <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 animate-in fade-in">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={translations.searchChatPlaceholder}
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-500 hover:text-white text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
            {displayedMessages.map((msg) => {
              const isAi = msg.sender === 'assistant';
              const isEditing = editingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 group ${isAi ? '' : 'flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs shadow-sm ${
                      isAi
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div className={`max-w-[82%] space-y-1.5 ${isAi ? '' : 'items-end'}`}>
                    {/* Attached file thumbnail if any */}
                    {msg.attachedFile && (
                      <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs">
                        {msg.attachedFile.previewUrl ? (
                          <img
                            src={msg.attachedFile.previewUrl}
                            alt="Receipt"
                            className="w-12 h-12 object-cover rounded-xl border border-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-amber-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[150px]">
                            {msg.attachedFile.name}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {((msg.attachedFile.size || 0) / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bubble Content */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                        isAi
                          ? 'bg-slate-950/80 border border-slate-800/90 text-slate-200'
                          : 'bg-emerald-600 text-white font-medium'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editInputText}
                            onChange={(e) => setEditInputText(e.target.value)}
                            className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                            rows={3}
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingMessageId(null)}
                              className="px-2.5 py-1 rounded-lg text-[10px] bg-slate-800 text-slate-300"
                            >
                              {translations.cancel}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditedMessage(msg.id)}
                              className="px-2.5 py-1 rounded-lg text-[10px] bg-emerald-500 text-slate-950 font-bold"
                            >
                              {translations.saveEditBtn}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap">{msg.text}</p>

                          {/* 1-Click Action Button from Invoice analysis */}
                          {msg.suggestedAction && msg.suggestedAction.type === 'add_loan' && (
                            <div className="mt-3 pt-2.5 border-t border-slate-800">
                              <button
                                type="button"
                                onClick={() => {
                                  const d: any = msg.suggestedAction!.data;
                                  onAddLoanFromAi({
                                    personName: d.personName,
                                    amount: d.amount,
                                    type: d.loanType || d.type || 'i_owe_them',
                                    notes: d.notes,
                                  });
                                  alert(language === 'ar' ? 'تمت إضافة القرض بنجاح للميزانية!' : 'Loan recorded to dashboard successfully!');
                                }}
                                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                                <span>{translations.oneClickAddFromInvoice}</span>
                              </button>
                            </div>
                          )}

                          <span
                            className={`block text-[9px] mt-1 text-end ${
                              isAi ? 'text-slate-500' : 'text-emerald-200/80'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Action Bar Beneath Bubble (Copy, Speak, Edit, Regenerate) */}
                    <div className="flex items-center gap-1.5 px-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Copy */}
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        aria-label={translations.copyMsgAction}
                        title={translations.copyMsgAction}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      {/* Text-to-Speech Audio */}
                      <button
                        type="button"
                        onClick={() => speakMessage(msg.id, msg.text)}
                        aria-label={speakingMessageId === msg.id ? translations.voiceStopSpeaking : translations.voiceSpeakMessage}
                        title={speakingMessageId === msg.id ? translations.voiceStopSpeaking : translations.voiceSpeakMessage}
                        className={`p-1 rounded-md transition-colors ${
                          speakingMessageId === msg.id
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {speakingMessageId === msg.id ? (
                          <VolumeX className="w-3 h-3 text-emerald-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                      </button>

                      {/* Edit (for User messages) */}
                      {!isAi && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMessageId(msg.id);
                            setEditInputText(msg.text);
                          }}
                          aria-label={translations.editMsgAction}
                          title={translations.editMsgAction}
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}

                      {/* Regenerate (for last AI message) */}
                      {isAi && msg.id === messages[messages.length - 1]?.id && (
                        <button
                          type="button"
                          onClick={handleRegenerate}
                          aria-label={translations.regenerateAction}
                          title={translations.regenerateAction}
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Animation */}
            {isLoading && (
              <div className="flex items-center gap-2.5 animate-in fade-in">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-150" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-300" />
                  <span className="text-[10px] text-slate-500 ms-2 font-mono">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {translations.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="px-3 py-1 rounded-full text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* File Attachment Chip in Input */}
          {attachedFile && (
            <div className="px-3 pt-2 bg-slate-950/80 flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[200px] text-[11px]">{attachedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="text-slate-400 hover:text-rose-400 text-xs ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Input Footer Area with Mic & Upload */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-800/80 bg-slate-950/90 flex items-center gap-2 shrink-0"
          >
            {/* File Upload Trigger */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="chat-file-upload"
            />
            <label
              htmlFor="chat-file-upload"
              aria-label={translations.uploadFileAction}
              title={translations.uploadFileAction}
              className="p-2.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </label>

            {/* Voice Input (Speech-to-Text) */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              aria-label={isRecording ? 'Stop Recording' : 'Voice Input'}
              title={isRecording ? 'Stop Recording' : 'Voice Input'}
              className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isRecording ? translations.voiceInputListening : translations.aiInputPlaceholder}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={(!inputValue.trim() && !attachedFile) || isLoading}
              aria-label="Send Message"
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-all shadow-md shadow-emerald-600/25 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
