import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useApp } from '../../context/AppContext';

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const configs = {
    success: { icon: CheckCircle, bg: 'bg-emerald-900/90', border: 'border-emerald-600/60', text: 'text-emerald-200', icon_color: 'text-emerald-400' },
    error: { icon: AlertCircle, bg: 'bg-rose-900/90', border: 'border-rose-600/60', text: 'text-rose-200', icon_color: 'text-rose-400' },
    info: { icon: Info, bg: 'bg-blue-900/90', border: 'border-blue-600/60', text: 'text-blue-200', icon_color: 'text-blue-400' },
  };
  const c = configs[toast.type] || configs.success;
  const Icon = c.icon;
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border ${c.bg} ${c.border} backdrop-blur-md shadow-2xl animate-slide-up max-w-sm`}>
      <Icon className={`w-5 h-5 ${c.icon_color} flex-shrink-0`} />
      <p className={`text-sm ${c.text} flex-1`}>{toast.message}</p>
      <button onClick={onClose} className={`${c.icon_color} hover:text-white transition-colors`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function PageWrapper({ children }) {
  const { toast, sidebarCollapsed, setSidebar } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
      forceUpdate(n => n + 1);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const { showToast } = useApp();

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-surface-950 to-surface-900">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-full page-enter">
            {children}
          </div>
        </main>
      </div>

      {/* Toast */}
      <Toast toast={toast} onClose={() => showToast(null)} />
    </div>
  );
}
