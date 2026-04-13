import type { Metadata } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://listan.sixten.app"),
  title: {
    default: "listan | Shared Shopping List App | Simple & Fast",
    template: "%s | listan",
  },
  description: "The shopping list that works. Simple. Shared. Done.",
  // Note: meta keywords are ignored by Google, but some tools still check it.
  keywords: [
    "shared shopping list",
    "shopping list app",
    "collaborative shopping list",
    "grocery list app",
    "family shopping list",
    "shopping list for roommates",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "listan | Shared Shopping List App | Simple & Fast",
    description: "The shopping list that works. Simple. Shared. Done.",
    siteName: "listan",
  },
  twitter: {
    card: "summary_large_image",
    title: "listan | Shared Shopping List App | Simple & Fast",
    description: "The shopping list that works. Simple. Shared. Done.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          defer
          src="https://umami-production-488d.up.railway.app/script.js"
          data-website-id="a4f6fce1-77ba-4234-a14a-8633bebffd9f"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          <ClerkProvider dynamic>
            <ConvexClientProvider>
              {children}
              <Toaster />
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
