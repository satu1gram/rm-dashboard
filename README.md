# RM Dashboard — Dashboard Social Media Specialist Rekapan Mitra

Dashboard untuk mengelola konten sosial media Rekapan Mitra (Threads, IG, WA Channel).
Membantu social media specialist: rencana, kanban progress, report, dan evaluasi dalam satu tempat.

## Fitur

- **Beranda**: hero, stat cards, konten hari ini (copy-paste), to-do checklist, mini calendar, next up, progress minggu
- **Kanban Konten**: 5 kolom status (Idea → Draft → Ready → Posted → Evaluated)
- **Konten**: list + filter platform + detail + tombol salin siap posting + metrik performa
- **Report**: grafik views/replies per konten, breakdown platform, pie chart jenis konten, insight otomatis
- **Evaluasi**: target M1 (followers, signup, views, replies) + progress bar, checklist konsistensi, review mingguan

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- lucide-react (ikon)
- recharts (grafik)
- localStorage (data persist, tanpa backend dulu)

## Development

```bash
npm install
npm run dev        # dev server
npm run build      # production build ke dist/
npm run preview    # preview build
```

## Deploy

Static site (output `dist/`). Target: Cloudflare Pages dengan custom domain `socmed.mitrabp.biz.id`.

### Opsi 1: Auto-deploy via GitHub Actions (rekomendasi)

Workflow `.github/workflows/deploy.yml` sudah disiapkan. Setiap push ke `main` otomatis build + deploy.

Setup sekali saja:
1. Buka repo → Settings → Secrets and variables → Actions
2. Tambah 2 secrets:
   - `CLOUDFLARE_API_TOKEN` — token API Cloudflare (izin: Account > Cloudflare Pages > Edit)
   - `CLOUDFLARE_ACCOUNT_ID` — Account ID Cloudflare (dashboard → kanan bawah)
3. Push ke `main` → workflow jalan otomatis → deploy ke `rm-dashboard.pages.dev`
4. Pasang custom domain di dashboard Cloudflare: project → Custom domains → `socmed.mitrabp.biz.id`

### Opsi 2: Deploy manual via wrangler CLI

```bash
npx wrangler login          # sekali saja
npx wrangler pages deploy dist --project-name=rm-dashboard
```

### Opsi 3: Connect to Git di dashboard (tanpa token)

1. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
2. Pilih repo `satu1gram/rm-dashboard`
3. Build command: `npm run build` | Output dir: `dist`
4. Custom domain: `socmed.mitrabp.biz.id`

## Data

Seed data berisi konten minggu lalu (posted + metrics) dan rencana minggu ini (7 konten).
Data tersimpan di localStorage; bisa direset dari halaman Evaluasi.

## Repo

https://github.com/satu1gram/rm-dashboard
