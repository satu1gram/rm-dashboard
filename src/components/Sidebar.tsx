import {
  LayoutDashboard,
  KanbanSquare,
  FileText,
  BarChart3,
  Target,
  Settings,
  LifeBuoy,
  Boxes,
} from 'lucide-react';

export type PageKey = 'beranda' | 'kanban' | 'konten' | 'report' | 'evaluasi';

const NAV: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'beranda', label: 'Beranda', icon: LayoutDashboard },
  { key: 'kanban', label: 'Kanban Konten', icon: KanbanSquare },
  { key: 'konten', label: 'Konten', icon: FileText },
  { key: 'report', label: 'Report', icon: BarChart3 },
  { key: 'evaluasi', label: 'Evaluasi', icon: Target },
];

export default function Sidebar({
  page,
  onNavigate,
}: {
  page: PageKey;
  onNavigate: (p: PageKey) => void;
}) {
  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-cardline bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rm-500 shadow-sm">
          <Boxes size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14.5px] font-bold text-[#1e1e2e] leading-tight">Rekapan Mitra</p>
          <p className="text-[11px] text-[#8b8b9e]">Dashboard Sosmed</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-2.5 pb-2 text-[10.5px] font-semibold uppercase tracking-wider text-[#b0b0c0]">Menu</p>
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                active ? 'bg-rm-500 text-white shadow-sm' : 'text-[#4a4a5e] hover:bg-[#f4f4f7]'
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-cardline px-3 py-4 space-y-1">
        <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-[#4a4a5e] hover:bg-[#f4f4f7]">
          <LifeBuoy size={16} /> Bantuan
        </button>
        <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-[#4a4a5e] hover:bg-[#f4f4f7]">
          <Settings size={16} /> Pengaturan
        </button>
        <div className="flex items-center gap-2.5 rounded-xl bg-[#f4f4f7] px-3 py-2.5 mt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rm-500 text-[12px] font-bold text-white">S</div>
          <div>
            <p className="text-[12.5px] font-semibold text-[#1e1e2e] leading-tight">Salinov</p>
            <p className="text-[10.5px] text-[#8b8b9e]">Social Media Specialist</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
