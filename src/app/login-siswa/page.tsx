"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth, MOCK_USERS } from "@/context/AuthContext";

export default function StudentLoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      const user = MOCK_USERS[username.toLowerCase()];
      if (user && user.role === 'STUDENT' && password.length > 0) {
        login(user);
      } else {
        setError("Username atau password salah. (Petunjuk: username 'alif')");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] relative overflow-hidden">
      {/* Background decorations - More playful colors for students */}
      <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-amber-400/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-400/20 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-5 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-4">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm bg-[var(--primary)] text-white shadow-lg">
              LV
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)]">
              Les<span className="text-[var(--accent)]">Vita</span>
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/[0.04] border border-sky-100 overflow-hidden relative">
          
          {/* Decorative header */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400 to-amber-400" />
          
          <div className="p-8 md:p-10 pt-10">
            <div className="mb-8 text-center">
              <div className="inline-block w-16 h-16 bg-sky-50 rounded-full mb-4 flex items-center justify-center text-3xl shadow-inner">
                🧑‍🎓
              </div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">E-Learning Siswa</h1>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Yuk, masuk untuk mulai belajar dan akses modul latihanmu!
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Username / ID Siswa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-light)] text-[var(--text-primary)] text-sm rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent block pl-11 p-3 transition-all"
                    placeholder="Contoh: andi123"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Password / PIN
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-light)] text-[var(--text-primary)] text-sm rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent block pl-11 p-3 transition-all"
                    placeholder="Masukkan password..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-btn text-white font-bold rounded-xl text-sm px-5 py-3.5 text-center shadow-lg shadow-sky-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? "Memproses..." : "Mulai Belajar 🚀"}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-[var(--bg-muted)] border-t border-[var(--border-light)] p-5 text-center">
            <p className="text-[12px] text-[var(--text-secondary)] font-medium">
              Lupa password? <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-[var(--primary)] font-bold hover:underline">Tanya Kakak Admin</a>
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-[11px] text-[var(--text-muted)] mt-8 font-medium">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
}
