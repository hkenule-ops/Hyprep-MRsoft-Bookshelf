import { FolderOpen, Users, Upload, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import mrsoftLogo from '@/images/mrsoft logo.svg';
import hyprepLogo from '@/images/hyprep-logo.svg';

const adminItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Courses', url: '/admin/categories', icon: FolderOpen },
  { title: 'Trainees', url: '/admin/students', icon: Users },
  { title: 'Books', url: '/admin/books', icon: Upload },
];

// green = the one interactive/active color; red = reserved for destructive actions only,
// so it never appears in this file (nothing here is destructive)
const GREEN = '#008751';
const GREEN_DEEP = '#04512E';
const RED = '#C8102E';

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar
      collapsible="icon"
      style={{
        background: `linear-gradient(165deg, #063D26 0%, ${GREEN_DEEP} 45%, #04663A 100%)`,
        borderRight: '1px solid rgba(255,255,255,0.1)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <SidebarContent>
        <SidebarGroup>
          {/* Dual logo area */}
          <div className="flex flex-col items-center justify-center pt-5 pb-4 mb-2 border-b border-white/10 gap-3 animate-fade-up">
            {collapsed ? (
              <div className="h-10 w-10 flex items-center justify-center bg-white rounded-lg p-1.5 shadow-md">
                <img src={hyprepLogo} alt="HYPREP" className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-14 w-14 flex items-center justify-center bg-white rounded-xl p-2 shadow-md animate-badge-in">
                    <img src={hyprepLogo} alt="HYPREP" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="h-14 w-14 flex items-center justify-center bg-white/95 rounded-xl p-2 shadow-sm animate-badge-in" style={{ animationDelay: '0.1s' }}>
                    <img src={mrsoftLogo} alt="MRSoft" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
                <p
                  className="text-[10px] text-white/70 font-semibold tracking-[0.18em] uppercase text-center leading-tight px-2"
                >
                  Training Portal
                </p>
                {/* tricolor mark, carried from the login/dashboard brand system */}
                <div className="flex h-1 w-14 rounded-full overflow-hidden">
                  <div className="flex-1" style={{ background: GREEN }} />
                  <div className="flex-1" style={{ background: '#FFFFFF' }} />
                  <div className="flex-1" style={{ background: RED }} />
                </div>
              </>
            )}
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item, i) => (
                <SidebarMenuItem
                  key={item.title}
                  className="animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 hover:translate-x-0.5"
                      activeClassName="bg-white/15 text-white font-medium border-l-2 border-white"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t border-white/10 pt-1 pb-2 px-2 space-y-1">
          {/* Theme toggle — brand green, never red: it isn't a destructive action */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            onClick={toggleTheme}
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4 shrink-0 transition-transform duration-300 hover:rotate-45" />
              : <Moon className="h-4 w-4 shrink-0 transition-transform duration-300 hover:-rotate-12" />}
            {!collapsed && (
              <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </Button>

          {/* Logout — a neutral navigation action, not destructive, so it stays white/ghost */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-white/70 hover:text-white hover:bg-white/15"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>

          {/* User email */}
          {!collapsed && user && (
            <p className="text-xs text-white/40 px-2 pt-1 truncate">{user.email}</p>
          )}
        </div>
      </SidebarFooter>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes badge-in {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up { animation: fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-badge-in { animation: badge-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up, .animate-badge-in { animation: none; }
        }
      `}</style>
    </Sidebar>
  );
}