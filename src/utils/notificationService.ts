/**
 * Automated due date push notification service for Loan Budget.
 * Works seamlessly across Web, iOS (Safari PWA Web Push), and Android (Chrome Web Push).
 */

import { Loan, Language } from '../types';
import { formatCardDebt } from './loanLogic';

const NOTIFIED_PREFIX = 'loan_budget_due_notified_';

/**
 * Format the exact required polite due date reminder message:
 * "Dear [Name], this is a friendly reminder that your payment of [Amount] is due today. We appreciate your prompt attention to this matter."
 */
export function formatPoliteDueMessage(personName: string, amountFormatted: string): string {
  return `Dear ${personName}, this is a friendly reminder that your payment of ${amountFormatted} is due today. We appreciate your prompt attention to this matter.`;
}

/**
 * Check if the browser supports notifications
 */
export function isPushNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission from the user
 */
export async function requestPushPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isPushNotificationSupported()) return 'unsupported';
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return Notification.permission;
  }
}

/**
 * Register lightweight service worker for iOS & Android push notifications
 */
export async function registerNotificationServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    return reg;
  } catch {
    return null;
  }
}

/**
 * Show a polite due date push notification for a specific loan
 */
export async function showPoliteDueDateNotification(
  loan: Loan,
  language: Language = 'en'
): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;

  let permission: NotificationPermission | 'unsupported' = Notification.permission;
  if (permission === 'default') {
    permission = await requestPushPermission();
  }

  if (permission !== 'granted') return false;

  const remaining = Math.max(0, loan.amount - (loan.paidAmount || 0));
  const amountStr = formatCardDebt(remaining, loan.currency || 'USD', language);
  const messageBody = formatPoliteDueMessage(loan.personName, amountStr);
  const title = `Loan Budget • Payment Due Today (${loan.personName})`;

  try {
    // Prefer service worker showNotification for reliable iOS Safari & Android mobile delivery
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body: messageBody,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `loan-due-${loan.id}`,
          data: { loanId: loan.id, url: '/' },
        });
        return true;
      }
    }

    // Direct Notification fallback (desktop / standalone web)
    const notification = new Notification(title, {
      body: messageBody,
      icon: '/favicon.ico',
      tag: `loan-due-${loan.id}`,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Push notification delivery fallback:', err);
    return false;
  }
}

/**
 * Check active loans and trigger automated notifications for loans due today
 */
export function checkAndNotifyDueTodayLoans(
  loans: Loan[],
  language: Language = 'en',
  options: { force?: boolean } = {}
): Loan[] {
  if (!isPushNotificationSupported() || Notification.permission !== 'granted') {
    return [];
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const notifiedLoans: Loan[] = [];

  loans.forEach((loan) => {
    if (loan.status !== 'active' || !loan.dueDate) return;

    // Trigger if due today
    const isDueToday = loan.dueDate === todayStr;
    const cacheKey = `${NOTIFIED_PREFIX}${loan.id}_${todayStr}`;

    if (isDueToday && (options.force || !localStorage.getItem(cacheKey))) {
      showPoliteDueDateNotification(loan, language);
      localStorage.setItem(cacheKey, 'true');
      notifiedLoans.push(loan);
    }
  });

  return notifiedLoans;
}
