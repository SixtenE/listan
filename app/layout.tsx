import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "@/components/ui/sonner";
import { dark } from "@clerk/themes";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
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
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${libreBaskerville.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            dynamic
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#fafafa",
                colorBackground: "#0a0a0a",
                colorInputBackground: "#171717",
                colorInputText: "#fafafa",
                borderRadius: "0.375rem",
              },
            }}
          >
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
