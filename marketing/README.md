# Tekno AI Marketing (`https://teknotama.com/marketing/`)

Portal internal B2B RevOps, AI Prospect Researcher, & Marketing Automation berbiaya Rp 0 untuk **PT Teknotama Prakarsa Mulia**.

## Ringkasan Fitur & Arsitektur
- **Stack:** HTML5, Tailwind CSS CDN, Vanilla JS ES6+, PHP 7.2+ (`ea-php72`), JSON Atomic Storage (`.htaccess` `403`), serta Google Apps Script (`gas/Code.gs`).
- **Modul Utama:**
  - **Ringkasan & Monitoring:** KPI funnel, antrean follow-up H+3/H+7, ekspor CSV (UTF-8 BOM untuk Excel/Google Sheets), dan status integrasi.
  - **Riset & Prospek AI:** Pemindai website resmi perusahaan target (proteksi SSRF + hormati `robots.txt`), ekstraksi kontak resmi publik, analisa ICP & kebutuhan IT, impor batch CSV, serta **Radar Sinyal Pasar (RSS / Google Alerts)** anti-XXE.
  - **Marketing Funnel (`TOFU → MOFU → BOFU`):** Statistik konversi per tahap, distribusi sumber (`Web Kontak`, `Riset AI/Outbound`, `Manual`), metrik traffic GA4, dan **AI Funnel Coach**.
  - **Lead Pipeline (CRM) & Outbound (HITL):** Terima lead otomatis dari `kontak.html` (`teknotama_api.php?action=booking`), AI scoring + draf email & `wa.me` (*PII Masked*), serta outbound review manual dengan throttling kuota harian.
  - **Master Harga Internal & Case Study AI:** Tarif editable oleh staf non-IT (tidak hardcode, tidak tampil ke publik) + generator studi kasus SEO & proposal PDF.
- **Keamanan & SEO:**
  - `noindex, nofollow, noarchive` (`<meta>`, header HTTP `.htaccess`, `robots.txt`), GTM khusus **`GTM-NK99NBN3`**.
  - Login BCRYPT + CSRF + session `HttpOnly; SameSite=Strict` + setup gate berbasis `cms_admin_key` dari `teknotama_secrets.php`.

## ATURAN DEPLOYMENT & OPS (PENTING!)
1. **DILARANG MENIMPA `/public_html/marketing/data/`** dan `/public_html/marketing/config/portal_config.php` saat mengunggah update ke server live — folder `data/` menyimpan akun login (`users.json`), leads CRM (`leads.json`), dan data operasional production.
2. Selalu pastikan seluruh file PHP lolos `php -l` dan tetap kompatibel dengan **PHP 7.2.34 (`ea-php72`)**.
3. Jangan pernah melakukan `git add` pada `data/*.json` atau `config/portal_config.php` (sudah diblokir oleh `.gitignore`).

## Setup Awal di Production
1. Pastikan `/public_html/marketing/data/` writable oleh PHP (umumnya default `0755` pada `ea-php72`).
2. Buka `https://teknotama.com/marketing/login.php` dan aktifkan akun admin pertama memakai **`cms_admin_key`** dari `teknotama_secrets.php`.
3. *(Opsional)* Tambahkan **Cloudflare Zero Trust Access (Free)** pada `teknotama.com/marketing/*` untuk proteksi tambahan sebelum halaman login.
4. *(Opsional)* Pasang `gas/Code.gs` di Google Apps Script untuk sinkronisasi Google Sheets, trigger RSS harian (`dailyRssSignalCollector`), reminder follow-up H+3/H+7, dan laporan mingguan.
