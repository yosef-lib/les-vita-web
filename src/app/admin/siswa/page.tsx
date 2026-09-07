"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SiswaPage() {
  const { user } = useAuth();
  const [studentList, setStudentList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const [newStudent, setNewStudent] = useState({
    name: "", grade: "", program: "", parentName: "", parentPhone: "", status: "Aktif", learningMode: "OFFLINE", subjectIds: [] as string[]
  });

  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        // Add initials for UI
        const withInitials = data.map((s: any) => ({
          ...s,
          initial: s.name.charAt(0).toUpperCase(),
          parentName: s.parentName || "Ibu/Bapak", 
          program: s.school || "Umum",
          subjectIds: s.subjects?.map((subj: any) => subj.id) || []
        }));
        setStudentList(withInitials);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      if (res.ok) {
        const data = await res.json();
        setAvailableSubjects(data.map((subj: any) => ({ id: subj.id, label: subj.name })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const handleEditClick = (s: any) => {
    setEditingStudent({ ...s });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data siswa ${name}?`)) {
      try {
        await fetch(`/api/students/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubjectToggle = (subjId: string, isEditing: boolean) => {
    if (isEditing) {
      setEditingStudent((prev: any) => {
        const ids = prev.subjectIds || [];
        return { ...prev, subjectIds: ids.includes(subjId) ? ids.filter((i: string) => i !== subjId) : [...ids, subjId] };
      });
    } else {
      setNewStudent((prev: any) => {
        const ids = prev.subjectIds || [];
        return { ...prev, subjectIds: ids.includes(subjId) ? ids.filter((i: string) => i !== subjId) : [...ids, subjId] };
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nis: editingStudent.nis,
          name: editingStudent.name,
          grade: editingStudent.grade,
          school: editingStudent.program, 
          phone: editingStudent.parentPhone || editingStudent.phone,
          status: editingStudent.status,
          learningMode: editingStudent.learningMode,
          subjectIds: editingStudent.subjectIds
        })
      });
      fetchStudents();
      setIsEditModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name) return;
    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nis: "NIS" + Math.floor(Math.random() * 1000000).toString(),
          name: newStudent.name,
          grade: newStudent.grade,
          school: newStudent.program, 
          phone: newStudent.parentPhone,
          status: newStudent.status,
          learningMode: newStudent.learningMode,
          subjectIds: newStudent.subjectIds
        })
      });
      fetchStudents();
      setIsAddModalOpen(false);
      setNewStudent({ name: "", grade: "", program: "", parentName: "", parentPhone: "", status: "Aktif", learningMode: "OFFLINE", subjectIds: [] });
    } catch (e) {
      console.error(e);
    }
  };

  const exportToCSV = () => {
    // Generate CSV content
    const headers = ['Nama Siswa', 'Kelas', 'Tipe Les', 'Program', 'Nama Wali', 'No HP Wali', 'Status'];
    const csvRows = [headers.join(',')];

    studentList.forEach(student => {
      const row = [
        `"${student.name}"`,
        `"${student.grade}"`,
        `"${student.learningMode || 'OFFLINE'}"`,
        `"${student.program || ''}"`,
        `"${student.parentName || ''}"`,
        `"${student.parentPhone || ''}"`,
        `"${student.status}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Siswa_Les_Vita_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  if (user?.role !== "MASTER_ADMIN") {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-slate-500 mt-2">Hanya Master Admin yang dapat mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
            <svg className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Keluarga & Data Siswa Les Vita
          </h1>
          <p className="text-sm text-slate-500 mt-1">Kelola data siswa, riwayat belajar, dan status cuti liburan (Paused).</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Sambut Siswa Baru
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col relative z-10">
        
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <input 
              type="text" 
              placeholder="Cari nama atau kelas..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all outline-none"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-800">Nama Siswa</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-800">Kelas & Tipe</th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[11px] text-slate-500">Program & Mapel</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-800">Wali Siswa</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-800">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-800">Aksi & Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <svg className="animate-spin h-6 w-6 text-sky-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Memuat data siswa...
                  </td>
                </tr>
              ) : studentList.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {student.initial}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-[var(--primary)] transition-colors">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {student.grade}
                    <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{student.learningMode || 'OFFLINE'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 font-medium">
                      {student.program}
                    </div>
                    {student.subjectIds && student.subjectIds.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {student.subjectIds.map((id: string) => {
                          const sLabel = availableSubjects.find(s => s.id === id)?.label.split(" ")[0];
                          return (
                            <span key={id} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                              {sLabel}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        {student.parentName}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        {student.parentPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${student.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-3">
                      <button onClick={() => handleEditClick(student)} className="text-slate-400 hover:text-sky-600 transition-colors" title="Edit Data & Kelola E-Learning">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteClick(student.id, student.name)} className="text-slate-400 hover:text-red-500 transition-colors" title="Hapus Data">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Edit Siswa</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Nama Siswa</label>
                  <input type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Kelas</label>
                  <input type="text" value={editingStudent.grade} onChange={e => setEditingStudent({...editingStudent, grade: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Nama Wali</label>
                  <input type="text" value={editingStudent.parentName} onChange={e => setEditingStudent({...editingStudent, parentName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">No HP Wali</label>
                  <input type="text" value={editingStudent.parentPhone} onChange={e => setEditingStudent({...editingStudent, parentPhone: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-slate-500">Program / Paket</label>
                  <input type="text" value={editingStudent.program} onChange={e => setEditingStudent({...editingStudent, program: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-slate-500">Status & Tipe Les</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={editingStudent.status} onChange={e => setEditingStudent({...editingStudent, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500">
                      <option value="Aktif">Aktif</option>
                      <option value="Paused">Paused (Cuti)</option>
                    </select>
                    <select value={editingStudent.learningMode || "OFFLINE"} onChange={e => setEditingStudent({...editingStudent, learningMode: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500">
                      <option value="OFFLINE">Offline (Reguler)</option>
                      <option value="ONLINE">Online (Full)</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-sm font-bold text-slate-700">Akses E-Learning / Mata Pelajaran</label>
                <div className="space-y-2 mt-2">
                  {availableSubjects.map(subj => {
                    const isChecked = editingStudent.subjectIds?.includes(subj.id);
                    return (
                      <label key={subj.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-sky-50 border-sky-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 bg-white text-transparent'}`}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className={`text-sm font-semibold ${isChecked ? 'text-sky-900' : 'text-slate-600'}`}>{subj.label}</span>
                        <input type="checkbox" className="sr-only" checked={isChecked} onChange={() => handleSubjectToggle(subj.id, true)} />
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleSaveEdit} className="px-5 py-2 text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Sambut Siswa Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Nama Siswa</label>
                  <input type="text" placeholder="Cth: Budi Santoso" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Kelas</label>
                  <input type="text" placeholder="Cth: 3 SD" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Nama Wali</label>
                  <input type="text" placeholder="Nama Orang Tua/Wali" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">No HP Wali</label>
                  <input type="text" placeholder="0812..." value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-slate-500">Program / Paket & Tipe Les</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Cth: SD (Semua Mapel)" value={newStudent.program} onChange={e => setNewStudent({...newStudent, program: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[var(--primary)]" />
                    <select value={newStudent.learningMode} onChange={e => setNewStudent({...newStudent, learningMode: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[var(--primary)]">
                      <option value="OFFLINE">Offline (Reguler)</option>
                      <option value="ONLINE">Online (Full)</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-sm font-bold text-slate-700">Akses E-Learning (Opsional)</label>
                <div className="space-y-2 mt-2">
                  {availableSubjects.map(subj => {
                    const isChecked = newStudent.subjectIds?.includes(subj.id);
                    return (
                      <label key={subj.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-slate-300 bg-white text-transparent'}`}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className={`text-sm font-semibold ${isChecked ? 'text-[var(--primary-dark)]' : 'text-slate-600'}`}>{subj.label}</span>
                        <input type="checkbox" className="sr-only" checked={isChecked} onChange={() => handleSubjectToggle(subj.id, false)} />
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleAddStudent} className="px-5 py-2 text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded-lg shadow-sm transition-colors">
                Tambahkan Siswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
