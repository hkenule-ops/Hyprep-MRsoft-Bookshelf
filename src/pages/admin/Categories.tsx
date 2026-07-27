import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Loader2, FolderOpen, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { Category } from '@/types';

const GREEN = '#008751';
const RED = '#C8102E'; // reserved exclusively for the destructive action on this page (delete)

export default function ManageCategories() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const c = {
    ink: isDark ? '#EAF3EE' : '#0B2E22',
    muted: isDark ? 'rgba(234,243,238,0.62)' : '#5B6B63',
    glassBg: isDark ? 'rgba(11,42,29,0.5)' : 'rgba(255,255,255,0.6)',
    glassBgHover: isDark ? 'rgba(11,42,29,0.68)' : 'rgba(255,255,255,0.82)',
    glassBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
    glassBorderHover: isDark ? 'rgba(0,135,81,0.5)' : 'rgba(0,135,81,0.35)',
  };

  const load = async () => {
    const res = await api.getCategories();
    if (res.data?.categories) setCategories(res.data.categories);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    setCreating(true);
    const res = await api.createCategory(name.trim(), description.trim());
    setCreating(false);
    if (res.success) {
      toast.success('Course created');
      setName(''); setDescription(''); setOpen(false);
      load();
    } else {
      toast.error(res.error || 'Failed to create');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    const res = await api.deleteCategory(id);
    if (res.success) { toast.success('Course deleted'); load(); }
    else toast.error(res.error || 'Failed to delete course');
  };

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const stagger = (i: number, base = 0) => ({ animationDelay: `${base + Math.min(i, 8) * 0.05}s` });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" style={{ color: GREEN }} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: GREEN }}>Manage</span>
          <h1 className="text-2xl font-bold mt-1" style={{ color: c.ink, fontFamily: 'Georgia, serif' }}>Courses</h1>
          <p className="text-sm mt-1" style={{ color: c.muted }}>Manage HYPREP training courses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="transition-transform duration-150 hover:-translate-y-0.5"
              style={{ background: GREEN, color: '#fff', border: 'none' }}
            >
              <Plus className="mr-2 h-4 w-4" />New Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle style={{ fontFamily: 'Georgia, serif' }}>Create Course</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. full stack" maxLength={100} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." maxLength={500} />
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full" style={{ background: GREEN, color: '#fff', border: 'none' }}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm animate-fade-up" style={{ animationDelay: '0.06s' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: c.muted }} />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:-translate-y-0.5"
          style={{ background: c.glassBg, borderColor: c.glassBorder, color: c.ink, ['--tw-ring-color' as string]: GREEN }}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed backdrop-blur-md animate-fade-up" style={{ background: c.glassBg, borderColor: c.glassBorder }}>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 mb-3" style={{ color: GREEN, opacity: 0.4 }} />
            <p style={{ color: c.muted }}>{search ? 'No matching courses' : 'No courses yet'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat, i) => (
            <Card
              key={cat.id}
              className="group backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
              style={{ background: c.glassBg, borderColor: c.glassBorder, ...stagger(i, 0.1) }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.glassBorderHover; e.currentTarget.style.background = c.glassBgHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.glassBorder; e.currentTarget.style.background = c.glassBg; }}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <CardTitle className="text-base" style={{ color: c.ink }}>{cat.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: RED }}
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2" style={{ color: c.muted }}>{cat.description || 'No description'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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