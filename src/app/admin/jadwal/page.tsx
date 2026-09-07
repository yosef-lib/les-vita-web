export default function JadwalPage() {
  const schedules = [
    { time: "09:00 - 10:30", student: "Budi Santoso", subject: "Matematika SD (Kelas 5)", type: "Online", tutor: "Kak Nisa" },
    { time: "11:00 - 12:30", student: "Aisyah", subject: "Bahasa Inggris SD", type: "Online", tutor: "Kak Dina" },
    { time: "14:00 - 15:30", student: "Kevin Sanjaya", subject: "Fisika SMP", type: "Offline", tutor: "Kak Bima" },
    { time: "16:00 - 17:30", student: "Grup SMP 2", subject: "IPA Terpadu", type: "Offline", tutor: "Kak Bima" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Jadwal Les</h1>
          <p className="text-sm text-slate-500 mt-1">Atur jadwal mengajar tutor dan plot kelas siswa.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-bold rounded-lg shadow-md shadow-sky-500/20 hover:bg-sky-600 transition-colors flex items-center gap-2">
            + Plot Jadwal Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-fit">
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Agustus 2026</h2>
          </div>
          {/* Simple static calendar representation for UI demo */}
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => (
              <div key={i} className="text-[10px] font-bold text-slate-400">{d}</div>
            ))}
            {Array.from({length: 31}).map((_, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs cursor-pointer hover:bg-slate-100 transition-colors ${
                  i === 11 ? "bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary)]" : "text-slate-700"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          
          <hr className="my-4 border-slate-100" />
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tutor Tersedia Hari Ini</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-slate-700">Kak Nisa (Math)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-slate-700">Kak Bima (IPA)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-sm font-medium text-slate-400 line-through">Kak Dina (Off)</span>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Jadwal: Rabu, 12 Agustus 2026</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-md shadow-sm">
                Hari Ini
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {schedules.map((schedule, i) => (
              <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-slate-50 transition-colors">
                <div className="w-32 shrink-0">
                  <p className="text-sm font-bold text-slate-800">{schedule.time.split(" - ")[0]}</p>
                  <p className="text-xs text-slate-500">s/d {schedule.time.split(" - ")[1]}</p>
                </div>
                
                <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-extrabold text-slate-800">{schedule.student}</p>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      schedule.type === "Online" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {schedule.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[var(--primary)]">{schedule.subject}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Tutor: {schedule.tutor}
                  </p>
                </div>

                <div className="flex gap-2 sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                  <button className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors text-center">
                    Ubah
                  </button>
                  <button className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold rounded-lg transition-colors text-center flex justify-center items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Selesai
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
