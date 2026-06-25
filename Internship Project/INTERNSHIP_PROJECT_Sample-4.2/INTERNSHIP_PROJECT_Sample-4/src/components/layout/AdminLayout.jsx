import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useApp } from '../../context/AppContext';

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const configs = {
    success: { icon: CheckCircle, bg: 'bg-emerald-50/90', border: 'border-emerald-200', text: 'text-emerald-800', icon_color: 'text-emerald-600' },
    error: { icon: AlertCircle, bg: 'bg-rose-50/90', border: 'border-rose-200', text: 'text-rose-800', icon_color: 'text-rose-600' },
    info: { icon: Info, bg: 'bg-blue-50/90', border: 'border-blue-200', text: 'text-blue-800', icon_color: 'text-blue-600' },
  };
  const c = configs[toast.type] || configs.success;
  const Icon = c.icon;
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border ${c.bg} ${c.border} backdrop-blur-md shadow-2xl animate-slide-up max-w-sm`}>
      <Icon className={`w-5 h-5 ${c.icon_color} flex-shrink-0`} />
      <p className={`text-sm ${c.text} flex-1`}>{toast.message}</p>
      <button onClick={onClose} className={`${c.icon_color} hover:text-surface-900 transition-colors`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function AdminLayout() {
  const { toast, showToast, isAuthenticated } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
      forceUpdate(n => n + 1);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 w-64 flex-shrink-0 animate-slide-in-right">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <TopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto relative scroll-smooth">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-full page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toast */}
      <Toast toast={toast} onClose={() => showToast(null)} />
    </div>
  );
}
