"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SettingsPage() {
  const [chatbotPrompt, setChatbotPrompt] = useState("");
  const [programs, setPrograms] = useState<{sd: any[], smp: any[]}>({ sd: [], smp: [] });
  const [faqs, setFaqs] = useState<{q: string, a: string}[]>([]);
  const [fallbackMsg, setFallbackMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"sd" | "smp">("sd");

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setChatbotPrompt(data.chatbotPrompt || "");
        
        if (data.homepageContent) {
          try {
            const parsed = typeof data.homepageContent === 'string' ? JSON.parse(data.homepageContent) : data.homepageContent;
            if (parsed.programs) {
              setPrograms({
                sd: parsed.programs.sd || [],
                smp: parsed.programs.smp || []
              });
            }
          } catch (e) {
            console.error("Failed to parse programs", e);
          }
        }

        if (data.faqContent) {
          try {
            const parsedFaq = typeof data.faqContent === 'string' ? JSON.parse(data.faqContent) : data.faqContent;
            setFaqs(parsedFaq.faqs || []);
            setFallbackMsg(parsedFaq.fallback || "");
          } catch (e) {
            console.error("Failed to parse FAQs", e);
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
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotPrompt,
          homepageContent: { programs },
          faqContent: { faqs, fallback: fallbackMsg }
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

  const updateProgram = (level: "sd" | "smp", index: number, field: string, value: string) => {
    setPrograms(prev => {
      const newProgs = { ...prev };
      newProgs[level][index] = { ...newProgs[level][index], [field]: value };
      return newProgs;
    });
  };

  const addProgram = (level: "sd" | "smp") => {
    setPrograms(prev => ({
      ...prev,
      [level]: [...prev[level], { icon: "📚", title: "Program Baru", desc: "Deskripsi program baru", price: "Hubungi Kami" }]
    }));
  };

  const removeProgram = (level: "sd" | "smp", index: number) => {
    setPrograms(prev => {
      const newProgs = { ...prev };
      newProgs[level].splice(index, 1);
      return newProgs;
    });
  };

  const addFaq = () => {
    setFaqs(prev => [...prev, { q: "Pertanyaan baru?", a: "Jawaban baru" }]);
  };

  const updateFaq = (index: number, field: "q" | "a", value: string) => {
    setFaqs(prev => {
      const newFaqs = [...prev];
      newFaqs[index] = { ...newFaqs[index], [field]: value };
      return newFaqs;
    });
  };

  const removeFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-bold">Memuat...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan Website (CMS)</h1>
          <Link href="/admin" className="text-sky-600 font-medium hover:underline">
            &larr; Kembali ke Dashboard Admin
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Chatbot Setting (Floating Widget) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Balasan Cepat Chatbot (Pojok Kanan Bawah)</h2>
            <p className="text-sm text-slate-500 mb-6">
              Atur daftar pertanyaan dan jawaban otomatis. Jika siswa bertanya hal lain, mereka akan diarahkan ke admin (Pesan Default).
            </p>
            
            <div className="space-y-4 mb-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Jika ada yang bertanya (Kata Kunci/Pertanyaan):</label>
                    <input 
                      type="text" 
                      value={faq.q} 
                      onChange={e => updateFaq(idx, 'q', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Maka jawabannya adalah:</label>
                    <textarea 
                      value={faq.a} 
                      onChange={e => updateFaq(idx, 'a', e.target.value)}
                      className="w-full p-2 h-20 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm text-slate-600"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeFaq(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors font-bold text-sm border border-red-200"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFaq}
                className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 font-semibold rounded-xl hover:border-sky-500 hover:text-sky-600 transition-colors flex items-center justify-center gap-2"
              >
                + Tambah Pertanyaan & Jawaban Baru
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <label className="block text-sm font-bold text-slate-800 mb-2">Pesan Default (Jika pertanyaan tidak ada di daftar atas):</label>
              <textarea 
                value={fallbackMsg} 
                onChange={e => setFallbackMsg(e.target.value)}
                className="w-full p-3 h-24 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="Mohon maaf, silakan hubungi admin di WA..."
              />
            </div>
          </div>

          {/* AI Tutor Setting */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Instruksi AI (Bagian Tengah Halaman Depan)</h2>
            <p className="text-sm text-slate-500 mb-4">
              Instruksi ini digunakan khusus untuk fitur "Tanya Kak Vita AI" yang dirancang untuk menjawab soal pelajaran.
            </p>
            <textarea 
              value={chatbotPrompt}
              onChange={(e) => setChatbotPrompt(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              placeholder="Anda adalah Kak Vita..."
            />
          </div>

          {/* Homepage Setting */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Harga & Program Les (Halaman Depan)</h2>
            
            <div className="flex space-x-4 mb-6 border-b border-slate-200">
              <button 
                type="button"
                onClick={() => setActiveTab("sd")}
                className={`py-2 px-4 font-semibold border-b-2 ${activeTab === 'sd' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Program SD
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("smp")}
                className={`py-2 px-4 font-semibold border-b-2 ${activeTab === 'smp' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Program SMP
              </button>
            </div>

            <div className="space-y-4">
              {programs[activeTab].map((p, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                  <div className="flex-none">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Ikon (Emoji)</label>
                    <input 
                      type="text" 
                      value={p.icon || ""} 
                      onChange={e => updateProgram(activeTab, i, 'icon', e.target.value)}
                      className="w-16 p-2 text-center text-xl border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Nama Program</label>
                        <input 
                          type="text" 
                          value={p.title || ""} 
                          onChange={e => updateProgram(activeTab, i, 'title', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Harga (Bisa teks/angka)</label>
                        <input 
                          type="text" 
                          value={p.price || ""} 
                          onChange={e => updateProgram(activeTab, i, 'price', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-bold text-emerald-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Deskripsi Lengkap</label>
                      <textarea 
                        value={p.desc || ""} 
                        onChange={e => updateProgram(activeTab, i, 'desc', e.target.value)}
                        className="w-full p-2 h-20 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm text-slate-600"
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeProgram(activeTab, i)}
                    className="absolute top-2 right-2 md:static md:mt-6 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors h-fit self-start font-bold text-sm border border-red-200"
                    title="Hapus Program"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addProgram(activeTab)}
                className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 font-semibold rounded-xl hover:border-sky-500 hover:text-sky-600 transition-colors flex items-center justify-center gap-2"
              >
                + Tambah Program {activeTab.toUpperCase()} Baru
              </button>
            </div>
          </div>

          <div className="flex justify-end sticky bottom-6">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
