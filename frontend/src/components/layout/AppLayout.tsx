import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  UsersRound, LayoutGrid, UserPlus, Settings, LogOut, Menu, X,
} from 'lucide-react';

const navMain = [
  { label: 'Directory', href: '/', icon: LayoutGrid },
  { label: 'Employees', href: '/employees', icon: UsersRound },
];

const navMgmt = [
  { label: 'Add Employee', href: '/addemployee', icon: UserPlus },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const NavItem = ({ item }: { item: typeof navMain[0] }) => {
    const active = router.pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'text-white active-nav'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
        onClick={() => setOpen(false)}
      >
        <Icon className="w-4 h-4" />
        <span>{item.label}</span>
      </Link>
    );
  };

  const sidebar = (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <UsersRound className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Crewmark</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">Main Menu</div>
        {navMain.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mt-8 mb-2">Management</div>
        {navMgmt.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            className="w-8 h-8 rounded-full bg-slate-700"
            alt="Admin"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Alex Sterling</p>
            <p className="text-[10px] text-slate-500 truncate">HR Admin</p>
          </div>
          <button type="button" className="text-slate-500 hover:text-white">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 h-screen flex-col flex-shrink-0 text-slate-300" style={{ background: '#0f172a' }}>
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-64 h-screen flex flex-col text-slate-300 z-50" style={{ background: '#0f172a' }}>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-slate-200">
          <button onClick={() => setOpen(true)} className="p-2">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-2 font-bold text-slate-900">Crewmark</span>
        </div>
        {children}
      </main>
    </div>
  );
}