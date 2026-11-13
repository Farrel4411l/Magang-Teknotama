# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Project: Platform Game Web TeknoGame (PLAY. EVOLVE. CONQUER.)

* **Versi Dokumen:** 2.1.0 (TeknoGame Rebranding, Cyber Blue Theme, & Zero-Database Architecture)
* **Status:** Final - Production Ready
* **Brand Name:** **TeknoGame** (`TEKNO GAME`)
* **Slogan:** *"PLAY. EVOLVE. CONQUER."*
* **Aset Logo Utama:** `TeknoGame_Logo.jpeg` (Shield GT, D-Pad, Lightning, Circuits)
* **Infrastruktur Hosting:** Hostdata.id (DirectAdmin + LiteSpeed + CloudLinux Node.js Selector / Standalone Mode - **100% Database-Free**)

---

## 1. Executive Summary & Visi Produk

**TeknoGame** adalah platform game web HTML5 instan terkemuka bergaya modern *Friv/Poki* yang mengusung tema **Cyberpunk / Esports Dark Mode**. Platform ini menghadirkan pengalaman bermain cepat, imersif, dan bebas hambatan langsung dari browser pengguna tanpa perlu instalasi aplikasi tambahan.

### 1.1 Tujuan Bisnis & Produk
1. **Platform Khusus Gaming Murni:** Menghadirkan portal game web independen dengan identitas visual *high-tech* yang memikat para gamer kasual maupun kompetitif.
2. **Kecepatan & Performa Tanpa Hambatan (Zero Latency):** Beroperasi dengan arsitektur bebas database (*Zero-Database Jamstack*), di mana katalog game dimuat langsung secara instan dan rekor skor pemain dikelola di sisi klien (*LocalStorage*).
3. **Monetisasi Iklan Terarah:** Menghasilkan pendapatan melalui unit iklan modern (Google AdSense / GAM) serta slot sponsor perlengkapan gaming (*Tekno Gear*) yang aman dari penalti viewability.
4. **Privasi Penuh untuk Pemain:** Tidak ada data pribadi atau rekaman nickname yang disimpan di server, menjamin keamanan privasi 100%.

---

## 2. Arsitektur Server Hostdata.id & Spesifikasi Sistem

```
+─────────────────────────────────────────────────────────────────────────────────────────────+
|  WEB SERVER HOSTDATA.ID (DirectAdmin Panel)                                                 |
|  ├─ Web Server Engine : LiteSpeed Web Server (LSCache, Brotli/Gzip)                         |
|  ├─ OS Layer          : CloudLinux with CageFS                                              |
|  ├─ Node.js Runtime   : CloudLinux Node.js Selector (v20.20.2 LTS - Standalone Server)      |
|  ├─ Database Layer    : NONE (100% Zero-Database / Static Catalog + Client LocalStorage)    |
|  ├─ User Base Path    : /home/immanuel/                                                     |
|  └─ App Root Directory: /home/immanuel/travelista-game                                      |
+─────────────────────────────────────────────────────────────────────────────────────────────+
```

### 2.1 Spesifikasi Lingkungan Server Hostdata.id
* **Control Panel:** DirectAdmin Web Control Panel.
* **Web Server:** LiteSpeed Web Server dengan kompresi otomatis Brotli/Gzip.
* **Node.js Selector:** Phusion Passenger / CloudLinux Node.js Selector versi **`v20.20.2` LTS**.
* **Database Server:** **Dieliminasi (Zero Database)**.
* **Akun User Server:** `immanuel` (`/home/immanuel/`).

---

## 3. Tech Stack & Arsitektur Aplikasi

* **Framework:** Next.js 16 (App Router) dengan output mode **`standalone`**.
* **Language:** TypeScript & React 19.
* **Styling & Design Tokens:** Tailwind CSS v4 berakar pada palet **Cyber Cyan (`#00F0FF`)**, **Electric Blue (`#2563EB`)**, dan **Void Dark Mode (`#070B14`)** mengacu pada [Design.md](Design.md) dan [newdesign.md](newdesign.md).
* **Database Driver:** **Dieliminasi (Zero Database / No MySQL)**.
* **Client-Side Storage:** Browser `LocalStorage` (riwayat bermain, bookmark favorit, dan rekor skor *Tekno Hall of Fame*).
* **Game Delivery System:** File statis HTML5 disimpan di direktori internal `/public/games/[slug]/` dan dimuat via iframe dengan atribut `sandbox`.
* **Ad Engine:** Google AdSense Script + Unit Sponsor Tekno Gear.

---

## 4. Struktur Folder & File Lengkap

```
travelista-game/
├── Design.md                     # Panduan desain TeknoGame (Cyber Blue)
├── newdesign.md                  # Dokumen perencanaan dan sistem warna TeknoGame
├── List-Game.md                  # Konsep awal game HTML5
├── list-game2.md                 # Spesifikasi 8 game zero-asset mandiri
├── PRD.md                        # Dokumen spesifikasi produk & arsitektur (v2.1)
├── UPDATE.md                     # Log rilis SemVer (MAJOR.MINOR.PATCH)
├── TeknoGame_Logo.jpeg           # Master file logo resmi TeknoGame
│
└── game/                         # Root direktori Next.js Application
    ├── .env.example              # Template variabel lingkungan
    ├── .env.local                # Konfigurasi lokal dev
    ├── next.config.ts            # Konfigurasi Next.js (output: 'standalone')
    ├── package.json              # Daftar dependency & script build
    ├── tsconfig.json             # Konfigurasi path alias TypeScript (@/*)
    ├── PRD.md                    # Salinan PRD aktif
    ├── UPDATE.md                 # Salinan changelog aktif
    ├── Design.md                 # Salinan panduan desain aktif
    ├── newdesign.md              # Salinan dokumen newdesign aktif
    │
    ├── public/                   # Aset Statis Publik
    │   ├── favicon.ico           # Multi-size brand favicon (Shield GT)
    │   ├── teknogame-icon.png    # High-res emblem perisai TeknoGame
    │   ├── teknogame-logo.png    # Full brand badge TeknoGame
    │   │
    │   └── games/                # DIRECT HOSTING: 11 Game HTML5 Mandiri
    │       ├── nusantara-runner/ # Game 1: Endless Runner Nusantara
    │       ├── kapal-feri/       # Game 2: Island Hopper
    │       ├── packing-master/   # Game 3: Koper Rapi
    │       ├── becak-drift/      # Game 4: Malioboro Drift
    │       ├── candi-stacker/    # Game 5: Balok Candi Borobudur
    │       ├── batik-flow/       # Game 6: Sambung Kain Batik
    │       ├── layangan-sanur/   # Game 7: Adu Layangan Pantai Sanur
    │       ├── kopi-klotok/      # Game 8: Seduh Kopi Klotok Jogja
    │       ├── lembah-bromo/     # Game 9: Paralayang Bromo
    │       ├── pasar-terapung/   # Game 10: Petik Buah Banjarmasin
    │       └── kamus-kelana/     # Game 11: TTS Wisata Nusantara
    │
    └── src/                      # Source Code Aplikasi
        │
        ├── app/                  # Next.js 16 App Router
        │   ├── globals.css       # Tailwind CSS v4 & custom keyframes
        │   ├── layout.tsx        # Root HTML Layout, Metadata "TeknoGame" & Icon
        │   ├── page.tsx          # Homepage: Hero + Category Chips + The Matrix Grid
        │   ├── icon.png          # App Router metadata icon
        │   ├── apple-icon.png    # App Router metadata apple icon
        │   │
        │   ├── play/             # Rute Halaman Bermain Game
        │   │   └── [slug]/
        │   │       └── page.tsx  # Cyber theater mode, dock kendali, & companion
        │   │
        │   └── category/         # Rute Halaman Kategori Spesifik
        │       └── [category]/
        │           └── page.tsx  # Grid khusus kategori terpilih
        │
        ├── components/           # Komponen UI Modular
        │   │
        │   ├── layout/           # Komponen Rangka Halaman
        │   │   ├── Navbar.tsx             # Main Cyber Nav (Logo GT, pills, search, hall of fame)
        │   │   ├── BreakingTicker.tsx     # Cyber Live Radar Bar (Statistik aktivitas gamer)
        │   │   ├── Footer.tsx             # Footer TeknoGame & slogan PLAY. EVOLVE. CONQUER.
        │   │   └── LayoutWrapper.tsx      # Penata gutter kiri & kanan untuk Skyscraper Ad
        │   │
        │   ├── ads/              # Komponen Unit Iklan & Sponsor Tekno Gear
        │   │   ├── AdSkyscraper.tsx       # Banner vertikal 160x600 (Desktop >= 1440px)
        │   │   ├── AdBottomAnchor.tsx     # Sticky bottom sponsor banner + tombol minimize
        │   │   ├── AdNativeTile.tsx       # Sponsor tile di dalam grid game
        │   │   └── AdCompanion.tsx        # Banner companion 300x250 di layar bermain
        │   │
        │   └── game/             # Komponen Terkait Game
        │       ├── GameCard.tsx           # Kartu ubin Friv (hover zoom, cyan glow, rating)
        │       ├── GameGrid.tsx           # Wadah CSS Grid responsif ratusan game
        │       ├── GameHero.tsx           # Cyber spotlight 3 game unggulan
        │       ├── CategoryChips.tsx      # Baris chip filter "JELAJAHI"
        │       ├── GameFrame.tsx          # Kontainer iframe game + instant score sync
        │       ├── LeaderboardModal.tsx   # Modal Tekno Hall of Fame (LocalStorage)
        │       └── SearchModal.tsx        # Dialog pencarian instan command-palette
        │
        ├── lib/                  # Library & Utility Functions
        │   ├── games-data.ts     # Master data statis katalog game (Single Source of Truth)
        │   ├── local-storage.ts  # Helper simpan favorit, riwayat bermain, rekor skor
        │   └── utils.ts          # Class helper (cn, format number, slugify)
        │
        └── types/                # Definisi TypeScript Interfaces
            ├── game.ts           # Tipe data Game, Category, Filter
            ├── leaderboard.ts    # Tipe data Skor Lokal
            └── ads.ts            # Tipe konfigurasi ukuran & status slot iklan
```

---

## 5. Spesifikasi Modul & Fitur (Requirements)

### 5.1 Modul Navigasi & Identitas TeknoGame
* **Navbar Tier-1 (Main Bar - Tinggi 68px):**
  * Logo resmi: Perisai `GT` emblem dengan efek border cyan menyala + teks `TEKNO GAME` dan slogan micro `PLAY. EVOLVE. CONQUER.`.
  * Menu navigasi kategori: *Semua Game, Arcade, Petualangan, Puzzle, Santai*.
  * Action Badges Gamer:
    * `[ ⚡ Main Acak ]` -> Memilih dan membuka game acak secara instan dengan aksen cyan glow.
    * `[ 🏆 Hall of Fame ]` -> Membuka modal rekor skor terbaik pribadi.
  * Search Bar dengan dialog modal instan berbasis judul dan kategori game.
* **Navbar Tier-2 (Live Radar Ticker - Tinggi 36px):**
  * Latar belakang kaca navy gelap `#0B1222` dengan border cyan halus.
  * Badge hijau neon berkedip `[ ⚡ LIVE RADAR ]`.
  * Ticker teks berjalan: Informasi gamers online, pemecahan rekor baru, dan tips gameplay.

### 5.2 Modul Katalog Game Ala Friv (Home Page)
* **Baris Filter Kategori ("JELAJAHI"):** Tombol pil filter instan tanpa reload halaman dengan aksen gradasi cyan-blue saat aktif.
* **Hero Spotlight Section (3 Game Unggulan):**
  * 1 Kartu Utama Besar (Game of the Week) dengan visual radial glow dan tombol CTA `"▶ Main Sekarang"`.
  * 2 Kartu Sedang Bertumpuk (Trending Arena #1 & #2).
* **The Tekno Matrix Responsive Game Grid:**
  * Grid ratusan kartu game berbentuk kotak (`aspect-square`) dengan sudut membulat `rounded-2xl`.
  * Interaksi hover: Terangkat halus (`scale-105`), border sirkuit menyala menjadi neon cyan terang (`border-[#00F0FF]`) dengan bayangan glow lembut.
  * Badge visual di kartu: `BARU`, `HOT`, rating bintang emas, dan emoji tematik unik.

### 5.3 Modul Layar Permainan (Cyber Theater Mode)
* **Frame Game HTML5:**
  * Iframe container responsif berbingkai neon cyan tipis dengan atribut `sandbox="allow-scripts allow-same-origin allow-pointer-lock"`.
  * Fitur kontrol toolbar: *Tombol Layar Penuh*, *Muat Ulang*, *Simpan ke Favorit*, dan *Bagikan Link*.
  * Sinkronisasi Skor Instan: Listener `postMessage` menangkap event `GAME_OVER` dan langsung memicu banner skor di layar serta menyimpannya ke `LocalStorage`.
* **Companion Sidebar:**
  * Slot sponsor perlengkapan gaming `300x250` (*Tekno Partner*).
  * Panduan tombol kendali (Keyboard WASD/Spasi & Sentuh).
  * Rekomendasi game serupa.

### 5.4 Modul Rekor Skor (Tekno Hall of Fame)
1. Game HTML5 mengirim skor saat game over melalui `postMessage`.
2. Portal mencatat skor lokal di `LocalStorage` browser secara instan.
3. Banner apresiasi skor langsung muncul merayakan rekor tanpa form input nickname yang membebani.
4. Modal *Tekno Hall of Fame* menyajikan ringkasan game yang ditaklukkan, skor tertinggi, medali juara, dan tombol reset skor mandiri.

### 5.5 Integrasi Promosi & Partner Resmi (teknotama.com)
1. **Target URL Promosi Tunggal:** Seluruh komponen promosi, slot iklan sponsor, dan backlink partner terintegrasi mengarah ke **`https://teknotama.com`** (**PT Teknotama Prakarsa Mulia**).
2. **Cakupan Penempatan Promosi:**
   * **AdSkyscraper (160x600 Desktop):** Solusi IT Infrastructure, jaringan, dan keamanan data enterprise.
   * **AdBottomAnchor (728x90 / 320x50):** Sticky banner sponsor Teknotama IT Solutions & Digital Services.
   * **AdCompanion (300x250) & Play Sidebar Card:** Highlight solusi transformasi digital saat user bermain.
   * **AdNativeTile (In-Grid Tile):** Kartu sponsor native di antara matriks game TeknoGame.
   * **Navbar & Live Radar Ticker:** Badge partner resmi dan marquis update solusi digital Teknotama.
   * **Footer & Homepage Banner:** Bagian khusus partner teknologi resmi dan backlink verifikasi legal.

---

## 6. Prosedur Build & Deployment di Hostdata.id

1. **Variabel Lingkungan (`.env.production`):**
   ```env
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_SITE_URL=https://game.travelista.id
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```
2. **Perintah Build:**
   ```bash
   npm run build
   ```
3. Restart aplikasi melalui tombol **Restart** di menu Web Applications Node.js DirectAdmin.
