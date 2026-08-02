import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const MODEL_PRIMARY = 'gemini-2.0-flash';
const MODEL_FALLBACK = 'gemini-2.0-flash-lite';

export async function POST(req) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [JARVIS] Request received`);

  try {
    const body = await req.json();
    const { message, level = 'ICPNA Intermediate 06', context = '' } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'El mensaje no puede estar vacío.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error(`[${timestamp}] [JARVIS] GEMINI_API_KEY missing`);
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY no configurada. Revisa .env.local.',
        code: 'MISSING_API_KEY'
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemInstruction = `You are JARVIS, an elite Virtual English Tutor for an ICPNA student studying ${level}.
Help the student excel in Writings, Speakings, Reading Quizzes, ALP, and Final Exam according to official ICPNA 20-point rubrics.
Be concise, clear, and encouraging. Include grammar tips or vocabulary corrections if relevant.
Respond in the same language the student writes to you.`;

    const fullPrompt = context 
      ? `Document Context:\n${context}\n\nStudent Question:\n${message}` 
      : message;

    // Try primary model, fallback to lite if it fails
    const modelsToTry = [MODEL_PRIMARY, MODEL_FALLBACK];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[${timestamp}] [JARVIS] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
        const result = await model.generateContent(fullPrompt);
        const replyText = result.response.text();

        console.log(`[${timestamp}] [JARVIS] Success with ${modelName} (${replyText.length} chars)`);
        return NextResponse.json({ reply: replyText, modelUsed: modelName, timestamp });
      } catch (modelErr) {
        lastError = modelErr;
        console.warn(`[${timestamp}] [JARVIS] Model ${modelName} failed: ${modelErr.message?.substring(0, 150)}`);
        
        // If it's a billing/quota error, no point trying another model
        if (modelErr.message?.includes('429') || modelErr.message?.includes('credits')) {
          break;
        }
      }
    }

    // Determine user-friendly error from the last exception
    const errMsg = lastError?.message || '';
    let userError, code;

    if (errMsg.includes('429') || errMsg.includes('credits') || errMsg.includes('quota')) {
      userError = 'Los créditos de la API de Google Gemini se han agotado. Necesitas recargar los créditos en Google AI Studio (aistudio.google.com) o generar una nueva API Key gratuita.';
      code = 'BILLING_EXHAUSTED';
    } else if (errMsg.includes('404') || errMsg.includes('not found')) {
      userError = 'El modelo de Gemini solicitado no está disponible. Contacta al desarrollador.';
      code = 'MODEL_NOT_FOUND';
    } else if (errMsg.includes('403') || errMsg.includes('permission')) {
      userError = 'La API Key no tiene permisos suficientes. Verifica la configuración en Google Cloud Console.';
      code = 'PERMISSION_DENIED';
    } else {
      userError = 'Error inesperado al comunicarse con Google Gemini.';
      code = 'UNKNOWN';
    }

    return NextResponse.json({ error: userError, code, details: errMsg.substring(0, 200), timestamp }, { status: 500 });

  } catch (error) {
    console.error(`[${timestamp}] [JARVIS] CRITICAL:`, error);
    return NextResponse.json({ 
      error: 'Error interno del servidor al procesar tu solicitud.',
      details: error.message,
      timestamp
    }, { status: 500 });
  }
}
