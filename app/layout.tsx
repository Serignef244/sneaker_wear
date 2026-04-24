import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SneakerWear | Boutique Premium",
  description: "La meilleure séléction de sneakers et vêtements au Sénégal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#050505]">
        {children}
      </body>
    </html>
  );
}
