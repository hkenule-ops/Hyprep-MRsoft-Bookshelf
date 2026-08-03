import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2, Users, Copy, RefreshCw, Search, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { User, Category } from '@/types';

const GREEN = '#008751';
const RED = '#C8102E';

export default function ManageStudents() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [students, setStudents] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const [assignUser, setAssignUser] = useState<User | null>(null);
  const [assignCats, setAssignCats] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  const [openPinReset, setOpenPinReset] = useState(false);
  const [resetPinUser, setResetPinUser] = useState<User | null>(null);
  const [resetPinValue, setResetPinValue] = useState('');

  const UNASSIGNED_KEY = '__unassigned__';

  const c = {
    ink: isDark ? '#EAF3EE' : '#0B2E22',
    muted: isDark ? 'rgba(234,243,238,0.62)' : '#5B6B63',
    glassBg: isDark ? 'rgba(11,42,29,0.5)' : 'rgba(255,255,255,0.6)',
    glassBgHover: isDark ? 'rgba(11,42,29,0.68)' : 'rgba(255,255,255,0.82)',
    glassBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
    glassBorderHover: isDark ? 'rgba(0,135,81,0.5)' : 'rgba(0,135,81,0.35)',
    codeBg: isDark ? 'rgba(0,135,81,0.2)' : 'rgba(0,135,81,0.1)',
    codeText: isDark ? '#7CD9AE' : '#006B3F',
    badgeBg: isDark ? 'rgba(0,135,81,0.22)' : 'rgba(0,135,81,0.12)',
    badgeText: isDark ? '#7CD9AE' : '#006B3F',
  };

  const load = async () => {
    const [u, cats] = await Promise.all([api.getUsers(), api.getCategories()]);
    if (u.data?.users) setStudents(u.data.users.filter((x) => x.role === 'student'));
    if (cats.data?.categories) setCategories(cats.data.categories);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const allGroupIds = categories.map((cat) => cat.id);
      allGroupIds.push(UNASSIGNED_KEY);
      setCollapsedGroups(new Set(allGroupIds));
    }
  }, [categories]);

  const handleCreate = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (!email.trim() && !phone.trim()) {
      toast.error('Provide either an email or a phone number');
      return;
    }
    setCreating(true);
    const res = await api.createUser(email.trim(), phone.trim(), selectedCats, name.trim());
    setCreating(false);
    if (res.success && res.data) {
      setNewPin(res.data.pin);
      toast.success('Trainee created');
      setEmail('');
      setPhone('');
      setName('');
      setSelectedCats([]);
      load();
    } else {
      toast.error(res.error || 'Failed');
    }
  };

  const handleRegenPin = async (user: User) => {
    setResetPinUser(user);
    const res = await api.regeneratePin(user.id);
    if (res.success && res.data) {
      setResetPinValue(res.data.pin);
      setOpenPinReset(true);
      load();
    } else {
      toast.error(res.error || 'Failed');
    }
  };

  const handleAssign = async () => {
    if (!assignUser) return;
    setAssigning(true);
    const res = await api.assignCategory(assignUser.id, assignCats);
    setAssigning(false);
    if (res.success) { toast.success('Course updated'); setAssignUser(null); load(); }
    else toast.error(res.error || 'Failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trainee?')) return;
    const res = await api.deleteUser(id);
    if (res.success) { toast.success('Deleted'); load(); }
    else toast.error(res.error || 'Failed');
  };

  const toggleCat = (id: string, list: string[], set: (v: string[]) => void) => {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const catName = (id: string) => categories.find((cat) => cat.id === id)?.name || id;

  const filtered = students.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.phone && s.phone.toLowerCase().includes(search.toLowerCase())) ||
    (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped: { id: string; label: string; students: User[] }[] = [
    ...categories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      students: filtered.filter((s) => s.categories.includes(cat.id)),
    })),
    {
      id: UNASSIGNED_KEY,
      label: 'Unassigned',
      students: filtered.filter((s) => s.categories.length === 0),
    },
  ].filter((g) => g.students.length > 0);

  const stagger = (i: number, base = 0) => ({ animationDelay: `${base + Math.min(i, 8) * 0.05}s` });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" style={{ color: GREEN }} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: GREEN }}>Manage</span>
          <h1 className="text-2xl font-bold mt-1" style={{ color: c.ink, fontFamily: 'Georgia, serif' }}>Trainees</h1>
          <p className="text-sm mt-1" style={{ color: c.muted }}>Manage trainee accounts & course access</p>
        </div>
        <Dialog open={openCreate} onOpenChange={(v) => { setOpenCreate(v); if (!v) setNewPin(''); }}>
          <DialogTrigger asChild>
            <Button
              className="transition-transform duration-150 hover:-translate-y-0.5"
              style={{ background: GREEN, color: '#fff', border: 'none' }}
            >
              <Plus className="mr-2 h-4 w-4" />Add Trainee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle style={{ fontFamily: 'Georgia, serif' }}>{newPin ? 'Trainee Created!' : 'Add Trainee'}</DialogTitle></DialogHeader>
            {newPin ? (
              <div className="space-y-4 text-center">
                <p className="text-sm" style={{ color: c.muted }}>Share this PIN with the trainee (shown once):</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-2xl font-mono font-bold px-4 py-2 rounded-lg" style={{ background: c.codeBg, color: c.codeText }}>{newPin}</code>
                  <Button variant="outline" size="icon" style={{ borderColor: GREEN, color: GREEN }} onClick={() => { navigator.clipboard.writeText(newPin); toast.success('Copied!'); }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" onClick={() => { setNewPin(''); setOpenCreate(false); }} className="w-full" style={{ borderColor: GREEN, color: GREEN }}>Done</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name <span style={{ color: RED }}>*</span></label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="optional@example.com"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    maxLength={20}
                  />
                </div>
                <p className="text-xs" style={{ color: c.muted }}>Provide at least one of email or phone number.</p>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Assign Course</label>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {categories.length === 0 ? (
                      <p className="text-sm" style={{ color: c.muted }}>Create Course first</p>
                    ) : categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={selectedCats.includes(cat.id)} onCheckedChange={() => toggleCat(cat.id, selectedCats, setSelectedCats)} />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreate} disabled={creating} className="w-full" style={{ background: GREEN, color: '#fff', border: 'none' }}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Trainee
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm animate-fade-up" style={{ animationDelay: '0.06s' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: c.muted }} />
        <Input
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:-translate-y-0.5"
          style={{ background: c.glassBg, borderColor: c.glassBorder, color: c.ink, ['--tw-ring-color' as string]: GREEN }}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed backdrop-blur-md animate-fade-up" style={{ background: c.glassBg, borderColor: c.glassBorder }}>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 mb-3" style={{ color: GREEN, opacity: 0.4 }} />
            <p style={{ color: c.muted }}>{search ? 'No matching trainees' : 'No trainees yet'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {grouped.map((group, gi) => {
            const isCollapsed = collapsedGroups.has(group.id);
            return (
              <div key={group.id} className="animate-fade-up" style={stagger(gi, 0.08)}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center gap-2 py-2 px-1 text-left transition-opacity hover:opacity-75"
                >
                  {isCollapsed
                    ? <ChevronRight className="h-4 w-4 flex-shrink-0 transition-transform duration-200" style={{ color: c.muted }} />
                    : <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform duration-200" style={{ color: c.muted }} />
                  }
                  <span className="font-semibold text-sm" style={{ color: group.id === UNASSIGNED_KEY ? c.ink : GREEN }}>
                    {group.label}
                  </span>
                  <span className="text-xs ml-1" style={{ color: c.muted }}>
                    ({group.students.length} {group.students.length === 1 ? 'trainee' : 'trainees'})
                  </span>
                  <div className="flex-1 h-px ml-2" style={{ background: c.glassBorder }} />
                </button>

                {!isCollapsed && (
                  <div className="space-y-2 mt-1">
                    {group.students.map((s, si) => (
                      <Card
                        key={s.id}
                        className="backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg animate-fade-up"
                        style={{ background: c.glassBg, borderColor: c.glassBorder, ...stagger(si, 0.03) }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.glassBorderHover; e.currentTarget.style.background = c.glassBgHover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.glassBorder; e.currentTarget.style.background = c.glassBg; }}
                      >
                        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
                          <div className="space-y-1 min-w-0">
                            <p className="font-medium truncate" style={{ color: c.ink }}>
                              {s.name && <span>{s.name}</span>}
                              {(s.email || s.phone) && (
                                <span className="text-sm ml-2" style={{ color: c.muted }}>
                                  ({[s.email, s.phone].filter(Boolean).join(' · ')})
                                </span>
                              )}
                              {!s.name && !s.email && !s.phone && <span>—</span>}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {s.categories.length === 0 ? (
                                <span className="text-xs" style={{ color: c.muted }}>No categories assigned</span>
                              ) : s.categories.map((cid) => (
                                <Badge key={cid} style={{ background: c.badgeBg, color: c.badgeText, border: 'none' }} className="text-xs">{catName(cid)}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="outline" size="sm" style={{ borderColor: GREEN, color: GREEN, background: 'transparent' }} onClick={() => { setAssignUser(s); setAssignCats([...s.categories]); }}>
                              Assign
                            </Button>
                            <Button variant="outline" size="sm" style={{ borderColor: GREEN, color: GREEN, background: 'transparent' }} onClick={() => handleRegenPin(s)}>
                              <RefreshCw className="h-3 w-3 mr-1" />PIN
                            </Button>
                            <Button variant="ghost" size="sm" style={{ color: RED }} onClick={() => handleDelete(s.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PIN Reset Dialog */}
      <Dialog open={openPinReset} onOpenChange={(v) => { setOpenPinReset(v); if (!v) { setResetPinUser(null); setResetPinValue(''); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle style={{ fontFamily: 'Georgia, serif' }}>PIN Reset Successful!</DialogTitle></DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-sm" style={{ color: c.muted }}>
              New PIN for {resetPinUser?.name || resetPinUser?.email || resetPinUser?.phone}:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-2xl font-mono font-bold px-4 py-2 rounded-lg" style={{ background: c.codeBg, color: c.codeText }}>
                {resetPinValue}
              </code>
              <Button variant="outline" size="icon" style={{ borderColor: GREEN, color: GREEN }} onClick={() => { navigator.clipboard.writeText(resetPinValue); toast.success('Copied!'); }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={() => { setOpenPinReset(false); setResetPinUser(null); setResetPinValue(''); }} className="w-full" style={{ borderColor: GREEN, color: GREEN }}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={!!assignUser} onOpenChange={(v) => { if (!v) setAssignUser(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle style={{ fontFamily: 'Georgia, serif' }}>Assign Categories — {assignUser?.name || assignUser?.email || assignUser?.phone}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-auto">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={assignCats.includes(cat.id)} onCheckedChange={() => toggleCat(cat.id, assignCats, setAssignCats)} />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
            <Button onClick={handleAssign} disabled={assigning} className="w-full" style={{ background: GREEN, color: '#fff', border: 'none' }}>
              {assigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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