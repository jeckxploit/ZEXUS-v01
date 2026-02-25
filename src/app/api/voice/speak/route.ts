import { NextRequest, NextResponse } from 'next/server';

// Function to optimize text for natural TTS speech in Indonesian
function optimizeTextForSpeech(text: string): string {
  let optimized = text;

  // Remove markdown formatting
  optimized = optimized.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
  optimized = optimized.replace(/\*(.*?)\*/g, '$1'); // Italic
  optimized = optimized.replace(/`(.*?)`/g, '$1'); // Inline code
  optimized = optimized.replace(/#{1,6}\s/g, ''); // Headers

  // Replace technical symbols with spoken equivalents
  optimized = optimized.replace(/->/g, ' ke ');
  optimized = optimized.replace(/=>/g, ' sama dengan ');
  optimized = optimized.replace(/!=/g, ' tidak sama dengan ');
  optimized = optimized.replace(/===/g, ' sama persis dengan ');
  optimized = optimized.replace(/==/g, ' sama dengan ');
  optimized = optimized.replace(/&&/g, ' dan ');
  optimized = optimized.replace(/\|\|/g, ' atau ');

  // Replace common abbreviations with spoken forms
  optimized = optimized.replace(/\bAPI\b/gi, 'A P I');
  optimized = optimized.replace(/\bUI\b/gi, 'U I');
  optimized = optimized.replace(/\bUX\b/gi, 'U X');
  optimized = optimized.replace(/\bAI\b/gi, 'A I');
  optimized = optimized.replace(/\bVS\b/gi, 'versus');
  optimized = optimized.replace(/\betc\b/gi, 'dan lain-lain');
  optimized = optimized.replace(/\bsdk\b/gi, 'S D K');

  // Add natural pauses - replace periods with pause-friendly format
  optimized = optimized.replace(/\.\s+/g, '. ');

  // Break long sentences into shorter chunks for better speech flow
  const sentences = optimized.split(/(?<=[.!?])\s+/);
  const processedSentences = sentences.map(sentence => {
    // If sentence is too long (more than 150 chars), try to break it at natural pause points
    if (sentence.length > 150) {
      // Break at "yang", "dan", "atau", "tapi", "karena", "sehingga"
      const breakWords = [' yang ', ' dan ', ' atau ', ' tapi ', ' karena ', ' sehingga ', ' lalu '];
      for (const breakWord of breakWords) {
        if (sentence.includes(breakWord)) {
          const parts = sentence.split(breakWord);
          if (parts.length > 1) {
            const midPoint = Math.floor(parts.length / 2);
            const firstPart = parts.slice(0, midPoint).join(breakWord);
            const secondPart = parts.slice(midPoint).join(breakWord);
            return firstPart + '. ' + breakWord.trim() + ' ' + secondPart;
          }
        }
      }
    }
    return sentence;
  });

  optimized = processedSentences.join(' ');

  // Clean up extra whitespace
  optimized = optimized.replace(/\s+/g, ' ').trim();

  return optimized;
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'tongtong', speed = 0.95 } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Optimize text for natural speech
    const optimizedText = optimizeTextForSpeech(text);

    // Validate text length (max 1024 characters after optimization)
    if (optimizedText.length > 1024) {
      // Truncate to last complete sentence
      const truncated = optimizedText.slice(0, 1020);
      const lastPeriod = truncated.lastIndexOf('.');
      const finalText = lastPeriod > 0 ? truncated.slice(0, lastPeriod + 1) : truncated.slice(0, 1024);

      console.log(`Text truncated from ${optimizedText.length} to ${finalText.length} characters`);
      return await generateSpeech(finalText, voice, speed);
    }

    return await generateSpeech(optimizedText, voice, speed);
  } catch (error: any) {
    console.error('TTS Error:', error);

    // Provide user-friendly error messages
    let errorMessage = 'Gagal membuat suara';
    if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
      errorMessage = 'Layanan suara saat ini tidak tersedia. Silakan coba lagi nanti.';
    } else if (error.message?.includes('Connect')) {
      errorMessage = 'Tidak dapat terhubung ke layanan suara. Periksa koneksi internet Anda.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

async function generateSpeech(text: string, voice: string, speed: number) {
  // Import ZAI SDK (must be done at runtime)
  const ZAI = (await import('z-ai-web-dev-sdk')).default;

  // Create SDK instance
  const zai = await ZAI.create();

  // Generate TTS audio with timeout
  const response = await Promise.race([
    zai.audio.tts.create({
      input: text.trim(),
      voice: voice,
      speed: speed,
      response_format: 'wav',
      stream: false,
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TTS service timeout')), 30000)
    )
  ]);

  // Get array buffer from Response object
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  // Return audio as response
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/wav',
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'no-cache',
    },
  });
}
