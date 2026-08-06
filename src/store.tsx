import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Content, DailyLog, Status } from './types';
import { seedContents, seedDailyLogs } from './data/seed';

const LS_KEY = 'rm-dashboard-v1';

interface StoreState {
  contents: Content[];
  dailyLogs: DailyLog[];
  query: string;
  setQuery: (q: string) => void;
  addContent: (c: Omit<Content, 'id'>) => void;
  updateContent: (id: string, patch: Partial<Content>) => void;
  setStatus: (id: string, status: Status) => void;
  removeContent: (id: string) => void;
  addDailyLog: (log: DailyLog) => void;
  updateDailyLog: (date: string, patch: Partial<DailyLog>) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreState | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Content[]>(() => load(LS_KEY + '-contents', seedContents));
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => load(LS_KEY + '-logs', seedDailyLogs));
  const [query, setQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(LS_KEY + '-contents', JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem(LS_KEY + '-logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  const addContent = (c: Omit<Content, 'id'>) => {
    setContents((prev) => [{ ...c, id: 'c-' + Date.now() }, ...prev]);
  };

  const updateContent = (id: string, patch: Partial<Content>) => {
    setContents((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const setStatus = (id: string, status: Status) => {
    setContents((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              posted_at: status === 'posted' || status === 'evaluated' ? new Date().toISOString() : c.posted_at,
            }
          : c,
      ),
    );
  };

  const removeContent = (id: string) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
  };

  const addDailyLog = (log: DailyLog) => {
    setDailyLogs((prev) => [...prev.filter((l) => l.date !== log.date), log]);
  };

  const updateDailyLog = (date: string, patch: Partial<DailyLog>) => {
    setDailyLogs((prev) =>
      prev.map((l) => (l.date === date ? { ...l, ...patch } : l)),
    );
  };

  const resetData = () => {
    setContents(seedContents);
    setDailyLogs(seedDailyLogs);
  };

  return (
    <StoreContext.Provider
      value={{ contents, dailyLogs, query, setQuery, addContent, updateContent, setStatus, removeContent, addDailyLog, updateDailyLog, resetData }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
