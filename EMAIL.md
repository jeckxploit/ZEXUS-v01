# 📧 ZEXUS Email System Guide

## Overview

ZEXUS uses **Resend** for transactional emails with beautiful React-based email templates.

### Features

- ✅ Beautiful email templates with React Email
- ✅ TypeScript-safe email sending
- ✅ Error tracking with Sentry
- ✅ Rate limiting for bulk emails
- ✅ Multiple template types
- ✅ API routes for easy integration

---

## Setup

### 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys)
3. Copy your API key

### 2. Configure Environment

Add to `.env.local`:

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="ZEXUS <noreply@yourdomain.com>"

# Optional - for contact form
SUPPORT_EMAIL="support@zexus.app"
```

### 3. Verify Domain (Production)

For production, verify your domain in Resend:

1. Go to [Domains](https://resend.com/domains)
2. Add your domain
3. Add DNS records to your domain provider
4. Wait for verification (usually < 1 hour)

---

## Email Templates

### Available Templates

| Template | Component | Usage |
|----------|-----------|-------|
| Welcome | `@/emails/welcome` | New user registration |
| Password Reset | `@/emails/password-reset` | Password recovery |
| Contact Form | `@/emails/contact-form` | Contact form submissions |

### Creating New Templates

```bash
# Create new template
touch src/emails/new-template.tsx
```

Example template:

```tsx
import { Body, Container, Heading, Text } from '@react-email/components';

interface NewTemplateProps {
  name: string;
}

export function NewTemplate({ name }: NewTemplateProps) {
  return (
    <Body>
      <Container>
        <Heading>Hello {name}!</Heading>
        <Text>This is a new email template.</Text>
      </Container>
    </Body>
  );
}
```

---

## Usage

### Send Welcome Email

```typescript
import { sendWelcomeEmail } from '@/lib/email';

// After user registration
await sendWelcomeEmail(user.email, user.name);
```

### Send Password Reset Email

```typescript
import { sendPasswordResetEmail } from '@/lib/email';

// Generate reset token
const resetToken = generateResetToken();
const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

await sendPasswordResetEmail(user.email, user.name, resetToken, resetUrl);
```

### Send Contact Form Email

```typescript
import { sendContactFormEmail } from '@/lib/email';

await sendContactFormEmail(
  'support@zexus.app',
  'John Doe',
  'john@example.com',
  'Question about pricing',
  'Message content...'
);
```

### Custom Email

```typescript
import { sendEmail } from '@/lib/email';
import { MyCustomTemplate } from '@/emails/my-template';

await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Email',
  react: <MyCustomTemplate name="User" />,
  cc: ['team@zexus.app'],
  replyTo: 'support@zexus.app',
});
```

### Bulk Emails

```typescript
import { sendBulkEmails } from '@/lib/email';
import { NewsletterTemplate } from '@/emails/newsletter';

const recipients = ['user1@example.com', 'user2@example.com', ...];

const { results, errors } = await sendBulkEmails(
  recipients,
  'Monthly Newsletter',
  <NewsletterTemplate />,
  10 // batch size
);

console.log(`Sent: ${results.length}, Failed: ${errors.length}`);
```

---

## API Routes

### POST /api/email/welcome

Send welcome email to new user.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "emailId": "email_id_from_resend"
}
```

### POST /api/email/contact

Submit contact form.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question",
  "message": "Message content..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "emailId": "email_id_from_resend"
}
```

---

## Email Service

### Configuration

```typescript
// src/lib/email.ts

// Default sender
const from = process.env.EMAIL_FROM || 'ZEXUS <onboarding@resend.dev>';

// In development, Resend provides a test email
// In production, use your verified domain
```

### Rate Limits

| Plan | Daily Limit | Rate Limit |
|------|-------------|------------|
| Free | 3,000/month | 3 emails/sec |
| Pro | 50,000/month | 10 emails/sec |
| Business | 100,000/month | 20 emails/sec |

Bulk email function automatically handles rate limiting.

---

## Testing

### Local Development

Resend provides test mode in development:

```typescript
// Use test API key
RESEND_API_KEY=re_test_xxxxxxxxxxxxxxxxxxxxx

// Emails won't be sent, but you can test templates
```

### Preview Templates

Use React Email CLI to preview templates:

```bash
# Install React Email CLI
bun add -d react-email

# Start preview server
bunx react-email dev src/emails
```

Open http://localhost:3001 to preview templates.

### Send Test Email

```bash
# Use the API route
curl -X POST http://localhost:3000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

---

## Error Handling

### Failed Emails

The email service automatically:

1. Logs errors to console
2. Captures errors in Sentry
3. Returns `null` on failure

```typescript
const result = await sendWelcomeEmail(email, name);

if (!result) {
  // Handle failure
  console.error('Failed to send welcome email');
  
  // Queue for retry later
  await queueEmail('welcome', email, name);
}
```

### Retry Logic

For critical emails, implement retry:

```typescript
async function sendWithRetry(
  fn: () => Promise<any>,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await fn();
    if (result) return result;
    
    // Wait before retry (exponential backoff)
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
  }
  return null;
}
```

---

## Best Practices

### 1. Personalization

```tsx
// ✅ Good
<WelcomeEmail name={user.name} email={user.email} />

// ❌ Bad
<WelcomeEmail name="User" email="" />
```

### 2. Plain Text Fallback

Always include plain text version:

```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome',
  react: <WelcomeEmail name="User" />,
  text: 'Welcome to ZEXUS! Visit https://zexus.app to get started.',
});
```

### 3. Unsubscribe Link

For marketing emails:

```tsx
<Text>
  Don't want to receive these emails?{' '}
  <Link href={`${process.env.NEXTAUTH_URL}/unsubscribe?email=${email}`}>
    Unsubscribe
  </Link>
</Text>
```

### 4. Email Analytics

Track opens and clicks:

```typescript
// Resend automatically tracks opens and clicks
// View analytics at resend.com/analytics
```

---

## Troubleshooting

### Emails Not Sending

1. Check API key is valid
2. Verify domain (production)
3. Check Resend dashboard for errors
4. Ensure `EMAIL_FROM` uses verified domain

### Template Not Rendering

1. Check all required props are passed
2. Ensure React Email components are imported
3. Preview in React Email dev server

### Rate Limit Errors

```typescript
// Implement exponential backoff
async function sendWithBackoff(emails: string[]) {
  for (let i = 0; i < emails.length; i++) {
    await sendEmail({ to: emails[i], ... });
    if (i % 10 === 0) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
```

---

## Resources

- [Resend Docs](https://resend.com/docs)
- [React Email Docs](https://react.email/docs)
- [Resend API Reference](https://resend.com/docs/api-reference/introduction)
- [Email Deliverability Guide](https://resend.com/docs/deliverability/introduction)

---

## Commands

```bash
# Preview email templates
bunx react-email dev src/emails

# Send test email
curl -X POST http://localhost:3000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'
```
