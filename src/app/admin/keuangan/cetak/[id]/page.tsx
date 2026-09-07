"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Student = {
  nis: string;
  name: string;
  grade: string;
  school: string;
  parentName: string;
  parentPhone: string;
};

type Invoice = {
  id: string;
  month: string;
  year: string;
  amount: number;
  status: string;
  dueDate: string;
  paymentDate: string | null;
  createdAt: string;
  student: Student;
};

export default function CetakNotaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  if (isLoading) {
    return <div className="p-10 text-center">Memuat Nota...</div>;
  }

  if (!invoice) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold">Nota tidak ditemukan</h1>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-slate-200 rounded">Kembali</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 flex justify-center font-sans print:p-0 print:bg-white">
      {/* Container Nota */}
      <div className="w-full max-w-3xl bg-white shadow-lg print:shadow-none p-10 sm:p-12 border border-slate-200 print:border-none relative">
        
        {/* Tombol Print (Sembunyi saat dicetak) */}
        <div className="absolute top-4 right-4 flex gap-2 print:hidden">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200 transition"
          >
            Kembali
          </button>
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-bold rounded-lg hover:bg-[var(--primary-dark)] transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak / PDF
          </button>
        </div>

        {/* Header Kop Surat */}
        <div className="border-b-4 border-[var(--primary)] pb-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="Les Vita Logo" className="w-20 h-20 object-cover rounded-full shadow-sm" />
            <div>
              <h1 className="text-3xl font-extrabold text-[var(--primary)] tracking-tight">LES VITA</h1>
              <p className="text-sm font-bold text-slate-500 tracking-widest mt-1">SCIENTIA VITA EST</p>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">
                Pusat Bimbingan Belajar SD & SMP <br />
                Jl. Pendidikan No. 123, Yogyakarta <br />
                Telp: 0812-3456-7890
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-slate-200 tracking-widest uppercase">INVOICE</h2>
            <p className="text-sm font-bold text-slate-600 mt-2">NO: #{invoice.id.substring(0,8).toUpperCase()}</p>
            <p className="text-sm text-slate-500">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        {/* Info Tagihan */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Ditagihkan Kepada</h3>
            <p className="font-extrabold text-slate-800 text-lg">{invoice.student.name}</p>
            <p className="text-slate-600">{invoice.student.grade} - {invoice.student.school}</p>
            <p className="text-slate-600 mt-2">
              <span className="font-semibold">Wali:</span> {invoice.student.parentName} <br />
              {invoice.student.parentPhone}
            </p>
          </div>
          <div className="text-right">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Informasi Pembayaran</h3>
             <div className="space-y-2 text-slate-600">
               <p className="flex justify-between border-b border-slate-100 pb-2"><span className="font-semibold">Status:</span> 
                <span className={`font-bold ${invoice.status === 'LUNAS' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {invoice.status}
                </span>
               </p>
               <p className="flex justify-between border-b border-slate-100 pb-2"><span className="font-semibold">Periode:</span> <span>{invoice.month} {invoice.year}</span></p>
               <p className="flex justify-between border-b border-slate-100 pb-2"><span className="font-semibold">Jatuh Tempo:</span> <span className={invoice.status !== 'LUNAS' ? 'text-rose-600 font-medium' : ''}>{new Date(invoice.dueDate).toLocaleDateString('id-ID')}</span></p>
               {invoice.paymentDate && (
                 <p className="flex justify-between border-b border-slate-100 pb-2"><span className="font-semibold">Tgl Bayar:</span> <span>{new Date(invoice.paymentDate).toLocaleDateString('id-ID')}</span></p>
               )}
             </div>
          </div>
        </div>

        {/* Tabel Tagihan */}
        <table className="w-full mb-10 text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="py-3 px-4 font-bold text-slate-700 text-sm">Deskripsi Tagihan</th>
              <th className="py-3 px-4 font-bold text-slate-700 text-sm text-center">Periode</th>
              <th className="py-3 px-4 font-bold text-slate-700 text-sm text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-4 px-4 text-slate-800">
                <p className="font-bold">Biaya Bimbingan Belajar SPP</p>
                <p className="text-sm text-slate-500">Program Reguler {invoice.student.grade}</p>
              </td>
              <td className="py-4 px-4 text-slate-600 text-center font-medium">
                {invoice.month} {invoice.year}
              </td>
              <td className="py-4 px-4 text-slate-800 font-bold text-right">
                {formatRupiah(invoice.amount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Total & TTD */}
        <div className="flex justify-between items-end">
          <div className="w-1/2">
             <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                <p className="text-xs font-bold text-sky-800 uppercase mb-2">Metode Pembayaran</p>
                <p className="text-sm text-sky-900 leading-relaxed">
                  Transfer Bank BCA<br />
                  No Rek: <strong>123-456-7890</strong><br />
                  a.n. Les Vita Mandiri
                </p>
             </div>
          </div>
          <div className="w-1/3 text-right">
            <div className="border-b-2 border-slate-800 pb-2 mb-2 flex justify-between">
              <span className="font-bold text-slate-600">TOTAL</span>
              <span className="text-2xl font-black text-slate-800">{formatRupiah(invoice.amount)}</span>
            </div>
            
            <div className="mt-16 pt-10 border-t border-slate-300 w-48 ml-auto text-center">
              <p className="font-bold text-slate-700">Administrasi Les Vita</p>
            </div>
          </div>
        </div>

        {/* Footer/Watermark */}
        <div className="mt-16 text-center text-xs text-slate-400 font-medium">
          <p>Terima kasih atas kepercayaan Anda kepada Les Vita.</p>
          <p>Dokumen ini sah dihasilkan oleh sistem dan tidak memerlukan tanda tangan basah.</p>
        </div>

      </div>
    </div>
  );
}
