import { NextRequest, NextResponse } from 'next/server';
import { getUploadPresignedUrl, validateFile, getFileType } from '@/lib/upload';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, type } = body;

    // Validation
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'File name and type are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const detectedType = getFileType(fileType);
    if (!detectedType) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Get presigned URL
    const result = await getUploadPresignedUrl(fileName, fileType, type || detectedType);

    return NextResponse.json({
      success: true,
      uploadUrl: result.uploadUrl,
      fileUrl: result.fileUrl,
      key: result.key,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('[API /api/upload/presigned] Error:', error);

    Sentry.captureException(error, {
      tags: {
        feature: 'upload',
        endpoint: '/api/upload/presigned',
      },
    });

    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return allowed file types and sizes
  return NextResponse.json({
    allowedTypes: {
      image: {
        extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        maxSize: '5MB',
      },
      document: {
        extensions: ['.pdf', '.doc', '.docx'],
        maxSize: '10MB',
      },
      video: {
        extensions: ['.mp4', '.webm', '.mov'],
        maxSize: '100MB',
      },
      audio: {
        extensions: ['.mp3', '.wav', '.ogg'],
        maxSize: '20MB',
      },
    },
  });
}
