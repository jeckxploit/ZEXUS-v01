import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  resetToken: string;
  resetUrl: string;
  expiryMinutes: number;
}

export function PasswordResetEmail({
  name = 'User',
  resetToken,
  resetUrl,
  expiryMinutes = 30,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your ZEXUS password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logo}>
            <Img
              src="https://z-cdn.chatglm.cn/z-ai/static/logo.svg"
              width="48"
              height="48"
              alt="ZEXUS"
            />
          </Section>

          {/* Heading */}
          <Heading style={heading}>Reset Your Password</Heading>

          <Text style={text}>
            Hi {name},
          </Text>

          <Text style={text}>
            We received a request to reset your password. Click the button below
            to reset it:
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>

          <Section style={code}>
            <Text style={codeText}>{resetUrl}</Text>
          </Section>

          <Hr style={hr} />

          {/* Security Notice */}
          <Text style={warningText}>
            <strong>⚠️ Security Notice:</strong>
          </Text>
          <Text style={text}>
            This link will expire in {expiryMinutes} minutes.
          </Text>
          <Text style={text}>
            If you didn't request this password reset, please ignore this email
            or contact support if you have concerns.
          </Text>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            For security reasons, never share your password or reset link with
            anyone.
          </Text>

          <Text style={footer}>
            Need help?{' '}
            <Link href="mailto:support@zexus.app" style={link}>
              Contact Support
            </Link>
          </Text>

          <Text style={footer}>
            © {new Date().getFullYear()} ZEXUS. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: '40px 20px',
};

const container = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  padding: '40px',
  maxWidth: '600px',
  margin: '0 auto',
  border: '1px solid #333',
};

const logo = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const heading = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const text = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const warningText = {
  color: '#fbbf24',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '10px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#00f5ff',
  borderRadius: '8px',
  color: '#0a0a0a',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  marginTop: '10px',
};

const code = {
  backgroundColor: '#27272a',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '20px',
  border: '1px solid #333',
};

const codeText = {
  backgroundColor: '#1a1a1a',
  borderRadius: '6px',
  padding: '12px 16px',
  fontSize: '13px',
  fontFamily: 'monospace',
  color: '#00f5ff',
  wordBreak: 'break-all' as const,
  margin: 0,
};

const hr = {
  borderColor: '#333',
  margin: '30px 0',
};

const footer = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '1.5',
  marginBottom: '10px',
  textAlign: 'center' as const,
};

const link = {
  color: '#00f5ff',
  textDecoration: 'underline',
};

export default PasswordResetEmail;
