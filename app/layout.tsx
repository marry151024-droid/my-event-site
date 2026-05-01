import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const noto = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "거상 운명상단",
  description: "거상 운명상단 기여도 랭킹",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${noto.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}