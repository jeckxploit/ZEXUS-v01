import { NextRequest, NextResponse } from 'next/server';
import { deleteFile } from '@/lib/upload';
import * as Sentry from '@sentry/nextjs';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Delete file
    await deleteFile(key);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('[API /api/upload/delete] Error:', error);

    Sentry.captureException(error, {
      tags: {
        feature: 'upload',
        endpoint: '/api/upload/delete',
      },
    });

    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
