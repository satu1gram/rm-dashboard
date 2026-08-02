import { useMemo } from 'react';
import { Plus, ChevronRight, ChevronLeft, Copy } from 'lucide-react';
import { useStore } from '../store';
import { Badge, Button } from '../components/ui';
import { PLATFORM_LABEL, PLATFORM_COLOR, STATUS_LABEL, TYPE_LABEL, type Status } from '../types';

const COLUMNS: { status: Status; color: string; bg: string }[] = [
  { status: 'idea', color: '#8b8b9e', bg: '#f4f4f7' },
  { status: 'draft', color: '#f59e0b', bg: '#fef3c7' },
  { status: 'ready', color: '#6060f0', bg: '#e0e7ff' },
  { status: 'posted', color: '#10b981', bg: '#d1fae5' },
  { status: 'evaluated', color: '#ec4899', bg: '#fce7f3' },
];

const ORDER: Status[] = ['idea', 'draft', 'ready', 'posted', 'evaluated'];

export default function Kanban() {
  const { contents, setStatus } = useStore();

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#1e1e2e]">Kanban Konten</h2>
          <p className="text-[13px] text-[#8b8b9e]">Seret atau pakai tombol panah buat pindahin status konten.</p>
        </div>
        <Button>
          <Plus size={15} /> Konten Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
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
                <div key={c.id} className="group rounded-xl border border-cardline bg-white p-3 shadow-[0_1px_2px_rgba(16,16,32,0.04)]">
                  <div className="flex items-start justify-between gap-2">
                    <Badge color={PLATFORM_COLOR[c.platform]}>{PLATFORM_LABEL[c.platform]}</Badge>
                    <span className="text-[10.5px] text-[#a0a0b4]">{c.scheduled_date.slice(8, 10)}/{c.scheduled_date.slice(5, 7)} • {c.scheduled_time}</span>
                  </div>
                  <p className="mt-2 text-[13px] font-semibold leading-snug text-[#1e1e2e]">{c.title}</p>
                  <p className="mt-1 text-[11px] text-[#8b8b9e]">{TYPE_LABEL[c.content_type]}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        onClick={() => move(c.id, -1)}
                        disabled={status === 'idea'}
                        className="rounded-lg border border-cardline p-1.5 text-[#8b8b9e] hover:bg-[#f4f4f7] disabled:opacity-30"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <button
                        onClick={() => move(c.id, 1)}
                        disabled={status === 'evaluated'}
                        className="rounded-lg border border-cardline p-1.5 text-[#8b8b9e] hover:bg-[#f4f4f7] disabled:opacity-30"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => navigator.clipboard?.writeText(c.body)}
                      className="rounded-lg p-1.5 text-[#a0a0b4] opacity-0 transition-opacity hover:bg-rm-50 hover:text-rm-600 group-hover:opacity-100"
                      title="Salin konten"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {groups[status].length === 0 && (
                <div className="rounded-xl border border-dashed border-cardline p-4 text-center text-[12px] text-[#a0a0b4]">
                  Kosong
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
