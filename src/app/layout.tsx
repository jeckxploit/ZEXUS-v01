import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "@/lib/env"; // Validate environment variables on startup

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "ZEXUS - Future of Digital Experience",
  description: "Experience the future of digital innovation. Where creativity meets technology in a stunning, futuristic interface.",
  keywords: ["ZEXUS", "futuristic", "innovation", "technology", "creative", "modern", "PWA"],
  authors: [{ name: "ZEXUS Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
    apple: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZEXUS",
  },
  openGraph: {
    title: "ZEXUS - Future of Digital Experience",
    description: "Experience the future of digital innovation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEXUS - Future of Digital Experience",
    description: "Experience the future of digital innovation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
