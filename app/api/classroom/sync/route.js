import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_PRIMARY = 'gemini-2.0-flash';

export async function POST(req) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Classroom Sync] Request received`);

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // In production, the accessToken comes from user's Google OAuth session stored in cookies/Supabase
    // For now we use sample data to demonstrate the classification pipeline
    const sampleClassroomData = [
      { id: 'c1', title: 'Writing #1: Cultural Differences Essay', type: 'assignment', maxPoints: 2 },
      { id: 'c2', title: 'Speaking #1: Self-Introduction Video', type: 'assignment', maxPoints: 2 },
      { id: 'c3', title: 'Reading Quiz - Unit 1', type: 'quiz', maxPoints: 2 },
      { id: 'c4', title: 'ALP Proposal & Pair Presentation', type: 'project', maxPoints: 4 },
      { id: 'c5', title: 'Final Exam - Written Component', type: 'exam', maxPoints: 4 },
    ];

    let aiClassification = null;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: MODEL_PRIMARY });

        const prompt = `Classify these raw Google Classroom items into official ICPNA rubrics (Writing 1, Writing 2, Writing 3, Speaking 1, Speaking 2, Speaking 3, Reading Quiz, ALP [4 pts], Final Exam [4 pts]). Return JSON array:
${JSON.stringify(sampleClassroomData)}`;

        const result = await model.generateContent(prompt);
        aiClassification = result.response.text();
        console.log(`[${timestamp}] [Classroom Sync] AI Classification succeeded`);
      } catch (aiErr) {
        console.warn(`[${timestamp}] [Classroom Sync] AI Classification failed: ${aiErr.message?.substring(0, 150)}`);
        // Gracefully continue without AI classification — still return sample data
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: aiClassification 
        ? 'Sincronización y clasificación completada con Gemini API'
        : 'Datos de Classroom cargados (clasificación AI no disponible — verifica créditos de API)',
      classifiedItems: sampleClassroomData,
      aiClassification,
      timestamp
    });
  } catch (error) {
    console.error(`[${timestamp}] [Classroom Sync] Error:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
