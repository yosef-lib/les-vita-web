"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SettingsPage() {
  const [chatbotPrompt, setChatbotPrompt] = useState("");
  const [homepageContent, setHomepageContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setChatbotPrompt(data.chatbotPrompt || "");
        if (data.homepageContent) {
          try {
            const parsed = JSON.parse(data.homepageContent);
            setHomepageContent(JSON.stringify(parsed, null, 2));
          } catch (e) {
            setHomepageContent(data.homepageContent);
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load settings", err);
        toast.error("Gagal memuat pengaturan");
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let parsedHomepage = undefined;
      if (homepageContent.trim()) {
        try {
          parsedHomepage = JSON.parse(homepageContent);
        } catch (e) {
          toast.error("Format JSON untuk Homepage tidak valid!");
          setIsSaving(false);
          return;
        }
      }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotPrompt,
          homepageContent: parsedHomepage
        })
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Berhasil disimpan!");
    } catch (err) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-bold">Memuat...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan Website (CMS)</h1>
          <Link href="/admin" className="text-sky-600 font-medium hover:underline">
            &larr; Kembali ke Dashboard Admin
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Instruksi Chatbot AI</h2>
            <p className="text-sm text-slate-500 mb-4">
              Ketik instruksi atau cara menjawab si Chatbot di sini. Anda bisa memasukkan harga, promo, atau sapaan.
            </p>
            <textarea 
              value={chatbotPrompt}
              onChange={(e) => setChatbotPrompt(e.target.value)}
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              placeholder="Anda adalah Kak Vita..."
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Konten Halaman Depan (Program Les)</h2>
            <p className="text-sm text-slate-500 mb-4">
              Silakan ubah nama program, harga, atau ikon (dalam format JSON). Harap berhati-hati jangan merusak tanda kutip atau kurung kurawal.
            </p>
            <textarea 
              value={homepageContent}
              onChange={(e) => setHomepageContent(e.target.value)}
              className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            />
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-70"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
