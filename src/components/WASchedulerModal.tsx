"use client";

import React, { useState } from 'react';
import { ScheduleItem } from '@/lib/types';

export default function WASchedulerModal() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: 'sch-1',
      studentName: 'Alif Pratama',
      parentName: 'Ibu Rahmawati',
      parentPhone: '6281234567890',
      teacherName: 'Kak Budi Mentor',
      teacherPhone: '6289876543210',
      subject: 'Matematika SD Kelas 5',
      gradeLevel: 'SD Kelas 5',
      dayDate: 'Besok (Jumat, 4 September 2026)',
      timeSlot: '15:30 - 17:00 WIB',
      materials: 'Modul Bab 4: Pecahan & Desimal (Soal Halaman 45)',
      materialUrl: 'https://lesvita.com/modul/sd-matematika-bab4.pdf',
      status: 'scheduled'
    },
    {
      id: 'sch-2',
      studentName: 'Fiona Wijaya',
      parentName: 'Bapak Hendra',
      parentPhone: '6281122334455',
      teacherName: 'Kak Sarah SNBT',
      teacherPhone: '6285566778899',
      subject: 'Penalaran Matematika SNBT',
      gradeLevel: 'SMA Kelas 12',
      dayDate: 'Besok (Jumat, 4 September 2026)',
      timeSlot: '18:30 - 20:00 WIB',
      materials: 'Bank Soal Intensif TPS Tryout #5',
      materialUrl: 'https://lesvita.com/modul/snbt-tps-to5.pdf',
      status: 'scheduled'
    }
  ]);

  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [targetType, setTargetType] = useState<'parent' | 'teacher'>('parent');

  const generateParentWAMessage = (item: ScheduleItem) => {
    return `Halo *${item.parentName}* 👋

Mengingatkan jadwal les untuk Ananda *${item.studentName}* bersama Les Vita:

📅 *Hari/Tanggal:* ${item.dayDate}
⏰ *Waktu:* ${item.timeSlot}
📚 *Mata Pelajaran:* ${item.subject}
👨‍🏫 *Pengajar:* ${item.teacherName}

Mohon konfirmasi kehadirannya dengan membalas pesan ini atau mengetik:
*1* - Siap Les
*2* - Minta Izin / Reschedule

Terima kasih atas kerjasamanya! 🙏
_Les Vita - Bimbel & Mentorship Cerdas_`;
  };

  const generateTeacherWAMessage = (item: ScheduleItem) => {
    return `Halo Pengajar *${item.teacherName}* 👨‍🏫

Berikut pengingat jadwal mengajar Anda besok:

👤 *Siswa:* ${item.studentName} (${item.gradeLevel})
👨‍👩‍👧 *Orang Tua:* ${item.parentName} (${item.parentPhone})
⏰ *Waktu:* ${item.timeSlot}
📖 *Materi/Bahan:* ${item.materials}
🔗 *Link Modul Ajar:* ${item.materialUrl || '-'}

Mohon persiapkan bahan ajar dan datang tepat waktu ya. Semangat mengajar! 💪
_Admin Operasional Les Vita_`;
  };

  const getWALink = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full uppercase tracking-wider">
            📲 Otomatisasi Pengingat WA
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            Jadwal Les & Generator Notifikasi WhatsApp
          </h3>
          <p className="text-slate-500 text-sm">
            Kirim pengingat les H-1 ke Orang Tua/Anak dan Pengajar secara otomatis dengan 1-Klik.
          </p>
        </div>
      </div>

      {/* Schedule Table / List */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className="bg-slate-50 hover:bg-indigo-50/40 p-5 rounded-2xl border border-slate-200/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">{sch.studentName}</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-md">
                  {sch.subject}
                </span>
              </div>
              <div className="text-xs text-slate-600 flex flex-wrap gap-4">
                <span>🗓️ {sch.dayDate}</span>
                <span>⏰ {sch.timeSlot}</span>
                <span>👨‍🏫 {sch.teacherName}</span>
              </div>
              <div className="text-xs text-slate-500 italic">📚 Materi: {sch.materials}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedSchedule(sch);
                  setTargetType('parent');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>💬 WA Orang Tua</span>
              </button>
              <button
                onClick={() => {
                  setSelectedSchedule(sch);
                  setTargetType('teacher');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>💬 WA Pengajar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal for WA Message */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <span>📱 Preview Pesan WhatsApp</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-normal">
                  {targetType === 'parent' ? 'Ke Orang Tua' : 'Ke Pengajar'}
                </span>
              </h4>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Target Selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTargetType('parent')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  targetType === 'parent'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pesan Orang Tua ({selectedSchedule.parentName})
              </button>
              <button
                onClick={() => setTargetType('teacher')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  targetType === 'teacher'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pesan Pengajar ({selectedSchedule.teacherName})
              </button>
            </div>

            {/* Message Box */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-2xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto mb-6">
              {targetType === 'parent'
                ? generateParentWAMessage(selectedSchedule)
                : generateTeacherWAMessage(selectedSchedule)}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedSchedule(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Batal
              </button>
              <a
                href={getWALink(
                  targetType === 'parent' ? selectedSchedule.parentPhone : selectedSchedule.teacherPhone,
                  targetType === 'parent'
                    ? generateParentWAMessage(selectedSchedule)
                    : generateTeacherWAMessage(selectedSchedule)
                )}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>Buka WhatsApp & Kirim</span>
                <span>➔</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
