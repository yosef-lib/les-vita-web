"use client";

import { useState } from "react";

export default function SchedulesPage() {
  const [selectedDay, setSelectedDay] = useState("Senin");
  
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  
  const mockSchedules = [
    { id: 1, time: "14:00 - 15:30", subject: "Matematika SD (Kelas 6)", tutor: "Kak Reza", room: "Ruang A1", students: 5, day: "Senin" },
    { id: 2, time: "15:30 - 17:00", subject: "Fisika SMA (Kelas 12)", tutor: "Kak Budi", room: "Ruang B2", students: 8, day: "Senin" },
    { id: 3, time: "16:00 - 17:30", subject: "Bahasa Inggris SMP", tutor: "Kak Sarah", room: "Ruang C1", students: 10, day: "Selasa" },
    { id: 4, time: "14:00 - 15:30", subject: "Calistung TK", tutor: "Kak Rini", room: "Ruang A2", students: 4, day: "Selasa" },
    { id: 5, time: "15:30 - 17:00", subject: "Sains SMP", tutor: "Kak Budi", room: "Ruang B1", students: 6, day: "Rabu" },
    { id: 6, time: "18:30 - 20:00", subject: "SNBT Intensif", tutor: "Kak Anton", room: "Ruang Utama", students: 15, day: "Rabu" },
  ];

  const filteredSchedules = mockSchedules.filter(s => s.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="font-display-lg text-[32px] text-on-surface">Jadwal Kelas Mingguan</h1>
        <button className="bg-primary text-on-primary font-label-bold px-4 py-2 rounded-xl shadow-sm hover:-translate-y-0.5 transition-transform flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah Jadwal
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col p-6 gap-6">
        
        {/* Day Selector */}
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-2.5 rounded-full font-label-bold transition-colors whitespace-nowrap ${
                selectedDay === day 
                  ? "bg-primary text-on-primary" 
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="flex flex-col gap-4">
          {filteredSchedules.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant font-body-md bg-surface-container-lowest rounded-xl border border-outline-variant/30">
              Tidak ada jadwal kelas untuk hari {selectedDay}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchedules.map(schedule => (
                <div key={schedule.id} className="flex gap-4 p-5 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 transition-colors shadow-sm">
                  <div className="flex flex-col items-center justify-center w-20 bg-primary-container/50 rounded-xl text-on-primary-container border border-primary/10">
                    <span className="font-label-bold text-[18px]">{schedule.time.split(' ')[0]}</span>
                    <span className="text-[10px] text-on-surface-variant">Mulai</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-title-md text-on-surface mb-1">{schedule.subject}</h4>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        <span className="font-caption">{schedule.tutor}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">meeting_room</span>
                        <span className="font-caption">{schedule.room}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">group</span>
                        <span className="font-caption">{schedule.students} Siswa</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span className="font-caption">{schedule.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface hover:text-primary flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface hover:text-error hover:bg-error-container flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
