import { Search, Bell, CalendarDays, Boxes } from 'lucide-react';

export type PageKey = 'beranda' | 'kanban' | 'konten' | 'report' | 'evaluasi';

const NAV: { key: PageKey; label: string }[] = [
  { key: 'beranda', label: 'Beranda' },
  { key: 'kanban', label: 'Kanban' },
  { key: 'konten', label: 'Konten' },
  { key: 'report', label: 'Report' },
  { key: 'evaluasi', label: 'Evaluasi' },
];

export default function Topbar({ page, onNavigate }: { page: PageKey; onNavigate: (p: PageKey) => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-cardline bg-white/90 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5">
        {/* Brand */}
        <button onClick={() => onNavigate('beranda')} className="flex shrink-0 items-center gap-2" title="Rekapan Mitra">
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
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-colors ${
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
          {/* Search: icon di mobile, field di sm+ */}
          <div className="hidden w-[160px] items-center gap-2 rounded-lg border border-cardline bg-[#f8f8fb] px-2.5 py-1.5 sm:flex md:w-[220px]">
            <Search size={13} className="text-[#a0a0b4]" />
            <input
              placeholder="Cari konten atau tugas..."
              className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-[#a0a0b4]"
            />
            <kbd className="hidden rounded border border-cardline bg-white px-1 py-0.5 text-[10px] text-[#a0a0b4] md:inline">
              ⌘K
            </kbd>
          </div>
          <button className="rounded-lg border border-cardline p-1.5 text-[#6b6b80] hover:bg-[#f4f4f7] sm:hidden" title="Cari">
            <Search size={15} />
          </button>

          <button
            className="relative rounded-lg border border-cardline p-1.5 text-[#6b6b80] hover:bg-[#f4f4f7]"
            title="Notifikasi"
          >
            <Bell size={15} />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rm-500 text-[8px] font-bold text-white">
              3
            </span>
          </button>

          <button className="hidden items-center gap-1.5 rounded-lg border border-cardline px-2.5 py-1.5 text-[12.5px] font-medium text-[#4a4a5e] hover:bg-[#f4f4f7] lg:flex">
            <CalendarDays size={14} className="text-rm-500" />
            3 - 9 Agu 2026
          </button>

          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-rm-500 text-[11px] font-bold text-white"
            title="Salinov"
          >
            S
          </button>
        </div>
      </div>
    </header>
  );
}
