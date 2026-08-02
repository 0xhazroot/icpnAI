import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const MODEL_PRIMARY = 'gemini-2.0-flash';

export async function POST(req) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Summarize API] Request received`);

  try {
    const { action, text, fileName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY no configurada en .env.local' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_PRIMARY });

    let prompt = '';

    if (action === 'summary') {
      prompt = `Act as an expert ICPNA English teacher. Generate a structured, concise study summary for the document "${fileName || 'ICPNA Study Material'}". 
Content / Context:
${text || 'ICPNA Intermediate 06 Unit Material'}

Include:
1. Key Grammar Concepts
2. Essential Target Vocabulary
3. Writing & Speaking Tips for 20/20 score`;
    } else if (action === 'quiz') {
      prompt = `Generate a 5-question multiple choice Quiz based on this ICPNA material for Intermediate level:
${text || 'ICPNA Vocabulary & Grammar Material'}

Format cleanly with questions 1 to 5, options A/B/C/D and an Answer Key at the end.`;
    } else if (action === 'writing_template') {
      prompt = `Create an official ICPNA Writing #2 template (Opinion Essay format) with introduction, 2 body paragraphs, and conclusion based on this topic:
${text || 'Global Culture & Technology'}`;
    } else if (action === 'pronunciation') {
      prompt = `List the 8 most important vocabulary words from this text and provide IPA pronunciation guide with sample sentences for Speaking practice:
${text || 'ICPNA Unit Material'}`;
    } else {
      prompt = `Summarize this ICPNA document: ${text}`;
    }

    console.log(`[${timestamp}] [Summarize API] Action: ${action}, Model: ${MODEL_PRIMARY}`);
    const result = await model.generateContent(prompt);
    const resultText = result.response.text();

    return NextResponse.json({ result: resultText, action, timestamp });

  } catch (error) {
    console.error(`[${timestamp}] [Summarize API] Error:`, error.message?.substring(0, 200));
    
    const errMsg = error.message || '';
    let userError;

    if (errMsg.includes('429') || errMsg.includes('credits') || errMsg.includes('quota')) {
      userError = 'Créditos de API agotados. Genera una nueva API Key gratuita en aistudio.google.com';
    } else if (errMsg.includes('404') || errMsg.includes('not found')) {
      userError = 'Modelo de Gemini no disponible. Contacta al desarrollador.';
    } else {
      userError = errMsg || 'Error desconocido al conectar con Gemini';
    }

    return NextResponse.json({ error: userError }, { status: 500 });
  }
}
