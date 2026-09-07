"use client";

import React from 'react';
import Link from 'next/link';
import WASchedulerModal from '@/components/WASchedulerModal';

export default function WASchedulePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-extrabold text-xl text-indigo-600 tracking-tight flex items-center gap-2">
            <span>✨</span>
            <span>Les Vita Web</span>
          </Link>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">
            Sistem Otomatisasi WA
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 px-4 py-2 rounded-xl transition-colors"
          >
            ← Kembali ke Website Utama
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1140px] w-full mx-auto p-6 md:py-10">
        <WASchedulerModal />
      </main>
    </div>
  );
}
