import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MotionProvider } from "@/components/providers/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Fitness Coach | Your AI-Powered Fitness Guide",
  description:
    "Get personalized fitness coaching powered by AI. Strength training, nutrition, yoga, and mobility guidance.",
  keywords: [
    "fitness coach",
    "AI fitness",
    "strength training",
    "nutrition advice",
    "workout planning",
    "yoga",
    "mobility",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Fitness Coach - AI-Powered Fitness Guidance",
    description:
      "Get personalized fitness coaching powered by AI. Strength training, nutrition, yoga, and mobility.",
    type: "website",
    siteName: "Fitness Coach",
  },
  twitter: {
    card: "summary",
    title: "Fitness Coach - AI-Powered Fitness Guidance",
    description:
      "Get personalized fitness coaching powered by AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MotionProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </MotionProvider>
      </body>
    </html>
  );
}
