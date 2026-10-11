import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Google GenAI client (Server-side only)
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Strict official business information for IronCore Gym
const IRONCORE_BUSINESS_INFO = {
  name: "IronCore Gym",
  positioning: "A serious gym for real results",
  founded: "2015",
  status: "Accepting New Members for 2026",
  award: "Rated #1 Best Local Gym 2026",
  address: "123 Fitness Blvd, Downtown District, City 90210",
  phone: "+2348163976633",
  hours: "Monday–Friday: 5:00 AM – 11:00 PM, Saturday–Sunday: 7:00 AM – 9:00 PM",
  programs: [
    "Personal Training",
    "Group Fitness",
    "Strength & Conditioning",
    "Fat Loss Programs",
    "Beginner Foundations"
  ],
  membership: {
    dayPass: "$15",
    monthly: "$49",
    personalTraining: "$240"
  }
};

const SYSTEM_INSTRUCTION = `You are FASHION NOVA AI Voice Support Assistant representing IronCore Gym.
Use ONLY the business information provided below and the content visible on this website.
Do NOT guess. Do NOT invent information.
If something is not listed:
• Say you don't have that information
• Guide the visitor to book a free session or call the gym at +2348163976633

When a visitor shows intent to join or book:
Ask the following questions ONE AT A TIME:
1) First name
2) Main fitness goal
3) Beginner or experienced
4) Preferred visit day
5) Morning or evening

After collecting all 5 pieces of information:
Say:
“Please review your details on the screen. If everything looks correct, click Confirm to submit your request.”
Do NOT auto-submit or auto-confirm. The user must review and click Confirm, Edit, or Cancel.

Tone:
• Friendly
• Professional
• Short answers (1 to 3 concise sentences, optimal for voice response)
• Conversion-focused

BUSINESS INFORMATION:
Business name: IronCore Gym
Positioning: A serious gym for real results
Founded: 2015
Status: Accepting New Members for 2026
Award: Rated #1 Best Local Gym 2026
Address: 123 Fitness Blvd, Downtown District, City 90210
Phone: +2348163976633
Opening Hours:
Mon–Fri: 5:00 AM – 11:00 PM
Sat–Sun: 7:00 AM – 9:00 PM
Programs:
- Personal Training
- Group Fitness
- Strength & Conditioning
- Fat Loss Programs
- Beginner Foundations

Membership:
- Day Pass: $15
- Monthly: $49
- Personal Training: $240

Always keep answers short, accurate, and encourage the visitor to book a free session or call +2348163976633.`;

// API Endpoint: AI Voice Support Assistant
app.post('/api/voice-assistant', async (req, res) => {
  try {
    const { prompt, topic, history, intakeState } = req.body;
    const userPrompt = String(prompt || '').trim();

    let answerText = '';

    if (ai) {
      try {
        // Build multi-turn conversational contents
        let contents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          contents = history.slice(-8).map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: String(msg.text || '') }],
          }));
          // Ensure current user prompt is at the end if not already included
          if (contents.length === 0 || contents[contents.length - 1].role !== 'user' || contents[contents.length - 1].parts[0].text !== userPrompt) {
            contents.push({ role: 'user', parts: [{ text: userPrompt }] });
          }
        } else {
          contents = [{ role: 'user', parts: [{ text: userPrompt }] }];
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2, // Low temperature for high precision and zero hallucination
          },
        });

        answerText = response.text || '';
      } catch (genError) {
        console.error('Gemini text generation error:', genError);
      }
    }

    // Precise fallback matching if model didn't return or offline
    if (!answerText) {
      const lower = userPrompt.toLowerCase();
      if (intakeState && intakeState.step) {
        if (intakeState.step === 1) {
          answerText = `Nice to meet you, ${userPrompt}! What is your main fitness goal? (e.g. strength, fat loss, muscle building, or general fitness)`;
        } else if (intakeState.step === 2) {
          answerText = "Got it! Are you a beginner or experienced with gym training?";
        } else if (intakeState.step === 3) {
          answerText = "Understood! What day would you prefer to visit us at 123 Fitness Blvd?";
        } else if (intakeState.step === 4) {
          answerText = "And do you prefer a morning or evening time slot?";
        } else if (intakeState.step === 5) {
          answerText = "Please review your details on the screen. If everything looks correct, click Confirm to submit your request.";
        }
      } else if (lower.includes('join') || lower.includes('sign up') || lower.includes('book') || lower.includes('free') || lower.includes('trial') || lower.includes('session') || topic === 'booking') {
        answerText = "Awesome! Let's get you set up for your free trial session. What is your first name?";
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('membership') || topic === 'pricing') {
        answerText = "Our memberships are $15 for a Day Pass, $49 for Monthly membership, and $240 for Personal Training. Would you like to book a free session to get started?";
      } else if (lower.includes('hour') || lower.includes('open') || lower.includes('time') || topic === 'hours') {
        answerText = "IronCore Gym is open Monday through Friday from 5:00 AM to 11:00 PM, and Saturday through Sunday from 7:00 AM to 9:00 PM.";
      } else if (lower.includes('location') || lower.includes('address') || lower.includes('where') || topic === 'location') {
        answerText = "We are located at 123 Fitness Blvd, Downtown District, City 90210. You can reach us at +2348163976633.";
      } else if (lower.includes('program') || lower.includes('class') || topic === 'programs') {
        answerText = "We offer Personal Training, Group Fitness, Strength & Conditioning, Fat Loss Programs, and Beginner Foundations. Ready to try one with a free session?";
      } else if (lower.includes('about') || lower.includes('award') || lower.includes('founded') || lower.includes('who')) {
        answerText = "IronCore Gym was founded in 2015 as a serious gym for real results, rated #1 Best Local Gym 2026. We are currently accepting new members for 2026!";
      } else {
        answerText = "I don't have that information. You can book a free session or give our team a call directly at +2348163976633.";
      }
    }

    // Generate Audio via TTS model if Gemini is active
    let base64Audio: string | null = null;
    if (ai) {
      try {
        const speechResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [{ text: answerText }],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Puck' },
              },
            },
          },
        });
        base64Audio = speechResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
      } catch (ttsErr) {
        console.warn('Gemini TTS generation error (will use client voice fallback):', ttsErr);
      }
    }

    res.json({
      success: true,
      text: answerText,
      audio: base64Audio, // Base64 WAV data if generated, or null for frontend speech synthesis fallback
    });
  } catch (error) {
    console.error('Voice assistant error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process voice assistant request',
      fallbackText: "I'm available to help with our pricing, opening hours, gym location, workout programs, or scheduling your free trial session.",
    });
  }
});

// API Endpoint: Book Free Session
app.post('/api/book-session', (req, res) => {
  const { name, email, phone, program, timeSlot } = req.body;
  const bookingId = `IRON-${Math.floor(100000 + Math.random() * 900000)}`;

  res.json({
    success: true,
    bookingId,
    name: name || 'Athlete',
    email: email || 'guest@example.com',
    program: program || 'Personal Training',
    timeSlot: timeSlot || 'Tomorrow at 10:00 AM',
    address: '123 Fitness Blvd, Downtown District, City 90210',
    phone: '+2348163976633',
    message: `Your complimentary session is confirmed! Pass #${bookingId} has been registered at IronCore Gym.`,
  });
});

// Vite server setup
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
