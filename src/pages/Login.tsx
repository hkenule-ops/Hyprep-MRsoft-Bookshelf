import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import mrsoftLogo from '@/images/mrsoft logo.svg';
import hyprepLogo from '@/images/hyprep-logo.svg';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !pin.trim()) {
      toast.error('Please enter your email/phone and PIN');
      return;
    }

    setLoading(true);
    const res = await api.login(identifier.trim(), pin.trim());
    setLoading(false);

    if (res.success && res.data?.user) {
      login(res.data.user);
      toast.success('Welcome back!');
      navigate(res.data.user.role === 'admin' ? '/admin' : '/student');
    } else {
      toast.error(res.error || 'Invalid credentials');
    }
  };

  return (
    <div
      className="h-screen w-full flex items-stretch overflow-hidden"
      style={{ background: '#FAF9F6', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ============ LEFT: ACCESS CARD PANEL ============ */}
      <div
        className="hidden md:flex md:w-[42%] lg:w-[38%] relative flex-col justify-between overflow-hidden animate-card-in"
        style={{ background: 'linear-gradient(165deg, #063D26 0%, #04512E 45%, #04663A 100%)' }}
      >
        <div
          className="absolute top-0 right-0 h-full w-px"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(255,255,255,0.55) 0 6px, transparent 6px 14px)',
          }}
        />

        <div
          className="absolute -right-24 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full border animate-seal-spin"
          style={{ borderColor: 'rgba(255,255,255,0.08)', borderWidth: '18px', borderStyle: 'dashed' }}
        />
        <div
          className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        />

        <div className="relative z-10 px-9 pt-9">
          <div className="flex items-center gap-2 mb-7 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <ShieldCheck className="h-3.5 w-3.5 animate-seal-pulse" style={{ color: '#F2C14E' }} strokeWidth={2.5} />
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: '#CDE9DA' }}
            >
              Verified Access Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-20 w-20 flex items-center justify-center bg-white rounded-xl p-2 shadow-md animate-badge-in">
              <img src={hyprepLogo} alt="HYPREP" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="h-20 w-20 flex items-center justify-center bg-white/95 rounded-xl p-2 shadow-sm animate-badge-in" style={{ animationDelay: '0.12s' }}>
              <img src={mrsoftLogo} alt="MRSoft" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
        </div>

        <div className="relative z-10 px-9">
          <h1
            className="text-white font-bold leading-[1.08] mb-4 animate-fade-up"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.75rem, 2.6vw, 2.4rem)', animationDelay: '0.14s' }}
          >
            HYPREP Training
            <br />
            Portal
          </h1>
          <p className="text-sm leading-relaxed max-w-[26ch] animate-fade-up" style={{ color: 'rgba(255,255,255,0.78)', animationDelay: '0.22s' }}>
            Sign in with your registered email or phone number and PIN to reach your training materials.
          </p>

          <div className="mt-8 space-y-3 max-w-[280px]">
            {[
              ['Programme', 'HYPREP Capacity Building'],
              ['Access Mode', 'Email / Phone + PIN'],
              ['Status', 'Active'],
            ].map(([label, value], i) => (
              <div
                key={label}
                className="flex items-baseline justify-between border-b pb-1.5 animate-fade-up"
                style={{ borderColor: 'rgba(255,255,255,0.14)', animationDelay: `${0.32 + i * 0.08}s` }}
              >
                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {label}
                </span>
                <span className="text-xs font-medium text-white text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-9 pb-9">
          <div
            className="flex h-1.5 w-full rounded-full overflow-hidden mb-3 animate-strip-in"
            style={{ maxWidth: 180, transformOrigin: 'left center', animationDelay: '0.62s' }}
          >
            <div className="flex-1" style={{ background: '#008751' }} />
            <div className="flex-1" style={{ background: '#FFFFFF' }} />
            <div className="flex-1" style={{ background: '#C8102E' }} />
          </div>
          <p className="text-[11px] animate-fade-up" style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '0.72s' }}>
            organised by HYPREP · powered by MRSoft
          </p>
        </div>
      </div>

      {/* ============ RIGHT: FORM PANEL ============ */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8 relative">
        <div className="md:hidden absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 animate-header-in" style={{ background: '#04512E' }}>
          <div className="flex items-center gap-2">
            <div className="h-11 w-11 flex items-center justify-center bg-white rounded-lg p-1.5 shrink-0">
              <img src={hyprepLogo} alt="HYPREP" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="h-11 w-11 flex items-center justify-center bg-white/95 rounded-lg p-1.5 shrink-0">
              <img src={mrsoftLogo} alt="MRSoft" className="max-h-full max-w-full object-contain" />
            </div>
            <span className="text-white text-sm font-semibold whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
              Training Material Portal
            </span>
          </div>
          <div className="flex h-1 w-12 rounded-full overflow-hidden shrink-0">
            <div className="flex-1" style={{ background: '#008751' }} />
            <div className="flex-1" style={{ background: '#FFFFFF' }} />
            <div className="flex-1" style={{ background: '#C8102E' }} />
          </div>
        </div>

        <div className="w-full max-w-sm mt-14 md:mt-0 animate-form-in">
          <div className="mb-8">
            <span
              className="text-[11px] font-semibold tracking-[0.18em] uppercase inline-block animate-fade-up"
              style={{ color: '#008751', animationDelay: '0.16s' }}
            >
              Sign in
            </span>
            <h2 className="text-2xl font-bold mt-1.5 animate-fade-up" style={{ color: '#0B2E22', fontFamily: 'Georgia, serif', animationDelay: '0.22s' }}>
              Welcome back
            </h2>
            <p className="text-sm mt-1.5 animate-fade-up" style={{ color: '#5B6B63', animationDelay: '0.28s' }}>
              Enter your email or phone number and PIN to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="animate-fade-up" style={{ animationDelay: '0.34s' }}>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#33403A' }}>
                Email or Phone Number
              </label>
              <Input
                type="text"
                placeholder="you@example.com or 08012345678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                className="h-11 border-gray-200 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:-translate-y-0.5"
                style={{ ['--tw-ring-color' as string]: '#008751' }}
              />
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#33403A' }}>
                PIN
              </label>
              <div className="relative">
                <Input
                  type={showPin ? 'text' : 'password'}
                  placeholder="••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                  autoComplete="current-password"
                  className="h-11 border-gray-200 pr-10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:-translate-y-0.5"
                  style={{ ['--tw-ring-color' as string]: '#008751' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPin((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="h-4 w-4 animate-fade-up" style={{ animationDuration: '0.2s' }} /> : <Eye className="h-4 w-4 animate-fade-up" style={{ animationDuration: '0.2s' }} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] animate-fade-up"
              disabled={loading}
              style={{ background: '#008751', color: '#fff', border: 'none', animationDelay: '0.46s' }}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="relative text-center my-7 animate-fade-up" style={{ animationDelay: '0.52s' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#E7E4DC' }} />
            </div>
            <span className="relative px-3 text-xs" style={{ background: '#FAF9F6', color: '#8A968E' }}>
              trouble signing in?
            </span>
          </div>

          <p className="text-center text-xs animate-fade-up" style={{ color: '#8A968E', animationDelay: '0.58s' }}>
            Contact your programme coordinator to reset your PIN.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes form-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes badge-in {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes strip-in {
          from { opacity: 0; transform: scaleX(0); }
          to { opacity: 1; transform: scaleX(1); }
        }
        @keyframes header-in {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes seal-spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes seal-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        .animate-card-in { animation: card-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-form-in { animation: form-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .animate-fade-up { animation: fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-badge-in { animation: badge-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-strip-in { animation: strip-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-header-in { animation: header-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-seal-spin { animation: seal-spin 50s linear infinite; }
        .animate-seal-pulse { animation: seal-pulse 2.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-card-in, .animate-form-in, .animate-fade-up, .animate-badge-in,
          .animate-strip-in, .animate-header-in, .animate-seal-spin, .animate-seal-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}