import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, validateFile } from '@/lib/upload';
import * as Sentry from '@sentry/nextjs';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100MB',
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload file
    const result = await uploadFile(
      buffer,
      file.name,
      file.type,
      validation.fileType
    );

    return NextResponse.json({
      success: true,
      file: {
        url: result.url,
        publicUrl: result.publicUrl,
        key: result.key,
        size: result.size,
        contentType: result.contentType,
        uploadedAt: result.uploadedAt,
      },
    });
  } catch (error) {
    console.error('[API /api/upload/direct] Error:', error);

    Sentry.captureException(error, {
      tags: {
        feature: 'upload',
        endpoint: '/api/upload/direct',
      },
    });

    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
