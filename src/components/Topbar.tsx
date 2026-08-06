import { Search, Bell, CalendarDays, Boxes, X } from 'lucide-react';
import { useStore } from '../store';
import { WEEK_START, WEEK_END } from '../data/seed';
import { localDateStr } from '../types';

export type PageKey = 'beranda' | 'kanban' | 'konten' | 'report' | 'evaluasi';

const NAV: { key: PageKey; label: string }[] = [
  { key: 'beranda', label: 'Beranda' },
  { key: 'kanban', label: 'Kanban' },
  { key: 'konten', label: 'Konten' },
  { key: 'report', label: 'Report' },
  { key: 'evaluasi', label: 'Evaluasi' },
];

function fmtRange(start: string, end: string): string {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const sameMonth = s.getMonth() === e.getMonth();
  const ds = s.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  const de = e.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  return sameMonth ? `${s.getDate()} - ${de} ${s.getFullYear()}` : `${ds} - ${de} ${s.getFullYear()}`;
}

export default function Topbar({ page, onNavigate }: { page: PageKey; onNavigate: (p: PageKey) => void }) {
  const { contents, query, setQuery } = useStore();
  const todayStr = localDateStr();

  // Jumlah konten yang butuh aksi hari ini (belum diposting) — angka nyata, bukan statis
  const needsAction = contents.filter(
    (c) => c.scheduled_date === todayStr && c.status !== 'posted' && c.status !== 'evaluated',
  ).length;

  return (
    <header className="sticky top-0 z-20 border-b border-cardline bg-white/90 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5">
        {/* Brand */}
        <button
          onClick={() => onNavigate('beranda')}
          className="flex shrink-0 items-center gap-2 transition duration-150 active:scale-[0.97]"
          title="Rekapan Mitra"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rm-500 shadow-sm">
            <Boxes size={14} className="text-white" />
          </span>
          <span className="hidden text-[13.5px] font-bold text-[#1e1e2e] sm:block">Rekapan Mitra</span>
        </button>

        <span className="mx-1 hidden h-5 w-px shrink-0 bg-cardline sm:block" />

        {/* Nav — satu-satunya navigasi utama */}
        <nav className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {NAV.map(({ key, label }) => {
            const active = page === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition duration-150 active:scale-[0.97] ${
                  active ? 'bg-rm-50 text-rm-600' : 'text-[#6b6b80] hover:bg-[#f4f4f7]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Search: benar-benar memfilter konten; mengetik langsung pindah ke halaman Konten */}
          <div className="hidden w-[160px] items-center gap-2 rounded-lg border border-cardline bg-[#f8f8fb] px-2.5 py-1.5 sm:flex md:w-[220px]">
            <Search size={13} className="text-[#76768c]" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value) onNavigate('konten');
              }}
              placeholder="Cari konten atau tugas..."
              className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-[#76768c]"
            />
            {query ? (
              <button onClick={() => setQuery('')} className="text-[#a0a0b4] hover:text-[#6b6b80]" title="Hapus pencarian">
                <X size={12} />
              </button>
            ) : (
              <kbd className="hidden rounded border border-cardline bg-white px-1 py-0.5 text-[10px] text-[#76768c] md:inline">
                ⌘K
              </kbd>
            )}
          </div>
          <button
            className="rounded-lg border border-cardline p-1.5 text-[#6b6b80] transition duration-150 hover:bg-[#f4f4f7] active:scale-[0.95] sm:hidden"
            title="Cari"
            onClick={() => onNavigate('konten')}
          >
            <Search size={15} />
          </button>

          <button
            className="relative rounded-lg border border-cardline p-1.5 text-[#6b6b80] transition duration-150 hover:bg-[#f4f4f7] active:scale-[0.95]"
            title={`${needsAction} konten perlu aksi hari ini`}
          >
            <Bell size={15} />
            {needsAction > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rm-500 text-[8px] font-bold text-white">
                {needsAction}
              </span>
            )}
          </button>

          <button
            className="hidden items-center gap-1.5 rounded-lg border border-cardline px-2.5 py-1.5 text-[12.5px] font-medium text-[#4a4a5e] transition duration-150 hover:bg-[#f4f4f7] active:scale-[0.97] lg:flex"
            title="Jadwal minggu berjalan"
          >
            <CalendarDays size={14} className="text-rm-500" />
            {fmtRange(WEEK_START, WEEK_END)}
          </button>

          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-rm-500 text-[11px] font-bold text-white transition duration-150 active:scale-[0.95]"
            title="Salinov"
          >
            S
          </button>
        </div>
      </div>
    </header>
  );
}
