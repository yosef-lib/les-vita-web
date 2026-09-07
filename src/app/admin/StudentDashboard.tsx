import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Halo, {user.name}!</h1>
          <p className="text-sm text-slate-500 mt-1">Selamat datang di Portal Siswa Les Vita. Semangat belajarnya hari ini!</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Materi Baru", value: "3", trend: "Belum dibaca", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, color: "bg-purple-50 text-purple-600 border-purple-100", shadow: "shadow-purple-500/20" },
          { label: "Tugas Menunggu", value: "1", trend: "Tenggat besok", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: "bg-amber-50 text-amber-600 border-amber-100", shadow: "shadow-amber-500/20" },
          { label: "Jadwal Les Hari Ini", value: "1", trend: "16:00 - Online", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: "bg-emerald-50 text-emerald-600 border-emerald-100", shadow: "shadow-emerald-500/20" },
        ].map((stat, i) => (
          <div key={i} className={`bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl ${stat.shadow} flex flex-col group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-30 blur-2xl ${stat.color.split(' ')[0]} group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${stat.color} group-hover:rotate-6 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{stat.label}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{stat.value}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-semibold bg-white/80 backdrop-blur-sm inline-block px-2.5 py-1 rounded-md border border-slate-100 shadow-sm group-hover:bg-white transition-colors">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Jadwal Terdekat */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Jadwal Kelasmu
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { time: "16:00 - 17:30", date: "Hari ini", subject: "Matematika SD (Kelas 5)", type: "Online", tutor: "Kak Nisa" },
              { time: "14:00 - 15:30", date: "Besok", subject: "Bahasa Inggris", type: "Online", tutor: "Kak Willi" },
            ].map((schedule, i) => (
              <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                <div className="flex gap-5 items-center">
                  <div className="w-16 text-center group-hover:scale-105 transition-transform">
                    <p className="text-sm font-black text-slate-800">{schedule.time.split(" - ")[0]}</p>
                    <p className="text-[10px] font-bold text-slate-400">{schedule.date}</p>
                  </div>
                  <div className="w-px h-10 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{schedule.subject}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Tutor: {schedule.tutor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 text-[10px] font-bold rounded-xl uppercase tracking-wider shadow-sm group-hover:-translate-y-0.5 transition-transform bg-purple-50 text-purple-600 border border-purple-100`}>
                    {schedule.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifikasi / Aktivitas */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="text-lg animate-bounce-subtle">🌟</span>
              Aktivitas Belajarmu
            </h2>
          </div>
          <div className="p-6 flex-1 space-y-6">
            {[
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, text: "Kamu menyelesaikan Latihan Bilangan Bulat", time: "Kemarin", color: "bg-blue-50 text-blue-600" },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, text: "Kak Nisa mengunggah Materi Pecahan Dasar", time: "2 hari lalu", color: "bg-purple-50 text-purple-600" },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>, text: "Nilai Ulangan IPA kamu: 85 (Sangat Baik!)", time: "3 hari lalu", color: "bg-emerald-50 text-emerald-600" },
            ].map((act, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-base shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-white/50 ${act.color}`}>
                  {act.icon}
                </div>
                <div>
                  <p className="text-sm text-slate-700 leading-snug font-medium group-hover:text-slate-900 transition-colors">{act.text}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
