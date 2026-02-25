import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { audioBase64 } = await req.json();

    if (!audioBase64) {
      return NextResponse.json(
        { error: 'Audio data is required' },
        { status: 400 }
      );
    }

    // Import ZAI SDK (must be done at runtime)
    const ZAI = (await import('z-ai-web-dev-sdk')).default;

    // Create SDK instance with timeout
    const zai = await ZAI.create();

    // Transcribe audio with error handling for timeout
    const response = await Promise.race([
      zai.audio.asr.create({
        file_base64: audioBase64
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('ASR service timeout')), 30000)
      )
    ]);

    const transcription = response.text || '';

    return NextResponse.json({
      success: true,
      transcription: transcription,
      wordCount: transcription.split(/\s+/).length
    });
  } catch (error: any) {
    console.error('ASR Error:', error);

    // Provide user-friendly error messages
    let errorMessage = 'Gagal mentranskripsi audio';
    if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
      errorMessage = 'Layanan suara saat ini tidak tersedia. Silakan coba lagi nanti.';
    } else if (error.message?.includes('Connect')) {
      errorMessage = 'Tidak dapat terhubung ke layanan suara. Periksa koneksi internet Anda.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
