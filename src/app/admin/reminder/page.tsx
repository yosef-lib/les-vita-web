"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  parentPhone: string;
}

interface Reminder {
  id: string;
  studentId: string;
  student: Student;
  type: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ReminderPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState('TAGIHAN');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resReminders, resStudents] = await Promise.all([
        fetch('/api/reminders'),
        fetch('/api/students')
      ]);
      const dataReminders = await resReminders.json();
      const dataStudents = await resStudents.json();
      setReminders(dataReminders);
      setStudents(dataStudents);
    } catch (error) {
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    if (newType === 'TAGIHAN') {
      setMessage('Halo Bapak/Ibu, ini adalah reminder (pengingat) pembayaran tagihan SPP les ananda untuk bulan ini yang akan/telah jatuh tempo. Mohon segera melakukan pembayaran. Abaikan pesan ini jika sudah membayar.');
    } else {
      setMessage('Halo Bapak/Ibu, ini adalah reminder untuk jadwal les ananda terdekat. Mohon persiapkan diri dan materi yang akan dipelajari.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !message) {
      toast.error('Mohon lengkapi form dengan benar');
      return;
    }
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, type, message })
      });
      if (res.ok) {
        toast.success('Reminder berhasil disimpan');
        setStudentId('');
        setMessage('');
        fetchData();
      } else {
        toast.error('Gagal menyimpan reminder');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const [sendingId, setSendingId] = useState<string | null>(null);

  const sendToWA = async (reminder: Reminder) => {
    // Format phone number to start with 62
    let phone = reminder.student?.parentPhone || '';
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    
    // Add specific context to the message
    const studentName = reminder.student?.name || 'Siswa';
    const text = `${reminder.message}\n\n- Admin Les Vita (Ananda ${studentName})`;
    
    try {
      setSendingId(reminder.id);
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
          <h1 className="text-2xl font-extrabold text-slate-800">Reminder WA</h1>
          <p className="text-sm text-slate-500 mt-1">Kirim pengingat tagihan SPP atau jadwal les ke orang tua.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Create */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">🔔</span>
            Buat Reminder Baru
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Siswa *</label>
              <select 
                value={studentId} 
                onChange={e => setStudentId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
              >
                <option value="">-- Pilih Siswa --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Jenis Reminder *</label>
              <select 
                value={type} 
                onChange={e => handleTypeChange(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
              >
                <option value="TAGIHAN">Tagihan SPP</option>
                <option value="JADWAL">Jadwal Les</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Pesan / Pesan Kustom *</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5"
            >
              Simpan Reminder
            </button>
          </form>
        </div>

        {/* List Reminders */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">🕰️</span>
            Riwayat Reminder
          </h2>
          
          {loading ? (
            <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : reminders.length === 0 ? (
            <div className="text-center p-8 text-slate-400">Belum ada data Reminder.</div>
          ) : (
            <div className="space-y-4">
              {reminders.map(reminder => (
                <div key={reminder.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        {reminder.student?.name}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          reminder.type === 'TAGIHAN' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'
                        }`}>
                          {reminder.type}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{new Date(reminder.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                    </div>
                    <button 
                      onClick={() => sendToWA(reminder)}
                      disabled={sendingId === reminder.id}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingId === reminder.id ? (
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      )}
                      {sendingId === reminder.id ? 'Mengirim...' : 'Kirim WA'}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <p className="text-sm font-normal text-slate-700 italic">"{reminder.message}"</p>
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
