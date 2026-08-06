import { useMemo, useState } from 'react';
import { Plus, ChevronRight, ChevronLeft, Copy, X } from 'lucide-react';
import { useStore } from '../store';
import { Badge, Button } from '../components/ui';
import { PLATFORM_LABEL, PLATFORM_COLOR, STATUS_LABEL, TYPE_LABEL, type Status, type Platform, type ContentType } from '../types';
import { localDateStr } from '../types';

const COLUMNS: { status: Status; color: string; bg: string }[] = [
  { status: 'idea', color: '#6b6b80', bg: '#f4f4f7' },
  { status: 'draft', color: '#b45309', bg: '#fef3c7' },
  { status: 'ready', color: '#4338ca', bg: '#e0e7ff' },
  { status: 'posted', color: '#047857', bg: '#d1fae5' },
  { status: 'evaluated', color: '#be185d', bg: '#fce7f3' },
];

const ORDER: Status[] = ['idea', 'draft', 'ready', 'posted', 'evaluated'];

const PLATFORMS: Platform[] = ['threads', 'ig_carousel', 'ig_reels', 'wa_channel'];
const TYPES: ContentType[] = ['hook', 'insight', 'tutorial', 'intermezzo', 'cta', 'testimoni', 'confession', 'value', 'reflection'];

const inputCls =
  'w-full rounded-xl border border-cardline bg-white px-3 py-2 text-[13px] text-[#1e1e2e] outline-none transition duration-150 placeholder:text-[#76768c] focus:border-rm-400 focus:ring-2 focus:ring-rm-100';

function NewContentModal({ onClose }: { onClose: () => void }) {
  const { addContent } = useStore();
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('threads');
  const [contentType, setContentType] = useState<ContentType>('hook');
  const [date, setDate] = useState(localDateStr());
  const [time, setTime] = useState('06:00');
  const [body, setBody] = useState('');

  const submit = () => {
    if (!title.trim()) return;
    addContent({
      title: title.trim(),
      platform,
      content_type: contentType,
      body: body.trim() || title.trim(),
      hashtags: ['#RekapanMitra'],
      scheduled_date: date,
      scheduled_time: time,
      status: 'idea',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#1e1e2e]/40 p-4 pt-[10vh] backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Tambah konten baru"
    >
      <div className="w-full max-w-md rounded-2xl border border-cardline bg-white p-5 shadow-[0_16px_48px_rgba(16,16,32,0.18)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#1e1e2e]">Konten Baru</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6b6b80] transition duration-150 hover:bg-[#f4f4f7] active:scale-95"
            title="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#4a4a5e]">Judul</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: 3 Masalah Catat Transaksi" className={inputCls} autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#4a4a5e]">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)} className={inputCls}>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{PLATFORM_LABEL[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#4a4a5e]">Jenis</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value as ContentType)} className={inputCls}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_LABEL[t]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#4a4a5e]">Tanggal</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#4a4a5e]">Jam</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#4a4a5e]">Isi konten</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Tulis draft di sini..."
              className={`${inputCls} resize-y`}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={submit} disabled={!title.trim()}>Simpan</Button>
        </div>
      </div>
    </div>
  );
}

export default function Kanban() {
  const { contents, setStatus } = useStore();
  const [showNew, setShowNew] = useState(false);

  const groups = useMemo(() => {
    const map: Record<Status, typeof contents> = { idea: [], draft: [], ready: [], posted: [], evaluated: [] };
    contents.forEach((c) => map[c.status].push(c));
    return map;
  }, [contents]);

  const move = (id: string, dir: -1 | 1) => {
    const c = contents.find((x) => x.id === id);
    if (!c) return;
    const idx = ORDER.indexOf(c.status);
    const next = ORDER[idx + dir];
    if (next) setStatus(id, next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-bold text-[#1e1e2e]">Kanban Konten</h2>
          <p className="text-[13px] text-[#6b6b80]">Pakai tombol panah buat pindahin status konten.</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus size={15} /> Konten Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        {COLUMNS.map(({ status, color, bg }) => (
          <div key={status} className="flex flex-col rounded-2xl border border-cardline bg-[#f8f8fb] min-h-[300px]">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[13.5px] font-semibold text-[#1e1e2e]">{STATUS_LABEL[status]}</span>
              </div>
              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ backgroundColor: bg, color }}>
                {groups[status].length}
              </span>
            </div>
            <div className="flex-1 space-y-2.5 px-3 pb-3">
              {groups[status].map((c) => (
                <div key={c.id} className="group rounded-xl border border-cardline bg-white p-3 shadow-[0_1px_2px_rgba(16,16,32,0.04)] transition duration-150 hover:border-rm-200">
                  <div className="flex items-start justify-between gap-2">
                    <Badge color={PLATFORM_COLOR[c.platform]}>{PLATFORM_LABEL[c.platform]}</Badge>
                    <span className="text-[10.5px] text-[#76768c]">{c.scheduled_date.slice(8, 10)}/{c.scheduled_date.slice(5, 7)} • {c.scheduled_time}</span>
                  </div>
                  <p className="mt-2 text-[13px] font-semibold leading-snug text-[#1e1e2e]">{c.title}</p>
                  <p className="mt-1 text-[11px] text-[#6b6b80]">{TYPE_LABEL[c.content_type]}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        onClick={() => move(c.id, -1)}
                        disabled={status === 'idea'}
                        className="rounded-lg border border-cardline p-1.5 text-[#6b6b80] transition duration-150 hover:bg-[#f4f4f7] active:scale-90 disabled:opacity-30"
                        title="Pindah mundur"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <button
                        onClick={() => move(c.id, 1)}
                        disabled={status === 'evaluated'}
                        className="rounded-lg border border-cardline p-1.5 text-[#6b6b80] transition duration-150 hover:bg-[#f4f4f7] active:scale-90 disabled:opacity-30"
                        title="Pindah maju"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => navigator.clipboard?.writeText(c.body)}
                      className="rounded-lg p-1.5 text-[#76768c] opacity-0 transition-opacity duration-150 hover:bg-rm-50 hover:text-rm-600 group-hover:opacity-100"
                      title="Salin konten"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {groups[status].length === 0 && (
                <div className="rounded-xl border border-dashed border-cardline p-4 text-center text-[12px] text-[#76768c]">
                  Kosong
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showNew && <NewContentModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
