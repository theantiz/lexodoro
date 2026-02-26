import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lexodoro.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lexodoro",
    template: "%s | Lexodoro",
  },
  description: "Lexodoro is a compiler-themed pomodoro timer with phases: Lex, Parse, Optimize, and Generate.",
  applicationName: "Lexodoro",
  keywords: [
    "pomodoro",
    "focus timer",
    "productivity",
    "compiler",
    "next.js",
    "lexodoro",
  ],
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lexodoro",
    description: "A compiler-themed Pomodoro timer for deep focus sessions.",
    url: "/",
    siteName: "Lexodoro",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lexodoro",
    description: "A compiler-themed Pomodoro timer for deep focus sessions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
