"use client";

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function RuangBelajarPage() {
  const { user } = useAuth();
  
  if (!user || user.role !== 'STUDENT') return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Ruang Belajar</h1>
          <p className="text-sm text-slate-500 mt-1">Akses semua materi, video, dan kuis pembelajaranmu di sini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Matematika", icon: "📐", tutor: "Kak Nisa", progress: 75, color: "from-blue-500 to-sky-400" },
          { title: "Bahasa Inggris", icon: "💬", tutor: "Kak Willi", progress: 60, color: "from-purple-500 to-fuchsia-400" },
          { title: "IPA Terpadu", icon: "🔬", tutor: "Kak Bima", progress: 90, color: "from-emerald-500 to-teal-400" },
        ].map((subject, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className={`h-24 bg-gradient-to-r ${subject.color} p-6 relative overflow-hidden flex items-end`}>
              <span className="text-5xl absolute -right-2 -top-2 opacity-30 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">{subject.icon}</span>
              <h2 className="text-xl font-bold text-white relative z-10 drop-shadow-sm">{subject.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 font-medium mb-4">Pengajar: {subject.tutor}</p>
              
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Progress Belajar</span>
                  <span className="text-slate-800">{subject.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Materi
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 hover:text-purple-800 transition-colors border border-purple-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Video
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Materi Terbaru untukmu</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {[
              { title: "Latihan Pecahan Part 2", type: "Kuis", subject: "Matematika", date: "Hari ini" },
              { title: "Video: Tenses Bahasa Inggris", type: "Video", subject: "Bahasa Inggris", date: "Kemarin" },
              { title: "Rangkuman Sistem Tata Surya", type: "PDF", subject: "IPA Terpadu", date: "2 Hari Lalu" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group">
                <div className="flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
                    ${item.type === 'Kuis' ? 'bg-amber-100 text-amber-600' : 
                      item.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-sky-100 text-sky-600'}`}>
                    {item.type === 'Kuis' ? '📝' : item.type === 'Video' ? '▶️' : '📄'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.subject} • {item.date}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200 transition-colors">
                  Buka
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
