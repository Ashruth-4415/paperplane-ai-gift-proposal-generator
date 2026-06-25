import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Gift, ArrowRight, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ─────────────────────────────────────────────
   Paper-Plane Transition Overlay
   - Plane flies LEFT → RIGHT using CSS animation
   - Welcome card fades in after plane exits
   - Entire overlay auto-removes after ~2.4 s
───────────────────────────────────────────── */
function PaperPlaneTransition({ userName }) {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Show welcome card 1.5 s after mount (after plane has flown across)
    const t = setTimeout(() => setShowCard(true), 1500);
    return () => clearTimeout(t);
  }, []);

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
      {/* ── CSS keyframes injected via <style> ── */}
      <style>{`
        @keyframes pp-fly {
          0%   { transform: translateX(-150px) translateY(10px) rotate(-5deg); opacity: 0; }
          15%  { opacity: 1; transform: translateX(5vw) translateY(-15px) rotate(3deg); }
          50%  { transform: translateX(50vw) translateY(20px) rotate(-6deg); }
          85%  { opacity: 1; transform: translateX(95vw) translateY(-10px) rotate(4deg); }
          100% { transform: translateX(115vw) translateY(0px) rotate(0deg);  opacity: 0.9; }
        }
        @keyframes pp-card-in {
          from { opacity: 0; transform: translateY(28px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0px)  scale(1);   }
        }
        @keyframes pp-pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.5; }
          50%       { transform: translate(-50%, -50%) scale(1.12); opacity: 1;   }
        }
        @keyframes pp-star-twinkle {
          from { opacity: 0.15; transform: scale(0.7); }
          to   { opacity: 0.8;  transform: scale(1.3); }
        }
        @keyframes pp-wind {
          0%   { transform: translateX(100vw) scaleX(1); opacity: 0; }
          20%  { opacity: 0.6; }
          100% { transform: translateX(-20vw) scaleX(3); opacity: 0; }
        }
        @keyframes pp-bar-grow {
          from { width: 0; opacity: 0; }
          to   { width: 140px; opacity: 1; }
        }
        @keyframes pp-icon-bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>

      {/* Central radial glow */}
      <div style={{
        position: 'absolute',
        width: '700px', height: '700px',
        borderRadius: '50%',
        top: '50%', left: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
        animation: 'pp-pulse-glow 2.4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: '350px', height: '350px',
        borderRadius: '50%',
        top: '25%', left: '15%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
        animation: 'pp-pulse-glow 3.5s ease-in-out 0.6s infinite',
        pointerEvents: 'none',
      }} />

      {/* Twinkling star particles */}
      {[...Array(28)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            borderRadius: '50%',
            top: `${8 + ((i * 31) % 84)}%`,
            left: `${3 + ((i * 47) % 94)}%`,
            background:
              i % 5 === 0 ? 'rgba(56,189,248,0.6)'
              : i % 5 === 1 ? 'rgba(14,165,233,0.5)'
              : i % 5 === 2 ? 'rgba(125,211,252,0.6)'
              : i % 5 === 3 ? 'rgba(251,191,36,0.3)'
              : 'rgba(15,23,42,0.15)',
            animation: `pp-star-twinkle ${1.2 + (i % 4) * 0.4}s ease-in-out ${(i * 0.09) % 1.2}s infinite alternate`,
            pointerEvents: 'none',
          }}
        />
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
            top: `${15 + (i * 37) % 70}%`,
            background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)',
            animation: `pp-wind ${0.6 + (i % 3) * 0.2}s linear ${i * 0.15}s infinite`,
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />
      ))}

      {/* ── THE PLANE ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        marginTop: '-40px',
        width: '80px',
        height: '80px',
        animation: 'pp-fly 1.8s cubic-bezier(0.2, 0.8, 0.6, 1) forwards',
        filter: 'drop-shadow(0 0 16px rgba(56,189,248,0.8)) drop-shadow(0 0 32px rgba(14,165,233,0.5))',
        zIndex: 20,
      }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ppGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#e0f2fe" />
              <stop offset="50%"  stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="ppGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <polygon points="8,40 76,14 58,40 76,66" fill="url(#ppGrad1)" />
          <polygon points="8,40 58,40 42,58" fill="url(#ppGrad2)" opacity="0.95" />
          <line x1="8" y1="40" x2="58" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
          <polyline points="8,40 76,14 58,40" stroke="rgba(255,255,255,0.9)" strokeWidth="1" fill="none" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── Welcome card (fades in after plane exits) ── */}
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
          {/* Plane icon badge */}
          <div style={{
            width: '76px', height: '76px',
            borderRadius: '22px',
            background: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06), 0 0 20px rgba(56,189,248,0.3)',
            animation: 'pp-icon-bob 2s ease-in-out infinite',
          }}>
            <svg width="40" height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="8,40 76,14 58,40 76,66" fill="#38bdf8" opacity="0.95" />
              <polygon points="8,40 58,40 42,58" fill="#0ea5e9" />
              <line x1="8" y1="40" x2="58" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
            </svg>
          </div>

          <p style={{ color: '#0f172a', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.4px', margin: '0 0 6px', fontFamily: 'inherit' }}>
            Welcome aboard, {userName}!
          </p>
          <p style={{ color: '#475569', fontSize: '14px', margin: '0 0 4px', fontFamily: 'inherit' }}>
            PaperPlane · AI Proposals
          </p>
          <p style={{ color: '#0284c7', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 18px', fontFamily: 'inherit' }}>
            Directing you to your portal…
          </p>

          <div style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #38bdf8 30%, #0ea5e9 70%, transparent 100%)',
            borderRadius: '100px',
            animation: 'pp-bar-grow 0.9s ease-out forwards',
            width: 0,
          }} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Login Page
───────────────────────────────────────────── */
export default function LoginPage() {
  const { loginUser, showToast, isAuthenticated, currentUser, users } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]     = useState('login');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [name, setName]               = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError]             = useState('');

  /* Already-logged-in redirect */
  if (isAuthenticated && currentUser) {
    const role = currentUser.role || 'customer';
    if (['admin', 'designer', 'production', 'dispatch', 'sales'].includes(role)) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  /* Public email domains to reject */
  const publicDomains = [
    'gmail.com','yahoo.com','outlook.com','hotmail.com',
    'aol.com','mail.com','protonmail.com','icloud.com',
    'zoho.com','yandex.com','gmx.com','live.com',
  ];
  const validateEmailDomain = (inputEmail) => {
    const domain = inputEmail.split('@')[1]?.toLowerCase().trim();
    return domain ? !publicDomains.includes(domain) : false;
  };



  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (!validateEmailDomain(email)) {
      setError('Please use your official company email ID to log in or register.');
      return;
    }

    const success = await loginUser({ email, password });
    if (success) {
      // Clear session flag so animation plays fresh on next portal load
      sessionStorage.removeItem('pp_intro_shown');
      // Navigation is handled by the redirect at the top of the component based on currentUser
    }
  };

  /* ── Sign Up ── */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !companyName || !email || !password) {
      setError('All fields are required.'); return;
    }
    if (!validateEmailDomain(email)) {
      setError('Please use your official company email ID to log in or register.');
      return;
    }

    const success = await loginUser({ name, company: companyName, email, password, is_register: true });
    if (success) {
      sessionStorage.removeItem('pp_intro_shown');
    }
  };


  return (
    <div className="min-h-screen bg-surface-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        {/* Decorative background glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        {/* Main card */}
        <div className="w-full max-w-5xl bg-surface-900/40 backdrop-blur-md border border-surface-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10">

          {/* ── Left: Branding ── */}
          <div className="flex-1 p-8 md:p-12 bg-gradient-to-br from-surface-900 to-brand-100/40 flex flex-col justify-between border-b md:border-b-0 md:border-r border-surface-800/80">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-glow">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-surface-100 font-bold text-lg leading-none">PaperPlane</p>
                  <p className="text-brand-400 text-xs mt-0.5">AI Proposals</p>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-surface-50 leading-tight mb-4 tracking-tight">
                Enterprise Corporate <br />
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-600 bg-clip-text text-transparent">
                  Gifting, Reimagined.
                </span>
              </h1>
              <p className="text-surface-400 text-sm md:text-base leading-relaxed mb-6">
                Generate AI-powered custom proposals, manage corporate inventories, and coordinate approvals instantly within a single workspace.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-brand-500/10 flex items-center justify-center text-brand-400 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-surface-200">Company Domain Lock</h4>
                  <p className="text-xs text-surface-400">Strictly isolated corporate networks. Public domain registrations are restricted.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-surface-200">B2B Portal Access</h4>
                  <p className="text-xs text-surface-400">Instant routing to either Customer Store or Admin Dashboard based on credentials.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-surface-900/20">
            {/* Tabs */}
            <div className="flex bg-surface-950 p-1.5 rounded-xl border border-surface-800 mb-8 w-fit">
              <button
                onClick={() => { setActiveTab('login'); setError(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'login' ? 'bg-brand-600 text-[#ffffff] shadow-md' : 'text-surface-400 hover:text-surface-200'}`}
              >
                Log In
              </button>
              <button
                onClick={() => { setActiveTab('signup'); setError(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'signup' ? 'bg-brand-600 text-[#ffffff] shadow-md' : 'text-surface-400 hover:text-surface-200'}`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-2xl font-bold text-surface-100 mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-surface-400 text-sm mb-6">
              {activeTab === 'login' ? 'Sign in to access your dashboard' : 'Register your company portal'}
            </p>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-100 border border-rose-200 rounded-xl text-rose-700 text-sm animate-fade-in">
                <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login form */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-sm text-surface-100 placeholder-surface-600 focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-sm text-surface-100 placeholder-surface-600 focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-[#ffffff] font-semibold rounded-xl text-sm shadow-lg hover:shadow-brand-500/25 transition-all duration-200 flex items-center justify-center gap-2 mt-6 group"
                >
                  <span>Access Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            ) : (
              /* Sign Up form */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                      <input
                        type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full pl-10 pr-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-sm text-surface-100 placeholder-surface-600 focus:border-brand-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Company Name</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                      <input
                        type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full pl-10 pr-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-sm text-surface-100 placeholder-surface-600 focus:border-brand-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full pl-10 pr-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-sm text-surface-100 placeholder-surface-600 focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-sm text-surface-100 placeholder-surface-600 focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-[#ffffff] font-semibold rounded-xl text-sm shadow-lg hover:shadow-brand-500/25 transition-all duration-200 flex items-center justify-center gap-2 mt-6 group"
                >
                  <span>Register &amp; Enter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            )}


          </div>
        </div>
    </div>
  );
}
