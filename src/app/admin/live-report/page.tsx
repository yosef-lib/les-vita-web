"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  parentPhone: string;
  grade: string;
}

interface LiveReport {
  id: string;
  studentId: string;
  student: Student;
  date: string;
  topic: string;
  understanding: string;
  notes: string | null;
  status: string;
}

export default function LiveReportPage() {
  const [reports, setReports] = useState<LiveReport[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [studentId, setStudentId] = useState('');
  const [topic, setTopic] = useState('');
  const [understanding, setUnderstanding] = useState('Baik');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resReports, resStudents] = await Promise.all([
        fetch('/api/live-reports'),
        fetch('/api/students')
      ]);
      const dataReports = await resReports.json();
      const dataStudents = await resStudents.json();
      setReports(dataReports);
      setStudents(dataStudents);
    } catch (error) {
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !topic || !understanding) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return;
    }
    try {
      const res = await fetch('/api/live-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, topic, understanding, notes })
      });
      if (res.ok) {
        toast.success('Live Report berhasil disimpan');
        setStudentId('');
        setTopic('');
        setNotes('');
        fetchData();
      } else {
        toast.error('Gagal menyimpan laporan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const [sendingId, setSendingId] = useState<string | null>(null);

  const sendToWA = async (report: LiveReport) => {
    const studentName = report.student?.name || 'Siswa';
    const date = new Date(report.date).toLocaleDateString('id-ID', { dateStyle: 'long' });
    const text = `Halo Bapak/Ibu, berikut adalah *Live Report* aktivitas les *${studentName}* pada hari ini (${date}):\n\n*Materi/Topik:* ${report.topic}\n*Pemahaman:* ${report.understanding}\n*Catatan Tutor:* ${report.notes || '-'}\n\nTerima kasih telah mempercayakan bimbingan belajar Ananda di Les Vita.`;
    
    // Format phone number to start with 62
    let phone = report.student?.parentPhone || '';
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    
    try {
      setSendingId(report.id);
      const res = await fetch('/api/wa/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message: text })
      });
      
      if (res.ok) {
        toast.success('Pesan WA berhasil dikirim (Mock)');
      } else {
        toast.error('Gagal mengirim WA');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim WA');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Live Report</h1>
          <p className="text-sm text-slate-500 mt-1">Kirim laporan belajar langsung ke orang tua setelah sesi les selesai.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Create */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">📝</span>
            Buat Laporan Baru
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Siswa *</label>
              <select 
                value={studentId} 
                onChange={e => setStudentId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              >
                <option value="">-- Pilih Siswa --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Materi / Topik *</label>
              <input 
                type="text" 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Contoh: Pecahan Campuran"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tingkat Pemahaman *</label>
              <select 
                value={understanding} 
                onChange={e => setUnderstanding(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              >
                <option value="Sangat Baik">Sangat Baik</option>
                <option value="Baik">Baik</option>
                <option value="Cukup">Cukup</option>
                <option value="Kurang">Kurang</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Catatan Tambahan</label>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Contoh: Budi perlu lebih banyak latihan soal cerita..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
            >
              Simpan Laporan
            </button>
          </form>
        </div>

        {/* List Reports */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">📋</span>
            Riwayat Live Report
          </h2>
          
          {loading ? (
            <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : reports.length === 0 ? (
            <div className="text-center p-8 text-slate-400">Belum ada data Live Report.</div>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{report.student?.name} <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md ml-2">{report.student?.grade}</span></h3>
                      <p className="text-xs text-slate-500 mt-1">{new Date(report.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                    </div>
                    <button 
                      onClick={() => sendToWA(report)}
                      disabled={sendingId === report.id}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingId === report.id ? (
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      )}
                      {sendingId === report.id ? 'Mengirim...' : 'Kirim WA'}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">Materi: <span className="font-normal text-slate-600">{report.topic}</span></p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">Pemahaman: <span className="font-normal text-slate-600">{report.understanding}</span></p>
                    {report.notes && (
                      <p className="text-sm font-semibold text-slate-800 mt-1">Catatan: <span className="font-normal text-slate-600 italic">"{report.notes}"</span></p>
                    )}
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
