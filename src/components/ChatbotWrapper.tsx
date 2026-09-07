"use client";

import { usePathname } from "next/navigation";
import AITutorWidget from "./AITutorWidget";

export default function ChatbotWrapper() {
  const pathname = usePathname();

  // Menyembunyikan chatbot di halaman admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <AITutorWidget />;
}
