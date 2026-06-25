import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useApp } from '../../context/AppContext';

/* ─────────────────────────────────────────────
   Toast Notification
───────────────────────────────────────────── */
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const configs = {
    success: { icon: CheckCircle, bg: 'bg-emerald-50/90', border: 'border-emerald-200', text: 'text-emerald-800', icon_color: 'text-emerald-600' },
    error:   { icon: AlertCircle, bg: 'bg-rose-50/90',    border: 'border-rose-200',    text: 'text-rose-800',    icon_color: 'text-rose-600'    },
    info:    { icon: Info,        bg: 'bg-blue-50/90',    border: 'border-blue-200',    text: 'text-blue-800',    icon_color: 'text-blue-600'    },
  };
  const c    = configs[toast.type] || configs.success;
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

/* ─────────────────────────────────────────────
   Paper-Plane Intro Animation Overlay
   Shows once per browser session for customer logins.
   Plane flies left → right, then a welcome card
   fades in before the overlay unmounts.
───────────────────────────────────────────── */
function PaperPlaneIntro({ userName, onDone }) {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Show the welcome card once the plane has crossed (1.5 s)
    const cardTimer = setTimeout(() => setShowCard(true), 1500);
    // Unmount the overlay after the full animation (2.6 s)
    const doneTimer = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(cardTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 60% 40%, #ffffff 0%, #f1f5f9 100%)',
      }}
    >
      {/* ── Keyframes ── */}
      <style>{`
        /* Diagonal flight with bobbing */
        @keyframes pp-fly {
          0%   { transform: translateX(-160px) translateY(38vh) rotate(-35deg); opacity: 0; }
          15%  { opacity: 1; transform: translateX(-10vw) translateY(18vh) rotate(-28deg); }
          50%  { transform: translateX(45vw) translateY(-5vh) rotate(-38deg); }
          85%  { opacity: 1; transform: translateX(100vw) translateY(-28vh) rotate(-30deg); }
          100% { transform: translateX(120vw) translateY(-42vh) rotate(-35deg); opacity: 0.9; }
        }
        @keyframes pp-card-in {
          from { opacity: 0; transform: translateY(30px) scale(0.88); }
          to   { opacity: 1; transform: translateY(0px)  scale(1);    }
        }
        @keyframes pp-pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.5; }
          50%       { transform: translate(-50%, -50%) scale(1.1);  opacity: 1;   }
        }
        @keyframes pp-twinkle {
          from { opacity: 0.1; transform: scale(0.7); }
          to   { opacity: 0.8; transform: scale(1.4); }
        }
        @keyframes pp-wind {
          0%   { transform: translate(100vw, -100vh) rotate(-35deg) scaleX(1); opacity: 0; }
          20%  { opacity: 0.6; }
          100% { transform: translate(-20vw, 20vh) rotate(-35deg) scaleX(3); opacity: 0; }
        }
        @keyframes pp-bar {
          from { width: 0;     opacity: 0; }
          to   { width: 140px; opacity: 1; }
        }
        @keyframes pp-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
      `}</style>

      {/* Central radial glows */}
      <div style={{
        position: 'absolute', width: '700px', height: '700px', borderRadius: '50%',
        top: '50%', left: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
        animation: 'pp-pulse-glow 2.5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '380px', height: '380px', borderRadius: '50%',
        top: '20%', left: '10%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
        animation: 'pp-pulse-glow 3.5s ease-in-out 0.7s infinite',
        pointerEvents: 'none',
      }} />

      {/* Twinkling star particles */}
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width:  `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
          borderRadius: '50%',
          top:  `${8  + ((i * 31) % 84)}%`,
          left: `${3  + ((i * 47) % 94)}%`,
          background:
            i % 5 === 0 ? 'rgba(56,189,248,0.6)'
            : i % 5 === 1 ? 'rgba(14,165,233,0.5)'
            : i % 5 === 2 ? 'rgba(125,211,252,0.6)'
            : i % 5 === 3 ? 'rgba(251,191,36,0.3)'
            : 'rgba(15,23,42,0.15)',
          animation: `pp-twinkle ${1.1 + (i % 4) * 0.45}s ease-in-out ${(i * 0.09) % 1.3}s infinite alternate`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Wind streaks for speed effect */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`wind-${i}`}
          style={{
            position: 'absolute',
            width: `${40 + (i * 25) % 80}px`,
            height: '2px',
            borderRadius: '2px',
            /* Start them randomly across the screen */
            top: `${10 + (i * 27) % 80}%`,
            left: `${10 + (i * 43) % 80}%`,
            background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)',
            animation: `pp-wind ${0.6 + (i % 3) * 0.2}s linear ${i * 0.15}s infinite`,
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />
      ))}

      {/* ── THE FLYING PAPER PLANE (bottom-left → top-right) ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        marginTop: '-44px',
        width: '88px',
        height: '88px',
        animation: 'pp-fly 2s cubic-bezier(0.2, 0.8, 0.6, 1) forwards',
        filter: 'drop-shadow(0 0 16px rgba(56,189,248,0.8)) drop-shadow(0 0 32px rgba(14,165,233,0.5))',
        zIndex: 20,
      }}>
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ppTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#e0f2fe" />
              <stop offset="50%"  stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="ppBot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"  stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <polygon points="82,44 6,14 24,44 6,74" fill="url(#ppTop)" />
          <polygon points="82,44 24,44 42,62" fill="url(#ppBot)" opacity="0.95" />
          <line x1="82" y1="44" x2="24" y2="44" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
          <polyline points="82,44 6,14 24,44" stroke="rgba(255,255,255,0.9)" strokeWidth="1.1" fill="none" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── Welcome card (appears after plane exits) ── */}
      {showCard && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'pp-card-in 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 24px',
        }}>
          {/* Icon badge */}
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '24px',
            background: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '22px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06), 0 0 20px rgba(56,189,248,0.3)',
            animation: 'pp-bob 2.2s ease-in-out infinite',
          }}>
            <svg width="44" height="44" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="82,44 6,14 24,44 6,74" fill="#38bdf8" opacity="0.95" />
              <polygon points="82,44 24,44 42,62" fill="#0ea5e9" />
              <line x1="82" y1="44" x2="24" y2="44" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
            </svg>
          </div>

          <p style={{ color: '#0f172a', fontWeight: 800, fontSize: '23px', letterSpacing: '-0.4px', margin: '0 0 7px', fontFamily: 'inherit' }}>
            Welcome{userName ? `, ${userName}` : ''}!
          </p>
          <p style={{ color: '#475569', fontSize: '14px', margin: '0 0 5px', fontFamily: 'inherit' }}>
            PaperPlane · AI Proposals
          </p>
          <p style={{ color: '#0284c7', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 20px', fontFamily: 'inherit' }}>
            Loading your portal…
          </p>

          <div style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #38bdf8 30%, #0ea5e9 70%, transparent 100%)',
            borderRadius: '100px',
            animation: 'pp-bar 1s ease-out forwards',
            width: 0,
          }} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Customer Layout
───────────────────────────────────────────── */
export default function CustomerLayout() {
  const { toast, showToast, isAuthenticated, currentUser } = useApp();
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [, forceUpdate]                   = useState(0);
  const [showIntro, setShowIntro]         = useState(false);

  /* Show the intro animation once per browser session */
  useEffect(() => {
    const key = 'pp_intro_shown';
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
      forceUpdate(n => n + 1);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Paper Plane Intro — shown once per session */}
      {showIntro && (
        <PaperPlaneIntro
          userName={currentUser?.name || ''}
          onDone={() => setShowIntro(false)}
        />
      )}

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

        {/* Main content */}
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
    </>
  );
}
