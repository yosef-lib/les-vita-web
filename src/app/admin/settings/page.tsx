"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [heroTitle, setHeroTitle] = useState("Bimbingan Belajar & Mentorship Terbaik untuk Masa Depan Anak");
  const [heroDesc, setHeroDesc] = useState("Lebih dari sekadar les biasa. Kami memadukan kurikulum adaptif dengan mentor berpengalaman untuk memaksimalkan potensi akademis dan karakter siswa.");
  
  const [subjects, setSubjects] = useState<string[]>(["Matematika", "Bahasa Inggris", "Sains / IPA", "Calistung", "SNBT Intensif"]);
  const [newSubject, setNewSubject] = useState("");

  useEffect(() => {
    // Load from local storage
    const savedTitle = localStorage.getItem("cms_heroTitle");
    const savedDesc = localStorage.getItem("cms_heroDesc");
    const savedSubjects = localStorage.getItem("cms_subjects");

    if (savedTitle) setHeroTitle(savedTitle);
    if (savedDesc) setHeroDesc(savedDesc);
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
  }, []);

  const saveSettings = () => {
    localStorage.setItem("cms_heroTitle", heroTitle);
    localStorage.setItem("cms_heroDesc", heroDesc);
    localStorage.setItem("cms_subjects", JSON.stringify(subjects));
    alert("Pengaturan berhasil disimpan!");
  };

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const removeSubject = (sub: string) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  return (
    <div className="flex flex-col gap-6 relative max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display-lg text-[32px] text-on-surface">Pengaturan Sistem</h1>
        <button 
          onClick={saveSettings}
          className="bg-primary text-on-primary font-label-bold px-6 py-2 rounded-xl flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Landing Page CMS */}
        <div className="bg-surface rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col p-6 gap-4">
          <h2 className="font-title-md text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-primary">web</span>
            Kustomisasi Landing Page
          </h2>
          
          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-on-surface">Judul Utama (Hero Title)</label>
            <textarea 
              rows={3}
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface resize-none"
            />
            <span className="text-caption text-on-surface-variant">Tips: Gunakan tag &lt;span className="text-primary"&gt;Teks&lt;/span&gt; untuk memberi warna khusus.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-on-surface">Deskripsi Pendek</label>
            <textarea 
              rows={4}
              value={heroDesc}
              onChange={(e) => setHeroDesc(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface resize-none"
            />
          </div>
        </div>

        {/* Subjects Management */}
        <div className="bg-surface rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col p-6 gap-4">
          <h2 className="font-title-md text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-secondary">category</span>
            Manajemen Mata Pelajaran
          </h2>
          
          <form onSubmit={addSubject} className="flex gap-2">
            <input 
              type="text" 
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Tambah mata pelajaran baru..."
              className="flex-1 px-4 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface"
            />
            <button 
              type="submit"
              className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl font-label-bold hover:bg-secondary hover:text-on-secondary transition-colors"
            >
              Tambah
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-2">
            {subjects.map((sub, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg border border-outline-variant">
                <span className="font-body-md">{sub}</span>
                <button 
                  onClick={() => removeSubject(sub)}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-error hover:text-on-error text-on-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
          </div>
          <span className="text-caption text-on-surface-variant mt-auto">Mata pelajaran ini akan muncul di daftar pilihan form tutor & siswa.</span>
        </div>
      </div>
    </div>
  );
}
