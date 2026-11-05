import React from 'react';
import { Loan, Translations } from '../types';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onConfirm: (id: string) => void;
  translations: Translations;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  loan,
  onConfirm,
  translations,
}) => {
  if (!isOpen || !loan) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 id="delete-confirm-title" className="text-base font-bold text-white mb-1.5">
          {translations.confirmDelete}
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {translations.confirmDeleteMessage}
        </p>

        <div className="flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {translations.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(loan.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-600/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>{translations.delete}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
