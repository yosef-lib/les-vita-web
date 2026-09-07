"use client";

import { useState } from "react";
import { mockStudents } from "@/lib/mockData";

export default function ReportsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [report, setReport] = useState({
    todayMaterial: "",
    evaluation: "",
    nextMaterial: ""
  });

  const selectedStudent = mockStudents.find(s => s.id === selectedStudentId);

  const handleSendWhatsApp = () => {
    if (!selectedStudent) return;

    const text = `Halo Bapak/Ibu ${selectedStudent.parentName},

Berikut adalah laporan belajar ananda ${selectedStudent.name} hari ini:

📚 *Materi Hari Ini:*
${report.todayMaterial}

📝 *Evaluasi/Catatan:*
${report.evaluation}

🎯 *Target Belajar Berikutnya:*
${report.nextMaterial}

Terima kasih atas kepercayaannya,
Les Vita Tutoring`;

    const url = `https://wa.me/${selectedStudent.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="font-display-lg text-[32px] text-on-surface">Laporan Belajar (Harian)</h1>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/50 shadow-sm p-6 flex flex-col gap-6 max-w-3xl">
        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-on-surface">Pilih Siswa</label>
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface"
          >
            <option value="" disabled>-- Pilih Siswa --</option>
            {mockStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.program}) - Orang Tua: {student.parentName}
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
              <p className="font-body-md text-on-surface-variant">
                Laporan ini akan dikirimkan ke <strong>{selectedStudent.parentName}</strong> di nomor <strong>{selectedStudent.phone}</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-on-surface">Materi Hari Ini</label>
              <textarea 
                rows={3}
                value={report.todayMaterial}
                onChange={(e) => setReport({...report, todayMaterial: e.target.value})}
                placeholder="Contoh: Belajar penjumlahan dan pengurangan bilangan bulat..."
                className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-on-surface">Evaluasi / Catatan Tutor</label>
              <textarea 
                rows={3}
                value={report.evaluation}
                onChange={(e) => setReport({...report, evaluation: e.target.value})}
                placeholder="Contoh: Budi sudah cukup paham konsep dasar, namun perlu lebih teliti saat mengerjakan soal cerita..."
                className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-on-surface">Target Materi Berikutnya</label>
              <textarea 
                rows={2}
                value={report.nextMaterial}
                onChange={(e) => setReport({...report, nextMaterial: e.target.value})}
                placeholder="Contoh: Perkalian bersusun dan latihan soal cerita."
                className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-body-md text-on-surface resize-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-outline-variant/30">
              <button 
                onClick={handleSendWhatsApp}
                disabled={!report.todayMaterial || !report.evaluation}
                className="bg-[#25D366] text-white font-label-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#1DA851] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                Kirim Laporan via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
