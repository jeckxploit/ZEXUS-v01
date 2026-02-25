import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 5000 characters' },
        { status: 400 }
      );
    }

    // Send email to admin/support
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@zexus.app';
    const result = await sendContactFormEmail(
      supportEmail,
      name,
      email,
      subject,
      message
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to send contact form email' },
        { status: 500 }
      );
    }

    // Optionally send confirmation email to user
    // await sendEmail({
    //   to: email,
    //   subject: 'We received your message',
    //   react: <ContactConfirmation name={name} />
    // });

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      emailId: result.id,
    });
  } catch (error) {
    console.error('[API /api/email/contact] Error:', error);
    
    Sentry.captureException(error, {
      tags: {
        feature: 'email',
        endpoint: '/api/email/contact',
      },
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
