"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

type Student = {
  id: string;
  name: string;
  grade: string;
};

type Invoice = {
  id: string;
  studentId: string;
  student: Student;
  month: string;
  year: string;
  amount: number;
  status: string;
  dueDate: string;
  paymentDate: string | null;
  createdAt: string;
};

export default function KeuanganPage() {
  const { user } = useAuth();
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);

  // Form states
  const [formStudentId, setFormStudentId] = useState("");
  const [formMonth, setFormMonth] = useState("");
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString());
  const [formAmount, setFormAmount] = useState("");
  const [formDueDate, setFormDueDate] = useState("");

  useEffect(() => {
    fetchInvoices();
    fetchStudents();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInvoices(data);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil data tagihan");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (res.ok) {
        setStudents(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data siswa", error);
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (window.confirm("Konfirmasi pembayaran lunas untuk tagihan ini?")) {
      try {
        const res = await fetch(`/api/invoices/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: "LUNAS",
            paymentDate: new Date().toISOString()
          }),
        });

        if (!res.ok) throw new Error("Gagal mengupdate tagihan");
        toast.success("Tagihan ditandai Lunas");
        fetchInvoices(); // refresh
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleAddInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId || !formMonth || !formYear || !formAmount || !formDueDate) return;

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formStudentId,
          month: formMonth,
          year: formYear,
          amount: formAmount,
          dueDate: formDueDate,
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat tagihan");
      toast.success("Tagihan berhasil dibuat!");
      
      // Reset
      setFormStudentId("");
      setFormMonth("");
      setFormAmount("");
      setFormDueDate("");
      setIsAddingInvoice(false);
      
      // Refresh
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToCSV = () => {
    const headers = ['No. Invoice', 'Siswa', 'Kelas', 'Periode', 'Jatuh Tempo', 'Nominal', 'Status', 'Tanggal Lunas'];
    const csvRows = [headers.join(',')];

    invoices.forEach(inv => {
      const row = [
        `"${inv.id.substring(0,8).toUpperCase()}"`,
        `"${inv.student?.name || ''}"`,
        `"${inv.student?.grade || ''}"`,
        `"${inv.month} ${inv.year}"`,
        `"${new Date(inv.dueDate).toLocaleDateString('id-ID')}"`,
        `"${inv.amount}"`,
        `"${inv.status}"`,
        `"${inv.paymentDate ? new Date(inv.paymentDate).toLocaleDateString('id-ID') : '-'}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Keuangan_Les_Vita_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  if (user?.role !== "MASTER_ADMIN") {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-slate-500 mt-2">Hanya Master Admin yang dapat mengakses halaman keuangan.</p>
      </div>
    );
  }

  const totalPemasukan = invoices.filter(i => i.status === "LUNAS").reduce((acc, curr) => acc + curr.amount, 0);
  const totalMenunggu = invoices.filter(i => i.status !== "LUNAS").reduce((acc, curr) => acc + curr.amount, 0);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Keuangan & SPP
          </h1>
          <p className="text-sm text-slate-500 mt-1">Pantau pemasukan, status pembayaran SPP siswa, dan laporan keuangan.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddingInvoice(true)}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-xl shadow-sm transition-colors"
          >
            + Buat Tagihan
          </button>
          <button 
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm shadow-emerald-500/30 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Laporan
          </button>
        </div>
      </div>

      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold">Laporan Keuangan Les Vita</h1>
        <p>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-100 rounded-full blur-2xl opacity-60"></div>
          <p className="text-sm font-bold text-slate-500 mb-1">Total Pemasukan</p>
          <h3 className="text-3xl font-extrabold text-slate-800">{formatRupiah(totalPemasukan)}</h3>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-60"></div>
          <p className="text-sm font-bold text-slate-500 mb-1">Menunggu Pembayaran</p>
          <h3 className="text-3xl font-extrabold text-slate-800">{formatRupiah(totalMenunggu)}</h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 font-bold bg-amber-50 w-fit px-2.5 py-1 rounded-lg">
            {invoices.filter(i => i.status !== "LUNAS").length} tagihan aktif
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700 shadow-lg relative overflow-hidden text-white print:hidden">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="font-bold text-sky-400 mb-2">Bot Notifikasi Aktif</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sistem akan otomatis mengirimkan pesan pengingat tagihan SPP ke nomor WhatsApp/Telegram wali siswa H-3 sebelum jatuh tempo.
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col relative z-10">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between print:hidden">
          <h2 className="font-bold text-slate-800">Daftar Tagihan SPP</h2>
        </div>

        {isLoading ? (
           <div className="p-8 text-center text-slate-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                  <th className="px-6 py-4 text-sm font-bold text-slate-800">No. Invoice</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-800">Siswa & Kelas</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-800">Periode Tagihan</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-800">Nominal</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-800">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-800 print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-500">
                      {inv.id.substring(0,8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{inv.student?.name}</div>
                      <div className="text-xs font-semibold text-slate-500 mt-0.5">{inv.student?.grade}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      {inv.month} {inv.year}
                      <div className="text-[10px] text-slate-400">Jatuh Tempo: {new Date(inv.dueDate).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                      {formatRupiah(inv.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 
                        ${inv.status === 'LUNAS' ? 'bg-emerald-100 text-emerald-700' : 
                          inv.status === 'MENUNGGU' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {inv.status === 'LUNAS' && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        {inv.status}
                      </span>
                      {inv.status === 'LUNAS' && inv.paymentDate && (
                        <div className="text-[10px] text-slate-400 mt-1.5 font-semibold">Tgl: {new Date(inv.paymentDate).toLocaleDateString('id-ID')}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 print:hidden">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/keuangan/cetak/${inv.id}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
                        >
                          Cetak Nota
                        </Link>
                        {inv.status !== 'LUNAS' && (
                          <button 
                            onClick={() => handleMarkPaid(inv.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
                          >
                            Tandai Lunas
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      Belum ada tagihan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add Invoice */}
      {isAddingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Buat Tagihan Baru</h3>
              <button onClick={() => setIsAddingInvoice(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleAddInvoiceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Siswa *</label>
                <select 
                  required
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bulan *</label>
                  <select 
                    required
                    value={formMonth}
                    onChange={(e) => setFormMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Pilih Bulan</option>
                    {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tahun *</label>
                  <input 
                    type="number" 
                    required
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nominal Tagihan (Rp) *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="Contoh: 350000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Batas Waktu (Jatuh Tempo) *</label>
                <input 
                  type="date" 
                  required
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddingInvoice(false)} 
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
                >
                  Buat Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
