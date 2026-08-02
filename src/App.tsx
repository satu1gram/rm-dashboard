import { useState } from 'react';
import { StoreProvider } from './store';
import Sidebar, { type PageKey } from './components/Sidebar';
import Topbar from './components/Topbar';
import Beranda from './pages/Beranda';
import Kanban from './pages/Kanban';
import Konten from './pages/Konten';
import Report from './pages/Report';
import Evaluasi from './pages/Evaluasi';

export default function App() {
  const [page, setPage] = useState<PageKey>('beranda');

  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        <Sidebar page={page} onNavigate={setPage} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar page={page} onNavigate={setPage} />
          <main className="flex-1 px-5 py-5 lg:px-7 lg:py-6">
            {page === 'beranda' && <Beranda onNavigate={setPage} />}
            {page === 'kanban' && <Kanban />}
            {page === 'konten' && <Konten />}
            {page === 'report' && <Report />}
            {page === 'evaluasi' && <Evaluasi />}
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
