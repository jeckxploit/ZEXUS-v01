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
  Hr,
} from '@react-email/components';

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactFormEmail({
  name,
  email,
  subject,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
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
          <Heading style={heading}>New Contact Form Submission</Heading>

          <Text style={text}>
            You've received a new message from the contact form:
          </Text>

          {/* Contact Info */}
          <Section style={infoSection}>
            <Text style={label}>From:</Text>
            <Text style={value}>{name}</Text>
            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>
            <Text style={label}>Subject:</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          {/* Message */}
          <Text style={label}>Message:</Text>
          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            This email was sent from your ZEXUS application contact form.
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

const infoSection = {
  backgroundColor: '#27272a',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const label = {
  color: '#71717a',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const value = {
  color: '#ffffff',
  fontSize: '16px',
  marginBottom: '16px',
};

const messageBox = {
  backgroundColor: '#27272a',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const messageText = {
  color: '#e4e4e7',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
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

export default ContactFormEmail;
