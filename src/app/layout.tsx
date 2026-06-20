import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/home/SiteHeader';
import { EcoSideNav, EcoSocialPanel } from '@/components/home/SidePanels';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/components/AuthProvider';
import { PwaRegister } from '@/components/PwaRegister';
import { BackgroundImage } from '@/components/BackgroundImage';
import { DynamicParticleBackground, DynamicEcoChatBot } from '@/components/DynamicComponents';
import { env } from '@/lib/env';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' });
const rajdhani = Rajdhani({ subsets: ['latin'], variable: '--font-rajdhani', weight: ['400', '500', '600', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'EcoTrace - Carbon Footprint Intelligence Platform',
    template: '%s | EcoTrace',
  },
  description: 'Track, reduce, and offset your carbon emissions with our interactive platform. Calculate your carbon footprint and join the fight against climate change.',
  keywords: ['carbon footprint', 'co2 calculator', 'climate change', 'sustainability', 'green living', 'eco-friendly', 'emissions tracker'],
  authors: [{ name: 'EcoTrace Team', url: 'https://ecotrace.vercel.app' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'EcoTrace - Carbon Footprint Intelligence Platform',
    description: 'Track, reduce, and offset your carbon emissions with our interactive platform.',
    url: env.NEXT_PUBLIC_APP_URL,
    siteName: 'EcoTrace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoTrace - Carbon Footprint Tracker',
    description: 'Track, reduce, and offset your carbon emissions with our interactive platform.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    canonical: env.NEXT_PUBLIC_APP_URL,
  },
};

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${rajdhani.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="EcoTrace" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EcoTrace" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen text-white antialiased">
        <AuthProvider>
          <PwaRegister />
          <BackgroundImage />
          <DynamicParticleBackground />
          <SiteHeader />
          <EcoSideNav />
          <EcoSocialPanel />
          <DynamicEcoChatBot />

          <div className="flex flex-col min-h-screen" style={{ position: 'relative', zIndex: 2 }}>
            <ErrorBoundary>
              <main className="flex-1 pt-14 pb-16 lg:pt-[60px] lg:pb-0 lg:px-[60px]">
                {children}
              </main>
            </ErrorBoundary>
            <Footer />
          </div>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
