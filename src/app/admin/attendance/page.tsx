"use client";

import { useState, useEffect } from "react";
import { mockStudents } from "@/lib/mockData";

interface AttendanceRecord {
  id: string;
  studentName: string;
  grade: string;
  time: string;
  type: "QR Scan" | "Online Zoom" | "Manual";
  status: "Hadir" | "Izin" | "Alpha";
  phone: string;
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<"qr" | "online">("qr");
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]?.name || "");
  const [lastScanned, setLastScanned] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cms_attendance_logs");
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
      const initialLogs: AttendanceRecord[] = [
        { id: "1", studentName: "Budi Santoso", grade: "SD Kelas 6", time: "14:02 WIB", type: "QR Scan", status: "Hadir", phone: "081234567890" },
        { id: "2", studentName: "Siti Aminah", grade: "SMP Kelas 9", time: "14:15 WIB", type: "Online Zoom", status: "Hadir", phone: "089876543210" }
      ];
      setLogs(initialLogs);
      localStorage.setItem("cms_attendance_logs", JSON.stringify(initialLogs));
    }
  }, []);

  const saveLogs = (newLogs: AttendanceRecord[]) => {
    setLogs(newLogs);
    localStorage.setItem("cms_attendance_logs", JSON.stringify(newLogs));
  };

  const handleSimulateScan = () => {
    const target = mockStudents.find(s => s.name === selectedStudent) || mockStudents[0];
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substring(7),
      studentName: target.name,
      grade: target.grade,
      time: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) + " WIB",
      type: activeTab === "qr" ? "QR Scan" : "Online Zoom",
      status: "Hadir",
      phone: target.phone
    };

    const updated = [newRecord, ...logs];
    saveLogs(updated);
    setLastScanned(newRecord);
  };

  const handleSendWA = (record: AttendanceRecord) => {
    const text = `Halo Bapak/Ibu Wali dari ${record.studentName},\n\nMemberitahukan bahwa Ananda telah *HADIR* mengikuti sesi les di Les Vita pada jam *${record.time}* (${record.type}).\n\nTerima kasih atas kepercayaannya! 🙏✨`;
    const url = `https://wa.me/${record.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display-lg text-[32px] text-on-surface flex items-center gap-2">
            📷 Sistem Presensi Real-Time
          </h1>
          <p className="text-on-surface-variant font-body-md mt-1">Scan Kartu QR Murid di Lokasi atau verifikasi kehadiran siswa kelas online.</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-3 bg-surface-container p-1.5 rounded-2xl w-fit border border-outline-variant/30">
        <button 
          onClick={() => setActiveTab("qr")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-label-bold transition-all ${
            activeTab === "qr" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          Scanner QR (Tatap Muka)
        </button>
        <button 
          onClick={() => setActiveTab("online")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-label-bold transition-all ${
            activeTab === "online" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">videocam</span>
          Presensi Kelas Online (Zoom/Meet)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/30 shadow-md p-6 flex flex-col items-center text-center">
            {activeTab === "qr" ? (
              <>
                <div className="relative w-full aspect-square max-w-[280px] bg-neutral-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-4 border-primary/30 shadow-inner mb-4">
                  <div className="absolute inset-4 border-2 border-dashed border-primary/60 rounded-xl animate-pulse flex items-center justify-center">
                    <span className="material-symbols-outlined text-[64px] text-primary/40">qr_code_scanner</span>
                  </div>
                  <span className="absolute bottom-3 bg-black/60 text-white text-caption font-mono px-3 py-1 rounded-full backdrop-blur-sm">
                    Kamera Aktif • Siap Scan
                  </span>
                </div>
                <h3 className="font-title-md text-on-surface">Arahkan Kartu QR ke Kamera</h3>
                <p className="font-caption text-on-surface-variant mt-1">Sistem akan otomatis mencatat kedatangan dan berbunyi bip.</p>
              </>
            ) : (
              <>
                <div className="w-full aspect-video max-w-[280px] bg-secondary-container/30 rounded-2xl flex flex-col items-center justify-center border border-secondary/20 mb-4 p-4">
                  <span className="material-symbols-outlined text-[48px] text-secondary mb-2">video_camera_front</span>
                  <span className="font-label-bold text-caption text-on-secondary-container">Ruang Kelas Virtual Ready</span>
                  <a href="https://meet.google.com" target="_blank" rel="noreferrer" className="mt-3 px-4 py-1.5 bg-secondary text-on-secondary text-caption font-label-bold rounded-lg hover:opacity-90">
                    Buka Google Meet / Zoom
                  </a>
                </div>
                <h3 className="font-title-md text-on-surface">Absensi Sesi Virtual</h3>
                <p className="font-caption text-on-surface-variant mt-1">Pilih nama siswa yang bergabung di room meeting online.</p>
              </>
            )}

            {/* Simulation Controls */}
            <div className="w-full mt-6 pt-5 border-t border-outline-variant/30 flex flex-col gap-3 text-left">
              <label className="font-label-bold text-caption text-on-surface-variant">Simulasi Scan / Input Murid:</label>
              <select 
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/50 font-body-md text-on-surface"
              >
                {mockStudents.map((s) => (
                  <option key={s.id} value={s.name}>{s.name} ({s.grade})</option>
                ))}
              </select>
              <button 
                onClick={handleSimulateScan}
                className="w-full py-3 bg-primary text-on-primary font-label-bold rounded-xl shadow-sm hover:-translate-y-0.5 transition-transform flex justify-center items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                {activeTab === "qr" ? "Simulasi Scan Kartu QR" : "Tandai Hadir di Room"}
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {lastScanned && (
            <div className="bg-tertiary-container/40 border border-tertiary/30 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">done_all</span>
                </div>
                <div>
                  <h4 className="font-label-bold text-on-surface">{lastScanned.studentName}</h4>
                  <p className="font-caption text-on-surface-variant">Berhasil Presensi • {lastScanned.time}</p>
                </div>
              </div>
              <button 
                onClick={() => handleSendWA(lastScanned)}
                className="px-3 py-1.5 bg-tertiary text-on-tertiary rounded-lg font-label-bold text-caption hover:opacity-90 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">send</span>
                Kirim WA
              </button>
            </div>
          )}
        </div>

        {/* Log Stream */}
        <div className="lg:col-span-7 bg-surface rounded-3xl border border-outline-variant/30 shadow-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-title-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Riwayat Kedatangan Hari Ini
            </h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-caption font-label-bold">
              Total: {logs.length} Siswa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                  <th className="py-3 px-4 font-label-bold text-on-surface-variant text-caption">Nama Siswa</th>
                  <th className="py-3 px-4 font-label-bold text-on-surface-variant text-caption">Jam Masuk</th>
                  <th className="py-3 px-4 font-label-bold text-on-surface-variant text-caption">Metode</th>
                  <th className="py-3 px-4 font-label-bold text-on-surface-variant text-caption text-right">Notifikasi WA</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant font-body-md">
                      Belum ada siswa yang melakukan presensi hari ini.
                    </td>
                  </tr>
                ) : (
                  logs.map((record) => (
                    <tr key={record.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-label-bold text-on-surface">{record.studentName}</span>
                          <span className="font-caption text-on-surface-variant">{record.grade}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-label-bold text-primary text-caption">{record.time}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-caption font-label-bold ${
                          record.type === "QR Scan" ? "bg-primary-container text-on-primary-container" : "bg-secondary-container text-on-secondary-container"
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => handleSendWA(record)}
                          className="px-3 py-1.5 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface-variant rounded-lg font-label-bold text-caption transition-colors inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">chat</span>
                          Kirim WA Wali
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
