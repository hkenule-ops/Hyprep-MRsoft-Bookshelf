import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2, BookOpen, Trash2, Search, ExternalLink, ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { Book, Category } from '@/types';

const GREEN = '#008751';
const RED = '#C8102E'; // reserved exclusively for delete on this page

export default function ManageBooks() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const c = {
    ink: isDark ? '#EAF3EE' : '#0B2E22',
    muted: isDark ? 'rgba(234,243,238,0.62)' : '#5B6B63',
    glassBg: isDark ? 'rgba(11,42,29,0.5)' : 'rgba(255,255,255,0.6)',
    glassBgHover: isDark ? 'rgba(11,42,29,0.68)' : 'rgba(255,255,255,0.82)',
    glassBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
    glassBorderHover: isDark ? 'rgba(0,135,81,0.5)' : 'rgba(0,135,81,0.35)',
    groupHeaderBg: isDark ? 'rgba(0,135,81,0.14)' : 'rgba(0,135,81,0.07)',
    badgeBg: isDark ? 'rgba(0,135,81,0.22)' : 'rgba(0,135,81,0.15)',
    badgeText: isDark ? '#7CD9AE' : '#006B3F',
  };

  const load = async () => {
    const [b, cats] = await Promise.all([api.getAllBooks(), api.getCategories()]);
    if (b.data?.books) setBooks(b.data.books);
    if (cats.data?.categories) {
      setCategories(cats.data.categories);
      setExpandedCats(new Set(cats.data.categories.map((cat: Category) => cat.id)));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!title.trim() || !fileUrl.trim() || !categoryId) {
      toast.error('All fields are required'); return;
    }
    setCreating(true);
    const res = await api.addBook(title.trim(), fileUrl.trim(), categoryId);
    setCreating(false);
    if (res.success) {
      toast.success('Book added');
      setTitle(''); setFileUrl(''); setCategoryId(''); setOpen(false);
      load();
    } else toast.error(res.error || 'Failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book?')) return;
    const res = await api.deleteBook(id);
    if (res.success) { toast.success('Deleted'); load(); }
    else toast.error(res.error || 'Failed');
  };

  const toggleCat = (id: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const booksByCategory = categories.map((cat) => ({
    category: cat,
    books: books.filter(
      (b) =>
        b.category_id === cat.id &&
        b.title.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const visibleCategories = search
    ? booksByCategory.filter((g) => g.books.length > 0)
    : booksByCategory;

  const totalFiltered = visibleCategories.reduce((acc, g) => acc + g.books.length, 0);
  const stagger = (i: number, base = 0) => ({ animationDelay: `${base + Math.min(i, 8) * 0.05}s` });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: GREEN }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: GREEN }}>Manage</span>
          <h1 className="text-2xl font-bold mt-1" style={{ color: c.ink, fontFamily: 'Georgia, serif' }}>Books</h1>
          <p className="text-sm mt-1" style={{ color: c.muted }}>Upload and manage HYPREP training materials</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="transition-transform duration-150 hover:-translate-y-0.5"
              style={{ background: GREEN, color: '#fff', border: 'none' }}
            >
              <Plus className="mr-2 h-4 w-4" />Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle style={{ fontFamily: 'Georgia, serif' }}>Add Book</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book title" maxLength={200} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Google Drive Link</label>
                <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." maxLength={500} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Course</label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full" style={{ background: GREEN, color: '#fff', border: 'none' }}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Book
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm animate-fade-up" style={{ animationDelay: '0.06s' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: c.muted }} />
        <Input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:-translate-y-0.5"
          style={{ background: c.glassBg, borderColor: c.glassBorder, color: c.ink, ['--tw-ring-color' as string]: GREEN }}
        />
      </div>

      {!search && categories.length > 0 && (
        <div className="flex gap-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedCats(new Set(categories.map((cat) => cat.id)))}
            className="backdrop-blur-sm"
            style={{ borderColor: GREEN, color: GREEN, background: 'transparent' }}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedCats(new Set())}
            className="backdrop-blur-sm"
            style={{ borderColor: GREEN, color: GREEN, background: 'transparent' }}
          >
            Collapse All
          </Button>
        </div>
      )}

      {search && totalFiltered === 0 ? (
        <Card className="border-dashed backdrop-blur-md animate-fade-up" style={{ background: c.glassBg, borderColor: c.glassBorder }}>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 mb-3" style={{ color: GREEN, opacity: 0.4 }} />
            <p style={{ color: c.muted }}>No books match your search</p>
          </CardContent>
        </Card>
      ) : categories.length === 0 ? (
        <Card className="border-dashed backdrop-blur-md animate-fade-up" style={{ background: c.glassBg, borderColor: c.glassBorder }}>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 mb-3" style={{ color: GREEN, opacity: 0.4 }} />
            <p style={{ color: c.muted }}>No courses yet. Create a course first.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleCategories.map(({ category, books: catBooks }, gi) => {
            const isExpanded = expandedCats.has(category.id);
            return (
              <div
                key={category.id}
                className="rounded-xl border overflow-hidden backdrop-blur-md animate-fade-up"
                style={{ borderColor: c.glassBorder, background: c.glassBg, ...stagger(gi, 0.12) }}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150"
                  style={{ background: c.groupHeaderBg }}
                  onClick={() => toggleCat(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5" style={{ color: GREEN }} />
                    <span className="font-semibold text-base" style={{ color: c.ink }}>{category.name}</span>
                    <Badge style={{ background: c.badgeBg, color: c.badgeText, border: 'none' }} className="text-xs">
                      {catBooks.length} {catBooks.length === 1 ? 'book' : 'books'}
                    </Badge>
                  </div>
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 transition-transform duration-200" style={{ color: c.muted }} />
                    : <ChevronRight className="h-4 w-4 transition-transform duration-200" style={{ color: c.muted }} />
                  }
                </button>

                {isExpanded && (
                  <div className="p-4" style={{ borderTop: `1px solid ${c.glassBorder}` }}>
                    {catBooks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <BookOpen className="h-8 w-8 mb-2" style={{ color: GREEN, opacity: 0.3 }} />
                        <p className="text-sm" style={{ color: c.muted }}>No books in this course yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {catBooks.map((b, bi) => (
                          <Card
                            key={b.id}
                            className="group backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-up"
                            style={{ background: c.glassBg, borderColor: c.glassBorder, ...stagger(bi, 0.05) }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.glassBorderHover; e.currentTarget.style.background = c.glassBgHover; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.glassBorder; e.currentTarget.style.background = c.glassBg; }}
                          >
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                              <CardTitle className="text-base line-clamp-2" style={{ color: c.ink }}>{b.title}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                style={{ color: RED }}
                                onClick={() => handleDelete(b.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full backdrop-blur-sm transition-transform duration-150 hover:-translate-y-0.5"
                                style={{ borderColor: GREEN, color: GREEN, background: 'transparent' }}
                                asChild
                              >
                                <a href={b.file_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-3 w-3" />Open in Drive
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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