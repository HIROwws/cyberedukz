import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberEdu KZ",
  description: "Практическая платформа для обучения кибербезопасности",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <header className="app-header">
          <a className="brand" href="/">
            CyberEdu KZ
          </a>
          <nav className="nav">
            <a href="/courses">Курсы</a>
            <a href="/leaderboard">Рейтинг</a>
            <a href="/login">Войти</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

