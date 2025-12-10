import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS Demo - AI Grading System",
  description: "Simple demo showcasing AI-powered MCQ grading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

