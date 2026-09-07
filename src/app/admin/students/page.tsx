"use client";

import { useState, useEffect } from "react";
import { mockStudents, StudentStatus, Student } from "@/lib/mockData";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [qrStudent, setQrStudent] = useState<Student | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    grade: "SD Kelas 1",
    program: "Matematika",
    parentName: "",
    phone: "",
    status: "Aktif" as StudentStatus
  });

  useEffect(() => {
    const saved = localStorage.getItem("cms_students");
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      setStudents(mockStudents);
      localStorage.setItem("cms_students", JSON.stringify(mockStudents));
    }
  }, []);

  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem("cms_students", JSON.stringify(newStudents));
  };

  const handleStatusChange = (id: string, newStatus: StudentStatus) => {
    const updated = students.map(s => s.id === id ? { ...s, status: newStatus } : s);
    saveStudents(updated);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      id: Math.random().toString(36).substring(7),
      joinDate: new Date().toISOString().split('T')[0],
      ...formData
    };
    saveStudents([student, ...students]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId) return;
    const updated = students.map(s => s.id === editingStudentId ? { ...s, ...formData } : s);
    saveStudents(updated);
    setIsEditModalOpen(false);
    resetForm();
  };

  const openEditModal = (student: Student) => {
    setEditingStudentId(student.id);
    setFormData({
      name: student.name,
      grade: student.grade,
      program: student.program,
      parentName: student.parentName,
      phone: student.phone,
      status: student.status
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
      const updated = students.filter(s => s.id !== id);
      saveStudents(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      grade: "SD Kelas 1",
      program: "Matematika",
      parentName: "",
      phone: "",
      status: "Aktif"
    });
    setEditingStudentId(null);
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'Aktif':
        return <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-caption font-label-bold flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Aktif</span>;
      case 'Paused':
        return <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-caption font-label-bold flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>Paused</span>;
      case 'Alumni':
        return <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-caption font-label-bold flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-outline"></span>Alumni</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display-lg text-[32px] text-on-surface flex items-center gap-2">
            👨‍👩‍👧‍👦 Keluarga & Data Siswa Les Vita
          </h1>
          <p className="text-on-surface-variant font-body-md mt-1">Kelola data siswa, riwayat belajar, dan status cuti liburan (Paused) tanpa kehilangan riwayat.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="bg-primary text-on-primary font-label-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Sambut Siswa Baru
        </button>
      </div>

      {/* PRD Anti-Holiday Feature Banner */}
      <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏖️</span>
          <div>
            <div className="font-bold text-amber-950">Fitur Anti-Liburan (Seasonal Dip Protection)</div>
            <div>Ubah status siswa menjadi <span className="font-bold bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950">Paused (Cuti Liburan)</span> saat libur sekolah agar data & riwayat belajar tetap tersimpan rapi, dan aktifkan program <span className="font-bold">Holiday Class</span>.</div>
          </div>
        </div>
        <a
          href="/admin/content-center"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shrink-0 text-center shadow-xs transition-colors"
        >
          📢 Broadcast Holiday Class WA
        </a>
      </div>

      <div className="bg-surface rounded-3xl border border-outline-variant/30 shadow-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input type="text" placeholder="Cari nama atau kelas..." className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-on-surface transition-all" />
          </div>
          <button className="text-on-surface-variant hover:text-primary font-label-bold flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-primary-container/30 transition-colors">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Saring Data
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="py-4 px-6 font-label-bold text-on-surface-variant">Nama Siswa</th>
                <th className="py-4 px-6 font-label-bold text-on-surface-variant">Kelas</th>
                <th className="py-4 px-6 font-label-bold text-on-surface-variant">Program</th>
                <th className="py-4 px-6 font-label-bold text-on-surface-variant">Wali Siswa</th>
                <th className="py-4 px-6 font-label-bold text-on-surface-variant">Status</th>
                <th className="py-4 px-6 font-label-bold text-on-surface-variant text-right">Aksi & Edit</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant font-body-md">
                    Belum ada siswa yang terdaftar.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-display-sm shadow-sm group-hover:scale-110 transition-transform">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-label-bold text-on-surface">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-body-md text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">school</span>
                        {student.grade}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-body-md text-on-surface">
                      <span className="bg-surface-container-highest px-3 py-1 rounded-lg text-caption">{student.program}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-body-md text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-secondary">family_restroom</span>
                          {student.parentName}
                        </span>
                        <span className="font-caption text-on-surface-variant flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          {student.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <select 
                          value={student.status} 
                          onChange={(e) => handleStatusChange(student.id, e.target.value as StudentStatus)}
                          className="bg-surface-container-lowest border border-outline-variant/50 text-on-surface font-label-bold text-caption rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary hover:border-primary/50 transition-colors"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Paused">Paused</option>
                          <option value="Alumni">Alumni</option>
                        </select>
                        <button 
                          onClick={() => setQrStudent(student)}
                          className="w-8 h-8 rounded-lg bg-primary-container/50 text-on-primary-container hover:bg-primary-container flex items-center justify-center transition-colors"
                          title="Cetak Kartu QR Presensi"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code</span>
                        </button>
                        <button 
                          onClick={() => openEditModal(student)}
                          className="w-8 h-8 rounded-lg bg-secondary-container/50 text-on-secondary-container hover:bg-secondary-container flex items-center justify-center transition-colors"
                          title="Edit Data"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student.id)}
                          className="w-8 h-8 rounded-lg bg-error-container/50 text-on-error-container hover:bg-error-container flex items-center justify-center transition-colors"
                          title="Hapus Data"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <span className="font-caption text-on-surface-variant">Menampilkan {students.length} anak-anak hebat</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/50 backdrop-blur-sm px-4">
          <div className="bg-surface w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-outline-variant/30">
            <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">{isEditModalOpen ? 'edit_note' : 'person_add'}</span>
                </div>
                <h2 className="font-title-lg text-on-surface">
                  {isEditModalOpen ? 'Perbarui Data Siswa' : 'Sambut Siswa Baru'}
                </h2>
              </div>
              <button 
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); resetForm(); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddStudent} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-bold text-caption text-on-surface-variant">Nama Lengkap Siswa</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-on-surface transition-all"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-bold text-caption text-on-surface-variant">Kelas / Tingkatan</label>
                  <select 
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-on-surface transition-all"
                  >
                    <option value="SD Kelas 1">SD Kelas 1</option>
                    <option value="SD Kelas 2">SD Kelas 2</option>
                    <option value="SD Kelas 6">SD Kelas 6</option>
                    <option value="SMP Kelas 7">SMP Kelas 7</option>
                    <option value="SMP Kelas 9">SMP Kelas 9</option>
                    <option value="SMA Kelas 12">SMA Kelas 12</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-bold text-caption text-on-surface-variant">Program</label>
                  <select 
                    value={formData.program}
                    onChange={(e) => setFormData({...formData, program: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-on-surface transition-all"
                  >
                    <option value="Calistung">Calistung</option>
                    <option value="Semua Mata Pelajaran">Semua Mata Pelajaran</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Sains / IPA">Sains / IPA</option>
                    <option value="SNBT Intensif">SNBT Intensif</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="font-label-bold text-caption text-on-surface-variant">Nama Orang Tua/Wali</label>
                <input 
                  required
                  type="text" 
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-on-surface transition-all"
                  placeholder="Contoh: Bapak Joko"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-bold text-caption text-on-surface-variant">Nomor Telepon/WhatsApp</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-on-surface transition-all"
                  placeholder="0812-xxxx-xxxx"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/30">
                <button 
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); resetForm(); }}
                  className="px-6 py-2.5 rounded-xl font-label-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-label-bold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  {isEditModalOpen ? 'Simpan Perubahan' : 'Tambah Ke Keluarga'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Card Modal */}
      {qrStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/50 backdrop-blur-sm px-4">
          <div className="bg-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-outline-variant/30">
            <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
              <span className="font-label-bold text-caption flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">badge</span>
                KARTU ANGGOTA LES VITA
              </span>
              <button 
                onClick={() => setQrStudent(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center text-center bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary font-display-md text-[24px] flex items-center justify-center shadow-md mb-3">
                {qrStudent.name.charAt(0)}
              </div>
              <h3 className="font-title-lg text-on-surface">{qrStudent.name}</h3>
              <p className="font-body-md text-primary font-label-bold mt-0.5">{qrStudent.grade} • {qrStudent.program}</p>
              <p className="font-caption text-on-surface-variant mt-1">Wali: {qrStudent.parentName} ({qrStudent.phone})</p>
              
              {/* QR Code Container */}
              <div className="my-5 p-4 bg-white rounded-2xl shadow-inner border border-outline-variant/30 flex flex-col items-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(JSON.stringify({id: qrStudent.id, name: qrStudent.name, grade: qrStudent.grade}))}`}
                  alt="QR Code Siswa"
                  className="w-40 h-40 object-contain"
                />
                <span className="font-mono text-caption text-neutral-500 mt-2">ID: {qrStudent.id}</span>
              </div>
              
              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-label-bold text-caption flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  Cetak Kartu
                </button>
                <button 
                  onClick={() => setQrStudent(null)}
                  className="px-4 py-2.5 bg-surface-container-high text-on-surface-variant rounded-xl font-label-bold text-caption hover:bg-surface-container-highest transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
