import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side Gemini AI Client configuration
const rawApiKey = process.env.GEMINI_API_KEY;
const isRealApiKey = Boolean(
  rawApiKey &&
  rawApiKey.trim() !== '' &&
  !rawApiKey.includes('MY_GEMINI_API_KEY') &&
  !rawApiKey.startsWith('MY_')
);

let aiClient: GoogleGenAI | null = null;
if (isRealApiKey && rawApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: rawApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client on server:', err);
  }
}

// API endpoint for AI Guide Chat
app.post('/api/ai/chat', async (req, res) => {
  const {
    messages,
    systemInstruction,
    personality = 'diplomat',
    responseLength = 'medium',
    creativity = 'balanced',
    language = 'en',
    loansContext,
    attachedFile, // { base64: string, mimeType: string, name: string }
  } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array provided' });
  }

  // If Gemini API client is available and active
  if (aiClient) {
    try {
      // Build personality and context instruction
      let personalityGuide = '';
      if (personality === 'diplomat') {
        personalityGuide = 'Tone: Highly polite, diplomatic, tactful, focused on relationship-preserving financial conversations.';
      } else if (personality === 'auditor') {
        personalityGuide = 'Tone: Strict, precise, analytical financial auditor. Straight to the numbers, deadlines, and balances.';
      } else if (personality === 'friend') {
        personalityGuide = 'Tone: Warm, empathetic, casual friend. Uses emojis where appropriate, relaxed and supportive.';
      } else if (personality === 'advisor') {
        personalityGuide = 'Tone: Wise wealth advisor and strategist. Focuses on debt snowball/avalanche, cash flow, and financial freedom.';
      }

      let lengthGuide = '';
      if (responseLength === 'short') {
        lengthGuide = 'Length constraint: Keep response under 2-3 concise sentences or bullet points.';
      } else if (responseLength === 'long') {
        lengthGuide = 'Length constraint: Provide comprehensive, detailed guidance with concrete step-by-step strategies.';
      } else {
        lengthGuide = 'Length constraint: Balanced response, around 2-4 sentences or actionable advice.';
      }

      const finalSystemInstruction = [
        'You are "Budget AI Guide", an exceptionally versatile, intelligent, and empathetic assistant inside the Loan Budget app.',
        `Language: Respond naturally and fluently in ${language === 'ar' ? 'fluent modern Arabic (العربية)' : 'natural, friendly English'}.`,
        'Crucial Directive: You understand and can discuss ANY topic, question, math problem, currency conversion, life situation, or debt negotiation. NEVER repeat rigid robotic templates. Answer directly, cleverly, concisely, and with real value.',
        personalityGuide,
        lengthGuide,
        loansContext ? `Active user loans data: ${JSON.stringify(loansContext)}` : '',
        systemInstruction ? `User custom instructions: ${systemInstruction}` : '',
        'Capabilities: Financial debt snowball/avalanche strategies, multi-currency live calculations (USD, IQD, TRY, EUR, IRR), WhatsApp/Telegram reminder scripts, receipt & bill OCR analysis, general Q&A, and relationship-friendly financial coaching.',
      ].filter(Boolean).join('\n\n');

      // Ensure conversation starts with user turn for Gemini API compliance
      const rawHistory = messages.slice(0, -1);
      const firstUserIndex = rawHistory.findIndex((m: any) => m.sender === 'user');
      const filteredHistory = firstUserIndex !== -1 ? rawHistory.slice(firstUserIndex) : [];

      const conversationHistory = filteredHistory.map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      // Multimodal contents if image attached
      const lastMessage = messages[messages.length - 1];
      const lastMessageParts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];
      if (attachedFile?.base64 && attachedFile?.mimeType) {
        lastMessageParts.push({
          inlineData: {
            data: attachedFile.base64.replace(/^data:[^;]+;base64,/, ''),
            mimeType: attachedFile.mimeType,
          },
        });
      }
      lastMessageParts.push({ text: lastMessage.text || 'Analyze this document for loan details.' });

      // Build contents array
      const contents = [
        ...conversationHistory,
        {
          role: 'user',
          parts: lastMessageParts,
        },
      ];

      // Add an 8-second timeout race so the request completes smoothly
      const apiCallPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: finalSystemInstruction,
        },
      });

      const timeoutPromise = new Promise<{ text?: string }>((_, reject) => {
        setTimeout(() => reject(new Error('AI request timeout')), 8000);
      });

      const response = await Promise.race([apiCallPromise, timeoutPromise]);

      return res.json({
        text: response.text || 'I processed your request.',
        modelUsed: 'gemini-3.8-flash',
      });
    } catch (apiError: any) {
      console.warn('Gemini API call timed out or failed, falling back to local intelligent engine:', apiError?.message || apiError);
      return res.json({
        fallback: true,
        message: 'Local intelligent engine active',
        errorDetails: apiError?.message,
      });
    }
  }

  // Return fallback flag if no server API key
  return res.json({
    fallback: true,
    message: 'Local intelligent financial engine active',
  });
});

// Setup Vite in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Loan Budget full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
