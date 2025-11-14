import { AuthProvider } from '@/components/auth/AuthProvider';
import type { Metadata, Viewport } from 'next';
import { Lora, Nunito } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-nunito',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: 'Personality Insights App',
  description: 'Discover actionable insights from your personality assessments',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Personality Insights',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth-mobile ${nunito.variable} ${lora.variable}`}
    >
      <body className={`${nunito.className} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <div id="main-content">{children}</div>
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
