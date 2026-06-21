import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CanvasBackground from '@/components/CanvasBackground';
import { GoogleProvider } from '@/components/auth/GoogleProvider';
import { PwaInstaller } from '@/components/pwa/PwaInstaller';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#22c55e',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://veloragreen.com'),
  title: {
    default: 'VeloraGreen — Carbon Footprint Intelligence Platform',
    template: '%s | VeloraGreen',
  },
  description:
    'Track, reduce, and offset your carbon footprint with our interactive platform. Calculate your carbon emissions and join the fight against climate change.',
  keywords: [
    'carbon footprint',
    'co2 calculator',
    'climate change',
    'sustainability',
    'green living',
    'eco-friendly',
    'emissions tracker',
    'carbon offset',
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
    description: 'Track, reduce, and offset your carbon footprint with our interactive platform.',
    type: 'website',
    locale: 'en_US',
    siteName: 'VeloraGreen',
    url: 'https://veloragreen.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VeloraGreen Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VeloraGreen — Carbon Footprint Intelligence Platform',
    description: 'Track, reduce, and offset your carbon footprint.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className="min-h-screen flex flex-col font-inter antialiased bg-slate-950">
        <GoogleProvider>
          <AnimatedBackground theme="green" />
          <CanvasBackground />
          <Navbar />
          <main id="main-content" className="flex-1 relative z-10" role="main">
            {children}
          </main>
          <Footer />
          <PwaInstaller />
        </GoogleProvider>
      </body>
    </html>
  );
}
