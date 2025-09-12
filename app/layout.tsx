import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { Suspense, memo, useMemo } from "react";
import dynamic from "next/dynamic";

// Optimized font loading with display swap and preload
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'monospace'],
});

// Dynamic imports for better code splitting
const DynamicProviders = dynamic(() => import("./Providers").then(mod => ({ default: mod.Providers })), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Initializing application...</p>
      </div>
    </div>
  ),
});

const DynamicClientLayout = dynamic(() => import("./components/ClientLayout"), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Loading interface...</p>
      </div>
    </div>
  ),
});

// Enhanced metadata with performance optimizations
export const metadata: Metadata = {
  title: {
    default: "ZeroLag Market Place",
    template: "%s | ZeroLag Market Place"
  },
  description: "Earn through your Agents - Decentralised AI Studio",
  keywords: ["AI", "Agents", "Marketplace", "Decentralized", "Crypto", "Blockchain"],
  authors: [{ name: "ZeroLag Team" }],
  creator: "ZeroLag",
  publisher: "ZeroLag",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zerolag.market',
    siteName: 'ZeroLag Market Place',
    title: 'ZeroLag Market Place',
    description: 'Earn through your Agents - Decentralised AI Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ZeroLag Market Place',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZeroLag Market Place',
    description: 'Earn through your Agents - Decentralised AI Studio',
    images: ['/twitter-image.jpg'],
    creator: '@zerolag',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'dark light',
  category: 'technology',
};

// Performance monitoring component for development


// Error boundary for layout-level errors
const LayoutErrorBoundary = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center max-w-md">
          <div className="w-12 h-12 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
          <h2 className="text-white text-lg font-semibold">Loading ZeroLag</h2>
          <p className="text-gray-400 text-sm">Preparing your decentralized AI experience...</p>
          <div className="flex space-x-1 justify-center mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
});

LayoutErrorBoundary.displayName = 'LayoutErrorBoundary';

// Optimized body component with memoization
const OptimizedBody = memo(({ 
  fontVariables, 
  children 
}: { 
  fontVariables: string; 
  children: React.ReactNode; 
}) => {
  return (
    <body className={`${fontVariables} antialiased overflow-x-hidden`}>
      <LayoutErrorBoundary>
        <DynamicProviders>
          <DynamicClientLayout>
            {children}
          </DynamicClientLayout>
        </DynamicProviders>
      </LayoutErrorBoundary>
      
      
      {/* Preload critical resources */}
      <link rel="preload" href="/ambSound.mp3" as="audio" type="audio/mpeg" />
      <link rel="preload" href="/niko.jpg" as="image" type="image/jpeg" />
      
      {/* Service Worker Registration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator && '${process.env.NODE_ENV}' === 'production') {
              navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('SW registered'))
                .catch(() => console.log('SW registration failed'));
            }
          `
        }}
      />
      
      {/* Performance monitoring script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Web Vitals monitoring
            function vitals(metric) {
              const body = JSON.stringify(metric);
              const url = '/api/vitals';
              
              if (navigator.sendBeacon) {
                navigator.sendBeacon(url, body);
              } else {
                fetch(url, { body, method: 'POST', keepalive: true });
              }
            }
            
            // Load web-vitals dynamically
            if (typeof window !== 'undefined' && '${process.env.NODE_ENV}' === 'production') {
              import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(vitals);
                getFID(vitals);
                getFCP(vitals);
                getLCP(vitals);
                getTTFB(vitals);
              }).catch(() => {});
            }
          `
        }}
      />
    </body>
  );
});

OptimizedBody.displayName = 'OptimizedBody';

// Main RootLayout component with comprehensive optimizations
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Memoize font variables to prevent recalculation
  const fontVariables = useMemo(() => 
    `${geistSans.variable} ${geistMono.variable}`, 
    []
  );

  return (
    <html 
      lang="en" 
      className="dark"
      suppressHydrationWarning={true}
    >
      <head>
        {/* Critical CSS inlining for faster rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for initial render */
            html { 
              color-scheme: dark; 
              scroll-behavior: smooth;
            }
            body { 
              margin: 0; 
              background: #000; 
              color: #fff; 
              font-synthesis: none;
              text-rendering: optimizeLegibility;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* Prevent FOUC */
            .hydrating { opacity: 0; }
            .hydrated { 
              opacity: 1; 
              transition: opacity 0.3s ease-in-out; 
            }
            
            /* Loading screen styles */
            .loading-screen {
              position: fixed;
              inset: 0;
              background: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            }
          `
        }} />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        
        {/* DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Resource hints */}
        <link rel="prefetch" href="/api/vitals" />
        
        {/* Critical resource preloads */}
        <link
          rel="preload"
          href={`/_next/static/css/app/layout.css`}
          as="style"
        />
        
        {/* Viewport meta for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* Optimization hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="ZeroLag" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZeroLag" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ZeroLag Market Place",
              "description": "Earn through your Agents - Decentralised AI Studio",
              "url": "https://zerolag.market",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      
      <OptimizedBody fontVariables={fontVariables}>
        {children}
      </OptimizedBody>
    </html>
  );
}