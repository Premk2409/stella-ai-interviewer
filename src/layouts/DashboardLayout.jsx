import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  UserCheck, 
  Video, 
  FileBarChart, 
  Menu, 
  X, 
  Sparkles, 
  Bell, 
  Search, 
  User,
  Plus
} from 'lucide-react';
import { PATHS } from '../utils/paths';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: PATHS.HOME, icon: Home },
    { name: 'Create Interview', href: PATHS.CREATE, icon: Plus },
    { name: 'Scheduled Interviews', href: PATHS.SCHEDULED, icon: Video },
    { name: 'Feedback Report', href: PATHS.REPORT, icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to={PATHS.HOME} className="flex items-center gap-2">
              <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="text-white" size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                Stella AI
              </span>
            </Link>
          </div>

          {/* Search bar & utility icons */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-400 text-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Search size={16} className="mr-2" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-48 text-xs"
              />
            </div>

            <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition">
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
            </button>

            <div className="h-8 w-px bg-slate-800"></div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-1">
              <div className="h-8 w-8 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400">
                <User size={16} />
              </div>
              <span className="hidden md:inline text-xs font-semibold text-slate-300">Admin Portal</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Navigation */}
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm md:hidden"
          ></div>
        )}

        <aside className={`
          fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800
          flex flex-col justify-between py-6 px-4 shrink-0 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="space-y-6">
            <div className="px-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3.5">
                Recruitment Hub
              </p>
              <Link
                to={PATHS.SETUP}
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98]"
              >
                <Plus size={14} />
                <span>New Interview</span>
              </Link>
            </div>
            
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick System Info footer in Sidebar */}
          <div className="bg-slate-850 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[11px] font-semibold text-slate-400">Stella Engine Online</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Vite Frontend Mock Engine active. No backend connected.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
