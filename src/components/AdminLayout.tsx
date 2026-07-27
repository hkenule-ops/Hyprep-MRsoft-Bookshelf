import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const GREEN = '#008751';
const GREEN_DEEP = '#04512E';
const RED = '#C8102E';

function AdminHeader() {
  const { toggleSidebar, open } = useSidebar();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header
      className="sticky top-0 z-10 backdrop-blur-xl animate-fade-down"
      style={{
        background: isDark ? 'rgba(10, 30, 20, 0.6)' : 'rgba(255, 255, 255, 0.65)',
        borderBottom: `1px solid ${isDark ? 'rgba(0,135,81,0.25)' : 'rgba(0,135,81,0.15)'}`,
      }}
    >
      <div className="h-14 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="transition-transform duration-200 hover:scale-110"
          style={{ color: GREEN }}
        >
          {open ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>
      {/* tricolor rule, the same brand mark used on login/sidebar */}
      <div className="flex h-[2px] w-full">
        <div className="flex-1" style={{ background: GREEN }} />
        <div className="flex-1" style={{ background: '#FFFFFF' }} />
        <div className="flex-1" style={{ background: RED }} />
      </div>
    </header>
  );
}

export default function AdminLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SidebarProvider>
      <div
        className="min-h-screen flex w-full relative overflow-hidden"
        style={{
          background: isDark ? '#04140D' : '#F4F1EA',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Ambient color the glass surfaces refract — deliberately no red here.
            Red is reserved for destructive actions and the brand mark only. */}
        <div
          className="fixed top-10 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-blob-drift"
          style={{ background: GREEN, opacity: isDark ? 0.22 : 0.28 }}
        />
        <div
          className="fixed bottom-10 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-blob-drift-slow"
          style={{ background: isDark ? '#0B2A1D' : '#FFFFFF', opacity: isDark ? 0.3 : 0.5 }}
        />
        <div
          className="fixed top-1/2 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-blob-drift"
          style={{ background: GREEN_DEEP, opacity: isDark ? 0.3 : 0.24, animationDelay: '3s' }}
        />

        <AppSidebar />

        <div className="flex-1 flex flex-col relative z-10 min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <style>{`
        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 25px) scale(0.95); }
        }
        @keyframes blob-drift-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-35px, 35px) scale(1.12); }
        }
        @keyframes fade-down {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob-drift { animation: blob-drift 14s ease-in-out infinite; }
        .animate-blob-drift-slow { animation: blob-drift-slow 20s ease-in-out infinite; }
        .animate-fade-down { animation: fade-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-blob-drift, .animate-blob-drift-slow, .animate-fade-down { animation: none; }
        }
      `}</style>
    </SidebarProvider>
  );
}