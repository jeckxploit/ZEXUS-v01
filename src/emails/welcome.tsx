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

interface WelcomeEmailProps {
  name: string;
  email: string;
}

export function WelcomeEmail({ name = 'User', email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ZEXUS - Your journey starts here!</Preview>
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
          <Heading style={heading}>Welcome to ZEXUS, {name}!</Heading>

          <Text style={text}>
            We're excited to have you on board. Your account has been successfully
            created with the email <strong>{email}</strong>.
          </Text>

          <Text style={text}>
            ZEXUS is a modern, production-ready web application scaffold that
            combines the best technologies in the React ecosystem.
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href="https://zexus.app/dashboard">
              Get Started
            </Button>
          </Section>

          <Hr style={hr} />

          {/* What's Next */}
          <Text style={text}>
            <strong>What's next?</strong>
          </Text>
          <Text style={listItem}>
            ✓ Explore the dashboard and features
          </Text>
          <Text style={listItem}>
            ✓ Customize your profile settings
          </Text>
          <Text style={listItem}>
            ✓ Check out our documentation
          </Text>
          <Text style={listItem}>
            ✓ Join our community
          </Text>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            If you didn't create this account, please ignore this email.
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

const listItem = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '1.8',
  marginBottom: '8px',
  paddingLeft: '20px',
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

export default WelcomeEmail;
