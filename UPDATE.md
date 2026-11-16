# CHANGELOG & UPDATE LOG (game.travelista.id)

Dokumen ini mencatat seluruh riwayat pembaruan, perbaikan bug, dan penambahan fitur pada project **Travelista Games** (`game.travelista.id`) dengan format standar **Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`)**:

* **MAJOR (`X.0.0`):** Perubahan besar pada arsitektur sistem, struktur database, atau breaking changes.
* **MINOR (`0.X.0`):** Penambahan fitur baru, halaman baru, atau pembaruan fungsionalitas yang backward-compatible.
* **PATCH (`0.0.X`):** Perbaikan bug, hotfix styling, optimasi performa, atau perbaikan minor.

---

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

### Fixed & Improved (Bug Fixes & Mobile HP Compatibility)
- **Perbaikan Game Lembah Bromo (Hang Glider):**
  - Memperbaiki bug kritis loop animasi terputus (`requestAnimationFrame`) saat menabrak lereng yang menyebabkan gunung membeku (stuck) dan jalanan/karakter hilang.
  - Memperbaiki tombol restart "Terbangkan Kembali" agar langsung me-reset state dan melanjutkan permainan tanpa macet.
  - Menambahkan mekanik **LOMPAT / ANGKAT SAYAP** (melalui Spasi, Panah Atas, tombol on-screen `🪂 LOMPAT`, atau tap cepat layar) dengan dorongan updraft thermal.
  - Menyesuaikan gravitasi dan aerodinamika luncur (aerodynamic lift) agar paralayang tidak jatuh terlalu cepat dan melayang anggun di atas lembah Bromo.
  - Menambahkan tombol on-screen `🔻 TUKIK` untuk menukik di lereng turunan dan mendapatkan dorongan kecepatan tinggi.
- **Perbaikan Game Barista (Kopi Klotok):**
  - Mengatur popup score banner di bagian atas `GameFrame.tsx` agar otomatis menutup (auto-close) setelah **2 detik** (2000ms), sehingga tidak menghalangi area bermain.
  - Memperlambat kecepatan jatuh tetesan kopi di awal permainan (kecepatan awal santai 2.0) dan mempercepat secara bertahap seiring bertambahnya skor pemain.
  - Menyesuaikan jeda spawn tetesan secara dinamis sesuai ritme kopi barista.
  - Mendukung tap di seluruh area kanvas layar untuk mempermudah pemain di smartphone.
- **Optimasi Kontrol Becak Drift & Kompatibilitas Seluruh Game di HP (Mobile):**
  - **Becak Drift:** Menambahkan tombol kemudi sentuh di layar `[ ◀ KIRI ]` dan `[ KANAN ▶ ]` serta area tap layar kiri/kanan dengan event listener anti-stuck (`pointerleave`, `pointercancel`, `touchcancel`). Menambahkan `touch-action: none` agar tidak terganggu gesture browser HP.
  - **Packing Master:** Menambahkan sistem sentuh tap-to-select & tap-to-place (karena HTML5 native drag-and-drop tidak didukung browser mobile HP).
  - **Pasar Terapung:** Menambahkan tombol kemudi `[ ◀ KAYUH ]` dan `[ KAYUH ▶ ]` serta swipe drag layar dengan `touch-action: none`.
  - **Candi Stacker:** Menambahkan tombol `[ 🛕 JATUHKAN BATU ]` dan tap kanvas responsif di HP.
  - **Layangan Sanur:** Menambahkan tombol `[ 🪁 TARIK MENUKIK ]` di layar HP.
  - **Nusantara Runner:** Menambahkan tombol `[ 👟 LOMPAT ]` melayang di layar HP.
  - **Kamus Kelana & Batik Flow:** Mengoptimalkan `touch-action: none` / `manipulation` agar input roda huruf dan ubin batik instan tanpa delay.

---

## [2.5.1] - 2026-11-13
### Fixed (Header Logo Asset Path & Game Over Audio Loop Bug)
- **Perbaikan Audio Game Over (Anti-Loop & Sound Sekali Saja):**
  - Memperbaiki bug di mana fungsi `gameOver()` terpanggil berulang kali (60x/detik) saat becak/karakter menabrak rintangan di `becak-drift` dan `nusantara-runner`.
  - Menambahkan guard clause `if (!isPlaying) return;` dan membatasi collision check di dalam blok `isPlaying` pada seluruh game mini HTML5.
  - Suara tabrakan game over kini berbunyi sekali saja dengan volume yang nyaman dan tidak berulang.
- **Perbaikan Logo Header TeknoGame di Subfolder `/games/`:**
  - Mengubah path gambar `<Image src="/games/teknogame-icon.png">` di `Navbar.tsx` dan `Footer.tsx` agar browser memuat logo langsung dari subfolder `/games/` tanpa error broken image icon.

---

## [2.5.0] - 2026-11-13
### Changed & Optimized (Configured Subfolder `/games` for /public_html/games/ Match)
- **Penyesuaian Subfolder Menjadi `/games`:**
  - Menyetel `basePath: "/games"` di `next.config.ts` agar presisi 100% dengan folder server `/public_html/games/`.
  - Mengubah prefix aset metadata & icon favicon menjadi `/games/teknogame-icon.png?v=3` dan `/games/favicon.ico?v=3`.
  - Menyesuaikan iframe container `GameFrame.tsx` agar memuat engine game dari `/games/games/[slug]/index.html`.
  - Memperbarui panduan deployment di `DEPLOY.md` untuk mencerminkan folder `/public_html/games/` dan `.htaccess` dengan `RewriteBase /games/`.

---

## [2.4.0] - 2026-11-13
### Added & Documented (Deployment Guide `DEPLOY.md` for Apache XAMPP & FileZilla)
- **Pembuatan Panduan Deployment Lengkap ([DEPLOY.md](DEPLOY.md)):**
  - Menjelaskan secara rinci bahwa yang di-deploy ke server adalah **HASIL BUILD di dalam folder `out/`**, bukan file mentah project (`src/`, `node_modules/`, dll).
  - Menyediakan panduan langkah demi langkah penggunaan FileZilla untuk meng-upload ke subfolder `htdocs/game/` maupun root domain `htdocs/`.
  - Menyertakan konfigurasi template Apache `.htaccess` untuk client-side routing dan pencegahan error 404 pada saat refresh halaman.
  - Menyertakan checklist troubleshooting permission file, path URL `basePath`, dan cache buster browser.

---

## [2.3.1] - 2026-11-13
### Added & Configured (Subfolder Deployment `/game` for Apache htdocs/game)
- **Konfigurasi Subfolder BasePath `/game`:**
  - Menyetel `basePath: "/game"` di `next.config.ts` sehingga seluruh rute internal (`<Link>`), routing navigasi, chunk JS, stylesheet CSS, dan aset statis otomatis diawali dengan prefix `/game`.
  - Memperbarui path iframe pada `GameFrame.tsx` agar memuat engine game HTML5 dari subfolder `/game/games/[slug]/index.html`.
  - Memperbarui tag `<head>` dan metadata favicon di `layout.tsx` agar menggunakan path `/game/teknogame-icon.png?v=3` dan `/game/favicon.ico?v=3`.
  - Hasil kompilasi folder `out/` kini siap di-upload ke dalam folder **`htdocs/game/`** dan langsung dapat diakses sempurna melalui URL **`http://.../game`**.

---

## [2.5.1] - 2026-11-13
### Fixed (Header Logo Asset Path & Game Over Audio Loop Bug)
- **Perbaikan Audio Game Over (Anti-Loop & Sound Sekali Saja):**
  - Memperbaiki bug di mana fungsi `gameOver()` terpanggil berulang kali (60x/detik) saat becak/karakter menabrak rintangan di `becak-drift` dan `nusantara-runner`.
  - Menambahkan guard clause `if (!isPlaying) return;` dan membatasi collision check di dalam blok `isPlaying` pada seluruh game mini HTML5.
  - Suara tabrakan game over kini berbunyi sekali saja dengan volume yang nyaman dan tidak berulang.
- **Perbaikan Logo Header TeknoGame di Subfolder `/games/`:**
  - Mengubah path gambar `<Image src="/games/teknogame-icon.png">` di `Navbar.tsx` dan `Footer.tsx` agar browser memuat logo langsung dari subfolder `/games/` tanpa error broken image icon.

---

## [2.5.0] - 2026-11-13
### Changed & Optimized (Configured Subfolder `/games` for /public_html/games/ Match)
- **Penyesuaian Subfolder Menjadi `/games`:**
  - Menyetel `basePath: "/games"` di `next.config.ts` agar presisi 100% dengan folder server `/public_html/games/`.
  - Mengubah prefix aset metadata & icon favicon menjadi `/games/teknogame-icon.png?v=3` dan `/games/favicon.ico?v=3`.
  - Menyesuaikan iframe container `GameFrame.tsx` agar memuat engine game dari `/games/games/[slug]/index.html`.
  - Memperbarui panduan deployment di `DEPLOY.md` untuk mencerminkan folder `/public_html/games/` dan `.htaccess` dengan `RewriteBase /games/`.

---

## [2.4.0] - 2026-11-13
### Added & Documented (Deployment Guide `DEPLOY.md` for Apache XAMPP & FileZilla)
- **Pembuatan Panduan Deployment Lengkap ([DEPLOY.md](DEPLOY.md)):**
  - Menjelaskan secara rinci bahwa yang di-deploy ke server adalah **HASIL BUILD di dalam folder `out/`**, bukan file mentah project (`src/`, `node_modules/`, dll).
  - Menyediakan panduan langkah demi langkah penggunaan FileZilla untuk meng-upload ke subfolder `htdocs/game/` maupun root domain `htdocs/`.
  - Menyertakan konfigurasi template Apache `.htaccess` untuk client-side routing dan pencegahan error 404 pada saat refresh halaman.
  - Menyertakan checklist troubleshooting permission file, path URL `basePath`, dan cache buster browser.

---

## [2.3.1] - 2026-11-13
### Added & Configured (Subfolder Deployment `/game` for Apache htdocs/game)
- **Konfigurasi Subfolder BasePath `/game`:**
  - Menyetel `basePath: "/game"` di `next.config.ts` sehingga seluruh rute internal (`<Link>`), routing navigasi, chunk JS, stylesheet CSS, dan aset statis otomatis diawali dengan prefix `/game`.
  - Memperbarui path iframe pada `GameFrame.tsx` agar memuat engine game HTML5 dari subfolder `/game/games/[slug]/index.html`.
  - Memperbarui tag `<head>` dan metadata favicon di `layout.tsx` agar menggunakan path `/game/teknogame-icon.png?v=3` dan `/game/favicon.ico?v=3`.
  - Hasil kompilasi folder `out/` kini siap di-upload ke dalam folder **`htdocs/game/`** dan langsung dapat diakses sempurna melalui URL **`http://.../game`**.

---

## [2.3.0] - 2026-11-13
### Added & Optimized (Static HTML Export for Apache XAMPP / htdocs Deployment)
- **Konfigurasi Output Static Export (`out/`):**
  - Mengubah konfigurasi `next.config.ts` menjadi `output: "export"` sehingga build menghasilkan bundle 100% statis (HTML, CSS, JS, dan aset game).
  - Mengimplementasikan `generateStaticParams()` pada rute `src/app/play/[slug]/page.tsx` dan `src/app/category/[category]/page.tsx` untuk pre-render seluruh halaman game dan kategori secara statis (SSG).
  - Folder output **`out/`** kini dapat di-copy/upload langsung via FileZilla ke folder **`htdocs`** Apache XAMPP tanpa perlu instalasi Node.js runtime di server remote.

---

## [2.2.0] - 2026-11-13
### Added & Changed (All Promotional Links Connected to teknotama.com)
- **Integrasi Penuh Promosi ke teknotama.com:**
  - Menghubungkan seluruh elemen promosi, slot iklan sponsor, dan backlink partner ke situs resmi **`https://teknotama.com`** (**PT Teknotama Prakarsa Mulia**).
  - **AdBottomAnchor:** Mengubah banner sticky sponsor bawah menjadi highlight solusi IT & layanan digital Teknotama dengan tombol aksi langsung ke `teknotama.com`.
  - **AdCompanion (300x250) & Play Page Partner Card:** Menampilkan promo layanan cloud system, data security, dan custom software development dari Teknotama di sebelah layar bermain game.
  - **AdNativeTile:** Menyesuaikan tile sponsor di dalam matriks game menjadi promosi resmi solusi IT Teknotama.
  - **AdSkyscraper (160x600 Rails):** Menyelaraskan promosi banner rel kiri (Solusi Jaringan & Cloud) dan kanan (Custom Software & Security) lengkap dengan tautan ke `teknotama.com`.
  - **Navbar & Live Radar Ticker:** Menambahkan badge partner `🌐 teknotama.com` pada navbar desktop & drawer mobile, serta menyisipkan marquis promo solusi digital Teknotama pada ticker Live Radar.
  - **Footer & Homepage Feature:** Menambahkan kolom profil partner teknologi resmi PT Teknotama Prakarsa Mulia pada footer serta banner promosi akselerasi bisnis di beranda utama.
- **Penyelarasan Dokumentasi:**
  - Memperbarui `Design.md`, `PRD.md`, dan `UPDATE.md` terkait integrasi promosi tunggal ke `teknotama.com`.

---

## [2.1.1] - 2026-11-13
### Fixed & Added (Tab Favicon Cache Refresh & Agent Workflow Policy)
- **Tab Favicon Cache Refresh & Head Injection:**
  - Menginjeksi tag `<head>` eksplisit dengan cache-buster (`/teknogame-icon.png?v=3` dan `/favicon.ico?v=3`) di `src/app/layout.tsx` untuk memastikan tab browser segera memperbarui favicon ke logo perisai TeknoGame.
  - Menimpa legacy `travelista-logo-gram.png` dengan logo resmi TeknoGame.
- **Workflow & Commit Policy Integration:**
  - Menambahkan aturan wajib commit Git dan standar SemVer ke `AGENTS.md` agar setiap perubahan langsung tersimpan ke version control.

---

## [2.1.0] - 2026-11-13
### Added & Changed (Complete Brand Pivot to TeknoGame & Cyber Blue Theme)
- **Transformasi Identitas Brand ke TeknoGame:**
  - Melakukan pivot menyeluruh dari portal *Travelista Games* menjadi **TeknoGame (`TEKNO GAME`)** dengan slogan resmi *"PLAY. EVOLVE. CONQUER."*.
  - Mengintegrasikan aset logo resmi `TeknoGame_Logo.jpeg`, memproses ikon perisai `GT` emblem untuk `favicon.ico`, `icon.png`, `apple-icon.png`, dan `teknogame-icon.png`.
- **Implementasi Sistem Palet Warna Cyber Blue & Dark Mode:**
  - Mengubah tema dasar menjadi *Deep Space Dark Mode* (`#070B14` void black, `#0B1222` midnight navy, `#0F172A` card surface).
  - Mengadopsi aksen utama *Neon Cyber Cyan* (`#00F0FF` / `#38BDF8`) dan *Electric Blue* (`#2563EB` / `#1D4ED8`) dengan efek interaktif *glow cyan* pada hover kartu game.
- **Perombakan Total Komponen UI/UX:**
  - **Navbar:** Header cyberpunk baru berlogo perisai `GT` menyala, navigasi arena kategori, dan tombol neon `[ ⚡ Main Acak ]` & `[ 🏆 Hall of Fame ]`.
  - **Breaking Ticker (Live Radar):** Mengubah bar berita merah lama menjadi bar kaca navy gelap `[ ⚡ LIVE RADAR ]` dengan pulsing dot hijau menampilkan aktivitas online gamer.
  - **Game Hero:** Menghadirkan spotlight arena bertema *Game of the Week* dengan tombol CTA neon cyan-blue dan kartu trending bertumpuk.
  - **Game Grid & Card (The Tekno Matrix):** Kartu Friv dengan border sirkuit gelap yang menyala terang (*cyan glow*) saat di-hover.
  - **Game Frame (Cyber Theater Mode):** Layar bermain berbingkai neon dengan dock kontrol instan dan banner Game Over otomatis.
  - **LeaderboardModal (Tekno Hall of Fame):** Papan rekor pribadi bergaya ruang piala sirkuit digital berbasis `LocalStorage` tanpa latensi server.
  - **Footer:** Identitas TeknoGame, informasi fitur, dan penegasan privasi 100% bebas database.
  - **Sponsor Ads:** Memperbarui banner fallback companion, skyscraper, native tile, dan bottom anchor ke tema perlengkapan gaming futuristik.
- **Penyelarasan Seluruh Dokumentasi Proyek:**
  - Memperbarui `Design.md`, `PRD.md`, `newdesign.md`, dan `UPDATE.md` di seluruh direktori proyek.

---

## [2.0.0] - 2026-11-13
### Changed & Removed (Zero-Database Architecture & 100% Static / LocalStorage)
- **Eliminasi Total Koneksi & Modul Database:**
  - Menghapus dependency driver `mysql2` dari `package.json` dan membersihkan `node_modules`.
  - Menghapus modul pool koneksi database `src/lib/db.ts`.
  - Menghapus seluruh variabel lingkungan database (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) dari file `.env.local` dan `.env.example`.
- **Penghapusan Fitur & Route Handler Berbasis Database:**
  - Menghapus direktori backend route handlers `src/app/api/` (`/api/games`, `/api/leaderboard`, dan `/api/stats`).
  - Menghilangkan network request tracker statistik `fetch('/api/stats')` pada saat game dibuka di `GameFrame.tsx`.
  - Menghilangkan form input nickname & submission score `fetch('/api/leaderboard')` di `GameFrame.tsx`.
- **Refactoring Leaderboard ke 100% Client-Side LocalStorage:**
  - Mengubah `LeaderboardModal.tsx` menjadi modal "Papan Rekor & Prestasi Pribadi" yang memuat skor terbaik langsung dari `LocalStorage` browser secara instan tanpa loading spinner atau latensi server.
  - Menambahkan visualisasi ringkasan rekor (total game dimainkan, skor tertinggi, medali juara, dan tombol main lagi).
  - Menambahkan utilitas `clearLocalScores()` di `src/lib/local-storage.ts` agar pemain dapat mereset rekor lokal secara mandiri.
  - Memperbarui tampilan Game Over banner pada layar game agar langsung menampilkan skor akhir dan konfirmasi penyimpanan ke browser.
- **Pembaruan Dokumen PRD ke Versi 2.0.0:**
  - Menyelaraskan seluruh dokumen `PRD.md` (root dan `game/PRD.md`) dengan arsitektur 100% Database-Free, menghilangkan langkah setup MariaDB di DirectAdmin Hostdata.id, dan menghapus skema tabel SQL yang sudah tidak digunakan.

---

## [1.5.1] - 2026-11-05
### Changed & Fixed (Web Title & Official Favicon)
- **Web Title Optimization:** Mengubah metadata title tab browser menjadi ringkas dan tepat: **`Travelista Games`** (menghilangkan suffix deskripsi panjang pada tab title).
- **Official Brand Favicon (Logo Gram):** Mengganti favicon bawaan Next.js "N" dengan ikon resmi **`travelista-logo-gram.png`** (emblem lingkaran 'T' Travelista) untuk `favicon.ico`, `icon.png`, dan `apple-icon.png`, sehingga tab browser menampilkan logo resmi Travelista secara tajam dan konsisten.

---

## [1.5.0] - 2026-11-03
### Added & Changed (Zero-Asset Games & No More Duplicates)
- **Eliminasi Game Duplikat / Placeholder:** Menghapus seluruh link fallback duplikat pada 9 game kemarin dan menggantinya dengan implementasi game mandiri.
- **Implementasi 8 Game Baru dari `list-game2.md`:**
  1. `becak-drift` (`/games/becak-drift/`): Top-down micro racing & drift becak Malioboro Jogja.
  2. `candi-stacker` (`/games/candi-stacker/`): Precision tower stacker balok andesit Candi Borobudur dengan audio gamelan.
  3. `batik-flow` (`/games/batik-flow/`): Rotating pipe puzzle sambung ukiran lilin malam canting kain batik mori.
  4. `layangan-sanur` (`/games/layangan-sanur/`): Action tension battle layangan aduan bebean di Pantai Sanur Bali.
  5. `kopi-klotok` (`/games/kopi-klotok/`): Rhythm barista menyeduh tetesan kopi & biji panggang di cangkir tanah liat.
  6. `lembah-bromo` (`/games/lembah-bromo/`): Momentum flight paralayang menukik melintasi bukit pasir Bromo.
  7. `pasar-terapung` (`/games/pasar-terapung/`): Falling fruit catcher perahu jukung di Sungai Martapura Banjarmasin.
  8. `kamus-kelana` (`/games/kamus-kelana/`): Word connect & teka-teki silang kosakata destinasi pariwisata nusantara.
- **100% Unique Game Pathing:** Setiap game pada katalog utama kini memiliki direktori dan entry point mandiri (`/games/[slug]/index.html`), sehingga saat diklik tidak akan membuka game yang salah.
- **Enhanced Friv Card Icons:** Menambahkan mapping ikon tematik unik untuk setiap game agar tampilan grid Friv semakin semarak dan mudah dikenali.

---

## [1.4.0] - 2026-11-02
### Added & Changed
- **Official Brand Logo Asset:** Mengganti logo teks di `Navbar.tsx` dan `Footer.tsx` dengan aset gambar resmi `travelista-logo-light.png` beresolusi tajam.
- **Direct Portal Hyperlink:** Menghubungkan klik logo langsung mengarah ke portal utama `https://travelista.id`.
- **Badge GAMES Retention:** Mempertahankan pill badge merah tebal `GAMES` di samping kanan logo gambar.

---

## [1.3.2] - 2026-11-02
### Fixed
- **Hydration Mismatch Fix:** Menambahkan atribut `suppressHydrationWarning` pada tag `<html>` dan `<body>` di `layout.tsx` untuk mencegah crash hidrasi akibat injeksi atribut ekstensi Chrome (Grammarly, ColorZilla).
- **Tailwind Source Scanning:** Menambahkan direktif `@source` di `globals.css` untuk memastikan PostCSS memindai seluruh direktori komponen secara menyeluruh.
- **Cache Clean-up:** Membersihkan cache stale di `.next` dan melakukan build ulang yang sukses menghasilkan stylesheet 58.3 KB.

---

## [1.3.1] - 2026-11-02
### Fixed
- **Webpack & PostCSS Compatibility Patch:**
  - Mengubah script `dev` dan `build` di `package.json` untuk menyertakan flag `--webpack` karena platform Windows host tidak memuat native binary SWC Turbopack.
  - Menginstal package pendukung `@tailwindcss/postcss` dan `postcss`.
  - Membuat file konfigurasi `postcss.config.mjs` untuk memproses `@import "tailwindcss";` pada mode Webpack.

---

## [1.3.0] - 2026-11-02
### Added (Full System & Game MVP Implementation)
- **Implementasi Frontend Next.js 16 + Tailwind CSS v4:**
  - Desain sistem lengkap sesuai token `Design.md`.
  - **Navbar 2-Tier:** Main Bar (Logo, navigasi kategori, tombol pencarian, selector bahasa, dual pills *Main Acak* dan *Leaderboard*) + Sub-bar Ticker Merah dengan animasi marquis berjalan.
  - **Monetisasi & Ad Placements:** Skyscraper Kiri-Kanan (160x600 untuk layar `>= 1440px`), Sticky Bottom Anchor Ad (728x90/320x50 dengan tombol minimize collapse), In-Grid Native Ad Tile, dan Companion Ad 300x250.
  - **Katalog Game Friv-Style:** Hero section 3 game unggulan, chip filter kategori *"Jelajahi"*, dan grid dinamis ubin game responsif.
  - **Layar Gameplay (`/play/[slug]`):** Iframe runner sandbox, kontrol Layar Penuh (Fullscreen), Reload, Simpan Favorit, Bagikan Link, dan panduan tombol kendali keyboard/touch.
  - **3 Game HTML5 Internal Siap Main:**
    1. `nusantara-runner` (Endless runner 2D melintasi Malioboro, Bromo, Bali).
    2. `kapal-feri` (Simulasi nakhoda feri Merak-Bakauheni dengan fisika ombak laut).
    3. `packing-master` (Puzzle drag-and-drop menata koper bagasi).
  - **Interaksi Skor `postMessage`:** Setiap game HTML5 mengirimkan event skor saat game over ke portal Next.js.
  - **Hybrid Data Storage:** Penyimpanan skor dan favorit di `LocalStorage` + modul API route `/api/leaderboard`, `/api/games`, dan `/api/stats` dengan pool koneksi database MariaDB / MySQL.

---

## [1.2.0] - 2026-11-02
### Added
- **Spesifikasi Struktur Direktori Lengkap:** Pemetaan arsitektur folder dan file di `PRD.md` (komponen layout, iklan, game, lib database, public games, dan types).
- **Standalone Build Target:** Konfigurasi Next.js `output: "standalone"` untuk mendukung CloudLinux Node.js Selector di DirectAdmin Hostdata.id.

---

## [1.1.0] - 2026-11-02
### Added
- **Spesifikasi Server Hostdata.id & Database:**
  - Penyesuaian arsitektur untuk DirectAdmin, LiteSpeed Web Server, CloudLinux CageFS, dan Node.js v20.20.2 LTS.
  - Skema database MariaDB 10.11 / MySQL lokal dengan nama database `immanuel_travelista_game`.
  - Prosedur delegasi DNS A Record subdomain `game.travelista.id`.

---

## [1.0.0] - 2026-11-02
### Added (Initial Blueprint & Specification Release)
- **Design System (`Design.md`):** Token warna, blueprint navbar 2-tier, aturan slot iklan AdSense / Better Ads Standards, dan grid katalog ala Friv.
- **Konsep Game (`List-Game.md`):** Brainstorming 12 konsep game mini bertema wisata, kuliner, dan transportasi nusantara beserta use case dan spesifikasi teknis HTML5.
- **Product Requirements Document (`PRD.md`):** Dokumen spesifikasi kebutuhan produk, arsitektur sistem, dan roadmap peluncuran.

