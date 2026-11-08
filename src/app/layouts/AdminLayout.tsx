import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookA, 
  UploadCloud, 
  MessageSquareCheck, 
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Kelola Kosakata', href: '/admin/kamus', icon: BookA },
    { label: 'Moderasi Kontribusi', href: '/admin/kontribusi', icon: MessageSquareCheck },
    { label: 'Bulk Import / Export', href: '/admin/import', icon: UploadCloud },
    { label: 'Kelola Artikel', href: '/admin/artikel', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navy text-ivory flex-shrink-0 flex flex-col justify-between border-r border-navy-900">
        <div>
          <div className="p-6 border-b border-navy-700/60">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold text-navy font-serif font-black flex items-center justify-center text-sm">
                KM
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-white tracking-tight leading-none">Admin Panel</h2>
                <span className="text-[10px] text-gold-400 font-mono">Kamus Madura Digital</span>
              </div>
            </Link>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gold text-navy-950 font-bold shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-navy-700/60">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
