import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, level = 'ICPNA Intermediate 06' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'El mensaje es obligatorio' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY no está configurada' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: `You are JARVIS, an elite Virtual English Tutor specially calibrated for an ICPNA student at ${level}.
Your goal is to help the student achieve a score of 20/20 in their 3 Writings, 3 Speakings, Reading Quiz, ALP, and Final Exam.
Provide helpful, encouraging, and accurate corrections in clear English (with brief Spanish explanations when necessary).
Ground your responses in standard ICPNA evaluation rubrics.`
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text() || "I have analyzed your request. Let's practice your Speaking and Writing skills!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ 
      error: 'Error al comunicarse con Gemini API',
      details: error.message 
    }, { status: 500 });
  }
}
