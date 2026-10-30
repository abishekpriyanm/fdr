import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FDR portal · Synthetic demo",
  description: "Local synthetic demonstration of fixed deposit receipt case management.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
