import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTotals,
  generateReminderMessage,
  cleanPhoneNumber,
  convertAmount,
  formatCurrency,
  formatCurrencyWithCode,
  formatCardDebt,
  generateAdvancedAiResponse,
  exportAppDataJson,
  importAppDataJson,
  defaultSettings,
  CURRENCIES,
  exportLoansToCsv,
  BACKGROUND_PRESETS,
  translations,
} from './loanLogic';
import { formatPoliteDueMessage } from './notificationService';
import { Loan } from '../types';

test('calculateTotals computes empty loans correctly', () => {
  const totals = calculateTotals([]);
  assert.equal(totals.totalTheyOwe, 0);
  assert.equal(totals.totalIOwe, 0);
  assert.equal(totals.netBalance, 0);
  assert.equal(totals.isMultiCurrency, false);
});

test('calculateTotals handles multi-currency loans and tracks per-currency breakdowns', () => {
  const loans: Loan[] = [
    {
      id: '1',
      personName: 'Ahmed (Baghdad)',
      amount: 1500000,
      currency: 'IQD',
      type: 'they_owe_me',
      status: 'active',
      createdAt: '2026-10-01',
    },
    {
      id: '2',
      personName: 'John (New York)',
      amount: 500,
      currency: 'USD',
      type: 'they_owe_me',
      status: 'active',
      createdAt: '2026-10-02',
    },
    {
      id: '3',
      personName: 'Pierre (Paris)',
      amount: 200,
      currency: 'EUR',
      type: 'i_owe_them',
      status: 'active',
      createdAt: '2026-10-03',
    },
  ];

  const totals = calculateTotals(loans, 'USD');
  assert.equal(totals.activeTheyOweCount, 2);
  assert.equal(totals.activeIOweCount, 1);
  assert.equal(totals.isMultiCurrency, true);
  assert.equal(totals.theyOweByCurrency.IQD, 1500000);
  assert.equal(totals.theyOweByCurrency.USD, 500);
  assert.equal(totals.iOweByCurrency.EUR, 200);
  assert.ok(totals.totalTheyOwe > 1400); // Converted IQD (~$1010) + $500
});

test('formatCardDebt formats exact debt with flag emoji and currency symbol/code', () => {
  const formattedIqd = formatCardDebt(1500000, 'IQD', 'en');
  assert.ok(formattedIqd.includes('🇮🇶'));
  assert.ok(formattedIqd.includes('1,500,000'));
  assert.ok(formattedIqd.includes('IQD'));

  const formattedUsd = formatCardDebt(1000, 'USD', 'en');
  assert.ok(formattedUsd.includes('🇺🇸'));
  assert.ok(formattedUsd.includes('$1,000'));
});

test('generateReminderMessage uses the loan recorded currency and flag', () => {
  const loan: Loan = {
    id: 'rem_1',
    personName: 'Hassan',
    amount: 1500000,
    currency: 'IQD',
    type: 'they_owe_me',
    status: 'active',
    createdAt: '2026-10-01',
  };

  const msgEn = generateReminderMessage(loan, 'en', 'formal');
  assert.ok(msgEn.includes('🇮🇶'));
  assert.ok(msgEn.includes('1,500,000'));
  assert.ok(msgEn.includes('IQD'));

  const msgAr = generateReminderMessage(loan, 'ar', 'friendly');
  assert.ok(msgAr.includes('🇮🇶'));
  assert.ok(msgAr.includes('Hassan') || msgAr.includes('حسن'));
});

test('CURRENCIES array contains USD, IQD, EUR, TRY, IRR with correct flags', () => {
  const codes = CURRENCIES.map((c) => c.code);
  assert.ok(codes.includes('USD'));
  assert.ok(codes.includes('IQD'));
  assert.ok(codes.includes('EUR'));
  assert.ok(codes.includes('TRY'));
  assert.ok(codes.includes('IRR'));
});

test('generateAdvancedAiResponse produces debt repayment strategies with active balance awareness', () => {
  const loans: Loan[] = [
    {
      id: '1',
      personName: 'Store',
      amount: 250,
      currency: 'USD',
      type: 'i_owe_them',
      status: 'active',
      createdAt: '2026-10-01',
    },
  ];

  const resEn = generateAdvancedAiResponse({
    question: 'Suggest a debt payoff strategy for my active loans',
    language: 'en',
    loans,
  });
  assert.ok(resEn.text.includes('Snowball') || resEn.text.includes('debt'));

  const resAr = generateAdvancedAiResponse({
    question: 'اقترح خطة لسداد ديوني',
    language: 'ar',
    loans,
  });
  assert.ok(resAr.text.includes('كرة الثلج') || resAr.text.includes('ديون'));
});

test('generateAdvancedAiResponse handles attached receipts and provides 1-click suggested action', () => {
  const res = generateAdvancedAiResponse({
    question: 'Please log this bill',
    language: 'en',
    attachedFile: {
      name: 'dinner_invoice.pdf',
      type: 'application/pdf',
      base64: 'data:application/pdf;base64,AAAA',
    },
  });

  assert.ok(res.suggestedAction);
  assert.equal(res.suggestedAction?.type, 'add_loan');
  assert.equal(res.suggestedAction?.data.loanType, 'i_owe_them');
});

test('exportAppDataJson and importAppDataJson round-trip accurately', () => {
  const testLoans: Loan[] = [
    {
      id: 'test_1',
      personName: 'Test Person',
      amount: 99,
      currency: 'EUR',
      type: 'they_owe_me',
      status: 'active',
      createdAt: '2026-10-31',
    },
  ];

  const exported = exportAppDataJson(testLoans, defaultSettings);
  const imported = importAppDataJson(exported);

  assert.ok(imported);
  assert.equal(imported?.loans?.length, 1);
  assert.equal(imported?.loans?.[0].personName, 'Test Person');
  assert.equal(imported?.loans?.[0].currency, 'EUR');
  assert.equal(imported?.settings?.currency, 'USD');
});

test('calculateTotals calculates remaining balance when loans have partial repayments (paidAmount)', () => {
  const loansWithRepayment: Loan[] = [
    {
      id: 'loan_partial_1',
      personName: 'Mustafa',
      amount: 1515000,
      paidAmount: 757500, // 50% paid back
      currency: 'IQD',
      type: 'they_owe_me',
      status: 'active',
      createdAt: '2026-11-01',
    },
    {
      id: 'loan_partial_2',
      personName: 'Ahmed',
      amount: 1000,
      paidAmount: 250, // 25% paid back
      currency: 'USD',
      type: 'i_owe_them',
      status: 'active',
      createdAt: '2026-11-01',
    },
  ];

  const totals = calculateTotals(loansWithRepayment, 'USD', {
    USD: 1,
    IQD: 1515,
    EUR: 0.92,
    TRY: 34.2,
    IRR: 59000,
  });

  // For Mustafa: remaining = 757,500 IQD = 500 USD (at 1,515 rate)
  // For Ahmed: remaining = 750 USD
  assert.equal(totals.totalTheyOwe, 500);
  assert.equal(totals.totalIOwe, 750);
  assert.equal(totals.netBalance, -250);
  assert.equal(totals.theyOweByCurrency['IQD'], 757500);
  assert.equal(totals.iOweByCurrency['USD'], 750);
});

test('formatCurrency formats amount directly in activeCurrency without double multiplication', () => {
  const iqdFormatted = formatCurrency(1000000, 'en', 'IQD');
  assert.equal(iqdFormatted, '🇮🇶 1,000,000 IQD');

  const usdFormatted = formatCurrency(500, 'en', 'USD');
  assert.equal(usdFormatted, '🇺🇸 $ 500.00');

  // Verify switching totals from USD to IQD maintains the exact original price in IQD
  const singleIqdLoan: Loan[] = [
    {
      id: 'iqd_test',
      personName: 'Kareem',
      amount: 1515000,
      currency: 'IQD',
      type: 'they_owe_me',
      status: 'active',
      createdAt: '2026-11-01',
    },
  ];

  // In USD display: 1,515,000 IQD / 1515 = 1000 USD
  const inUSD = calculateTotals(singleIqdLoan, 'USD', { USD: 1, IQD: 1515, EUR: 0.92, TRY: 34.2, IRR: 59000 });
  assert.equal(inUSD.totalTheyOwe, 1000);
  assert.equal(formatCurrency(inUSD.totalTheyOwe, 'en', 'USD'), '🇺🇸 $ 1,000.00');

  // In IQD display: 1,515,000 IQD -> must be EXACTLY 1,515,000 IQD (NOT multiplied by 1515 again!)
  const inIQD = calculateTotals(singleIqdLoan, 'IQD', { USD: 1, IQD: 1515, EUR: 0.92, TRY: 34.2, IRR: 59000 });
  assert.equal(inIQD.totalTheyOwe, 1515000);
  assert.equal(formatCurrency(inIQD.totalTheyOwe, 'en', 'IQD'), '🇮🇶 1,515,000 IQD');
});

test('generateAdvancedAiResponse answers specific person debt queries accurately', () => {
  const sampleLoans: Loan[] = [
    {
      id: 'm1',
      personName: 'Mustafa Al-Iraqi',
      amount: 1500000,
      paidAmount: 500000,
      currency: 'IQD',
      type: 'they_owe_me',
      status: 'active',
      createdAt: '2026-10-15',
    },
    {
      id: 'z1',
      personName: 'Zainab',
      amount: 400,
      currency: 'USD',
      type: 'i_owe_them',
      status: 'active',
      createdAt: '2026-10-20',
    },
  ];

  // Look up Mustafa in English
  const resMustafaEn = generateAdvancedAiResponse({
    question: 'How much does Mustafa owe me?',
    language: 'en',
    loans: sampleLoans,
  });
  assert.ok(resMustafaEn.text.includes('Mustafa Al-Iraqi'));
  assert.ok(resMustafaEn.text.includes('1,000,000') || resMustafaEn.text.includes('Remaining'));

  // Look up Mustafa in Arabic
  const resMustafaAr = generateAdvancedAiResponse({
    question: 'شكد يطلبني مصطفى؟',
    language: 'ar',
    loans: sampleLoans,
  });
  assert.ok(resMustafaAr.text.includes('Mustafa Al-Iraqi') || resMustafaAr.text.includes('مصطفى'));
  assert.ok(resMustafaAr.text.includes('1,000,000') || resMustafaAr.text.includes('المتبقي'));

  // Who owes me query
  const resWhoOwes = generateAdvancedAiResponse({
    question: 'Who owes me money?',
    language: 'en',
    loans: sampleLoans,
  });
  assert.ok(resWhoOwes.text.includes('Mustafa Al-Iraqi'));

  // Math query
  const resMath = generateAdvancedAiResponse({
    question: 'What is 25% of 1500000?',
    language: 'en',
    loans: sampleLoans,
  });
  assert.ok(resMath.text.includes('375,000') || resMath.text.includes('375000'));

  // Installment plan query
  const resInstallment = generateAdvancedAiResponse({
    question: 'If I pay 200 a month for 1000 debt how long?',
    language: 'en',
    loans: sampleLoans,
  });
  assert.ok(resInstallment.text.includes('5') || resInstallment.text.includes('month'));
});

test('formatPoliteDueMessage matches exact required elegant reminder template', () => {
  const message = formatPoliteDueMessage('Tariq', '$250.00');
  assert.equal(
    message,
    'Dear Tariq, this is a friendly reminder that your payment of $250.00 is due today. We appreciate your prompt attention to this matter.'
  );
});

test('exportLoansToCsv produces valid CSV with UTF-8 BOM and correct columns', () => {
  const sampleLoans: Loan[] = [
    {
      id: 'csv_1',
      personName: 'Omar Farooq',
      amount: 1000,
      paidAmount: 200,
      currency: 'USD',
      type: 'they_owe_me',
      status: 'active',
      dueDate: '2026-11-10',
      createdAt: '2026-11-01',
      notes: 'Hardware purchase',
    },
  ];

  const csvContent = exportLoansToCsv(sampleLoans, 'en', 'all');
  // Must start with UTF-8 BOM for Excel
  assert.ok(csvContent.startsWith('\uFEFF'));
  assert.ok(csvContent.includes('Omar Farooq'));
  assert.ok(csvContent.includes('USD'));
  assert.ok(csvContent.includes('1000'));
  assert.ok(csvContent.includes('200'));
  assert.ok(csvContent.includes('800'));
  assert.ok(csvContent.includes('Hardware purchase'));
});

test('BACKGROUND_PRESETS contains valid presets and defaultSettings contains theme customization defaults', () => {
  assert.ok(Array.isArray(BACKGROUND_PRESETS));
  assert.ok(BACKGROUND_PRESETS.length >= 6);
  assert.ok(BACKGROUND_PRESETS.some((p: any) => p.id === 'mesh_grid'));
  assert.ok(BACKGROUND_PRESETS.some((p: any) => p.id === 'aurora'));
  assert.ok(BACKGROUND_PRESETS.some((p: any) => p.id === 'emerald_circuit'));

  // defaultSettings checks
  assert.strictEqual(defaultSettings.theme, 'dark');
  assert.strictEqual(defaultSettings.customThemeColor, '#10b981');
  assert.strictEqual(defaultSettings.customBgImage, '');
  assert.strictEqual(defaultSettings.bgOpacity, 0.15);
  assert.strictEqual(defaultSettings.bgBlur, 0);

  // translations checks for navigation drawer & customizer
  assert.ok(translations.en.hamburgerMenu);
  assert.ok(translations.ar.hamburgerMenu);
  assert.ok(translations.en.themeSapphire);
  assert.ok(translations.ar.themeSapphire);
  assert.ok(translations.en.bgCustomizerTitle);
  assert.ok(translations.ar.bgCustomizerTitle);
});

test('translations contain required due date and deadline tracking keys', () => {
  // English keys
  assert.ok(translations.en.dueDateRequired);
  assert.ok(translations.en.selectDueDate);
  assert.ok(translations.en.dueToday);
  assert.ok(translations.en.dueInDays);
  assert.ok(translations.en.overdueByDays);
  assert.ok(translations.en.dueSoon);

  // Arabic keys
  assert.ok(translations.ar.dueDateRequired);
  assert.ok(translations.ar.selectDueDate);
  assert.ok(translations.ar.dueToday);
  assert.ok(translations.ar.dueInDays);
  assert.ok(translations.ar.overdueByDays);
  assert.ok(translations.ar.dueSoon);
});

