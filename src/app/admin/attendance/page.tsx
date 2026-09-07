"use client";

import { useState } from "react";

type StatusType = "Hadir" | "Izin" | "Alpha" | "-";

interface SiswaPresensi {
  id: string;
  nama: string;
  kelas: string;
  noWaOrtu: string;
  status: StatusType;
}

const STATUS_CONFIG: Record<StatusType, { label: string; color: string; bg: string }> = {
  "Hadir":  { label: "✅ Hadir",  color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  "Izin":   { label: "🟡 Izin",   color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  "Alpha":  { label: "❌ Alpha",  color: "text-rose-700",    bg: "bg-rose-50 border-rose-200" },
  "-":      { label: "— Belum",   color: "text-slate-400",   bg: "bg-slate-50 border-slate-200" },
};

const today = new Date().toLocaleDateString("id-ID", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

export default function AttendancePage() {
  const [daftarSiswa, setDaftarSiswa] = useState<SiswaPresensi[]>([]);
  const [namaBaru, setNamaBaru] = useState("");
  const [kelasBaru, setKelasBaru] = useState("");
  const [waBaru, setWaBaru] = useState("");
  const [showForm, setShowForm] = useState(false);

  const totalHadir = daftarSiswa.filter(s => s.status === "Hadir").length;
  const totalIzin  = daftarSiswa.filter(s => s.status === "Izin").length;
  const totalAlpha = daftarSiswa.filter(s => s.status === "Alpha").length;

  const setStatus = (id: string, status: StatusType) => {
    setDaftarSiswa(prev =>
      prev.map(s => s.id === id ? { ...s, status } : s)
    );
  };

  const tambahSiswa = () => {
    if (!namaBaru.trim()) return;
    setDaftarSiswa(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        nama: namaBaru.trim(),
        kelas: kelasBaru.trim() || "-",
        noWaOrtu: waBaru.trim().replace(/[^0-9]/g, ""),
        status: "-",
      },
    ]);
    setNamaBaru(""); setKelasBaru(""); setWaBaru("");
    setShowForm(false);
  };

  const hapusSiswa = (id: string) => {
    setDaftarSiswa(prev => prev.filter(s => s.id !== id));
  };

  const kirimWA = (siswa: SiswaPresensi) => {
    if (!siswa.noWaOrtu) return alert("Nomor WA orang tua belum diisi.");
    const pesan = siswa.status === "Hadir"
      ? `Assalamu'alaikum Bapak/Ibu Wali ${siswa.nama},\n\nMemberitahukan bahwa Ananda *${siswa.nama}* telah *HADIR* mengikuti sesi les di Les Vita hari ini, *${today}*.\n\nTerima kasih atas kepercayaannya! 🙏`
      : `Assalamu'alaikum Bapak/Ibu Wali ${siswa.nama},\n\nMemberitahukan bahwa Ananda *${siswa.nama}* tercatat *${siswa.status.toUpperCase()}* pada sesi les Les Vita hari ini, *${today}*.\n\nMohon konfirmasi lebih lanjut. Terima kasih 🙏`;
    window.open(`https://wa.me/${siswa.noWaOrtu}?text=${encodeURIComponent(pesan)}`, "_blank");
  };

  const kirimSemuaHadir = () => {
    const hadir = daftarSiswa.filter(s => s.status === "Hadir" && s.noWaOrtu);
    if (hadir.length === 0) return alert("Belum ada siswa yang ditandai Hadir dan memiliki nomor WA.");
    hadir.forEach((s, i) => {
      setTimeout(() => kirimWA(s), i * 600);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">📋 Presensi Siswa</h1>
          <p className="text-sm text-slate-500 mt-1">{today}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={kirimSemuaHadir}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow transition-colors flex items-center gap-2"
          >
            📲 Kirim WA Semua Hadir
          </button>
          <button
            onClick={() => setShowForm(v => !v)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow transition-colors flex items-center gap-2"
          >
            ＋ Tambah Siswa
          </button>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Hadir", value: totalHadir, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
          { label: "Izin",  value: totalIzin,  color: "bg-amber-50 text-amber-700 border-amber-200" },
          { label: "Alpha", value: totalAlpha, color: "bg-rose-50 text-rose-700 border-rose-200" },
        ].map(item => (
          <div key={item.label} className={`rounded-2xl border p-4 text-center ${item.color}`}>
            <div className="text-3xl font-extrabold">{item.value}</div>
            <div className="text-xs font-bold mt-1 uppercase tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Form Tambah Siswa */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <h3 className="font-bold text-slate-700 text-sm">Tambah Siswa ke Daftar Presensi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              value={namaBaru}
              onChange={e => setNamaBaru(e.target.value)}
              placeholder="Nama Siswa *"
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              value={kelasBaru}
              onChange={e => setKelasBaru(e.target.value)}
              placeholder="Kelas (contoh: SD Kelas 5)"
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              value={waBaru}
              onChange={e => setWaBaru(e.target.value)}
              placeholder="No WA Orang Tua (628xxx)"
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
            <button onClick={tambahSiswa} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-colors">Simpan</button>
          </div>
        </div>
      )}

      {/* Daftar Presensi */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {daftarSiswa.length === 0 ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <svg className="w-14 h-14 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="font-semibold text-sm">Daftar siswa masih kosong</p>
            <p className="text-xs">Klik tombol <strong>"+ Tambah Siswa"</strong> untuk mulai mengisi presensi</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa</th>
                <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status Kehadiran</th>
                <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {daftarSiswa.map(siswa => (
                <tr key={siswa.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-800 text-sm">{siswa.nama}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{siswa.kelas}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {(["Hadir", "Izin", "Alpha"] as StatusType[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setStatus(siswa.id, s)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            siswa.status === s
                              ? STATUS_CONFIG[s].bg + " " + STATUS_CONFIG[s].color + " scale-105 shadow-sm"
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                          }`}
                        >
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {siswa.status !== "-" && siswa.noWaOrtu && (
                        <button
                          onClick={() => kirimWA(siswa)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          📲 WA Ortu
                        </button>
                      )}
                      <button
                        onClick={() => hapusSiswa(siswa.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Hapus dari daftar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
