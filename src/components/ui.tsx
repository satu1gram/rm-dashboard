import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-cardline shadow-[0_1px_2px_rgba(16,16,32,0.04)] ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between px-4 pt-4 pb-2.5">
      <div>
        <h3 className="text-[14px] font-semibold text-[#1e1e2e]">{title}</h3>
        {subtitle && <p className="text-[11.5px] text-[#6b6b80] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/**
 * Section = blok satu modul di halaman single-scroll.
 * - id dipakai anchor scroll dari topbar
 * - scroll-mt-16 biar tidak ketutup topbar sticky
 */
export function Section({
  id,
  children,
  className = '',
  divider = true,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  divider?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 py-3 ${divider ? 'border-t border-cardline/70' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

export function Badge({ children, color = '#6060f0', bg }: { children: ReactNode; color?: string; bg?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{ color, backgroundColor: bg || color + '14' }}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
}: {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const styles =
    variant === 'primary'
      ? 'bg-rm-500 text-white hover:bg-rm-600 shadow-sm'
      : variant === 'outline'
        ? 'border border-cardline text-[#4a4a5e] hover:bg-[#f4f4f7]'
        : 'text-rm-600 hover:bg-rm-50';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatCard({
  icon,
  label,
  value,
  delta,
  deltaUp = true,
  color = '#6060f0',
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  color?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: color + '14', color }}
        >
          {icon}
        </div>
        {delta && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              deltaUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      <p className="mt-3 text-[22px] font-bold tracking-tight text-[#1e1e2e]">{value}</p>
      <p className="text-[12px] text-[#6b6b80] font-medium">{label}</p>
    </Card>
  );
}

export function ProgressBar({ value, color = '#6060f0' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[#eef0f6]">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
    </div>
  );
}
