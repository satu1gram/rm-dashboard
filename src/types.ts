export type Platform = 'threads' | 'ig_carousel' | 'ig_reels' | 'wa_channel';

export type ContentType = 'hook' | 'insight' | 'tutorial' | 'intermezzo' | 'cta' | 'testimoni' | 'confession' | 'value' | 'reflection';

export type Status = 'idea' | 'draft' | 'ready' | 'posted' | 'evaluated';

export interface Metric {
  replies: number;
  likes: number;
  saves: number;
  views: number;
  followers_gained: number;
  dms: number;
  signups: number;
}

export interface Content {
  id: string;
  title: string;
  platform: Platform;
  content_type: ContentType;
  body: string;
  hashtags: string[];
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:mm
  status: Status;
  posted_at?: string;
  metrics?: Metric;
  notes?: string;
}

export interface DailyLog {
  date: string;
  posted_morning: boolean;
  shared_wa: boolean;
  replied_comments: boolean;
  cross_commented: boolean;
  notes: string;
}

/** Format tanggal lokal (YYYY-MM-DD) — hindari toISOString yang bergeser karena timezone UTC */
export function localDateStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const PLATFORM_LABEL: Record<Platform, string> = {
  threads: 'Threads',
  ig_carousel: 'IG Carousel',
  ig_reels: 'IG Reels',
  wa_channel: 'WA Channel',
};

export const PLATFORM_COLOR: Record<Platform, string> = {
  threads: '#000000',
  ig_carousel: '#E1306C',
  ig_reels: '#F77737',
  wa_channel: '#25D366',
};

export const TYPE_LABEL: Record<ContentType, string> = {
  hook: 'Hook',
  insight: 'Insight',
  tutorial: 'Tutorial',
  intermezzo: 'Intermezzo',
  cta: 'CTA',
  testimoni: 'Testimoni',
  confession: 'Confession',
  value: 'Value',
  reflection: 'Refleksi',
};

export const STATUS_LABEL: Record<Status, string> = {
  idea: 'Idea',
  draft: 'Draft',
  ready: 'Ready',
  posted: 'Posted',
  evaluated: 'Evaluated',
};
