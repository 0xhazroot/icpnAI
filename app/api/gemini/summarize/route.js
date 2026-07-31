import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Gemini Summarize API] Request received`);

  try {
    const { action, text, fileName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error(`[${timestamp}] [Gemini Summarize API] Missing GEMINI_API_KEY`);
      return NextResponse.json({ error: 'Falta la GEMINI_API_KEY en .env.local' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

    console.log(`[${timestamp}] [Gemini Summarize API] Executing action: ${action}`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();

    return NextResponse.json({ 
      result: resultText,
      action,
      timestamp
    });

  } catch (error) {
    console.error(`[${timestamp}] [Gemini Summarize API] Error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
