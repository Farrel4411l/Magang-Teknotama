# AGENTS.md — Aturan Kerja Tim & AI Agent (`teknotama.com`)

Dokumen ini adalah panduan wajib bagi seluruh **Developer, Ops Agent, QC Agent, dan AI Coding Assistant** yang bekerja di repository `Magang-Teknotama`.

---

## 1. ATURAN PRODUCTION & DEPLOYMENT (WAJIB DIPATUHI)

- **Lingkungan Server Live:** cPanel / LiteSpeed dengan **PHP 7.2.34 (`ea-php72`)**.
  - **DILARANG** memakai sintaks PHP 7.3+/7.4+/8.x (tidak boleh `fn()`, `match()`, `str_contains()`, `str_starts_with()`, `??=`, typed class properties, union types, maupun trailing comma pada pemanggilan fungsi).
  - Selalu cek dengan `php -l` sebelum commit/upload.
- **Mekanisme Deploy:**
  - Branch `main` **TIDAK** otomatis deploy ke `/public_html/` untuk Company Profile dan `/marketing/`. Deploy dilakukan lewat FileZilla atau Ops Agent.
  - Pengecualian: folder `/games/` disinkronkan otomatis harian ke `main` oleh GitHub Actions (`.github/workflows/sync-games.yml`) dari repo `ImmanuelValentino/Teknogames`.

### PERINGATAN KERAS: FILE & DATA LIVE YANG DILARANG DITIMPA / DIHAPUS SAAT UPLOAD
Saat mengunggah pembaruan via FileZilla atau Ops Agent ke `/public_html/`, **DILARANG MENIMPA atau MENGHAPUS**:
1. **`/public_html/teknotama_secrets.php`** (berisi API key AI & `cms_admin_key` — tidak ada di Git).
2. **`/public_html/testimonials_data.json`** (data ulasan klien asli).
3. **`/public_html/marketing/data/`** (seluruh file JSON live: `users.json`, `leads.json`, `pricing.json`, `outbound.json`, `research_accounts.json`, `rss_feeds.json`, `market_signals.json`, `funnel_traffic.json`, `integrations.json`, `outbound_quota.json`, `system_logs.json`, dan `ratelimit/`) — **menimpa folder ini akan menghapus akun login admin & seluruh data CRM production!**
4. **`/public_html/marketing/config/portal_config.php`** (bila dibuat manual di server).

---

## 2. PEMBAGIAN ZONA & BATASAN ARSITEKTUR

### A. Root Company Profile (`/` — B2B Public Site)
- Halaman aktif: `index.html`, `tentang.html`, `kontak.html`, `kalkulator-boq-it.html`, dan 6 halaman layanan `jasa-*.html`.
- **Integrasi Wajib Dipertahankan:** GTM **`GTM-K8MSKHH7`**, dual Google Search Console verification, AdSense `ca-pub-3146007647541379`, dan kanonik non-`www` HTTPS (`.htaccess`).
- **Kebijakan Konten B2B:** Kalkulator & AI publik (`kalkulator-boq-it.html`, `script.js`, `teknotama_api.php?action=chat`) **dilarang menampilkan nominal harga Rupiah** (hanya BOQ teknis).
- **Sinkronisasi CRM:** Form survei di `kontak.html` mengirim ke `teknotama_api.php?action=booking` yang otomatis meneruskan lead baru ke `/marketing/data/leads.json` (non-blocking, skip honeypot).
- **CMS Admin Testimoni:** `admin-testimoni.html` berstatus `noindex, nofollow, noarchive` — **dilarang** menautkannya dari navbar atau footer publik.

### B. Sub-Portal Internal (`/marketing/` — Tekno AI Marketing)
- Portal internal B2B RevOps, AI Account Researcher, RSS Market Radar, Outbound Console (HITL), Master Harga Internal, Case Study AI, & Marketing Funnel Analytics.
- **Keamanan & SEO:**
  - Wajib tetap `noindex, nofollow, noarchive` (`<meta>`, `X-Robots-Tag`, `marketing/robots.txt`) dan diwajibkan login (BCRYPT + CSRF + `HttpOnly; SameSite=Strict`).
  - Memakai property GTM terpisah **`GTM-NK99NBN3`** (jangan campurkan dengan `GTM-K8MSKHH7`).
  - Backend membaca AI key dari `teknotama_secrets.php` secara server-side, menerapkan **PII Masking** sebelum ke LLM free-tier, serta **proteksi SSRF** untuk crawl website & RSS.
  - Subfolder `config/`, `data/`, `includes/`, `gas/` wajib tetap HTTP `403` via `.htaccess`.
- **Detail setup & SOP:** baca [marketing/README.md](marketing/README.md).

### C. Portal TeknoGame (`/games/`)
- Dikelola oleh tim developer game (`ImmanuelValentino/Teknogames`) via `.github/workflows/sync-games.yml`.
- **Jangan edit isi `games/` secara manual** di repo ini agar tidak konflik dengan sinkronisasi CI.
- **Soft SEO Isolation di Root:**
  - Halaman B2B **tidak** menautkan ke `/games/`, dan `sitemap.xml` **tidak** menyertakan URL `/games/`.
  - `.htaccess` root memberi `X-Robots-Tag: noindex, nofollow` pada `/games/` via `SetEnvIfNoCase` tanpa memblokir akses pengguna (dan **jangan** tambahkan `Disallow: /games/` di `robots.txt` selama Google masih memproses `noindex`).

### D. Folder Legacy Terproteksi
- Jangan menghapus atau mengubah nama file di `img/`, `icons/`, `css/`, `js/`, `fonts/`, `redesign/`, `teknotama.com/` tanpa persetujuan eksplisit.

---

## 3. CHECKLIST WAJIB SEBELUM `git push` / RILIS
1. Jalankan `php -l` pada setiap file `.php` yang diubah dan pastikan bebas sintaks PHP 7.3+/8.x.
2. Pastikan **tidak ada** file rahasia (`teknotama_secrets.php`, `marketing/config/portal_config.php`, `marketing/data/*.json`) yang masuk ke `git status` atau `git diff --cached`.
3. Untuk perubahan UI publik, cek tampilan Desktop (`1440x900`) & Mobile (`390x844`) tanpa *horizontal overflow* dan tanpa *console error* lokal.
4. Untuk deploy ke `/public_html/marketing/`, selalu kecualikan `marketing/data/` dan `marketing/config/portal_config.php`.
