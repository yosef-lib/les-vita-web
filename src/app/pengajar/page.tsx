"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function PengajarPortalPage() {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'modul' | 'profil'>('jadwal');

  const todayClasses = [
    {
      id: '1',
      studentName: 'Alif Pratama',
      grade: 'SD Kelas 5',
      subject: 'Matematika SD',
      time: '15:30 - 17:00 WIB',
      location: 'Les Online (Zoom / GMeet)',
      materialTitle: 'Bab 4: Pecahan, Desimal & Persen',
      materialLink: 'https://lesvita.com/modul/sd-matematika-bab4.pdf',
      status: 'confirmed',
      parentPhone: '081234567890'
    },
    {
      id: '2',
      studentName: 'Fiona Wijaya',
      grade: 'SMA Kelas 12',
      subject: 'TPS Penalaran Matematika SNBT',
      time: '18:30 - 20:00 WIB',
      location: 'Tatap Muka (Rumah Siswa)',
      materialTitle: 'Bank Soal Tryout #5 & Trik Cepat',
      materialLink: 'https://lesvita.com/modul/snbt-tps-to5.pdf',
      status: 'confirmed',
      parentPhone: '081122334455'
    }
  ];

  const modules = [
    { title: 'Modul Rangkuman Rumus Sakti Matematika SD-SMP', category: 'Matematika', size: '4.2 MB' },
    { title: 'Bank Soal & Pembahasan Super Intensif SNBT 2026', category: 'SNBT / TPS', size: '8.5 MB' },
    { title: 'Lembar Kerja Calistung Printable (PAUD & SD Awal)', category: 'Calistung', size: '3.1 MB' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 max-w-md mx-auto shadow-2xl relative flex flex-col pb-20">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full backdrop-blur-md">
            ← Ke Halaman Utama
          </Link>
          <span className="text-xs font-semibold bg-emerald-400 text-slate-900 px-2.5 py-0.5 rounded-full">
            ● Mode Mobile Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-2xl shadow-inner">
            👨‍🏫
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Portal Pengajar Les Vita</h1>
            <p className="text-xs text-indigo-100 opacity-90">Selamat bertugas, Kak Budi Mentor! 👋</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 space-y-4">
        {activeTab === 'jadwal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                📅 Jadwal Mengajar Besok (Jumat)
              </h2>
              <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg">
                2 Sesi Les
              </span>
            </div>

            {todayClasses.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">
                      {item.subject}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{item.studentName}</h3>
                    <p className="text-xs text-slate-500">{item.grade}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                    ✓ Terkonfirmasi
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-700 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span className="font-semibold text-slate-900">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-700 font-medium">
                    <span>📖</span>
                    <span>{item.materialTitle}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <a
                    href={item.materialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2 rounded-xl border border-indigo-200 transition-colors"
                  >
                    📥 Unduh Bahan Ajar
                  </a>
                  <a
                    href={`https://wa.me/${item.parentPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl shadow-xs transition-colors"
                  >
                    💬 WA Orang Tua
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'modul' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              📚 Perpustakaan Modul & Bahan Ajar
            </h2>
            {modules.map((m, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                    {m.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{m.title}</h4>
                  <span className="text-[10px] text-slate-400">{m.size}</span>
                </div>
                <button className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold hover:bg-indigo-700">
                  Buka
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner">
              👨‍🏫
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Kak Budi Santoso, M.Pd</h3>
              <p className="text-xs text-slate-500">Senior Mentor Matematika & SNBT Les Vita</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Mengajar Bulan Ini:</span>
                <span className="font-bold text-indigo-700">24 Sesi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rating Feedback Orang Tua:</span>
                <span className="font-bold text-amber-600">⭐ 4.95 / 5.0</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 p-2 flex justify-around items-center z-40 shadow-xl">
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`flex flex-col items-center gap-1 text-xs py-1 px-4 rounded-xl transition-colors ${
            activeTab === 'jadwal' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">📅</span>
          <span>Jadwal</span>
        </button>
        <button
          onClick={() => setActiveTab('modul')}
          className={`flex flex-col items-center gap-1 text-xs py-1 px-4 rounded-xl transition-colors ${
            activeTab === 'modul' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">📚</span>
          <span>Modul Ajar</span>
        </button>
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex flex-col items-center gap-1 text-xs py-1 px-4 rounded-xl transition-colors ${
            activeTab === 'profil' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">👤</span>
          <span>Profil</span>
        </button>
      </nav>
    </div>
  );
}
