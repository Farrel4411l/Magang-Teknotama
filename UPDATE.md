# Dokumentasi Audit & Pembersihan Visual Usang Frontend Tekno Game
# CHANGELOG & UPDATE LOG (teknotama.com/games)

Dokumen ini mencatat daftar lengkap seluruh elemen visual usang, inkonsistensi branding, motto lama, dan emoji yang telah dihapus serta dibersihkan dari antarmuka pengguna (UI) website **Tekno Game** (`https://teknotama.com/games/`).
Dokumen ini mencatat seluruh riwayat pembaruan, perbaikan bug, penambahan fitur, dan audit pembersihan visual pada project **Tekno Game** (`https://teknotama.com/games/`) dengan format standar **Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`)**:

* **MAJOR (`X.0.0`):** Perubahan besar pada arsitektur sistem, desain/redesign total, struktur URL/SEO, atau breaking changes.
* **MINOR (`0.X.0`):** Penambahan fitur baru, halaman baru, atau pembaruan fungsionalitas yang backward-compatible.
* **PATCH (`0.0.X`):** Perbaikan bug, hotfix styling, optimasi performa, atau perbaikan minor.

---

## 1. Daftar Elemen Visual Lama yang Dihapus & Diperbarui
## [3.0.0] - 2026-11-17
### Major Redesign Total Frontend (UI/UX) & Technical SEO Sub-Direktori (`teknotama.com/games/`)

| No | Elemen Visual / Teks yang Dihapus | Lokasi File Asal | Alasan Penghapusan / Pembersihan | Solusi & Elemen Pengganti Baru |
#### 1. Audit & Pembersihan Visual Usang (Visual Cleanup)
Daftar lengkap elemen visual lama yang dihapus dari antarmuka:

| No | Elemen Visual / Teks yang Dihapus | Lokasi File Asal | Alasan Penghapusan | Solusi & Elemen Pengganti Baru |
|---|---|---|---|---|
| 1 | **Slogan / Motto Lama:** `"PLAY. EVOLVE. CONQUER."` | `src/app/layout.tsx`<br>`src/app/page.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx` | Menghilangkan motto lama secara total sesuai instruksi identitas brand baru Tekno Game. | Dihapus total dari UI, teks, komentar, dan metadata `<head>`. Digantikan dengan fokus identitas portal resmi PT Teknotama Prakarsa Mulia. |
| 2 | **Logo Lama & Ikon Usang:** `/games/teknogame-icon.png`, `/games/teknogame-banner.png`, `teknogame-logo.png` | `src/app/layout.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx`<br>`src/app/icon.png`<br>`src/app/apple-icon.png` | Desain logo lama tidak menggunakan perisai monogram GT resmi yang baru. | Diganti dengan logo baru `/Teknogame_logo_only.png` berdampingan horizontal dengan teks modern "Tekno Game". |
| 3 | **Penulisan Nama Brand Tanpa Spasi:** `"TeknoGame"` | Seluruh file di `src/app/` dan `src/components/` | Menyeragamkan identitas resmi brand menjadi **"Tekno Game"** (dengan spasi). | Diubah 100% konsisten menjadi **"Tekno Game"** di Navbar, Footer, Hero, Title Tag, Metadata, dan Schema JSON-LD. |
| 4 | **Karakter Emoji Unicode (Blacklist Emoji):** `🎮`, `🕹️`, `🧭`, `🧩`, `⚡`, `☕`, `⚽`, `🏃‍♂️`, `🚢`, `🧳`, `🛺`, `🛕`, `🎨`, `🪁`, `🪂`, `🛶`, `🗺️`, `🐺`, `🐦`, `🧠`, `🌐`, `🏆`, `🏎️`, `🚀`, `💻`, `⭐` | `src/lib/games-data.ts`<br>`src/components/game/GameCard.tsx`<br>`src/components/game/CategoryChips.tsx`<br>`src/components/game/GameGrid.tsx`<br>`src/components/game/GameHero.tsx`<br>`src/components/game/GameFrame.tsx`<br>`src/components/game/LeaderboardModal.tsx`<br>`src/components/game/SearchModal.tsx`<br>`src/components/layout/BreakingTicker.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx`<br>`src/components/ads/AdSkyscraper.tsx`<br>`src/components/ads/AdBottomAnchor.tsx`<br>`src/components/ads/AdNativeTile.tsx`<br>`src/app/page.tsx`<br>`src/app/play/[slug]/page.tsx`<br>`src/app/category/[category]/page.tsx` | Melanggar kebijakan ketat *Strict No-Emoji Policy* yang membuat tampilan terlihat tidak profesional dan tidak konsisten antar OS/perangkat. | Dihapus total (0 emoji di seluruh codebase) dan digantikan 100% dengan ikon vektor presisi dari **Lucide React** (`Gamepad2`, `Compass`, `Puzzle`, `Zap`, `Coffee`, `Trophy`, `Star`, `ShieldCheck`, `Network`, `Cpu`, dll.) serta ornamen SVG murni. |
| 5 | **Palet Warna Neon Cyan Lama:** (`#00F0FF`, `#070B14`, `#0B1222`) | `src/app/globals.css`<br>Seluruh komponen UI | Estetika lama bertabrakan dengan identitas visual baru bertema dinamis 60 - 30 - 10. | Diganti dengan sistem warna terpusat:<br>- 60% Dominan: Midnight Navy (`#021861`) & Deep Void Navy (`#010B2E`)<br>- 30% Sekunder: Cobalt Blue (`#255dce`) dengan Selective Glassmorphism & Solid Elevated Cards<br>- 10% Aksen: Burgundy (`#660033` - `#8A0045`) untuk CTA, sponsor badge, dan favorit aktif. |
| 6 | **Tipografi Lama (Geist / Geist Mono):** | `src/app/layout.tsx`<br>`src/app/globals.css` | Font lama kurang mencerminkan nuansa teknologi modern dan keterbacaan tinggi di layar HP/Desktop. | Diganti dengan Google Fonts teroptimasi (`display: 'swap'`):<br>- Heading: **`Space Grotesk`** (600, 700)<br>- Body/UI: **`Plus Jakarta Sans`** (400, 500, 600, 700). |
| 7 | **Pengalih Bahasa (Language Toggle `ID/EN`):** | `src/components/layout/Navbar.tsx` | Menimbulkan ambiguitas antarmuka karena konten backend game dan portal ditargetkan 100% Bahasa Indonesia. | Dihapus dari Navbar sesuai aturan bahwa Navbar hanya memuat 8 elemen utama resmi. |
| 8 | **Grid Kolom Friv Lama (6-8 Kolom Rapat di Desktop & 3 Kolom di HP):** | `src/components/game/GameGrid.tsx`<br>`src/app/play/[slug]/page.tsx` | Menyebabkan layout sempit dan rawan salah klik (*accidental click*) pada Google Ads di layar HP. | Diubah ke arsitektur responsif standar 3 ukuran layar:<br>- Mobile (`< 768px`): 2 kolom proporsional (touch target > 44px)<br>- Tablet (`768px - 1023px`): 3 kolom proporsional<br>- Desktop (`>= 1024px`): 4 kolom proporsional dengan zona aman Floating Side Ads. |
| 9 | **Iklan Samping Tanpa Kunci Wadah (Potensi Layout Shift):** | `src/components/ads/AdSkyscraper.tsx`<br>`src/components/ads/AdBottomAnchor.tsx` | Dimensi wadah iklan tidak terkunci dengan ketat sehingga berisiko menimbulkan *Cumulative Layout Shift* (CLS > 0). | Mengunci dimensi wadah iklan secara permanen (`160x600`, `320x50`, `300x250`) via komponen `<GoogleAdSlot />`, membuat floating side ads permanen di desktop, serta menyediakan tombol sembunyikan iklan di mobile. |
| 1 | **Slogan / Motto Lama:** `"PLAY. EVOLVE. CONQUER."` | `src/app/layout.tsx`<br>`src/app/page.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx` | Dihapus total sesuai panduan resmi identitas baru brand Tekno Game. | Dihapus 100% dari UI, teks, komentar, dan metadata `<head>`. Fokus pada identitas resmi sub-portal PT Teknotama Prakarsa Mulia. |
| 2 | **Logo Lama & Ikon Usang:** `teknogame-icon.png`, `teknogame-banner.png`, `teknogame-logo.png` | `src/app/layout.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx`<br>`src/app/icon.png`<br>`src/app/apple-icon.png` | Logo lama tidak menggunakan perisai monogram GT modern. | Diganti dengan ikon perisai monogram GT baru `/Teknogame_logo_only.png` berdampingan horizontal dengan teks modern "Tekno Game". |
| 3 | **Penulisan Nama Brand Tanpa Spasi:** `"TeknoGame"` | Seluruh file di `src/app/` dan `src/components/` | Menyeragamkan identitas resmi menjadi **"Tekno Game"** (dengan spasi). | Diubah 100% konsisten menjadi **"Tekno Game"** di Navbar, Footer, Hero, Title Tag, Metadata, dan Schema JSON-LD. |
| 4 | **Karakter Emoji Unicode (Strict No-Emoji Policy):** `🎮`, `🕹️`, `🧭`, `🧩`, `⚡`, `☕`, `⚽`, `🏃‍♂️`, `🚢`, `🧳`, `🛺`, `🛕`, `🎨`, `🪁`, `🪂`, `🛶`, `🗺️`, `🐺`, `🐦`, `🧠`, `🌐`, `🏆`, `🏎️`, `🚀`, `💻`, `⭐` | `src/lib/games-data.ts`<br>`src/components/game/`<br>`src/components/layout/`<br>`src/components/ads/`<br>`src/app/` | Kebijakan ketat bebas emoji untuk estetika modern, profesional, dan konsisten di seluruh browser/OS. | 0 emoji di seluruh kode. Digantikan sepenuhnya dengan ikon vektor ringan dari **Lucide React** (`Gamepad2`, `Compass`, `Puzzle`, `Zap`, `Coffee`, `Trophy`, `Star`, `ShieldCheck`, `Network`, `Cpu`, dll.) dan ornamen SVG murni. |
| 5 | **Palet Warna Neon Cyan Lama:** (`#00F0FF`, `#070B14`, `#0B1222`) | `src/app/globals.css`<br>Seluruh komponen UI | Desain warna lama digantikan sistem warna proporsional dinamis 60-30-10. | Diperbarui menjadi:<br>- 60% Dominan: Midnight Navy (`#021861`) & Deep Void Navy (`#010B2E`)<br>- 30% Sekunder: Cobalt Blue (`#255dce`) dengan Selective Glassmorphism & Solid Elevated Cards<br>- 10% Aksen: Burgundy (`#660033` - `#8A0045`) sebagai focal point CTA dan tombol sponsor. |
| 6 | **Tipografi Lama (Geist / Geist Mono):** | `src/app/layout.tsx`<br>`src/app/globals.css` | Mengoptimalkan keterbacaan (*legibility*) dan identitas modern futuristik. | Menggunakan self-hosted Google Fonts (`next/font/google`) dengan `display: 'swap'`:<br>- Heading: **`Space Grotesk`** (600, 700)<br>- Body/UI: **`Plus Jakarta Sans`** (400, 500, 600, 700). |
| 7 | **Pengalih Bahasa (`ID/EN`):** | `src/components/layout/Navbar.tsx` | Seluruh antarmuka diarahkan 100% Bahasa Indonesia baku. | Dihapus agar Navbar tepat memuat 8 elemen wajib. |
| 8 | **Grid Kolom Lama (6-8 Kolom Rapat di Desktop & 3 Kolom di HP):** | `src/components/game/GameGrid.tsx`<br>`src/app/play/[slug]/page.tsx` | Mencegah salah klik (*accidental click*) pada Google Ads di layar HP dan menjaga proporsi kartu. | Menerapkan layout responsif 3 ukuran layar:<br>- Mobile (`< 768px`): 2 kolom proporsional (touch target > 44px)<br>- Tablet (`768px - 1023px`): 3 kolom proporsional<br>- Desktop (`>= 1024px`): 4 kolom proporsional dengan zona aman Floating Side Ads. |
| 9 | **Iklan Samping & Bawah Tanpa Kunci Wadah Anti-CLS:** | `src/components/ads/AdSkyscraper.tsx`<br>`src/components/ads/AdBottomAnchor.tsx` | Menghilangkan risiko pergeseran tata letak (CLS > 0). | Mengunci dimensi wadah iklan via komponen baru `<GoogleAdSlot />`, membuat floating side ads permanen di desktop, dan menambahkan tombol "Sembunyikan Iklan" di mobile. |

#### 2. Fitur & Komponen Baru:
- **Navbar Efek Selective Glassmorphism:**
  - Hanya memuat 8 elemen resmi: Brand Logo Tekno Game, Search Bar, Beranda, Kategori Game (Dropdown), Main Acak, Papan Skor, Favorit, dan Link Sponsor `teknotama.com` yang sangat ditonjolkan dengan gradasi Burgundy (`#660033`).
- **Modal Favorit (`FavoritesModal.tsx`):**
  - Modal glassmorphism interaktif untuk melihat dan mengelola game yang difavoritkan secara lokal.
- **Hero Visual Showcase & Ekosistem Teknotama:**
  - Tipografi tegas, visualisasi sirkuit & orbit geometris SVG murni, serta kartu showcase sponsor solusi IT, Cloud System, Data Security, dan Custom Software Development dari **PT Teknotama Prakarsa Mulia** (`https://teknotama.com`).
- **Sorotan Papan Skor Terbaik di Homepage:**
  - Menampilkan 4 rekor skor lokal teratas pengguna untuk meningkatkan dwell time dan kompetisi.
- **Halaman Detail Game (`/play/[slug]`):**
  - Bilah kontrol modern dengan tombol Layar Penuh (Fullscreen API), Bagikan Tautan (Web Share API + toast notifikasi glassmorphism), Favorit (Heart icon dengan transisi warna ke Burgundy), dan Muat Ulang.
- **Footer Resmi Sponsor:**
  - Menampilkan brand Tekno Game dengan logo `/Teknogame_logo_only.png` dan teks wajib resmi dukungan **PT Teknotama Prakarsa Mulia** serta tautan aktif ke `https://teknotama.com`.
- **Technical SEO Sub-Direktori:**
  - `metadataBase: new URL('https://teknotama.com')` dan tag `<link rel="canonical">` akurat ke `/games/...`.
  - Pemisahan `export const viewport: Viewport` dengan `themeColor: '#021861'`.
  - Favicon & Web Icons mengarah ke `/Teknogame_logo_only.png` dan `/favicon.ico`.
  - JSON-LD Structured Data: `WebSite` di Homepage dan `VideoGame` + `BreadcrumbList` 4 tingkat di Halaman Game.
  - Resource hints `preconnect` & `dns-prefetch` ke `https://pagead2.googlesyndication.com` dan `https://teknotama.com`.

---

## 2. Keterhubungan SEO Sub-Direktori `teknotama.com/games/`
- Konfigurasi `basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '/games'` pada `next.config.ts`.
- `metadataBase: new URL('https://teknotama.com')` dan canonical link URL presisi ke `/games/...`.
- Schema JSON-LD `WebSite` di Homepage dan `VideoGame` + `BreadcrumbList` 4 level di halaman game.
- Tombol sponsor `teknotama.com` di Navbar dan Footer terhubung langsung dengan target `_blank` dan `rel="noopener noreferrer"`.
## [2.6.3] - 2026-11-17
### Changed & Deployed (Include `out/` Build Folder in Git Tracking)
- **Mengaktifkan Git Tracking untuk Folder `out/` ([.gitignore](.gitignore)):**
  - Menghapus `/out/` dari `.gitignore` agar artefak hasil build produksi Next.js tersimpan langsung di branch GitHub `games`.
  - Memudahkan proses deployment langsung ke hosting cPanel/Apache tanpa harus menjalankan build di sisi server.

## [2.6.2] - 2026-11-16
### Fixed (Lembah Bromo Game Over & Sunset/Momentum Mechanics)
- **Implementasi Mekanik Game Over yang Seimbang di Lembah Bromo:**
  - Menambahkan batas waktu siang (*Daylight / Sunset Timer*) selama 60 detik. Setiap mengambil bintang emas di bukit, waktu siang bertambah `+3 detik`. Saat matahari terbenam (waktu habis), petualangan berakhir (*Game Over*).
  - Menambahkan sistem *Friction & Loss of Momentum*: jika paralayang terhenti di hamparan pasir bukit dan kehilangan kecepatan (`vx <= 0.8`) selama ~0.7 detik, game over dipicu.
  - Menambahkan *Hard Crash Detection*: jika pemain menukik tajam langsung menabrak lereng tebing terjal (`vy > 4.5` pada lereng negatif curam), paralayang terhempas dan game over.
  - Membatasi lompatan di udara (*Air Jump*) menjadi 1 kali per fase terbang (bisa di-reset dengan menyentuh lereng bukit atau mengambil bintang), sehingga pemain harus mahir memanfaatkan gelombang bukit ala Tiny Wings.
  - Folder `out/` telah di-build ulang (`npm run build`).

## [2.6.1] - 2026-11-16
### Added & Fixed (Custom Not-Found Page & Auto-Redirect from Root to /games)
- **Penambahan Custom 404 & Auto-Redirect Root ([not-found.tsx](src/app/not-found.tsx)):**
  - Membuat halaman khusus 404 Cyber TeknoGame dengan tombol aksi cepat menuju beranda `/games`.
  - Menambahkan auto-redirect otomatis berbasis JavaScript di browser ketika user membuka root `http://localhost:3000/` agar langsung diarahkan ke `http://localhost:3000/games`.

## [2.6.0] - 2026-11-16
### Added (Integrasi Game Werewolf: Malam & Desa)
- **Integrasi Penuh Game Werewolf (`/games/werewolf/index.html`):**
  - Mengintegrasikan game deduksi sosial lokal Werewolf ke portal utama TeknoGame.
  - Fitur lengkap: setup nama pemain unik (min 5 pemain), pembagian role rahasia (Werewolf, Seer, Doctor, Villager), fase malam (target Werewolf, perlindungan Doctor, terawang Seer), fase siang (diskusi desa & voting eliminasi), serta penentuan kemenangan warga vs werewolf.
  - Sinkronisasi skor akhir ronde ke portal TeknoGame via `postMessage({ type: 'GAME_OVER' })`.
  - Terdaftar resmi di `INITIAL_GAMES` (`games-data.ts`) dan kartu game (`GameCard.tsx`) dengan icon `🐺`.
