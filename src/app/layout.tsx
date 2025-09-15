import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "돌봄일지",
  description:
    "희귀질환 환자·보호자 기록에서 정신 상태와 SDoH를 LLM으로 자동 추출·분석하는 서비스",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased text-[15px] bg-background text-foreground",
          "supports-[scrollbar-gutter]:scrollbar-gutter-stable",
          "overscroll-y-contain",
          "min-h-dvh flex flex-col",
        ].join(" ")}
      >
        <div
          className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Navbar />
        </div>
        <main className="flex-1 min-h-0">{children}</main>
        <div id="portal-root" />
      </body>
    </html>
  );
}
