import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "꼼꼼 - 서민금융의 길라잡이",
  description:
    "연봉 실수령액, DSR, DTI, 퇴직금, 양도소득세까지. 꼼꼼하게 계산해주는 무료 생활 금융 계산기 모음.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body className="font-sans">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-grid">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-stamp text-white font-bold text-sm shrink-0">
                꼼
              </span>
              <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                <span className="text-lg font-bold tracking-tight text-ink">
                  꼼꼼
                </span>
                <span className="text-xs text-inkSoft font-medium hidden sm:inline">
                  서민금융의 길라잡이
                </span>
              </span>
            </Link>
            <nav className="text-sm text-inkSoft">
              생활 금융 계산기 모음
            </nav>
          </div>
        </header>
        {children}
        <footer className="mx-auto max-w-5xl px-6 py-10 mt-20 border-t border-grid text-xs text-inkSoft">
          <p>
            본 계산 결과는 참고용이며 실제 금액과 다를 수 있습니다. 정확한
            금액은 관련 기관이나 전문가에게 확인하세요.
          </p>
          <p className="mt-1">© {new Date().getFullYear()} 꼼꼼</p>
        </footer>
      </body>
    </html>
  );
}
