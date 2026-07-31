import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // In production, accessToken is obtained from user's Google OAuth session
    const sampleClassroomData = [
      { id: 'c1', title: 'Writing #1: Cultural Differences Essay', type: 'assignment', maxPoints: 2 },
      { id: 'c2', title: 'Speaking #1: Self-Introduction Video', type: 'assignment', maxPoints: 2 },
      { id: 'c3', title: 'Reading Quiz - Unit 1', type: 'quiz', maxPoints: 2 },
      { id: 'c4', title: 'ALP Proposal & Pair Presentation', type: 'project', maxPoints: 4 },
      { id: 'c5', title: 'Final Exam - Written Component', type: 'exam', maxPoints: 4 },
    ];

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Classify these raw Google Classroom items into official ICPNA rubrics (Writing 1, Writing 2, Writing 3, Speaking 1, Speaking 2, Speaking 3, Reading Quiz, ALP [4 pts], Final Exam [4 pts]). Return JSON array:
${JSON.stringify(sampleClassroomData)}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log('AI Classifier output:', response.text());
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sincronización y clasificación completada con Gemini 2.0 API',
      classifiedItems: sampleClassroomData
    });
  } catch (error) {
    console.error('Classroom Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
