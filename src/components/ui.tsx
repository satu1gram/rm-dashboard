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
    <div className="flex items-start justify-between px-5 pt-5 pb-3">
      <div>
        <h3 className="text-[15px] font-semibold text-[#1e1e2e]">{title}</h3>
        {subtitle && <p className="text-[12px] text-[#8b8b9e] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
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
}: {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  onClick?: () => void;
  className?: string;
}) {
  const styles =
    variant === 'primary'
      ? 'bg-rm-500 text-white hover:bg-rm-600 shadow-sm'
      : variant === 'outline'
        ? 'border border-cardline text-[#4a4a5e] hover:bg-[#f4f4f7]'
        : 'text-[#6060f0] hover:bg-rm-50';
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors ${styles} ${className}`}
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
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: color + '14', color }}
        >
          {icon}
        </div>
        {delta && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              deltaUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-[26px] font-bold tracking-tight text-[#1e1e2e]">{value}</p>
      <p className="text-[12.5px] text-[#8b8b9e] font-medium">{label}</p>
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
