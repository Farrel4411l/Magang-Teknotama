# Tekno AI Marketing (`https://teknotama.com/marketing/`)

Portal internal B2B RevOps & Marketing Automation berbiaya Rp 0 untuk **PT Teknotama Prakarsa Mulia**.

## Ringkasan Arsitektur
- **Stack:** HTML5, Tailwind CSS CDN, Vanilla JS ES6+, PHP 7.2+ (`ea-php72`), JSON Atomic Storage (`.htaccess` `403`), serta template Google Apps Script (`gas/Code.gs`).
- **Keamanan & SEO:**
  - `noindex, nofollow, noarchive` via meta tag + header HTTP `.htaccess` + `robots.txt` (`Disallow: /`).
  - Login BCRYPT (`password_hash`) + CSRF Token (`hash_equals`) + session cookie `HttpOnly; SameSite=Strict` + login brute-force rate limiter.
  - **First-Run Setup Gate:** Akun admin pertama di server produksi hanya bisa diaktifkan dengan memasukkan `cms_admin_key` dari `teknotama_secrets.php` (atau `setup_secret_key` dari `config/portal_config.php`).
  - **PII Masking AI Proxy:** Nama perusahaan, PIC, email, dan nomor telepon disamarkan sebelum dikirim ke LLM free-tier (`Groq` -> `Gemini` -> `OpenRouter` -> Fallback Lokal).
  - **Zero Hardcoded Prices:** Master harga dikelola lewat UI atau ekspor/impor CSV.

## Cara Setup Setelah Upload ke `/public_html/marketing/`
1. Pastikan izin tulis folder `/public_html/marketing/data/` aktif (default `0755` pada `ea-php72` / suPHP).
2. Buka `https://teknotama.com/marketing/login.php`.
3. Pada layar **Aktivasi Admin Pertama**, masukkan username baru, password (min. 8 karakter), dan **`cms_admin_key`** dari `teknotama_secrets.php` server Anda.
4. *(Opsional)* Untuk lapisan keamanan tambahan, pasang **Cloudflare Zero Trust Access (Free)** pada path `teknotama.com/marketing/*` agar hanya email `@teknotama.com` / tim internal yang bisa mencapai halaman login.
5. *(Opsional)* Untuk sinkronisasi ke Google Sheets / Looker Studio & reminder H+3/H+7, deploy `gas/Code.gs` sebagai Web App di Google Apps Script lalu masukkan URL-nya di menu **Integrasi, SOP & Logs**.
