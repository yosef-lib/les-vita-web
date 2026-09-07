import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function StudentHomeworkPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login-siswa');
  }

  // Get student ID
  const student = await prisma.student.findUnique({
    where: { userId }
  });

  if (!student) {
    return <div className="p-8 text-center">Data siswa tidak ditemukan.</div>;
  }

  const homeworks = await prisma.homework.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Tugas & PR Digital</h1>
          <p className="text-purple-100 opacity-90 max-w-xl text-sm leading-relaxed">
            Daftar pekerjaan rumah dan latihan soal yang harus kamu kerjakan. Jangan lupa perhatikan tenggat waktunya ya!
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 -mb-10 -mr-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homeworks.length === 0 ? (
          <div className="col-span-full bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Hore! Tidak Ada PR</h3>
            <p className="text-slate-500 mt-2">Kamu sudah menyelesaikan semua tugas. Selamat istirahat!</p>
          </div>
        ) : (
          homeworks.map(hw => (
            <div key={hw.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg ${
                  hw.status === 'SELESAI' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {hw.status === 'SELESAI' ? 'Selesai' : 'Belum Dikerjakan'}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                  Tenggat: {new Date(hw.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                {hw.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {hw.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
