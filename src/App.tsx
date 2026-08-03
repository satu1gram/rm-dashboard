import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { StoreProvider } from './store';
import Topbar, { type PageKey } from './components/Topbar';
import { Section } from './components/ui';
import Beranda from './pages/Beranda';
import Kanban from './pages/Kanban';
import Konten from './pages/Konten';
import Report from './pages/Report';
import Evaluasi from './pages/Evaluasi';

const SECTIONS: PageKey[] = ['beranda', 'kanban', 'konten', 'report', 'evaluasi'];

export default function App() {
  const [active, setActive] = useState<PageKey>('beranda');
  const [showTop, setShowTop] = useState(false);

  // Scroll-spy: menu topbar ikut menyala sesuai section yang sedang terlihat
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as PageKey);
      },
      { rootMargin: '-15% 0px -65% 0px' },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Tombol "ke atas" muncul setelah scroll cukup jauh
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll manual via getBoundingClientRect: akurat walau section pakai content-visibility
  const go = (p: PageKey) => {
    const el = document.getElementById(p);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <StoreProvider>
      <div className="flex min-h-screen flex-col">
        <Topbar page={active} onNavigate={go} />
        <main className="flex-1 px-3 py-3 sm:px-5 lg:px-6">
          <Section id="beranda" divider={false}>
            <Beranda onNavigate={go} />
          </Section>
          <Section id="kanban">
            <Kanban />
          </Section>
          <Section id="konten">
            <Konten />
          </Section>
          <Section id="report">
            <Report />
          </Section>
          <Section id="evaluasi">
            <Evaluasi />
          </Section>
        </main>

        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-5 right-5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-rm-500 text-white shadow-[0_4px_16px_rgba(96,96,240,0.4)] transition-transform hover:scale-105 hover:bg-rm-600"
            title="Kembali ke atas"
          >
            <ArrowUp size={16} />
          </button>
        )}
      </div>
    </StoreProvider>
  );
}
