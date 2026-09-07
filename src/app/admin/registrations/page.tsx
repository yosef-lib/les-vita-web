"use client";

import { useState, useEffect } from "react";

interface Lead {
  id: string;
  name: string;
  parentName: string;
  program: string;
  grade: string;
  phone: string;
  date: string;
  stage: 'Lead Baru' | 'Konsultasi' | 'Schedule Trial' | 'Siswa Aktif';
}

export default function RegistrationsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');

  const defaultLeads: Lead[] = [
    {
      id: 'L001',
      name: 'Rian Pratama',
      parentName: 'Ibu Susanti',
      program: 'Matematika SD',
      grade: 'SD Kelas 4',
      phone: '6281234567890',
      date: '2026-09-02',
      stage: 'Lead Baru'
    },
    {
      id: 'L002',
      name: 'Nabila Putri',
      parentName: 'Bapak Rudi',
      program: 'IPA & Fisika SMP',
      grade: 'SMP Kelas 8',
      phone: '6289876543210',
      date: '2026-09-01',
      stage: 'Konsultasi'
    },
    {
      id: 'L003',
      name: 'Farhan Azhar',
      parentName: 'Ibu Dewi',
      program: 'TPS SNBT 2026',
      grade: 'SMA Kelas 12',
      phone: '6281122334455',
      date: '2026-08-30',
      stage: 'Schedule Trial'
    },
    {
      id: 'L004',
      name: 'Alif Pratama',
      parentName: 'Ibu Rahmawati',
      program: 'Matematika SD',
      grade: 'SD Kelas 5',
      phone: '6285566778899',
      date: '2026-08-25',
      stage: 'Siswa Aktif'
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("cms_leads");
    if (saved) {
      setLeads(JSON.parse(saved));
    } else {
      setLeads(defaultLeads);
      localStorage.setItem("cms_leads", JSON.stringify(defaultLeads));
    }
  }, []);

  const updateStage = (id: string, newStage: Lead['stage']) => {
    const updated = leads.map(l => l.id === id ? { ...l, stage: newStage } : l);
    setLeads(updated);
    localStorage.setItem("cms_leads", JSON.stringify(updated));
  };

  const getWAFollowUpLink = (lead: Lead) => {
    let msg = '';
    if (lead.stage === 'Lead Baru') {
      msg = `Halo *${lead.parentName}* 👋\nTerima kasih telah menghubungi Les Vita! Saya Kak Vita, mau konsultasi les privat/kelompok untuk Ananda *${lead.name}* (${lead.grade})? Silakan beri tahu kami mata pelajaran yang diminati ya! 🙏`;
    } else if (lead.stage === 'Konsultasi') {
      msg = `Halo *${lead.parentName}* 👋\nMelanjutkan pembicaraan kita mengenai les Ananda *${lead.name}*, kami ada slot Trial Class gratis minggu ini. Apakah mau dijadwalkan?`;
    } else if (lead.stage === 'Schedule Trial') {
      msg = `Halo *${lead.parentName}* 👋\nMengingatkan jadwal Trial Class Ananda *${lead.name}* untuk program ${lead.program}. Sampai jumpa besok ya!`;
    } else {
      msg = `Halo *${lead.parentName}* 👋\nTerima kasih sudah menjadi bagian dari keluarga Les Vita!`;
    }
    return `https://wa.me/${lead.phone}?text=${encodeURIComponent(msg)}`;
  };

  const stages: Lead['stage'][] = ['Lead Baru', 'Konsultasi', 'Schedule Trial', 'Siswa Aktif'];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">
            🎯 CRM & Pipeline Orang Tua
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Alur Pendaftaran & Follow-Up Prospek
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Otomatisasi pengolahan prospek dari pertama bertanya hingga menjadi siswa aktif tanpa ada calon murid yang terlewat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              viewMode === 'pipeline'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📊 KanBan Pipeline
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📋 Tampilan Tabel
          </button>
        </div>
      </div>

      {/* KanBan Pipeline View */}
      {viewMode === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map((stg) => {
            const stageLeads = leads.filter(l => l.stage === stg);
            return (
              <div key={stg} className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 flex flex-col gap-3 min-h-[400px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">{stg}</h3>
                  <span className="text-xs bg-white font-extrabold text-indigo-700 px-2 py-0.5 rounded-full shadow-xs">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{lead.name}</h4>
                          <p className="text-xs text-slate-500">{lead.grade} • {lead.program}</p>
                        </div>
                        <span className="text-[10px] text-slate-400">{lead.date}</span>
                      </div>

                      <div className="text-xs text-slate-600">
                        👤 Ortubahan: <span className="font-medium">{lead.parentName}</span>
                      </div>

                      {/* Action & Move Controls */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <a
                          href={getWAFollowUpLink(lead)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <span>💬 Follow-Up WA</span>
                        </a>

                        <div className="flex gap-1 text-[10px]">
                          <select
                            value={lead.stage}
                            onChange={(e) => updateStage(lead.id, e.target.value as Lead['stage'])}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2 rounded-lg font-medium focus:outline-none"
                          >
                            {stages.map((s) => (
                              <option key={s} value={s}>Ke: {s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">Orang Tua</th>
                <th className="py-3.5 px-4">Kelas & Program</th>
                <th className="py-3.5 px-4">Tahap CRM</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{lead.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{lead.parentName} ({lead.phone})</td>
                  <td className="py-3.5 px-4 text-slate-600">{lead.grade} - {lead.program}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={getWAFollowUpLink(lead)}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      💬 WA Follow-up
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
