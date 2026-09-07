"use client";

import { useAuth } from '@/context/AuthContext';

export default function SPPPage() {
  const { user } = useAuth();
  
  if (!user || user.role !== 'STUDENT') return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Tagihan SPP & Pembayaran</h1>
          <p className="text-sm text-slate-500 mt-1">Cek status pembayaran bimbingan belajar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
            <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-red-100 text-red-600 font-bold text-xs rounded-full uppercase tracking-wider">Belum Lunas</span>
                  <span className="text-slate-400 text-sm font-medium">Bulan September 2026</span>
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Rp 250.000</h2>
                <p className="text-sm text-slate-500 mt-1">Tenggat pembayaran: 10 September 2026</p>
              </div>
              <button className="w-full md:w-auto px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-all hover:scale-105 active:scale-95 text-center">
                Bayar Sekarang
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800">Riwayat Pembayaran</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { month: "Agustus 2026", amount: "Rp 250.000", status: "Lunas", date: "5 Agustus 2026" },
                { month: "Juli 2026", amount: "Rp 250.000", status: "Lunas", date: "4 Juli 2026" },
                { month: "Juni 2026", amount: "Rp 250.000", status: "Lunas", date: "7 Juni 2026" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">SPP {item.month}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:gap-6 sm:w-1/3">
                    <span className="font-bold text-slate-800">{item.amount}</span>
                    <button className="text-sky-600 text-xs font-bold hover:underline">
                      Unduh Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl"></div>
            <h2 className="font-bold text-sky-400 uppercase tracking-widest text-xs mb-4">Informasi Pembayaran</h2>
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-slate-400 text-xs mb-1">Transfer Bank (BCA)</p>
                <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="font-mono font-bold tracking-wider">123-456-7890</span>
                  <button className="text-sky-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">a.n. Les Vita Indonesia</p>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-1">Panduan Pembayaran</p>
                <ul className="text-sm text-slate-300 space-y-2 mt-2 list-disc pl-4">
                  <li>Transfer tepat sesuai nominal tagihan</li>
                  <li>Simpan bukti transfer</li>
                  <li>Hubungi admin jika pembayaran belum terverifikasi dalam 1x24 jam</li>
                </ul>
              </div>

              <a href="https://wa.me/6289646416982" target="_blank" rel="noreferrer" className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-center transition-colors shadow-lg shadow-emerald-500/20">
                Konfirmasi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
