"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>(["Matematika", "Bahasa Inggris", "Sains / IPA", "Calistung", "SNBT Intensif"]);
  
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    phone: "",
    program: ""
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const savedSubjects = localStorage.getItem("cms_subjects");
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    
    // Auto-select first program if none is selected
    if (subjects.length > 0 && !formData.program) {
      setFormData(prev => ({ ...prev, program: subjects[0] }));
    }
  }, [subjects, formData.program]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRegistration = {
      id: "REG-" + Math.floor(Math.random() * 10000),
      name: formData.name,
      program: formData.program,
      grade: formData.grade,
      phone: formData.phone,
      date: new Date().toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }),
      status: "Menunggu Konfirmasi"
    };

    const existingRegs = JSON.parse(localStorage.getItem("cms_registrations") || "[]");
    localStorage.setItem("cms_registrations", JSON.stringify([newRegistration, ...existingRegs]));
    
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl z-50 flex items-center justify-between px-margin-desktop border-b border-outline-variant/30">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Les Vita Logo" className="h-12 object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="font-label-bold text-primary hover:bg-primary-container px-4 py-2 rounded-lg transition-colors">Kembali ke Beranda</Link>
        </div>
      </header>

      <main className="flex-1 pt-24 px-margin-desktop pb-12 flex items-center justify-center">
        <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant/30 p-8">
          <h1 className="font-display-lg text-[32px] text-on-surface mb-2 text-center">Pendaftaran Murid Baru</h1>
          <p className="font-body-md text-on-surface-variant text-center mb-8">Isi formulir di bawah ini untuk mendaftar sesi belajar.</p>
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-primary-container/30 rounded-2xl border border-primary/20">
              <div className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">check</span>
              </div>
              <h2 className="font-title-lg text-on-surface mb-2">Pendaftaran Berhasil!</h2>
              <p className="font-body-md text-on-surface-variant">Tim kami akan segera menghubungi Anda. Anda akan dialihkan kembali ke beranda...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-label-bold text-on-surface">Nama Lengkap Murid</label>
                <input 
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-on-surface">Kelas / Tingkatan</label>
                  <select 
                    required
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface"
                  >
                    <option value="" disabled>Pilih Kelas</option>
                    <option value="SD Kelas 1-3">SD Kelas 1-3</option>
                    <option value="SD Kelas 4-6">SD Kelas 4-6</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-on-surface">No. WhatsApp / Telepon</label>
                  <input 
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface"
                    placeholder="0812xxxxxx"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-bold text-on-surface">Program / Mata Pelajaran</label>
                <select 
                  required
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface"
                >
                  <option value="" disabled>Pilih Program</option>
                  {subjects.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 bg-primary text-on-primary font-label-bold text-label-bold px-6 py-4 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform"
              >
                Kirim Pendaftaran
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
