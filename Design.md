# PANDUAN DESAIN & DOKUMEN SPESIFIKASI UI/UX
## Portal: TeknoGame (Dedicated Web Gaming Platform)

> **Catatan Dokumen:**  
> Dokumen ini adalah **panduan desain tunggal (Single Source of Truth / Design System)** untuk **TeknoGame** (`TEKNO GAME`). Seluruh implementasi kode mengacu pada spesifikasi token warna, komponen navigasi, aturan slot iklan, dan struktur grid cyber yang dirumuskan di sini.

---

## 1. Brand Identity & Design Tokens

Desain **TeknoGame** mengadopsi DNA visual *Cyberpunk / High-Tech Esports* dengan basis **Dark Mode** modern, memadukan energi tinggi dari **Neon Cyber Cyan** dan **Electric Blue** yang terinspirasi langsung dari logo resmi `TeknoGame_Logo.jpeg`.

* **Brand Name:** TeknoGame (`TEKNO GAME`)
* **Slogan:** *"PLAY. EVOLVE. CONQUER."*
* **Aset Logo:** Perisai Monogram `GT`, D-Pad Controller, Lightning Bolt, dan PCB Circuit Traces.

### 1.1 Palet Warna Resmi (Color Palette)

| Kategori Token | Nama Token | Nilai HEX | RGB / HSL | Implementasi & Karakteristik |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand (Neon)** | `tekno-cyan` | `#00F0FF` | `rgb(0, 240, 255)` | Warna aksen utama logo, tombol aksi primer (CTA), outline glow aktif, badge "HOT", kursor/hover highlight. |
| **Primary Soft** | `tekno-cyan-light` | `#38BDF8` | `rgb(56, 189, 248)` | State hover pada teks link, icon glow sekunder, dan gradient transit. |
| **Secondary Brand (Blue)**| `tekno-blue` | `#2563EB` | `rgb(37, 99, 235)` | Warna biru elektrik untuk badge kategori, border kontur perisai, tombol sekunder. |
| **Secondary Dark** | `tekno-blue-deep`| `#1D4ED8` | `rgb(29, 78, 216)` | Gradasi pembungkus kartu, header dropdown, dan border kartu game. |
| **Canvas Background** | `tekno-void` | `#070B14` | `rgb(7, 11, 20)` | Latar belakang dasar web (Deep Space Dark Mode) yang nyaman di mata gamer saat sesi bermain panjang. |
| **Surface Level 1** | `tekno-surface` | `#0B1222` | `rgb(11, 18, 34)` | Latar belakang Navbar, Footer, Ticker Bar, dan Sidebar Container. |
| **Surface Level 2 (Cards)**| `tekno-card` | `#0F172A` | `rgb(15, 23, 42)` | Latar kartu game Friv, modal pop-up, search bar container. |
| **Surface Elevated** | `tekno-card-hover`| `#162238`| `rgb(22, 34, 56)` | State kartu saat di-hover dengan kilau border cyan. |
| **Border Cyber** | `tekno-border` | `#1E293B` | `rgb(30, 41, 59)` | Garis pemisah netral antar modul. |
| **Border Active Glow** | `tekno-glow-border`| `#0284C7` | `rgb(2, 132, 199)` | Border kartu saat aktif/terfokus dengan bayangan glow cyan. |
| **Text Pure White** | `tekno-text-main` | `#F8FAFC` | `rgb(248, 250, 252)` | Judul game, heading h1/h2/h3, dan teks kontras tinggi. |
| **Text Muted Slate** | `tekno-text-muted`| `#94A3B8` | `rgb(148, 163, 184)`| Deskripsi game, metadata kategori, dan label informasi sekunder. |
| **Accent Rank / Trophy** | `tekno-amber` | `#FACC15` | `rgb(250, 204, 21)` | Bintang rating emas, ikon trofi rank #1, dan skor rekor. |
| **Accent Live Status** | `tekno-green` | `#10B981` | `rgb(16, 185, 129)` | Indikator live status "ONLINE", badge "BARU", dan konfirmasi sukses. |

---

### 1.2 Efek Visual Cyber Glow (Shadows & Gradients)

* **Glow Cyan Primer:** `box-shadow: 0 0 20px rgba(0, 240, 255, 0.45);`
* **Glow Blue Sekunder:** `box-shadow: 0 0 25px rgba(37, 99, 235, 0.35);`
* **Glow Trophy Emas:** `box-shadow: 0 0 18px rgba(250, 204, 21, 0.4);`
* **Gradient Hero:** `bg-gradient-to-r from-[#070B14] via-[#0B1222] to-[#1E3A8A]/50`
* **Gradient Button:** `bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600`
* **Card Border Effect:** `border border-slate-800 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]`

---

### 1.3 Sistem Tipografi (Typography)

* **Font Utama (Display & Body):** `Geist`, `Inter`, `system-ui`, `-apple-system`, `sans-serif`. Bersih, tajam, dan mudah dibaca pada thumbnail kartu game.
* **Font Aksen (Skor & Tabular):** Monospace modern (`tabular-nums`) untuk skor leaderboard dan angka ranking.

#### Skala Hirarki Tipografi:
* **H1 Hero / Brand Title:** 26px – 34px | Font-black 900 | Line-height 1.15
* **Game Card Title:** 13px – 14px | Font-bold 700 | Line-height 1.25 (truncate 1 baris)
* **Navbar Items:** 14px | Font-bold 700
* **Pill Badges:** 11px – 12px | Font-black 900 | Uppercase & tracking-wider
* **Meta & Description:** 12px – 13px | Font-medium 500 | Text slate-400

---

## 2. Blueprint & Spesifikasi Navbar

Navbar TeknoGame terdiri dari 2 tingkat: **Tier 1 (Main Cyber Nav)** dan **Tier 2 (Live Radar Ticker Bar)**.

```
+─────────────────────────────────────────────────────────────────────────────────────────────+
|  [EMBLEM] TEKNOGAME  |  🎮 Semua  🕹️ Arcade  🧭 Petualangan  🧩 Puzzle  ☕ Santai  |  ⚡ Acak  🏆 Hall of Fame  🔍  |
+─────────────────────────────────────────────────────────────────────────────────────────────+
|  [⚡ LIVE RADAR]  🔥 2.450 Gamers Sedang Online! • 🏆 Rekor Baru: 24.800 pts • 🎮 11 Game Siap Dimainkan!     |
+─────────────────────────────────────────────────────────────────────────────────────────────+
```

### 2.1 Tier 1: Main Cyber Nav (Tinggi: 68px)
1. **Logo & Identitas:**
   - Emblem perisai `GT` dari logo resmi dengan border cyan menyala (`/teknogame-icon.png`).
   - Teks `TEKNO` warna putih + `GAME` dengan gradasi cyan-blue.
   - Slogan micro: `PLAY. EVOLVE. CONQUER.`
2. **Kategori Navigasi:**
   - *Semua Game, Arcade, Petualangan, Puzzle, Santai*.
3. **Pill Aksi Cepat:**
   - `[ ⚡ Main Acak ]` dengan aksen cyan neon.
   - `[ 🏆 Hall of Fame ]` dengan trofi emas dan border cobalt blue.
   - Tombol pencarian instan (modal dialog).

### 2.2 Tier 2: Live Radar Ticker (Tinggi: 36px)
* Background: Glassmorphism `#0B1222` dengan border bawah `border-cyan-500/20`.
* Badge: `[ ⚡ LIVE RADAR ]` dengan indikator titik hijau neon berkedip (*pulsing green dot*).
* Marquis berjalan: Menampilkan aktivitas gamer, pemecahan rekor skor, dan rekomendasi game.

---

## 3. Komponen Layar Utama & Permainan

### 3.1 Hero Spotlight Section
* 1 Kartu Game Utama (Game of the Week) dengan latar radial cyber glow dan tombol CTA `"▶ Main Sekarang"`.
* 2 Kartu Game Trending bertumpuk di sisi kanan.

### 3.2 The Tekno Matrix Friv Grid
* Responsive CSS Grid: 3 kolom (mobile) hingga 8 kolom (layar lebar).
* Hover interaktif: Kartu terangkat (`scale-105`), border menyala menjadi neon cyan terang dengan bayangan glow lembut.
* Badge visual: `HOT` (cyan-blue), `BARU` (emerald), `POPULAR` (amber).

### 3.3 Layar Permainan (Cyber Theater Mode)
* Kontainer iframe berbingkai neon dengan atribut `sandbox="allow-scripts allow-same-origin allow-pointer-lock"`.
* Toolbar HUD: Fullscreen, Reload, Favorit, Share.
* Deteksi Game Over otomatis: Skor langsung dicatat ke `LocalStorage` tanpa form kirim server atau database.

### 3.4 Papan Rekor (Tekno Hall of Fame)
* Modal cyberpunk untuk meninjau rekor skor terbaik per game.
* Dilengkapi ringkasan game yang telah dimainkan, skor puncak, dan opsi reset mandiri.

---

## 4. Slot Iklan, Sponsor & Integrasi Promosi (Official Partner: teknotama.com)

Seluruh komponen promosi, slot iklan sponsor, dan backlink partner terintegrasi langsung ke website resmi partner teknologi: **`https://teknotama.com`** (**PT Teknotama Prakarsa Mulia**).

### 4.1 Unit Promosi & Tata Letak
1. **AdSkyscraper (Rails Kiri & Kanan - 160x600):**
   - Menampilkan promo solusi infrastruktur jaringan, cloud system, keamanan data, dan custom software development dari Teknotama.
   - Tombol CTA mengarah ke `https://teknotama.com` dengan target `_blank`.
2. **AdBottomAnchor (Sticky Bottom Banner - 728x90 / 320x50):**
   - Unit melayang di bawah layar dengan kontrol buka/tutup (*minimize/expand*), menampilkan highlight layanan IT Teknotama.
3. **AdCompanion (Sidebar 300x250) & Play Page Partner Card:**
   - Ditempatkan di sisi kanan layar bermain untuk memaksimalkan eksposur saat user sedang bermain game.
4. **AdNativeTile (In-Grid Sponsor Tile):**
   - Tile interaktif yang menyatu secara harmonis di antara kotak permainan Tekno Matrix.
5. **Navbar & Breaking Ticker Live Radar:**
   - Badge partner `[ 🌐 teknotama.com ]` di navbar desktop dan drawer navigasi mobile.
   - Live ticker marquis menampilkan update promo solusi digital Teknotama secara berkala.
6. **Footer Partner Directory:**
   - Kolom khusus informasi partner resmi PT Teknotama Prakarsa Mulia dan backlink legal copyright.

