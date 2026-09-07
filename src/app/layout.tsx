import type { Metadata } from "next";
import "./globals.css";
import ChatbotWrapper from "@/components/ChatbotWrapper";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Les Vita - Bimbingan Belajar & Mentorship Cerdas Ramah Anak",
  description:
    "Bimbingan Belajar & Mentorship Terbaik untuk Masa Depan Anak dengan Asisten AI 24 Jam dan Pengingat WhatsApp Otomatis.",
  keywords: "les privat, bimbel, tutor, SD, SMP, les anak, les online, les vita",
  openGraph: {
    title: "Les Vita - Bimbingan Belajar & Mentorship Cerdas",
    description: "Bimbel SD & SMP dengan AI Asisten 24/7 & Pengingat WA Otomatis",
    type: "website",
  },
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400"
          rel="stylesheet"
        />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Les Vita" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="antialiased selection:bg-[var(--primary)] selection:text-white">
        <AuthProvider>
          <Toaster position="top-center" />
          {children}
          {/* Floating AI Tutor Chatbot 24/7 */}
          <ChatbotWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
