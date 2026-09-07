"use client";

import React, { useState, useRef, useEffect } from "react";

export default function AITutorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    {
      role: "bot",
      text: "Halo Bunda/Ayah! 👋 Saya admin Les Vita. Mau tanya tentang program les, jadwal, biaya, atau pendaftaran? Silakan chat di sini ya!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const quickPrompts = [
    "Ada program les apa saja?",
    "Berapa biaya les per bulan?",
    "Bagaimana cara mendaftar?",
    "Jadwal les hari apa?",
  ];

  const generateReply = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes("program") || q.includes("les apa")) {
      return `Kami punya program les SD & SMP:\n\n📚 SD: Calistung, Matematika & IPA, English Fun, Les Semua Mapel\n📚 SMP: Matematika & IPA, OSN, Ujian Sekolah, Bahasa Inggris\n\nMau tahu detail yang mana? 😊`;
    }
    if (q.includes("biaya") || q.includes("harga") || q.includes("bayar")) {
      return `Biaya mulai dari:\n\n• SD: Rp 250rb - 400rb/bulan\n• SMP: Rp 400rb - 500rb/bulan\n\nSudah termasuk modul & laporan WA ke orang tua!\n\n📲 Chat WA admin untuk info lebih detail ya!`;
    }
    if (q.includes("daftar") || q.includes("registrasi") || q.includes("gabung")) {
      return `Cara daftar:\n1️⃣ Chat admin via WA\n2️⃣ Konsultasi gratis\n3️⃣ Pilih program & jadwal\n4️⃣ Mulai les! 🎉\n\n✅ Konsultasi & trial pertama GRATIS!`;
    }
    if (q.includes("jadwal") || q.includes("hari") || q.includes("jam")) {
      return `Jadwal fleksibel:\n⏰ Senin - Sabtu\n⏰ 13.00 - 20.00 WIB\n⏰ 60-90 menit/pertemuan\n\nBisa diatur sesuai kegiatan sekolah anak!`;
    }
    return `Terima kasih! 😊 Untuk info lebih lengkap, langsung chat admin WA kami ya!\n\n📲 Klik tombol "Daftar via WhatsApp" di halaman ini.`;
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || typing) return;

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    if (!textToSend) setInputMessage("");
    setTyping(true);

    setTimeout(() => {
      const reply = generateReply(query);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[var(--border-light)] flex flex-col overflow-hidden mb-4 animate-fade-in">
          {/* Header */}
          <div className="gradient-hero p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">💬</div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[var(--primary)] rounded-full" />
              </div>
              <div>
                <div className="font-bold text-sm">Admin Les Vita</div>
                <div className="text-[11px] text-white/60">Konsultasi Program & Pendaftaran</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--bg-page)] no-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs shrink-0 mt-1">💬</div>
                )}
                <div className={`px-3.5 py-3 text-[13px] leading-relaxed max-w-[82%] whitespace-pre-wrap rounded-2xl ${
                  msg.role === "user"
                    ? "bg-[var(--primary)] text-white rounded-br-sm"
                    : "bg-white text-[var(--text-primary)] rounded-bl-sm border border-[var(--border-light)] shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs shrink-0">💬</div>
                <div className="bg-white px-3.5 py-3 rounded-2xl rounded-bl-sm text-[13px] text-[var(--text-muted)] flex items-center gap-2 border border-[var(--border-light)]">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  <span className="text-[11px]">Mengetik...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length < 3 && (
            <div className="px-3 py-2 bg-[var(--bg-muted)] border-t border-[var(--border-light)] flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, i) => (
                <button key={i} onClick={() => handleSend(prompt)}
                  className="text-[11px] bg-white hover:bg-[var(--primary-glow)] border border-[var(--border-light)] text-[var(--primary)] px-2.5 py-1 rounded-lg text-left transition-colors font-medium">
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-[var(--border-light)] flex gap-2 items-center">
            <input type="text" value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ketik pertanyaan Anda..."
              className="flex-1 text-[13px] bg-[var(--bg-muted)] focus:bg-white text-[var(--text-primary)] placeholder:text-[var(--text-muted)] px-4 py-2.5 rounded-xl border border-transparent focus:border-[var(--primary)] focus:outline-none transition-all"
            />
            <button onClick={() => handleSend()} disabled={typing || !inputMessage.trim()}
              className="w-10 h-10 rounded-xl gradient-btn disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all hover:shadow-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 gradient-hero text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 hover:scale-105 transition-all duration-300">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">💬</div>
        <span className="font-bold text-[13px] hidden sm:inline">
          {isOpen ? "Tutup Chat" : "Tanya Admin"}
        </span>
        <span className="inline-flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>
      </button>
    </div>
  );
}
