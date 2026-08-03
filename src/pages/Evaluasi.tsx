import { useMemo, useState } from 'react';
import { Target, CheckCircle2, AlertCircle, RefreshCw, Save } from 'lucide-react';
import { useStore } from '../store';
import { Card, CardHeader, Badge, Button, ProgressBar } from '../components/ui';

const GOALS = [
  { key: 'followers', label: 'Followers +50', current: 65, target: 50, unit: 'orang', hint: 'dari total 65 followers bertambah (2 minggu)' },
  { key: 'signups', label: 'Signup 10', current: 10, target: 10, unit: 'orang', hint: 'dari konten & landing page' },
  { key: 'views', label: 'Views 50.000', current: 46200, target: 50000, unit: 'views', hint: 'total views semua platform' },
  { key: 'replies', label: 'Rata-rata 20 replies/post', current: 25.8, target: 20, unit: 'reply', hint: 'hitung dari 6 konten dievaluasi' },
];

export default function Evaluasi() {
  const { contents, setStatus, dailyLogs, resetData } = useStore();
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');

  const evaluated = useMemo(() => contents.filter((c) => c.metrics), [contents]);
  const posted = contents.filter((c) => c.status === 'posted');

  const avgReplies = evaluated.length ? evaluated.reduce((s, c) => s + (c.metrics?.replies || 0), 0) / evaluated.length : 0;
  const totalViews = evaluated.reduce((s, c) => s + (c.metrics?.views || 0), 0);
  const totalFollowers = evaluated.reduce((s, c) => s + (c.metrics?.followers_gained || 0), 0);
  const totalSignups = evaluated.reduce((s, c) => s + (c.metrics?.signups || 0), 0);

  const actual = {
    followers: totalFollowers,
    signups: totalSignups,
    views: totalViews,
    replies: avgReplies,
  };

  const evalAll = () => {
    posted.forEach((c) => setStatus(c.id, 'evaluated'));
  };

  const adherence = dailyLogs.length ? (dailyLogs.filter((l) => l.posted_morning).length / dailyLogs.length) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#1e1e2e]">Evaluasi</h2>
          <p className="text-[13px] text-[#8b8b9e]">Pantau target M1 dan evaluasi mingguan. Update angkanya tiap Minggu malam.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetData}>
            <RefreshCw size={14} /> Reset Data Demo
          </Button>
          <Button onClick={evalAll}>
            <CheckCircle2 size={14} /> Evaluasi Semua Posted
          </Button>
        </div>
      </div>

      {/* Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GOALS.map((g) => {
          const val = actual[g.key as keyof typeof actual];
          const pct = Math.min((val / g.target) * 100, 100);
          const done = val >= g.target;
          return (
            <Card key={g.key} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {done ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <Target size={18} className="text-rm-500" />
                  )}
                  <h3 className="text-[14.5px] font-semibold text-[#1e1e2e]">{g.label}</h3>
                </div>
                <Badge color={done ? '#10b981' : '#f59e0b'} bg={done ? '#10b98114' : '#f59e0b14'}>
                  {done ? 'Tercapai' : 'Dalam proses'}
                </Badge>
              </div>
              <p className="mt-3 text-[11.5px] text-[#8b8b9e]">{g.hint}</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className={`text-[26px] font-bold ${done ? 'text-emerald-500' : 'text-[#1e1e2e]'}`}>
                  {typeof val === 'number' ? val.toLocaleString('id-ID') : val}
                </span>
                <span className="text-[12px] text-[#a0a0b4]">/ {g.target} {g.unit}</span>
              </div>
              <div className="mt-3">
                <ProgressBar value={pct} color={done ? '#10b981' : '#6060f0'} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Konsistensi */}
        <Card>
          <CardHeader title="Konsistensi Mingguan" subtitle="Checklist harian minggu lalu" />
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12.5px] text-[#8b8b9e]">Posting sesuai jadwal</span>
              <span className="text-[14px] font-bold text-[#1e1e2e]">{adherence.toFixed(0)}%</span>
            </div>
            <ProgressBar value={adherence} color="#10b981" />
            <div className="mt-4 space-y-2">
              {dailyLogs.map((l) => (
                <div key={l.date} className="flex items-center gap-2 rounded-lg bg-[#fafafc] px-3 py-2">
                  <span className="w-24 text-[12px] font-medium text-[#4a4a5e]">{l.date.slice(5)}</span>
                  {l.posted_morning ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={14} className="text-rose-400" />
                  )}
                  <span className="text-[11.5px] text-[#8b8b9e]">
                    {l.posted_morning ? 'Posted' : 'Missed'} {l.shared_wa ? '• WA ✓' : '• WA ✗'}
                  </span>
                  {l.notes && <span className="ml-auto truncate text-[11px] italic text-[#a0a0b4]">{l.notes}</span>}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Review mingguan */}
        <Card>
          <CardHeader title="Review Mingguan" subtitle="Apa yang jalan, apa yang nggak" />
          <div className="px-5 pb-5">
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3.5">
                <p className="text-[12px] font-semibold text-emerald-700">✅ Yang jalan minggu ini</p>
                <ul className="mt-1.5 space-y-1 text-[12.5px] text-emerald-800">
                  <li>• Intermezzo relatable juara: 12.400 views, 40 replies</li>
                  <li>• Confession story saves tinggi (55) = orang nyimpen buat dibaca ulang</li>
                  <li>• Reply-bait di akhir post konsisten ngasih engagement</li>
                </ul>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3.5">
                <p className="text-[12px] font-semibold text-amber-700">⚠️ Yang perlu diperbaiki</p>
                <ul className="mt-1.5 space-y-1 text-[12.5px] text-amber-800">
                  <li>• 1 hari lupa share ke WA Channel (29/7) — pasang reminder</li>
                  <li>• Cross-comment baru jalan 4 dari 6 hari</li>
                  <li>• IG Carousel belum mulai minggu ini — siapkan 2 carousel</li>
                </ul>
              </div>
            </div>

            <label className="mt-4 block text-[12.5px] font-semibold text-[#4a4a5e]">Catatan evaluasi sendiri</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: minggu depan fokus ke tutorial micro-thread, coba variasi hook..."
              className="mt-1.5 min-h-[90px] w-full rounded-xl border border-cardline bg-[#fafafc] p-3 text-[13px] outline-none focus:border-rm-400 focus:ring-2 focus:ring-rm-100"
            />
            <div className="mt-3 flex justify-end">
              <Button
                onClick={() => {
                  setSavedNote(note || 'Catatan disimpan.');
                  setNote('');
                }}
              >
                <Save size={14} /> Simpan Catatan
              </Button>
            </div>
            {savedNote && (
              <p className="mt-2 rounded-lg bg-rm-50 px-3 py-2 text-[12px] text-rm-700">💾 {savedNote}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
