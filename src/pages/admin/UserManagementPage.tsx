import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Shield, 
  Edit, 
  UserCheck, 
  Filter, 
  UserX,
  Mail,
  Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '../../lib/utils';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'contributor' | 'user';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended';
  contributionsCount: number;
  joinedAt: string;
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    fullName: 'Mustofa (Administrator)',
    email: 'cholilelgara001@gmail.com',
    role: 'super_admin',
    status: 'active',
    contributionsCount: 142,
    joinedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr-2',
    fullName: 'Wildan Mubarok',
    email: 'willnode@wellosoft.net',
    role: 'admin',
    status: 'active',
    contributionsCount: 88,
    joinedAt: '2026-02-10T10:30:00Z',
  },
  {
    id: 'usr-3',
    fullName: 'Dr. R. Achmad Syafiuddin (Budayawan Madura)',
    email: 'achmad.syafiuddin@madura.ac.id',
    role: 'editor',
    status: 'active',
    contributionsCount: 56,
    joinedAt: '2026-03-01T14:20:00Z',
  },
  {
    id: 'usr-4',
    fullName: 'Nurul Hidayati',
    email: 'nurul.hidayati@gmail.com',
    role: 'contributor',
    status: 'active',
    contributionsCount: 23,
    joinedAt: '2026-05-18T11:15:00Z',
  },
  {
    id: 'usr-5',
    fullName: 'Bambang Soepomo',
    email: 'bambang.s@yahoo.com',
    role: 'user',
    status: 'active',
    contributionsCount: 4,
    joinedAt: '2026-08-22T09:40:00Z',
  },
];

export const UserManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleOpenEditRole = (user: UserAccount) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, role: selectedRole } : u))
    );
    showToast(`Hak akses untuk ${editingUser.fullName} diperbarui menjadi ${selectedRole}`);
    setEditingUser(null);
  };

  const handleToggleStatus = (user: UserAccount) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    showToast(`Status akun ${user.fullName} diubah menjadi ${newStatus}`);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy text-gold border border-navy-700">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Super Admin</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest/15 text-forest border border-forest/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <span>Editor Bahasa</span>
          </span>
        );
      case 'contributor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span>Kontributor</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
            <span>Pengguna</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            Manajemen Pengguna & Hak Akses
          </h1>
          <p className="text-xs text-madura-muted">
            Kelola role, izin editorial, dan status akun pengguna (Prinsip Least Privilege).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-madura-border text-xs font-semibold text-navy">
            Total Terdaftar: <strong className="text-forest">{users.length}</strong> akun
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-madura-border shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-madura-border bg-ivory text-xs text-navy focus:outline-none focus:ring-1 focus:ring-navy"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="font-semibold text-navy">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-madura-border bg-ivory text-xs text-navy focus:outline-none"
          >
            <option value="all">Semua Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor Bahasa</option>
            <option value="contributor">Kontributor</option>
            <option value="user">Pengguna Umum</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-madura-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-madura-border text-navy font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Pengguna</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role / Hak Akses</th>
                <th className="py-3.5 px-4">Kontribusi</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Bergabung</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-madura-border/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-ivory-warm/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-navy text-sm">
                    {user.fullName}
                  </td>
                  <td className="py-3.5 px-4 text-madura-muted font-mono">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3.5 px-4 font-semibold text-navy">
                    {user.contributionsCount} kata
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold capitalize ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {user.status === 'active' ? 'Aktif' : 'Ditangguhkan'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 font-mono">
                    {formatDate(user.joinedAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditRole(user)}
                        className="p-1.5 rounded-lg border border-madura-border hover:bg-stone-100 text-stone-600 transition-colors"
                        title="Ubah Role"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          user.status === 'active'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.status === 'active' ? 'Tangguhkan Akun' : 'Aktifkan Akun'}
                      >
                        {user.status === 'active' ? (
                          <UserX className="w-3.5 h-3.5" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Edit Modal */}
      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title={`Ubah Role: ${editingUser?.fullName}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-madura-muted">
            Tentukan hak akses untuk pengguna <strong>{editingUser?.email}</strong>.
          </p>

          <div className="space-y-2">
            {[
              {
                role: 'super_admin',
                label: 'Super Admin',
                desc: 'Akses penuh ke semua konfigurasi, database, manajemen pengguna, dan audit log.',
              },
              {
                role: 'admin',
                label: 'Admin',
                desc: 'Akses CRUD kosakata, import/export data, dan moderasi usulan kata.',
              },
              {
                role: 'editor',
                label: 'Editor Bahasa',
                desc: 'Akses memverifikasi dan menyetujui usulan kosakata baru dari masyarakat.',
              },
              {
                role: 'contributor',
                label: 'Kontributor Terdaftar',
                desc: 'Dapat mengusulkan kata dengan prioritas verifikasi lebih cepat.',
              },
              {
                role: 'user',
                label: 'Pengguna Umum',
                desc: 'Akses publik untuk mencari kata, menyimpan favorit, dan mengusulkan kata.',
              },
            ].map((opt) => (
              <label
                key={opt.role}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRole === opt.role
                    ? 'border-navy bg-navy/5 font-semibold text-navy'
                    : 'border-madura-border bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="user-role"
                  value={opt.role}
                  checked={selectedRole === opt.role}
                  onChange={() => setSelectedRole(opt.role as UserRole)}
                  className="mt-0.5 text-navy focus:ring-navy"
                />
                <div>
                  <div className="font-bold text-navy">{opt.label}</div>
                  <div className="text-[11px] text-madura-muted font-normal mt-0.5">
                    {opt.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-madura-border">
            <Button variant="outline" size="sm" onClick={() => setEditingUser(null)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveRole}>
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
