import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, BookOpen, Loader2 } from 'lucide-react';
import type { Category, User, Book } from '@/types';

const GREEN = '#008751';
const GREEN_DEEP = '#04512E';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const c = {
    ink: isDark ? '#EAF3EE' : '#0B2E22',
    muted: isDark ? 'rgba(234,243,238,0.62)' : '#5B6B63',
    glassBg: isDark ? 'rgba(11,42,29,0.5)' : 'rgba(255,255,255,0.6)',
    glassBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
    rowBg: isDark ? 'rgba(0,135,81,0.14)' : 'rgba(0,135,81,0.08)',
  };

  useEffect(() => {
    async function load() {
      const [u, cat, b] = await Promise.all([
        api.getUsers(),
        api.getCategories(),
        api.getAllBooks(),
      ]);
      if (u.data?.users) setUsers(u.data.users);
      if (cat.data?.categories) setCategories(cat.data.categories);
      if (b.data?.books) setBooks(b.data.books);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: GREEN }} />
      </div>
    );
  }

  const students = users.filter((u) => u.role === 'student');

  // one consistent green family for stat icons — not arbitrary colors per card,
  // just three steps of brand depth so the three numbers read as siblings
  const stats = [
    { label: 'Trainees', value: students.length, icon: Users, bg: GREEN },
    { label: 'Courses', value: categories.length, icon: FolderOpen, bg: '#006B3F' },
    { label: 'Books', value: books.length, icon: BookOpen, bg: GREEN_DEEP },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: GREEN }}>
          Overview
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: c.ink, fontFamily: 'Georgia, serif' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1.5" style={{ color: c.muted }}>
          Overview of the HYPREP Training Portal
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card
            key={s.label}
            className="backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
            style={{ background: c.glassBg, borderColor: c.glassBorder, animationDelay: `${i * 0.08}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: c.muted }}>{s.label}</CardTitle>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-3"
                style={{ background: s.bg }}
              >
                <s.icon className="h-4 w-4" style={{ color: '#fff' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: s.bg, fontFamily: 'Georgia, serif' }}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className="backdrop-blur-md animate-fade-up"
          style={{ background: c.glassBg, borderColor: c.glassBorder, animationDelay: '0.24s' }}
        >
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: c.ink, fontFamily: 'Georgia, serif' }}>Recent Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-sm" style={{ color: c.muted }}>No courses yet</p>
            ) : (
              <div className="space-y-2">
                {categories.slice(0, 5).map((cat) => (
                  <div
                    key={cat.id}
                    className="flex justify-between items-center p-2.5 rounded-md transition-colors duration-150"
                    style={{ background: c.rowBg }}
                  >
                    <span className="font-medium text-sm" style={{ color: isDark ? '#7CD9AE' : '#006B3F' }}>{cat.name}</span>
                    <span className="text-xs truncate max-w-[45%]" style={{ color: c.muted }}>{cat.description}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className="backdrop-blur-md animate-fade-up"
          style={{ background: c.glassBg, borderColor: c.glassBorder, animationDelay: '0.3s' }}
        >
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: c.ink, fontFamily: 'Georgia, serif' }}>Recent Trainees</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm" style={{ color: c.muted }}>No trainees yet</p>
            ) : (
              <div className="space-y-2">
                {students.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center p-2.5 rounded-md transition-colors duration-150"
                    style={{ background: c.rowBg }}
                  >
                    <span className="font-medium text-sm truncate" style={{ color: isDark ? '#7CD9AE' : '#006B3F' }}>{s.email}</span>
                    <span className="text-xs shrink-0 ml-2" style={{ color: c.muted }}>
                      {s.categories.length} {s.categories.length === 1 ? 'course' : 'courses'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up { animation: none; }
        }
      `}</style>
    </div>
  );
}