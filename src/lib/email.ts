import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || '');

// Email types
export type EmailType = 'welcome' | 'password-reset' | 'contact-form' | 'newsletter';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export interface SendEmailResult {
  id: string;
  from: string;
  to: string[];
  createdAt: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult | null> {
  const from = process.env.EMAIL_FROM || 'ZEXUS <onboarding@resend.dev>';

  try {
    const { data, error } = await resend.emails.send({
      from,
      ...options,
      to: Array.isArray(options.to) ? options.to : [options.to],
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
    });

    if (error) {
      console.error('[Email] Failed to send email:', error);
      
      // Capture error in Sentry
      Sentry.captureException(error, {
        tags: {
          feature: 'email',
          email_to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        },
        extra: {
          subject: options.subject,
          from,
        },
      });

      return null;
    }

    console.log('[Email] Email sent successfully:', data?.id);
    return {
      id: data!.id,
      from: data!.from,
      to: data!.to,
      createdAt: data!.createdAt,
    };
  } catch (error) {
    console.error('[Email] Unexpected error:', error);
    
    Sentry.captureException(error, {
      tags: {
        feature: 'email',
      },
      extra: {
        subject: options.subject,
        to: options.to,
      },
    });

    return null;
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(to: string, name: string) {
  const { WelcomeEmail } = await import('@/emails/welcome');
  
  return sendEmail({
    to,
    subject: 'Welcome to ZEXUS! 🎉',
    react: WelcomeEmail({ name, email: to }),
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetToken: string,
  resetUrl: string
) {
  const { PasswordResetEmail } = await import('@/emails/password-reset');
  
  return sendEmail({
    to,
    subject: 'Reset Your Password - ZEXUS',
    react: PasswordResetEmail({
      name,
      resetToken,
      resetUrl,
      expiryMinutes: 30,
    }),
  });
}

/**
 * Send contact form submission notification
 */
export async function sendContactFormEmail(
  to: string,
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const { ContactFormEmail } = await import('@/emails/contact-form');
  
  return sendEmail({
    to,
    subject: `New Contact Form: ${subject}`,
    react: ContactFormEmail({ name, email, subject, message }),
  });
}

/**
 * Send bulk emails (for newsletters, announcements)
 */
export async function sendBulkEmails(
  recipients: string[],
  subject: string,
  react: React.ReactElement,
  batchSize: number = 10
) {
  const results: SendEmailResult[] = [];
  const errors: Array<{ email: string; error: unknown }> = [];

  // Process in batches to avoid rate limits
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (email) => {
      const result = await sendEmail({
        to: email,
        subject,
        react,
      });
      
      if (result) {
        results.push(result);
      } else {
        errors.push({ email, error: 'Failed to send' });
      }
    });

    await Promise.all(batchPromises);
    
    // Wait between batches
    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { results, errors };
}

export { resend };
export default resend;
