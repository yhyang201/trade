import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KStory - The Story Behind Every K-Line",
  description: "AI-powered stock news analysis - see the story behind every K-line movement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
