"use client";

import React, { useState, useRef, useEffect } from "react";
import { askVitaAI, ChatMessage } from "@/lib/aiClient";

export default function LandingAIChatSection() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo Mama & Papa! 👋 Saya Kak Vita, AI Asisten Belajar Les Vita. Coba ketikkan soal matematika atau pertanyaan pelajaran anak Anda, Kak Vita siap bantu jelaskan cara jawabnya secara rinci!",
    },
  ]);

  const sampleQuestions = [
    "Bagaimana cara mudah menghafal perkalian?",
    "Jelaskan hukum Newton 1 dengan contoh",
    "Buat 3 contoh Present Continuous Tense",
    "Strategi menjawab soal TPS SNBT?",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async (text?: string) => {
    const q = text || query;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: q };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    if (!text) setQuery("");
    setLoading(true);

    try {
      const response = await askVitaAI(newMsgs);
      setMessages([...newMsgs, { role: "assistant", content: response }]);
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          content: "Maaf, terjadi gangguan sementara. Silakan coba tanya lagi ya!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-20 bg-[var(--bg-page)]">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] bg-[var(--primary-glow)] px-4 py-1.5 rounded-full">
            ✨ Fitur Unggulan AI 24/7
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-4 tracking-tight">
            Coba Langsung{" "}
            <span className="gradient-text">Kak Vita AI Asisten</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 text-base leading-relaxed">
            Tanpa perlu menunggu mentor, siswa & orang tua bisa bertanya soal
            pelajaran 24 jam nonstop.
          </p>
        </div>

        {/* Chat Box */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-black/[0.04] border border-[var(--border-light)] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[var(--primary)] px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
              👩‍🏫
            </div>
            <div>
              <div className="text-white font-bold text-sm">Kak Vita AI</div>
              <div className="text-white/60 text-[11px]">
                Asisten Belajar 24/7 • Online
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-white/60">Aktif</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto no-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm shrink-0 shadow-sm">
                    🤖
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed max-w-[80%] whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[var(--primary)] text-white rounded-br-sm"
                      : "bg-[var(--bg-muted)] text-[var(--text-primary)] rounded-bl-sm border border-[var(--border-light)]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm shrink-0">
                  🤖
                </div>
                <div className="bg-[var(--bg-muted)] px-4 py-3 rounded-2xl rounded-bl-sm text-[13px] text-[var(--text-muted)] flex items-center gap-2 border border-[var(--border-light)]">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  <span>Kak Vita sedang mengetik...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Sample Questions */}
          <div className="px-6 pb-3">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              Contoh Pertanyaan:
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(sq)}
                  className="text-[12px] bg-[var(--primary-glow)] hover:bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1.5 rounded-lg border border-[var(--primary)]/10 transition-colors text-left font-medium"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-6 pb-5 pt-3">
            <div className="flex gap-2.5 items-center bg-[var(--bg-muted)] rounded-xl border border-[var(--border-light)] p-1.5 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-glow)] transition-all">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Tuliskan soal atau pertanyaan di sini..."
                className="flex-1 text-[13px] bg-transparent text-[var(--text-primary)] px-3 py-2.5 focus:outline-none placeholder:text-[var(--text-muted)]"
              />
              <button
                onClick={() => handleAsk()}
                disabled={loading || !query.trim()}
                className="gradient-btn text-white font-bold px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40 transition-all flex items-center gap-1.5 shrink-0 text-[13px]"
              >
                Tanya
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
