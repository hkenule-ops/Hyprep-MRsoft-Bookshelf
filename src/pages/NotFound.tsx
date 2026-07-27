import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from '@/contexts/ThemeContext';
import mrsoftLogo from '@/images/mrsoft logo.svg';
import hyprepLogo from '@/images/hyprep-logo.svg';

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen items-center justify-center relative overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #021a12 0%, #0a2e1f 50%, #0d3a28 100%)'
          : 'linear-gradient(135deg, #006B3F 0%, #008751 60%, #006B3F 100%)',
      }}
    >
      {/* Blobs */}
      <div
        className="absolute top-10 left-1/4 w-96 h-96 rounded-full filter blur-3xl pointer-events-none animate-blob-fast"
        style={{ background: '#008751', opacity: isDark ? 0.35 : 0.45 }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full filter blur-3xl pointer-events-none animate-blob-fast animation-delay-2000"
        style={{ background: '#FFFFFF', opacity: isDark ? 0.28 : 0.35 }}
      />
      <div
        className="absolute top-1/2 right-10 w-72 h-72 rounded-full filter blur-3xl pointer-events-none animate-blob-fast animation-delay-1000"
        style={{ background: '#006B3F', opacity: isDark ? 0.35 : 0.38 }}
      />

      {/* Content */}
      <div className="text-center space-y-4 relative z-10">
        <div className="flex justify-center mb-6 gap-3">
          <div className="bg-white/95 rounded-2xl px-4 py-3 shadow-lg">
            <img src={hyprepLogo} alt="HYPREP" className="h-10 w-auto object-contain" />
          </div>
          <div className="bg-white/95 rounded-2xl px-3 py-3 shadow-lg flex items-center">
            <img src={mrsoftLogo} alt="MRSoft" className="h-8 w-auto object-contain" />
          </div>
        </div>
        <h1 className="text-7xl font-bold text-white">404</h1>
        <p className="text-xl text-white/70">Oops! Page not found</p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: '#008751' }}
        >
          Return to Home
        </a>
      </div>

      <style>{`
        @keyframes blob-fast {
          0%   { transform: translate(0px, 0px) scale(1); }
          25%  { transform: translate(40px, -60px) scale(1.15); }
          50%  { transform: translate(-30px, 30px) scale(0.85); }
          75%  { transform: translate(20px, -20px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob-fast { animation: blob-fast 4s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default NotFound;