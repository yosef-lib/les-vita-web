"use client";

import { useState } from "react";

export default function LaporanPage() {
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const reports = [
    { id: "S001", name: "Budi Santoso", grade: "5 SD", math: 85, science: 90, english: 80, parent: "0812-3456-7890", status: "Siap Kirim" },
    { id: "S002", name: "Aisyah Putri", grade: "3 SD", math: 95, science: 85, english: 88, parent: "0813-5555-9999", status: "Siap Kirim" },
    { id: "S004", name: "Dina Mariana", grade: "6 SD", math: 75, science: 80, english: 85, parent: "0819-8888-7777", status: "Belum Lengkap" },
  ];

  const handleSendWA = (id: string) => {
    setSendingId(id);
    setTimeout(() => {
      setSendingId(null);
      setSentIds(new Set([...sentIds, id]));
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Laporan Progress (WhatsApp)</h1>
          <p className="text-sm text-slate-500 mt-1">Kirim ringkasan nilai ujian dan absen siswa ke orang tua via WhatsApp.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Kirim ke Semua (Broadcast)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Laporan Bulan Agustus 2026</h2>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium">Bulan: Agustus</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium">Tahun: 2026</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-rata Math</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-rata IPA</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">WA Orang Tua</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status Data</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi Kirim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{report.name}</p>
                    <p className="text-xs text-slate-500">{report.grade}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-extrabold text-slate-700">{report.math}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-extrabold text-slate-700">{report.science}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                    {report.parent}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      report.status === "Siap Kirim" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {sentIds.has(report.id) ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Terkirim
                      </span>
                    ) : (
                      <button 
                        disabled={report.status !== "Siap Kirim" || sendingId === report.id}
                        onClick={() => handleSendWA(report.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          report.status !== "Siap Kirim" 
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : sendingId === report.id
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500"
                        }`}
                      >
                        {sendingId === report.id ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Kirim WA
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
