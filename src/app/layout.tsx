import type { Metadata, Viewport } from 'next';
import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CanvasBackground from '@/components/CanvasBackground';
import { GoogleProvider } from '@/components/auth/GoogleProvider';
import { PwaInstaller } from '@/components/pwa/PwaInstaller';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { SkipToContent } from '@/components/accessibility/SkipToContent';
import { VisionAnalyzer } from '@/components/VisionAnalyzer';
import ChatAssistant from '@/components/chat/ChatAssistant';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://veloragreen.com';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#22c55e',
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'VeloraGreen — Carbon Footprint Intelligence Platform',
    template: '%s | VeloraGreen',
  },
  description:
    'Track, reduce, and offset your carbon footprint with AI-powered insights. Calculate your carbon emissions and join the fight against climate change.',
  keywords: [
    'carbon footprint',
    'co2 calculator',
    'climate change',
    'sustainability',
    'green living',
    'eco-friendly',
    'emissions tracker',
    'carbon offset',
    'carbon intelligence',
  ],
  authors: [{ name: 'VeloraGreen Team' }],
  creator: 'VeloraGreen',
  publisher: 'VeloraGreen',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'VeloraGreen — Carbon Footprint Intelligence Platform',
    description: 'Track, reduce, and offset your carbon footprint with AI-powered insights.',
    type: 'website',
    locale: 'en_US',
    siteName: 'VeloraGreen',
    url: APP_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VeloraGreen Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VeloraGreen — Carbon Footprint Intelligence Platform',
    description: 'Track, reduce, and offset your carbon footprint with AI-powered insights.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      'en-US': APP_URL,
      'hi-IN': `${APP_URL}/hi`,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VeloraGreen',
  url: APP_URL,
  description: 'Track, reduce, and offset your carbon footprint with AI-powered insights.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'VeloraGreen Team',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-inter antialiased bg-slate-950">
        <SkipToContent />
        <div role="status" aria-live="polite" className="sr-only" id="global-announcements" />
        <GoogleProvider>
          <AnimatedBackground theme="green" />
          <CanvasBackground />
          <Navbar />
          <main id="main-content" className="flex-1 relative z-10" role="main">
            {children}
          </main>
          <ChatAssistant />
          <VisionAnalyzer />
          <Footer />
          <PwaInstaller />
          <PwaRegister />
        </GoogleProvider>

        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
