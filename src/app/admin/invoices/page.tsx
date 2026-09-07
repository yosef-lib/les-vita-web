"use client";

import { useState } from "react";

type InvoiceStatus = "Lunas" | "Parsial / Cicilan" | "Belum Lunas";

interface Invoice {
  id: string;
  studentName: string;
  parentName: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  phone: string;
  paymentMethod?: string;
}

const mockInvoices: Invoice[] = [
  { id: "INV-202609-01", studentName: "Alif Pratama", parentName: "Ibu Rahmawati", amount: 450000, paidAmount: 225000, dueDate: "10 Sep 2026", status: "Parsial / Cicilan", phone: "6281234567890", paymentMethod: "QRIS / E-Wallet" },
  { id: "INV-202609-02", studentName: "Fiona Wijaya", parentName: "Bapak Hendra", amount: 600000, paidAmount: 600000, dueDate: "12 Sep 2026", status: "Lunas", phone: "6281122334455", paymentMethod: "BCA Virtual Account" },
  { id: "INV-202609-03", studentName: "Dimas Kartika", parentName: "Ibu Maya", amount: 400000, paidAmount: 0, dueDate: "15 Sep 2026", status: "Belum Lunas", phone: "6289876543210" },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [activePaymentModal, setActivePaymentModal] = useState<Invoice | null>(null);

  const handleStatusChange = (id: string, newStatus: InvoiceStatus) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === id) {
        const paid = newStatus === 'Lunas' ? inv.amount : newStatus === 'Parsial / Cicilan' ? inv.amount / 2 : 0;
        return { ...inv, status: newStatus, paidAmount: paid };
      }
      return inv;
    }));
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  const sendInvoiceWhatsApp = (invoice: Invoice) => {
    const remaining = invoice.amount - invoice.paidAmount;
    const text = `Halo *${invoice.parentName}* 👋

Berikut rincian tagihan les Les Vita untuk Ananda *${invoice.studentName}*:

📄 *No. Invoice:* ${invoice.id}
💰 *Total Tagihan:* ${formatRupiah(invoice.amount)}
💳 *Sudah Dibayar:* ${formatRupiah(invoice.paidAmount)}
⚠️ *Sisa Pembayaran:* ${formatRupiah(remaining)}
📅 *Jatuh Tempo:* ${invoice.dueDate}

Bayar praktis via Payment Gateway (QRIS / VA Instant):
🔗 https://lesvita.com/pay/${invoice.id}

Terima kasih atas kerjasamanya! 🙏
_Les Vita Financial Team_`;

    const url = `https://wa.me/${invoice.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full uppercase tracking-wider">
            💳 Financial & Invoice Hub
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Invoice Tagihan & Payment Gateway
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Mendukung pembayaran cicilan/parsial, rekapan mutasi otomatis, dan invoice QRIS/VA Instant ke WA Orang Tua.
          </p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0">
          + Buat Invoice Baru
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            <tr>
              <th className="py-3.5 px-4">No. Invoice</th>
              <th className="py-3.5 px-4">Nama Siswa & Orang Tua</th>
              <th className="py-3.5 px-4">Total Tagihan</th>
              <th className="py-3.5 px-4">Sudah Dibayar</th>
              <th className="py-3.5 px-4">Sisa Tagihan</th>
              <th className="py-3.5 px-4">Jatuh Tempo</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => {
              const remaining = inv.amount - inv.paidAmount;
              return (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{inv.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{inv.studentName}</div>
                    <div className="text-[11px] text-slate-500">{inv.parentName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{formatRupiah(inv.amount)}</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold">{formatRupiah(inv.paidAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">{formatRupiah(remaining)}</td>
                  <td className="py-3.5 px-4 text-slate-600">{inv.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv.id, e.target.value as InvoiceStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        inv.status === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : inv.status === 'Parsial / Cicilan'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      <option value="Lunas">Lunas</option>
                      <option value="Parsial / Cicilan">Parsial / Cicilan</option>
                      <option value="Belum Lunas">Belum Lunas</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setActivePaymentModal(inv)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-xs border border-indigo-200"
                    >
                      📱 Payment Gateway
                    </button>
                    <button
                      onClick={() => sendInvoiceWhatsApp(inv)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs"
                    >
                      💬 WA Invoice
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Gateway Modal Simulator */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <span>💳 Payment Gateway Instant</span>
              </h3>
              <button
                onClick={() => setActivePaymentModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Tagihan Untuk:</span>
                <span className="font-bold text-slate-900">{activePaymentModal.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sisa Pembayaran:</span>
                <span className="font-extrabold text-indigo-700 text-sm">
                  {formatRupiah(activePaymentModal.amount - activePaymentModal.paidAmount)}
                </span>
              </div>
            </div>

            {/* QRIS & VA Simulator */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-center space-y-2">
                <div className="text-xs font-bold text-indigo-900">QRIS / E-Wallet Instant</div>
                <div className="w-32 h-32 bg-white mx-auto border border-slate-300 rounded-xl flex items-center justify-center font-bold text-xs text-slate-400">
                  [ QRIS SCAN CODE ]
                </div>
                <div className="text-[10px] text-slate-500">Mendukung GoPay, OVO, Dana, ShopeePay, LinkAja</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">BCA Virtual Account</div>
                  <div className="font-mono text-indigo-700 font-bold">88308-1234-5678</div>
                </div>
                <button
                  onClick={() => alert('Nomor VA berhasil disalin!')}
                  className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded-lg font-bold"
                >
                  Salin
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                handleStatusChange(activePaymentModal.id, 'Lunas');
                setActivePaymentModal(null);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-xs"
            >
              Simulasikan Pembayaran Lunas (Auto-Sync)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
