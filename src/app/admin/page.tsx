"use client";

import { useAuth } from '@/context/AuthContext';
import StudentDashboard from './StudentDashboard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const revenueData = [
  { name: 'Jan', value: 4500000 },
  { name: 'Feb', value: 5200000 },
  { name: 'Mar', value: 4800000 },
  { name: 'Apr', value: 6100000 },
  { name: 'Mei', value: 5900000 },
  { name: 'Jun', value: 6500000 },
];

const studentStats = [
  { name: 'Siswa Offline', value: 185 },
  { name: 'Siswa Online', value: 60 },
];
const COLORS = ['#10b981', '#6366f1']; // emerald-500, indigo-500

export default function AdminDashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'STUDENT') {
    return <StudentDashboard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Dashboard Utama</h1>
          <p className="text-sm text-slate-500 mt-1">Ringkasan aktivitas dan performa Les Vita hari ini.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Siswa Aktif", value: "245", trend: "+12 bulan ini", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, color: "bg-blue-50 text-blue-600 border-blue-100", shadow: "shadow-blue-500/20" },
          { label: "Laporan Terkirim", value: "1,204", trend: "Live report ke orang tua", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: "bg-amber-50 text-amber-600 border-amber-100", shadow: "shadow-amber-500/20" },
          { label: "Sesi Les Hari Ini", value: "18", trend: "5 Online, 13 Offline", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: "bg-emerald-50 text-emerald-600 border-emerald-100", shadow: "shadow-emerald-500/20" },
          { label: "Reminder Aktif", value: "3", trend: "Jadwal dan Tagihan", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>, color: "bg-rose-50 text-rose-600 border-rose-100", shadow: "shadow-rose-500/20" },
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

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">📈</span>
              Tren Pemasukan (6 Bulan Terakhir)
            </h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `Rp${(value/1000000).toFixed(1)}Jt`}
                />
                <RechartsTooltip 
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pemasukan']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6, stroke: 'white' }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Demographics Pie Chart */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">👥</span>
              Distribusi Siswa
            </h2>
          </div>
          <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {studentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any) => [`${value} Siswa`, 'Jumlah']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-700 font-medium text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Jadwal Terdekat */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Jadwal Kelas Terdekat
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { time: "14:00 - 15:30", student: "Budi Santoso", subject: "Matematika SD (Kelas 5)", type: "Online", tutor: "Kak Nisa" },
              { time: "15:00 - 16:30", student: "Grup SMP 2", subject: "IPA Terpadu", type: "Offline", tutor: "Kak Bima" },
              { time: "16:00 - 17:30", student: "Aisyah", subject: "Bahasa Inggris SD", type: "Online", tutor: "Kak Dina" },
            ].map((schedule, i) => (
              <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                <div className="flex gap-5 items-center">
                  <div className="w-16 text-center group-hover:scale-105 transition-transform">
                    <p className="text-sm font-black text-slate-800">{schedule.time.split(" - ")[0]}</p>
                    <p className="text-[10px] font-bold text-slate-400">{schedule.time.split(" - ")[1]}</p>
                  </div>
                  <div className="w-px h-10 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-[var(--primary)] transition-colors">{schedule.student}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{schedule.subject} • {schedule.tutor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 text-[10px] font-bold rounded-xl uppercase tracking-wider shadow-sm group-hover:-translate-y-0.5 transition-transform ${
                    schedule.type === "Online" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                  }`}>
                    {schedule.type}
                  </span>
                  
                  {/* Attendance Confirmation Button */}
                  <button 
                    title="Konfirmasi Kehadiran" 
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifikasi / Aktivitas */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="text-lg animate-bounce-subtle">✨</span>
              Aktivitas Terbaru
            </h2>
          </div>
          <div className="p-6 flex-1 space-y-6">
            {[
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, text: "Sesi Les Offline Budi telah selesai.", time: "10 menit lalu", color: "bg-blue-50 text-blue-600" },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: "Pembayaran tagihan SPP a.n. orangtua Dina berhasil", time: "1 jam lalu", color: "bg-emerald-50 text-emerald-600" },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>, text: "Live Report dikirim ke WhatsApp Ibu Nisa", time: "2 jam lalu", color: "bg-purple-50 text-purple-600" },
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
          <div className="p-4 border-t border-slate-100 bg-slate-50/30">
            <button className="w-full text-center text-xs font-bold text-slate-500 hover:text-[var(--primary)] hover:bg-[var(--primary-glow)] py-2 rounded-lg transition-colors">
              Lihat Riwayat Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
