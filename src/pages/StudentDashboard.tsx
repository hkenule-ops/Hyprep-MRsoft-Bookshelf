import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, FolderOpen, ExternalLink, Download, Loader2, ArrowLeft, LogOut, Moon, Sun, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mrsoftLogo from '@/images/mrsoft logo.svg';
import hyprepLogo from '@/images/hyprep-logo.svg';
import type { Category, Book } from '@/types';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [search, setSearch] = useState('');
  const isDark = theme === 'dark';

  // Token set — color has one job each, no color is reused for two different meanings:
  //   green  -> the ONE interactive/brand color: links, primary actions, focus rings, active icons
  //   red    -> reserved for the flag/brand mark only (tricolor rule); never used for UI state here,
  //             since there's no destructive or error action on this screen to signal
  //   ink/muted -> text hierarchy (primary vs secondary), not decorative
  //   glass  -> translucent surfaces that let the background blobs show through, per-theme
  const c = {
    pageBg: isDark ? '#04140D' : '#F4F1EA',
    ink: isDark ? '#EAF3EE' : '#0B2E22',
    muted: isDark ? 'rgba(234,243,238,0.62)' : '#5B6B63',
    glassBg: isDark ? 'rgba(11,42,29,0.55)' : 'rgba(255,255,255,0.55)',
    glassBgHover: isDark ? 'rgba(11,42,29,0.72)' : 'rgba(255,255,255,0.78)',
    glassBorder: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.6)',
    glassBorderHover: isDark ? 'rgba(0,135,81,0.55)' : 'rgba(0,135,81,0.4)',
    iconBg: isDark ? 'rgba(0,135,81,0.22)' : 'rgba(0,135,81,0.12)',
    headerGlass: isDark ? 'rgba(4,20,13,0.55)' : 'rgba(4,81,46,0.68)',
    green: '#008751',
    greenDeep: '#04512E',
    red: '#C8102E',
  };

  useEffect(() => {
    async function load() {
      const res = await api.getCategories();
      if (res.data?.categories) {
        const assigned = res.data.categories.filter((cat) => user?.categories.includes(cat.id));
        setCategories(assigned);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const openCategory = async (cat: Category) => {
    setSelectedCat(cat);
    setLoadingBooks(true);
    setSearch('');
    const res = await api.getBooksByCategory(cat.id);
    if (res.data?.books) setBooks(res.data.books);
    setLoadingBooks(false);
  };

  const getDownloadUrl = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    return url;
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const filteredBooks = books.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));
  const stagger = (i: number, base = 0) => ({ animationDelay: `${base + Math.min(i, 8) * 0.05}s` });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 relative overflow-hidden" style={{ background: c.pageBg }}>
        <div className="absolute w-72 h-72 rounded-full blur-3xl animate-blob-drift" style={{ background: c.green, opacity: isDark ? 0.25 : 0.3 }} />
        <div className="h-16 w-16 flex items-center justify-center bg-white rounded-xl p-2.5 shadow-lg animate-badge-in relative z-10">
          <img src={hyprepLogo} alt="HYPREP" className="max-h-full max-w-full object-contain" />
        </div>
        <Loader2 className="h-6 w-6 animate-spin relative z-10" style={{ color: c.green }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: c.pageBg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Ambient color, blurred behind the glass surfaces — this is what the glass actually refracts */}
      <div className="fixed -top-24 left-[8%] w-[26rem] h-[26rem] rounded-full blur-3xl pointer-events-none animate-blob-drift" style={{ background: c.green, opacity: isDark ? 0.22 : 0.28 }} />
      <div className="fixed top-1/3 -right-24 w-[24rem] h-[24rem] rounded-full blur-3xl pointer-events-none animate-blob-drift-slow" style={{ background: c.greenDeep, opacity: isDark ? 0.28 : 0.22 }} />
      <div className="fixed bottom-[-6rem] left-1/3 w-[22rem] h-[22rem] rounded-full blur-3xl pointer-events-none animate-blob-drift" style={{ background: isDark ? '#0B2A1D' : '#FFFFFF', opacity: isDark ? 0.3 : 0.5, animationDelay: '2s' }} />

      {/* ============ HEADER: glass over the deep-green brand color ============ */}
      <header
        className="sticky top-0 z-20 animate-header-in backdrop-blur-xl"
        style={{ background: c.headerGlass, borderBottom: '1px solid rgba(255,255,255,0.14)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="h-11 w-11 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center bg-white rounded-xl p-1.5 sm:p-2 shadow-md transition-transform duration-200 hover:scale-105">
              <img src={hyprepLogo} alt="HYPREP" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="hidden xs:block sm:block h-9 w-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="h-11 w-11 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center bg-white/95 rounded-xl p-1.5 sm:p-2 shadow-sm transition-transform duration-200 hover:scale-105">
              <img src={mrsoftLogo} alt="MRSoft" className="max-h-full max-w-full object-contain" />
            </div>
            <span
              className="hidden md:inline text-xs font-semibold tracking-[0.14em] uppercase truncate"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Training Portal
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-white hover:bg-white/15 hover:text-white transition-transform duration-200 hover:rotate-12"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/15 hover:text-white"
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
        {/* tricolor rule — the brand mark; red appears nowhere else on this screen */}
        <div className="flex h-[3px] w-full">
          <div className="flex-1" style={{ background: c.green }} />
          <div className="flex-1" style={{ background: '#FFFFFF' }} />
          <div className="flex-1" style={{ background: c.red }} />
        </div>
      </header>

      {/* ============ MAIN ============ */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {!selectedCat ? (
          <div className="space-y-7">
            <div className="animate-fade-up">
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: c.green }}>
                Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: c.ink, fontFamily: 'Georgia, serif' }}>
                My Training Materials
              </h1>
              <p className="text-sm mt-1.5" style={{ color: c.muted }}>
                Welcome, {user?.name} · HYPREP Training Portal
              </p>
            </div>

            {categories.length === 0 ? (
              <Card
                className="border-dashed backdrop-blur-md animate-fade-up"
                style={{ background: c.glassBg, borderColor: c.glassBorder, animationDelay: '0.08s' }}
              >
                <CardContent className="flex flex-col items-center py-14">
                  <FolderOpen className="h-11 w-11 mb-3" style={{ color: c.green, opacity: 0.4 }} />
                  <p style={{ color: c.muted }}>No courses assigned yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, i) => (
                  <Card
                    key={cat.id}
                    className="group cursor-pointer backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
                    style={{ background: c.glassBg, borderColor: c.glassBorder, ...stagger(i, 0.05) }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.glassBorderHover; e.currentTarget.style.background = c.glassBgHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.glassBorder; e.currentTarget.style.background = c.glassBg; }}
                    onClick={() => openCategory(cat)}
                  >
                    <CardHeader>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ background: c.iconBg }}
                      >
                        <FolderOpen className="h-5 w-5" style={{ color: c.green }} />
                      </div>
                      <CardTitle className="text-lg" style={{ color: c.ink }}>{cat.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2" style={{ color: c.muted }}>
                        {cat.description || 'Explore training materials'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-3 animate-fade-up">
              <Button
                variant="ghost"
                size="icon"
                className="mt-0.5 shrink-0 transition-transform duration-200 hover:-translate-x-1"
                style={{ color: c.green }}
                onClick={() => { setSelectedCat(null); setBooks([]); }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold truncate" style={{ color: c.ink, fontFamily: 'Georgia, serif' }}>
                  {selectedCat.name}
                </h1>
                <p className="text-sm" style={{ color: c.muted }}>{selectedCat.description}</p>
              </div>
            </div>

            <div className="relative w-full sm:max-w-sm animate-fade-up" style={{ animationDelay: '0.08s' }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: c.muted }} />
              <Input
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:-translate-y-0.5"
                style={{ background: c.glassBg, borderColor: c.glassBorder, color: c.ink, ['--tw-ring-color' as string]: c.green }}
              />
            </div>

            {loadingBooks ? (
              <div className="flex justify-center py-14">
                <Loader2 className="h-7 w-7 animate-spin" style={{ color: c.green }} />
              </div>
            ) : filteredBooks.length === 0 ? (
              <Card className="border-dashed backdrop-blur-md animate-fade-up" style={{ background: c.glassBg, borderColor: c.glassBorder }}>
                <CardContent className="flex flex-col items-center py-14">
                  <BookOpen className="h-11 w-11 mb-3" style={{ color: c.green, opacity: 0.4 }} />
                  <p style={{ color: c.muted }}>{search ? 'No matching books' : 'No books in this category'}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((b, i) => (
                  <Card
                    key={b.id}
                    className="group backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
                    style={{ background: c.glassBg, borderColor: c.glassBorder, ...stagger(i, 0.05) }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.glassBorderHover; e.currentTarget.style.background = c.glassBgHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.glassBorder; e.currentTarget.style.background = c.glassBg; }}
                  >
                    <CardHeader>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ background: c.iconBg }}
                      >
                        <BookOpen className="h-5 w-5" style={{ color: c.green }} />
                      </div>
                      <CardTitle className="text-base line-clamp-2" style={{ color: c.ink }}>{b.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 backdrop-blur-sm transition-transform duration-150 hover:-translate-y-0.5"
                        style={{ borderColor: c.green, color: c.green, background: 'transparent' }}
                        asChild
                      >
                        <a href={b.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />View
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 transition-transform duration-150 hover:-translate-y-0.5"
                        style={{ background: c.green, color: '#fff', border: 'none' }}
                        asChild
                      >
                        <a href={getDownloadUrl(b.file_url)} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-1 h-3 w-3" />Download
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes badge-in {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes header-in {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 25px) scale(0.95); }
        }
        @keyframes blob-drift-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-35px, 35px) scale(1.12); }
        }
        .animate-fade-up { animation: fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-badge-in { animation: badge-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-header-in { animation: header-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-blob-drift { animation: blob-drift 14s ease-in-out infinite; }
        .animate-blob-drift-slow { animation: blob-drift-slow 20s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up, .animate-badge-in, .animate-header-in,
          .animate-blob-drift, .animate-blob-drift-slow { animation: none; }
        }
      `}</style>
    </div>
  );
}