import { useMemo, useState } from 'react';
import { Copy, Filter, Check, MessageSquare, Heart, Bookmark, Eye, TrendingUp } from 'lucide-react';
import { useStore } from '../store';
import { Card, Badge, Button } from '../components/ui';
import { PLATFORM_LABEL, PLATFORM_COLOR, STATUS_LABEL, TYPE_LABEL, type Platform, type Content } from '../types';

export default function Konten() {
  const { contents } = useStore();
  const [filter, setFilter] = useState<'all' | Platform>('all');
  const [selected, setSelected] = useState<Content | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(
    () => contents.filter((c) => filter === 'all' || c.platform === filter),
    [contents, filter],
  );

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (a.scheduled_date + a.scheduled_time).localeCompare(b.scheduled_date + b.scheduled_time)),
    [filtered],
  );

  const copy = async (id: string, text: string) => {
    await navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: contents.length };
    (['threads', 'ig_carousel', 'ig_reels', 'wa_channel'] as Platform[]).forEach((p) => {
      m[p] = contents.filter((c) => c.platform === p).length;
    });
    return m;
  }, [contents]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#1e1e2e]">Konten</h2>
          <p className="text-[13px] text-[#8b8b9e]">Semua konten siap copy-paste. Klik kartu buat liat detail.</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-cardline bg-white p-1">
          {(['all', 'threads', 'ig_carousel', 'ig_reels', 'wa_channel'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                filter === f ? 'bg-rm-500 text-white' : 'text-[#6b6b80] hover:bg-[#f4f4f7]'
              }`}
            >
              {f === 'all' ? 'Semua' : PLATFORM_LABEL[f]} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* List */}
        <div className="xl:col-span-2 space-y-2.5">
          {sorted.map((c) => (
            <Card
              key={c.id}
              className={`p-4 cursor-pointer transition-all hover:border-rm-300 ${selected?.id === c.id ? 'border-rm-400 ring-2 ring-rm-100' : ''}`}
            >
              <div onClick={() => setSelected(c)}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color={PLATFORM_COLOR[c.platform]}>{PLATFORM_LABEL[c.platform]}</Badge>
                  <Badge color="#6b6b80">{TYPE_LABEL[c.content_type]}</Badge>
                  <span className="text-[11px] text-[#a0a0b4]">
                    {c.scheduled_date} • {c.scheduled_time} WIB
                  </span>
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      color: c.status === 'posted' || c.status === 'evaluated' ? '#10b981' : c.status === 'ready' ? '#6060f0' : '#f59e0b',
                      backgroundColor: c.status === 'posted' || c.status === 'evaluated' ? '#d1fae5' : c.status === 'ready' ? '#e0e7ff' : '#fef3c7',
                    }}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                </div>
                <p className="mt-2.5 text-[14px] font-semibold text-[#1e1e2e]">{c.title}</p>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[#6b6b80]">{c.body.replace(/\n/g, ' ')}</p>
                {c.metrics && (
                  <div className="mt-3 flex items-center gap-4 text-[11.5px] text-[#8b8b9e]">
                    <span className="flex items-center gap-1"><Eye size={12} /> {c.metrics.views.toLocaleString('id-ID')}</span>
                    <span className="flex items-center gap-1"><Heart size={12} /> {c.metrics.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={12} /> {c.metrics.replies}</span>
                    <span className="flex items-center gap-1"><Bookmark size={12} /> {c.metrics.saves}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" onClick={() => copy(c.id, c.body)}>
                  {copied === c.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copied === c.id ? 'Tersalin!' : 'Salin Konten'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail */}
        <div className="space-y-4">
          {selected ? (
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <Badge color={PLATFORM_COLOR[selected.platform]}>{PLATFORM_LABEL[selected.platform]}</Badge>
                <span className="text-[11px] text-[#a0a0b4]">{selected.scheduled_time} WIB</span>
              </div>
              <h3 className="mt-3 text-[16px] font-bold leading-snug text-[#1e1e2e]">{selected.title}</h3>
              <div className="mt-4 rounded-xl bg-[#f8f8fb] p-4">
                <p className="whitespace-pre-line text-[13px] leading-relaxed text-[#2a2a3e]">{selected.body}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.hashtags.map((h) => (
                    <span key={h} className="rounded-md bg-rm-50 px-2 py-0.5 text-[11px] font-medium text-rm-600">{h}</span>
                  ))}
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={() => copy(selected.id, selected.body)}>
                {copied === selected.id ? <Check size={15} /> : <Copy size={15} />}
                {copied === selected.id ? 'Tersalin!' : 'Salin Buat Posting'}
              </Button>
              {selected.notes && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
                  💡 {selected.notes}
                </div>
              )}
              {selected.metrics && (
                <div className="mt-3 rounded-xl bg-emerald-50 p-3">
                  <p className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700">
                    <TrendingUp size={13} /> Performa
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white py-2">
                      <p className="text-[15px] font-bold text-[#1e1e2e]">{selected.metrics.views.toLocaleString('id-ID')}</p>
                      <p className="text-[10.5px] text-[#8b8b9e]">Views</p>
                    </div>
                    <div className="rounded-lg bg-white py-2">
                      <p className="text-[15px] font-bold text-[#1e1e2e]">{selected.metrics.replies}</p>
                      <p className="text-[10.5px] text-[#8b8b9e]">Replies</p>
                    </div>
                    <div className="rounded-lg bg-white py-2">
                      <p className="text-[15px] font-bold text-[#1e1e2e]">{selected.metrics.saves}</p>
                      <p className="text-[10.5px] text-[#8b8b9e]">Saves</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <Filter size={24} className="mx-auto text-[#c8c8d4]" />
              <p className="mt-2 text-[13px] font-medium text-[#6b6b80]">Pilih konten buat liat detail</p>
              <p className="text-[12px] text-[#a0a0b4]">Copy-paste siap posting, performa, dan catatan.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
