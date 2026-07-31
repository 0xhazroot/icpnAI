import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [JARVIS Gemini API] Request received`);

  try {
    const body = await req.json();
    const { message, level = 'ICPNA Intermediate 06', context = '' } = body;

    console.log(`[${timestamp}] [JARVIS Gemini API] User Prompt: "${message}"`);
    console.log(`[${timestamp}] [JARVIS Gemini API] Level Context: "${level}"`);

    if (!message || message.trim() === '') {
      console.warn(`[${timestamp}] [JARVIS Gemini API] Warning: Empty message provided`);
      return NextResponse.json({ error: 'El mensaje no puede estar vacío.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error(`[${timestamp}] [JARVIS Gemini API] Error: GEMINI_API_KEY missing in environment variables`);
      return NextResponse.json({ 
        error: 'La clave GEMINI_API_KEY no está configurada en el servidor. Revisa tu archivo .env.local.' 
      }, { status: 500 });
    }

    // Initialize Google Generative AI Client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try gemini-1.5-flash first, with fallback to gemini-pro
    let modelName = 'gemini-1.5-flash';
    let model;

    try {
      model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: `You are JARVIS, an elite Virtual English Tutor for an ICPNA student studying ${level}.
Help the student excel in Writings, Speakings, Reading Quizzes, ALP, and Final Exam according to official ICPNA 20-point rubrics.
Be concise, clear, and encouraging. Include grammar tips or vocabulary corrections if relevant.`
      });
    } catch (modelErr) {
      console.warn(`[${timestamp}] [JARVIS Gemini API] Fallback to gemini-1.5-pro due to:`, modelErr.message);
      modelName = 'gemini-1.5-pro';
      model = genAI.getGenerativeModel({ model: modelName });
    }

    const fullPrompt = context 
      ? `Document Context:\n${context}\n\nStudent Question:\n${message}` 
      : message;

    console.log(`[${timestamp}] [JARVIS Gemini API] Querying model: ${modelName}...`);
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const replyText = response.text();

    console.log(`[${timestamp}] [JARVIS Gemini API] Success! Response generated (${replyText.length} chars)`);

    return NextResponse.json({ 
      reply: replyText,
      modelUsed: modelName,
      timestamp
    });

  } catch (error) {
    console.error(`[${timestamp}] [JARVIS Gemini API] CRITICAL EXCEPTION:`, error);
    
    return NextResponse.json({ 
      error: 'Error al comunicarse con la API de Google Gemini.',
      details: error.message || 'Excepción desconocida',
      timestamp
    }, { status: 500 });
  }
}
