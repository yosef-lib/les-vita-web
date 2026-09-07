import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function StudentRaporPage() {
  const cookieStore = await cookies();
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

  const reports = await prisma.liveReport.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-sky-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Rapor & Live Report</h1>
          <p className="text-sky-100 opacity-90 max-w-xl text-sm leading-relaxed">
            Pantau terus perkembangan belajarmu setiap selesai les. Catatan ini dibuat khusus oleh tutor untuk membantumu belajar lebih baik!
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 -mb-10 -mr-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
        </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h3 className="text-xl font-bold text-slate-800">Belum Ada Rapor</h3>
            <p className="text-slate-500 mt-2">Belum ada catatan belajar yang dibagikan untuk saat ini.</p>
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{report.topic}</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1">
                    {new Date(report.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl ${
                    report.understanding === 'Sangat Baik' ? 'bg-emerald-100 text-emerald-700' :
                    report.understanding === 'Baik' ? 'bg-sky-100 text-sky-700' :
                    report.understanding === 'Cukup' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    Pemahaman: {report.understanding}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Catatan Pengajar:</p>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm leading-relaxed border border-slate-100">
                  {report.notes || 'Tidak ada catatan tambahan.'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
