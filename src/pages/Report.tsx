import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, Badge } from '../components/ui';
import { useStore } from '../store';
import { PLATFORM_LABEL, TYPE_LABEL } from '../types';

const TYPE_COLORS: Record<string, string> = {
  hook: '#6060f0',
  insight: '#10b981',
  tutorial: '#f59e0b',
  intermezzo: '#ec4899',
  confession: '#8b5cf6',
  cta: '#06b6d4',
  value: '#f97316',
  reflection: '#14b8a6',
  testimoni: '#6366f1',
};

export default function Report() {
  const { contents } = useStore();

  const evaluated = useMemo(() => contents.filter((c) => c.metrics), [contents]);

  const byDay = useMemo(() => {
    return evaluated
      .filter((c) => c.posted_at)
      .sort((a, b) => (a.posted_at! < b.posted_at! ? -1 : 1))
      .map((c) => ({
        name: c.title.length > 14 ? c.title.slice(0, 14) + '…' : c.title,
        views: c.metrics!.views,
        replies: c.metrics!.replies,
        saves: c.metrics!.saves,
      }));
  }, [evaluated]);

  const byPlatform = useMemo(() => {
    const m: Record<string, { views: number; replies: number; saves: number }> = {};
    evaluated.forEach((c) => {
      const k = PLATFORM_LABEL[c.platform];
      m[k] = m[k] || { views: 0, replies: 0, saves: 0 };
      m[k].views += c.metrics!.views;
      m[k].replies += c.metrics!.replies;
      m[k].saves += c.metrics!.saves;
    });
    return Object.entries(m).map(([name, v]) => ({ name, ...v }));
  }, [evaluated]);

  const byType = useMemo(() => {
    const m: Record<string, number> = {};
    evaluated.forEach((c) => {
      const k = TYPE_LABEL[c.content_type];
      m[k] = (m[k] || 0) + c.metrics!.views;
    });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [evaluated]);

  const totals = useMemo(() => {
    const t = { views: 0, replies: 0, likes: 0, saves: 0, followers: 0, dms: 0, signups: 0 };
    evaluated.forEach((c) => {
      t.views += c.metrics!.views;
      t.replies += c.metrics!.replies;
      t.likes += c.metrics!.likes;
      t.saves += c.metrics!.saves;
      t.followers += c.metrics!.followers_gained;
      t.dms += c.metrics!.dms;
      t.signups += c.metrics!.signups;
    });
    return t;
  }, [evaluated]);

  const engagementRate = totals.views > 0 ? ((totals.replies + totals.likes + totals.saves) / totals.views) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#1e1e2e]">Report</h2>
        <p className="text-[13px] text-[#8b8b9e]">Metrik minggu lalu (27 Jul - 2 Agu) sebagai baseline.</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-[12.5px] font-medium text-[#8b8b9e]">Total Views</p>
          <p className="mt-1 text-[24px] font-bold text-[#1e1e2e]">{totals.views.toLocaleString('id-ID')}</p>
          <Badge color="#10b981" bg="#10b98114">baseline</Badge>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] font-medium text-[#8b8b9e]">Engagement Rate</p>
          <p className="mt-1 text-[24px] font-bold text-[#1e1e2e]">{engagementRate.toFixed(1)}%</p>
          <Badge color="#6060f0" bg="#6060f014">replies+likes+saves</Badge>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] font-medium text-[#8b8b9e]">Followers Bertambah</p>
          <p className="mt-1 text-[24px] font-bold text-[#1e1e2e]">+{totals.followers}</p>
          <Badge color="#f59e0b" bg="#f59e0b14">target M1: 50</Badge>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] font-medium text-[#8b8b9e]">Signup dari Konten</p>
          <p className="mt-1 text-[24px] font-bold text-[#1e1e2e]">{totals.signups}</p>
          <Badge color="#ec4899" bg="#ec489914">target M1: 10</Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Views per content */}
        <Card>
          <CardHeader title="Views per Konten" subtitle="Minggu lalu, konten yang udah dievaluasi" />
          <div className="px-5 pb-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: '#8b8b9e' }} axisLine={false} tickLine={false} interval={0} angle={-12} height={50} />
                <YAxis tick={{ fontSize: 10.5, fill: '#8b8b9e' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f4f4f7' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e8e8ee', fontSize: 12, boxShadow: '0 4px 12px rgba(16,16,32,0.08)' }}
                />
                <Bar dataKey="views" fill="#6060f0" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Replies per content */}
        <Card>
          <CardHeader title="Replies per Konten" subtitle="Reply-bait = sinyal algoritma" />
          <div className="px-5 pb-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: '#8b8b9e' }} axisLine={false} tickLine={false} interval={0} angle={-12} height={50} />
                <YAxis tick={{ fontSize: 10.5, fill: '#8b8b9e' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e8e8ee', fontSize: 12, boxShadow: '0 4px 12px rgba(16,16,32,0.08)' }}
                />
                <Line type="monotone" dataKey="replies" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform breakdown */}
        <Card>
          <CardHeader title="Performa per Platform" subtitle="Views & replies" />
          <div className="px-5 pb-5 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPlatform} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8b8b9e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: '#8b8b9e' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e8e8ee', fontSize: 12, boxShadow: '0 4px 12px rgba(16,16,32,0.08)' }}
                />
                <Bar dataKey="views" fill="#6060f0" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="replies" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Type breakdown */}
        <Card>
          <CardHeader title="Views per Jenis Konten" subtitle="Cari formula yang paling jalan" />
          <div className="px-5 pb-5 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {byType.map((t) => (
                    <Cell key={t.name} fill={TYPE_COLORS[t.name] || '#6060f0'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e8e8ee', fontSize: 12, boxShadow: '0 4px 12px rgba(16,16,32,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 pb-4">
              {byType.map((t) => (
                <span key={t.name} className="flex items-center gap-1.5 text-[11px] text-[#6b6b80]">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[t.name] || '#6060f0' }} />
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Insight */}
      <Card className="p-5">
        <h3 className="text-[15px] font-semibold text-[#1e1e2e]">Insight Otomatis</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: '🏆', text: 'Konten intermezzo relatable perform terbaik (12.400 views). Jenis ini layak diposting 1x/minggu.', color: '#10b981' },
            { icon: '💬', text: 'Reply-bait "angkat tangan" dan "kamu di titik mana?" konsisten ngasih 15-40 replies. Pertahankan pola ini.', color: '#6060f0' },
            { icon: '⚠️', text: 'Konsistensi posting 89%. 1 hari terlewat share ke WA Channel. Coba pasang reminder.', color: '#f59e0b' },
            { icon: '🎯', text: `Target M1: 50 followers & 10 signup. Saat ini +${totals.followers} followers & ${totals.signups} signup dari minggu pertama.`, color: '#ec4899' },
          ].map((x, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-cardline bg-[#fafafc] p-3.5">
              <span className="text-[18px]">{x.icon}</span>
              <p className="text-[12.5px] leading-relaxed text-[#2a2a3e]">{x.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
