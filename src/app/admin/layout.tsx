"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;

  const isMasterAdmin = user.role === "MASTER_ADMIN";
  const isStudent = user.role === "STUDENT";

  const menuItems = [
    { name: 'Dashboard Utama', href: '/admin', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { name: 'Manajemen Siswa', href: '/admin/siswa', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { name: 'Keuangan & SPP', href: '/admin/keuangan', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { name: 'Live Report', href: '/admin/live-report', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'Manajemen Tugas', href: '/admin/homework', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    { name: 'Presensi Siswa', href: '/admin/attendance', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { name: 'Reminder WA', href: '/admin/reminder', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
    // Menu khusus Master Admin (kosong karena dihapus sesuai request)
    ...(isMasterAdmin ? [
      
    ] : []),
  ];

  const studentMenuItems = [
    { name: 'Beranda Siswa', href: '/admin', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { name: 'Tugas & PR', href: '/admin/student/tugas', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    { name: 'Rapor & Nilai', href: '/admin/student/rapor', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'Tagihan SPP', href: '/admin/student/spp', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  let visibleMenuItems = menuItems;
  if (isStudent) {
    visibleMenuItems = studentMenuItems;
  } else if (!isMasterAdmin) {
    visibleMenuItems = menuItems; // No filter needed anymore since those menus are removed
  }

  // Theme Helpers
  const sidebarBg = isStudent ? 'bg-indigo-950' : isMasterAdmin ? 'bg-[#0B2028]' : 'bg-slate-900';
  const logoRing = isStudent ? 'shadow-purple-500/30' : 'shadow-sky-500/30';
  const logoTextHover = isStudent ? 'group-hover:text-purple-300' : 'group-hover:text-sky-200';
  
  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      {/* Dynamic Ambient Background based on Role */}
      {isStudent ? (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </>
      ) : isMasterAdmin ? (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#0EA5E9] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-[#10B981] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className={`h-full flex flex-col ${sidebarBg} text-white border-r border-white/10 shadow-2xl relative overflow-hidden`}>
          
          {/* Abstract Background Shapes for Sidebar */}
          <div className={`absolute top-0 left-0 w-full h-64 bg-gradient-to-b ${isStudent ? 'from-purple-600/30' : isMasterAdmin ? 'from-[#0369A1]/30' : 'from-emerald-500/30'} to-transparent pointer-events-none`}></div>
          <div className={`absolute -top-10 -right-10 w-40 h-40 ${isStudent ? 'bg-purple-500/20' : isMasterAdmin ? 'bg-[#0EA5E9]/20' : 'bg-emerald-500/20'} rounded-full blur-3xl`}></div>

          {/* Sidebar Header */}
          <div className="h-24 flex items-center px-6 border-b border-white/10 relative z-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg ${logoRing} group-hover:scale-105 transition-transform overflow-hidden shrink-0 p-1`}>
                <img src="/logo.jpg" alt="Les Vita Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold tracking-tight text-white ${logoTextHover} transition-colors leading-none`}>
                  Les Vita
                </span>
                <span className="text-[9px] text-sky-200/90 italic tracking-wide mt-1.5 font-serif">
                  Scientia Vita Est
                </span>
              </div>
            </Link>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 relative z-10 scrollbar-hide">
            <div className="px-4 py-3 mb-2">
              <p className="text-xs font-bold text-sky-200/50 uppercase tracking-widest">Menu Utama</p>
            </div>
            {visibleMenuItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
              
              // Determine active styles based on role
              let activeBg = 'bg-gradient-to-r from-emerald-500/20 to-transparent shadow-[inset_4px_0_0_0_#10B981]';
              let activeText = 'text-emerald-400';
              let hoverText = 'group-hover:text-emerald-300';
              
              if (isStudent) {
                activeBg = 'bg-gradient-to-r from-purple-500/20 to-transparent shadow-[inset_4px_0_0_0_#A855F7]';
                activeText = 'text-purple-400';
                hoverText = 'group-hover:text-purple-300';
              } else if (isMasterAdmin) {
                activeBg = 'bg-gradient-to-r from-sky-500/20 to-transparent shadow-[inset_4px_0_0_0_#0EA5E9]';
                activeText = 'text-sky-400';
                hoverText = 'group-hover:text-sky-300';
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? `${activeBg} text-white`
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`transition-transform duration-300 ${isActive ? `scale-110 ${activeText}` : `group-hover:scale-110 ${hoverText}`}`}>
                    {item.icon}
                  </span>
                  <span className={`font-semibold tracking-wide ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-6 border-t border-white/10 bg-black/20 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${isStudent ? 'from-purple-400 to-purple-600' : isMasterAdmin ? 'from-[#0EA5E9] to-[#0284C7]' : 'from-emerald-400 to-emerald-600'} p-0.5 shadow-lg`}>
                <div className={`w-full h-full ${sidebarBg} rounded-[14px] flex items-center justify-center overflow-hidden`}>
                  <div className={`font-bold ${isStudent ? 'text-purple-400' : isMasterAdmin ? 'text-sky-400' : 'text-emerald-400'}`}>
                    {user.name.substring(0,2).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="mt-4 w-full py-2.5 px-4 bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="hidden sm:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Cari kelas, materi, dll..." 
                  className="pl-9 pr-4 py-2 w-64 bg-slate-100/50 border-transparent rounded-lg text-sm focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-glow)] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block mr-2">
              <p className="text-xs font-bold text-slate-700">{user.name}</p>
              <p className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-wider">{user.role}</p>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
