import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexodoro",
  description: "Lexodoro is a compiler-themed pomodoro timer with phases: Lex, Parse, Optimize, and Generate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
