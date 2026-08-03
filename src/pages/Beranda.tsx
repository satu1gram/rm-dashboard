import { useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  TrendingUp,
  Users,
  MessageSquare,
  ChevronRight,
  CalendarDays,
  ListTodo,
  Copy,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store';
import { Card, CardHeader, Badge, Button, StatCard, ProgressBar } from '../components/ui';
import type { PageKey } from '../components/Topbar';
import { PLATFORM_LABEL, PLATFORM_COLOR, TYPE_LABEL } from '../types';
import { WEEK_START, WEEK_END } from '../data/seed';

function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
}

export default function Beranda({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  const { contents } = useStore();

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const week = contents.filter((c) => c.scheduled_date >= WEEK_START && c.scheduled_date <= WEEK_END);
    const posted = week.filter((c) => c.status === 'posted' || c.status === 'evaluated').length;
    const ready = week.filter((c) => c.status === 'ready').length;
    const draft = week.filter((c) => c.status === 'draft' || c.status === 'idea').length;
    return { total: week.length, posted, ready, draft };
  }, [contents]);

  const todayContents = useMemo(
    () => contents.filter((c) => c.scheduled_date === todayStr && c.status !== 'posted' && c.status !== 'evaluated'),
    [contents, todayStr],
  );

  const nextUp = useMemo(
    () =>
      contents
        .filter((c) => c.scheduled_date >= todayStr && c.status !== 'posted' && c.status !== 'evaluated')
        .sort((a, b) => (a.scheduled_date + a.scheduled_time).localeCompare(b.scheduled_date + b.scheduled_time))
        .slice(0, 4),
    [contents, todayStr],
  );

  const tasks = [
    { label: 'Posting Threads pagi', done: todayContents.length < 2, time: '06.00' },
    { label: 'Share ke WA Channel minta support reply', done: false, time: 'Setelah post' },
    { label: 'Balas komentar (maks 1 jam)', done: false, time: 'Sesudah 06.00' },
    { label: 'Cross-comment 3-5 akun UMKM', done: false, time: '17.00' },
    { label: 'Posting Threads sore', done: false, time: '17.00' },
  ];
  const doneCount = tasks.filter((t) => t.done).length;

  const totalViews = contents.reduce((s, c) => s + (c.metrics?.views || 0), 0);
  const totalFollowers = contents.reduce((s, c) => s + (c.metrics?.followers_gained || 0), 0);
  const totalSignups = contents.reduce((s, c) => s + (c.metrics?.signups || 0), 0);

  return (
    <div className="space-y-3">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-rm-500 px-5 py-5 text-white shadow-[0_8px_24px_rgba(96,96,240,0.28)]">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute right-24 -bottom-20 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[18px] font-bold tracking-tight">
              Hi, Salinov! Konten apa yang harus kamu posting hari ini?
            </h1>
            <p className="mt-1 text-[12.5px] text-white/85 max-w-xl">
              Dashboard ini dirancang buat ngebantu kamu ngatur konten Threads, IG, sama WA Channel mitra BP. Rencana, pantau, evaluasi, semua di satu tempat.
            </p>
          </div>
          <Button variant="ghost" className="!text-white !bg-white/15 hover:!bg-white/25" onClick={() => onNavigate('konten')}>
            <Sparkles size={14} /> Lihat Konten Hari Ini
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard icon={<FileText size={17} />} label="Konten Minggu Ini" value={String(stats.total)} delta={`${stats.posted} posted`} color="#6060f0" />
        <StatCard icon={<CheckCircle2 size={17} />} label="Sudah Diposting" value={String(stats.posted)} delta={`${stats.ready} ready`} color="#10b981" />
        <StatCard icon={<Users size={17} />} label="Followers Bertambah" value={`+${totalFollowers}`} delta="7 hari" color="#f59e0b" />
        <StatCard icon={<TrendingUp size={17} />} label="Total Views" value={totalViews.toLocaleString('id-ID')} delta={`${totalSignups} signup`} color="#ec4899" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {/* LEFT column */}
        <div className="space-y-3 xl:col-span-2">
          {/* Today */}
          <Card>
            <CardHeader
              title="Konten Hari Ini"
              subtitle={fmtDate(todayStr)}
              action={
                <Button variant="outline" onClick={() => onNavigate('konten')}>
                  Semua Konten <ChevronRight size={14} />
                </Button>
              }
            />
            <div className="px-5 pb-5 space-y-3">
              {todayContents.length === 0 && (
                <div className="rounded-xl border border-dashed border-cardline bg-[#fafafc] p-4 text-center text-[13px] text-[#8b8b9e]">
                  Tidak ada konten terjadwal hari ini. Santai dulu, atau siapkan konten besok. ✨
                </div>
              )}
              {todayContents.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-cardline bg-[#fafafc] p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: PLATFORM_COLOR[c.platform] + '18', color: PLATFORM_COLOR[c.platform] }}>
                    <MessageSquare size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-[#1e1e2e]">{c.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge color={PLATFORM_COLOR[c.platform]}>{PLATFORM_LABEL[c.platform]}</Badge>
                      <Badge color="#6b6b80">{TYPE_LABEL[c.content_type]}</Badge>
                      <span className="text-[11px] text-[#a0a0b4]">{c.scheduled_time} WIB</span>
                    </div>
                  </div>
                  <Button onClick={() => navigator.clipboard?.writeText(c.body)}>
                    <Copy size={14} /> Salin
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Today tasks */}
          <Card>
            <CardHeader title="To-Do Hari Ini" subtitle={`${doneCount} dari ${tasks.length} selesai`} />
            <div className="px-5 pb-5">
              <div className="mb-4">
                <ProgressBar value={(doneCount / tasks.length) * 100} />
              </div>
              <div className="space-y-1">
                {tasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#fafafc]">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        t.done ? 'border-rm-500 bg-rm-500 text-white' : 'border-[#d4d4dc]'
                      }`}
                    >
                      {t.done && <CheckCircle2 size={13} />}
                    </div>
                    <span className={`flex-1 text-[13.5px] ${t.done ? 'text-[#a0a0b4] line-through' : 'text-[#2a2a3e]'}`}>
                      {t.label}
                    </span>
                    <span className="rounded-md bg-[#f0f0f6] px-2 py-0.5 text-[11px] font-medium text-[#8b8b9e]">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT column */}
        <div className="space-y-3">
          {/* Mini calendar */}
          <Card>
            <CardHeader title="Jadwal Minggu Ini" subtitle={`${WEEK_START.slice(8, 10)} - ${WEEK_END.slice(8, 10)} Agu`} action={<CalendarDays size={16} className="text-rm-500" />} />
            <div className="px-5 pb-5">
              <div className="grid grid-cols-7 gap-1.5">
                {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-semibold text-[#a0a0b4]">{d}</div>
                ))}
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date(2026, 7, 3 + i);
                  const ds = date.toISOString().slice(0, 10);
                  const has = contents.some((c) => c.scheduled_date === ds);
                  const isToday = ds === todayStr;
                  return (
                    <div
                      key={i}
                      className={`flex h-10 flex-col items-center justify-center rounded-lg text-[12.5px] font-medium ${
                        isToday ? 'bg-rm-500 text-white shadow-sm' : has ? 'bg-rm-50 text-rm-600' : 'text-[#6b6b80]'
                      }`}
                    >
                      {3 + i}
                      {has && <span className={`mt-0.5 h-1 w-1 rounded-full ${isToday ? 'bg-white' : 'bg-rm-500'}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Next up */}
          <Card>
            <CardHeader title="Next Up" subtitle="Konten berikutnya" action={<ListTodo size={16} className="text-rm-500" />} />
            <div className="px-5 pb-5 space-y-2.5">
              {nextUp.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => onNavigate('kanban')}
                  className="group flex w-full items-center gap-3 rounded-xl border border-cardline p-3 text-left transition-colors hover:border-rm-200 hover:bg-rm-50/40"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rm-500 text-[11px] font-bold text-white">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#1e1e2e]">{c.title}</p>
                    <p className="text-[11px] text-[#a0a0b4]">
                      {fmtDate(c.scheduled_date)} • {c.scheduled_time}
                    </p>
                  </div>
                  <ChevronRight size={15} className="text-[#c8c8d4] group-hover:text-rm-500" />
                </button>
              ))}
            </div>
          </Card>

          {/* Week progress */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#1e1e2e]">Progress Minggu Ini</h3>
              <Badge color="#10b981" bg="#10b98114">{Math.round((stats.posted / Math.max(stats.total, 1)) * 100)}%</Badge>
            </div>
            <div className="mt-4">
              <ProgressBar value={(stats.posted / Math.max(stats.total, 1)) * 100} color="#10b981" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { v: stats.posted, l: 'Posted', c: '#10b981' },
                { v: stats.ready, l: 'Ready', c: '#6060f0' },
                { v: stats.draft, l: 'Draft/Idea', c: '#f59e0b' },
              ].map((x) => (
                <div key={x.l} className="rounded-xl bg-[#f8f8fb] py-3">
                  <p className="text-[18px] font-bold" style={{ color: x.c }}>{x.v}</p>
                  <p className="text-[11px] text-[#8b8b9e]">{x.l}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
