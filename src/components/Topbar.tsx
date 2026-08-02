import { Search, Bell, CalendarDays } from 'lucide-react';
import type { PageKey } from './Sidebar';

const TITLES: Record<PageKey, string> = {
  beranda: 'Dashboard',
  kanban: 'Workflows',
  konten: 'Content',
  report: 'Analytics',
  evaluasi: 'Evaluation',
};

export default function Topbar({ page, onNavigate }: { page: PageKey; onNavigate: (p: PageKey) => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-cardline bg-white/90 px-5 py-3 backdrop-blur">
      <div className="hidden md:flex items-center gap-1">
        {(['beranda', 'kanban', 'konten', 'report', 'evaluasi'] as PageKey[]).map((k) => (
          <button
            key={k}
            onClick={() => onNavigate(k)}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              page === k ? 'bg-rm-50 text-rm-600' : 'text-[#6b6b80] hover:bg-[#f4f4f7]'
            }`}
          >
            {TITLES[k]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="ml-auto flex items-center gap-2 rounded-xl border border-cardline bg-[#f8f8fb] px-3 py-2 w-[180px] md:w-[240px]">
        <Search size={14} className="text-[#a0a0b4]" />
        <input
          placeholder="Cari konten atau tugas..."
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#a0a0b4]"
        />
        <kbd className="hidden md:inline rounded-md border border-cardline bg-white px-1.5 py-0.5 text-[10px] text-[#a0a0b4]">⌘K</kbd>
      </div>

      <button className="relative rounded-xl border border-cardline p-2 text-[#6b6b80] hover:bg-[#f4f4f7]">
        <Bell size={16} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rm-500 text-[9px] font-bold text-white">3</span>
      </button>
      <button className="hidden sm:flex items-center gap-2 rounded-xl border border-cardline px-3 py-2 text-[13px] font-medium text-[#4a4a5e] hover:bg-[#f4f4f7]">
        <CalendarDays size={15} className="text-rm-500" />
        <span className="hidden md:inline">3 - 9 Agu 2026</span>
        <span className="md:hidden">Minggu Ini</span>
      </button>
    </header>
  );
}
