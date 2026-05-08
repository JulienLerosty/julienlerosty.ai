import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://julienlerosty.ai"),
  title: "Julien Lerosty // AI Engineer",
  description: "Wireless engineer building production AI agents. The portfolio is the proof — try the chat.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Julien Lerosty // AI Engineer",
    description: "Wireless engineer building production AI agents. The portfolio is the proof — try the chat.",
    images: ["/avatar.png"],
  },
  twitter: {
    card: "summary",
    images: ["/avatar.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
