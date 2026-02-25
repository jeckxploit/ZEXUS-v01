import { NextRequest, NextResponse } from 'next/server';

// Google API Key for Gemini
const GOOGLE_API_KEY = 'AIzaSyBpRPUUs3q4PqKmTt3osHfW_5vQMA5DT74';

// In-memory conversation storage
const conversations = new Map<string, Array<{ role: string; content: string }>>();

const SYSTEM_PROMPTS: Record<string, string> = {
  general: `Kamu adalah ZEXUS, asisten AI yang ramah dan asik ngobrol. Berbicaralah seperti teman yang santai tapi tetap sopan. Gunakan Bahasa Indonesia yang natural, sehari-hari. Berikan jawaban yang singkat, padat, dan to-the-point (maksimal 1000 karakter).`,
  creative: `Kamu adalah ZEXUS, asisten AI yang super kreatif dan penuh imajinasi. Berbicaralah dengan semangat dan antusias! Gunakan Bahasa Indonesia yang ekspresif dan penuh warna.`,
  professional: `Kamu adalah ZEXUS, asisten AI profesional. Berbicaralah dengan sopan, profesional, tapi tetap hangat. Gunakan Bahasa Indonesia yang baku tapi natural.`,
  coding: `Kamu adalah ZEXUS, asisten AI yang jago programming. Berbicaralah seperti teman programmer yang asik. Gunakan Bahasa Indonesia teknis tapi santai.`,
  design: `Kamu adalah ZEXUS, asisten AI spesialis desain. Berbicaralah dengan gaya artistik. Gunakan Bahasa Indonesia yang ekspresif saat mendeskripsikan visual.`,
};

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = 'default', mode = 'general' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;

    let history = conversations.get(sessionId);
    if (!history) {
      history = [];
    }

    history.push({ role: 'user', content: message });

    if (history.length > 10) {
      history = history.slice(-10);
    }

    // Convert to Gemini format
    const geminiContents = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak bisa membuat respons.';

    history.push({ role: 'assistant', content: aiResponse });
    conversations.set(sessionId, history);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageCount: history.length - 1
    });
  } catch (error: any) {
    console.error('LLM Error:', error);

    let errorMessage = 'Gagal membuat respons';
    if (error.message?.includes('401') || error.message?.includes('API_KEY_INVALID')) {
      errorMessage = 'API key tidak valid.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage, debug: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId = 'default' } = await req.json();
    conversations.delete(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear conversation' }, { status: 500 });
  }
}
