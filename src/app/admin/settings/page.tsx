"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: string;
}

const ROLE_LABEL: Record<string, { label: string; color: string }> = {
  MASTER_ADMIN: { label: "Master Admin", color: "bg-orange-100 text-orange-700" },
  TUTOR:        { label: "Guru / Tutor",  color: "bg-blue-100 text-blue-700" },
  STUDENT:      { label: "Siswa",          color: "bg-emerald-100 text-emerald-700" },
};

export default function SettingsPage() {
  const { user: currentUser } = useAuth();

  // ── Daftar akun ──
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Form edit ──
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPass, setEditPass] = useState("");
  const [editConfirm, setEditConfirm] = useState("");
  const [editMsg, setEditMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Form tambah akun ──
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPass, setAddPass] = useState("");
  const [addRole, setAddRole] = useState("TUTOR");
  const [addMsg, setAddMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [adding, setAdding] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const startEdit = (u: UserAccount) => {
    setEditId(u.id);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPass("");
    setEditConfirm("");
    setEditMsg(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditMsg(null);
  };

  const handleSave = async () => {
    if (editPass && editPass !== editConfirm) {
      setEditMsg({ type: "err", text: "Password baru tidak cocok!" });
      return;
    }
    setSaving(true);
    const body: any = { name: editName, email: editEmail };
    if (editPass) body.password = editPass;
    const res = await fetch(`/api/users/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setEditMsg({ type: "ok", text: "✅ Berhasil disimpan!" });
      fetchUsers();
      setTimeout(() => setEditId(null), 1200);
    } else {
      setEditMsg({ type: "err", text: data.error || "Gagal menyimpan" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus akun "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleAdd = async () => {
    if (!addName || !addEmail || !addPass) {
      setAddMsg({ type: "err", text: "Semua field wajib diisi!" });
      return;
    }
    setAdding(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: addName, email: addEmail, password: addPass, role: addRole }),
    });
    const data = await res.json();
    setAdding(false);
    if (res.ok) {
      setAddMsg({ type: "ok", text: "✅ Akun berhasil ditambahkan!" });
      setAddName(""); setAddEmail(""); setAddPass(""); setAddRole("TUTOR");
      fetchUsers();
      setTimeout(() => { setShowAdd(false); setAddMsg(null); }, 1200);
    } else {
      setAddMsg({ type: "err", text: data.error || "Gagal menambah akun" });
    }
  };

  const adminGuruUsers = users.filter(u => u.role !== "STUDENT");
  const siswaUsers = users.filter(u => u.role === "STUDENT");

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">⚙️ Pengaturan Akun</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola username & password untuk Admin, Guru, dan Siswa</p>
        </div>
        <button
          onClick={() => { setShowAdd(v => !v); setAddMsg(null); }}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow transition-colors flex items-center gap-2"
        >
          ＋ Tambah Akun Baru
        </button>
      </div>

      {/* Form Tambah Akun */}
      {showAdd && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-700">Buat Akun Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
              <input value={addName} onChange={e => setAddName(e.target.value)}
                placeholder="contoh: Kak Rina" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email (Username)</label>
              <input value={addEmail} onChange={e => setAddEmail(e.target.value)} type="email"
                placeholder="contoh: rina@lesvita.com" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <input value={addPass} onChange={e => setAddPass(e.target.value)} type="password"
                placeholder="Minimal 4 karakter" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role / Jabatan</label>
              <select value={addRole} onChange={e => setAddRole(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="TUTOR">Guru / Tutor</option>
                <option value="MASTER_ADMIN">Master Admin</option>
                <option value="STUDENT">Siswa</option>
              </select>
            </div>
          </div>
          {addMsg && (
            <p className={`text-sm font-semibold ${addMsg.type === "ok" ? "text-emerald-600" : "text-rose-600"}`}>{addMsg.text}</p>
          )}
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl">Batal</button>
            <button onClick={handleAdd} disabled={adding}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl disabled:opacity-60">
              {adding ? "Menyimpan..." : "Buat Akun"}
            </button>
          </div>
        </div>
      )}

      {/* Tabel Admin & Guru */}
      <AccountTable
        title="👩‍🏫 Akun Admin & Guru"
        users={adminGuruUsers}
        loading={loading}
        editId={editId}
        editName={editName} setEditName={setEditName}
        editEmail={editEmail} setEditEmail={setEditEmail}
        editPass={editPass} setEditPass={setEditPass}
        editConfirm={editConfirm} setEditConfirm={setEditConfirm}
        editMsg={editMsg}
        saving={saving}
        currentUserId={currentUser?.id}
        onEdit={startEdit}
        onCancel={cancelEdit}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* Tabel Siswa */}
      <AccountTable
        title="🧑‍🎓 Akun Login Siswa"
        users={siswaUsers}
        loading={loading}
        editId={editId}
        editName={editName} setEditName={setEditName}
        editEmail={editEmail} setEditEmail={setEditEmail}
        editPass={editPass} setEditPass={setEditPass}
        editConfirm={editConfirm} setEditConfirm={setEditConfirm}
        editMsg={editMsg}
        saving={saving}
        currentUserId={currentUser?.id}
        onEdit={startEdit}
        onCancel={cancelEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        emptyNote="Belum ada akun login siswa. Tambahkan akun dengan role 'Siswa' menggunakan tombol di atas."
      />
    </div>
  );
}

/* ─── Sub-komponen Tabel ─── */
function AccountTable({
  title, users, loading, editId, editName, setEditName, editEmail, setEditEmail,
  editPass, setEditPass, editConfirm, setEditConfirm, editMsg, saving, currentUserId,
  onEdit, onCancel, onSave, onDelete, emptyNote
}: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <h2 className="font-bold text-slate-700">{title}</h2>
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-400 text-sm">Memuat data...</div>
      ) : users.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm px-6">{emptyNote || "Belum ada akun."}</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {users.map((u: UserAccount) => (
            <div key={u.id}>
              {/* Baris normal */}
              {editId !== u.id ? (
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-extrabold text-sm flex items-center justify-center">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{u.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_LABEL[u.role]?.color || "bg-slate-100 text-slate-600"}`}>
                      {ROLE_LABEL[u.role]?.label || u.role}
                    </span>
                    <button onClick={() => onEdit(u)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors">
                      ✏️ Edit
                    </button>
                    {u.id !== currentUserId && (
                      <button onClick={() => onDelete(u.id, u.name)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors">
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Form Edit Inline */
                <div className="px-6 py-5 bg-orange-50/40 border-l-4 border-orange-400 flex flex-col gap-4">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Editing: {u.name}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Nama</label>
                      <input value={editName} onChange={e => setEditName(e.target.value)}
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Email (Username Login)</label>
                      <input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email"
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Password Baru <span className="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span></label>
                      <input value={editPass} onChange={e => setEditPass(e.target.value)} type="password"
                        placeholder="Password baru..." className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Konfirmasi Password Baru</label>
                      <input value={editConfirm} onChange={e => setEditConfirm(e.target.value)} type="password"
                        placeholder="Ulangi password baru..." className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
                    </div>
                  </div>
                  {editMsg && (
                    <p className={`text-sm font-semibold ${editMsg.type === "ok" ? "text-emerald-600" : "text-rose-600"}`}>{editMsg.text}</p>
                  )}
                  <div className="flex gap-2 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl">Batal</button>
                    <button onClick={onSave} disabled={saving}
                      className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl disabled:opacity-60">
                      {saving ? "Menyimpan..." : "💾 Simpan"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
