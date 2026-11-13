# TEKNOGAME - BLUEPRINT DESAIN & PERENCANAAN REBRANDING
## Dokumen Perencanaan UI/UX, Sistem Token Warna, & Arsitektur Portal Khusus Game
**Dokumen:** `newdesign.md`  
**Status:** Planning & Concept Phase (Belum masuk tahap coding)  
**Brand Name:** **TeknoGame** (`TEKNO GAME`)  
**Slogan:** *"PLAY. EVOLVE. CONQUER."*  
**Palet Utama:** **Electric Blue & Cyber Cyan (Gamer / Futuristic Dark Mode)**  
**Aset Logo Resmi:** `TeknoGame_Logo.jpeg`

---

## 1. Executive Summary & Visi Rebranding

### 1.1 Transformasi Konsep Produk
Proyek ini bertransformasi dari portal game bertema pariwisata (*Travelista Games*) menjadi **platform portal game web murni dan independen** bernama **TeknoGame**.

* **Konsep Baru:** Website khusus game modern bergaya *cyber-esports* dan *tech-arcade*, terinspirasi dari portal game global terkemuka (seperti Poki, CrazyGames, Miniclip, dan Steam UI) dengan nuansa futuristik, cepat, dan berenergi tinggi.
* **Target Pengguna:** Gamers kasual maupun kompetitif dari segala usia yang mencari pengalaman bermain game HTML5 instan tanpa download, cepat, bebas lag, dan berpenampilan modern.
* **Tone of Voice:** Enerjik, modern, kompetitif, berorientasi teknologi (*high-tech*), dan bersih (*sleek*).

---

## 2. Bedah Anatomi Logo (`TeknoGame_Logo.jpeg`)

Berdasarkan analisis visual mendalam pada file logo `TeknoGame_Logo.jpeg`:

```
                    ┌─────────────────────────┐
                    │       [ G ] Crown       │
                    │   ┌─────────────────┐   │
   D-Pad Controller │ + │    [ T ] Core   │ ⚡│ Lightning Bolt
                    │ ╘═│═════════════════│══╛│
      Circuit Traces│ ──┴── PCB Lines ────┴── │ Circuit Traces
                    │   \                 /   │
                    │    \  CYBER SHIELD /    │
                    │     \             /     │
                    │      ▼───────────▼      │
                    └─────────────────────────┘
                       T E K N O   G A M E
                     PLAY. EVOLVE. CONQUER.
```

### 2.1 Makna Elemen Visual Logo:
1. **Perisai Cyber (Crest / Shield):** Melambangkan ketangguhan, pertahanan, dan arena kompetisi game esports.
2. **Monogram 'GT' / 'TG' (Top Crown G + Central Pillar T):** Menggabungkan identitas *Game* dan *Tekno* menjadi satu kesatuan emblem yang kokoh.
3. **D-Pad Controller (+):** Simbol universal konsol dan kontrol gaming presisi.
4. **Kilat / Petir (Lightning Bolt):** Melambangkan kecepatan reaksi instan, daya ledak, dan keseruan bermain.
5. **Jalur Sirkuit PCB (Circuit Traces & Hex Nodes):** Aksen teknologi komputasi masa depan (*cybernetics*).
6. **Tipografi 'TEKNO GAME':** Font display futuristik bergaris tegas (*bold geometric sci-fi*) dengan gradasi cyan neon menyala dan outline navy tua.
7. **Slogan 'PLAY. EVOLVE. CONQUER.':** Tiga pilar perjalanan gamer: Bermain (Play), Mengasah keahlian (Evolve), dan Menjadi juara (Conquer).

---

## 3. Sistem Palet Warna (Color Palette & Design Tokens)

Menggantikan warna merah pariwisata sebelumnya, **TeknoGame berakar pada spektrum Biru & Cyan Neon dengan basis Dark Mode Cyberpunk**:

```
+─────────────────────────────────────────────────────────────────────────────────────────────+
|                                    TEKNOGAME COLOR MATRIX                                   |
+─────────────────────────────────────────────────────────────────────────────────────────────+
|  NEON CYAN        ELECTRIC BLUE     DEEP NAVY         VOID BLACK        LASER AMBER         |
|  #00F0FF          #2563EB           #0B1222           #070B14           #FACC15             |
|  [CTA / Glow]     [Brand Core]      [Surface / Cards] [Canvas Main]     [XP / Top Rank]     |
+─────────────────────────────────────────────────────────────────────────────────────────────+
```

### 3.1 Spesifikasi Token Warna Resmi

| Kategori Token | Nama Token | Nilai HEX | Nilai RGB / HSL | Peran & Implementasi UI |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand (Neon)** | `tekno-cyan` | `#00F0FF` | `rgb(0, 240, 255)` | Warna aksen utama logo, tombol aksi primer (CTA), outline glow aktif, badge "HOT", kursor/hover highlight. |
| **Primary Hover / Soft** | `tekno-cyan-light` | `#38BDF8` | `rgb(56, 189, 248)` | State hover pada teks link, icon glow sekunder, dan gradient transit. |
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

### 3.2 Efek Visual Cyber Glow (Shadows & Gradients)

* **Glow Cyan Primer:** `box-shadow: 0 0 20px rgba(0, 240, 255, 0.45);`
* **Glow Blue Sekunder:** `box-shadow: 0 0 25px rgba(37, 99, 235, 0.35);`
* **Glow Trophy Emas:** `box-shadow: 0 0 18px rgba(250, 204, 21, 0.4);`
* **Gradient Hero:** `bg-gradient-to-r from-[#070B14] via-[#0B1222] to-[#1E293B]`
* **Gradient Button:** `bg-gradient-to-r from-[#00F0FF] via-[#0284C7] to-[#2563EB]`
* **Card Border Effect:** Garis tipis 1px border dengan sentuhan gradient `border-cyan-500/30 hover:border-cyan-400`.

---

## 4. Tipografi & Gaya Bahasa

* **Font Utama (Display & Heading):** `system-ui`, `-apple-system`, `Inter`, `sans-serif` dengan bobot `font-black (900)` dan `font-bold (700)` untuk memberikan kesan kokoh ala game AAA.
* **Font Aksen (Angka & Skor):** Monospace modern / Tabular numerals (`font-mono` atau `tabular-nums`) agar angka skor pada leaderboard dan timer tampil presisi tanpa pergeseran lebar.
* **Hirarki Tipografi:**
  * **H1 Hero / Brand Title:** 26px - 32px | Extra Bold 800-900 | Tracking tight
  * **Section Title:** 18px - 22px | Bold 700 | Tracking wide dengan ikon neon
  * **Game Card Title:** 13px - 14px | Bold 700 | Truncate 1 baris
  * **Badge & Chips:** 11px - 12px | Semi-bold 600 | Uppercase
  * **Body / Meta:** 12px - 14px | Regular 400 & Medium 500

---

## 5. Blueprint Arsitektur UI/UX Komponen

```
+─────────────────────────────────────────────────────────────────────────────────────────────+
|  [EMBLEM] TEKNOGAME  |  🎮 Semua  ⚡ Aksi  🕹️ Arcade  🧩 Puzzle  🏎️ Balap  |  ⚡ Acak  🏆 Rekor  🔍  |  (Navbar Tier 1)
+─────────────────────────────────────────────────────────────────────────────────────────────+
|  [⚡ LIVE RADAR]  🔥 2.450 Gamers Sedang Online! • 🏆 Rekor Baru: 28.500 pts • 🚀 11 Game Siap Dimainkan!    |  (Ticker Tier 2)
+─────────────────────────────────────────────────────────────────────────────────────────────+
|                                                                                             |
|   ┌───────────────────────────────────────────────┐  ┌────────────────────────────────────┐ |
|   │               GAME OF THE WEEK                │  │         TRENDING ARENA #1          │ |
|   │        [ Nusantara Runner: Cyber Rush ]       │  ├────────────────────────────────────┤ |
|   │         Tombol [ ▶ MAIN SEKARANG ]            │  │         TRENDING ARENA #2          │ |
|   └───────────────────────────────────────────────┘  └────────────────────────────────────┘ |
|                                                                                             |
|   [ JELAJAHI ARENA:  🔘 SEMUA  ⚡ AKSI  🕹️ ARCADE  🧩 PUZZLE  🏎️ BALAP  🎯 RETRO  ☕ SANTAI ] |
|                                                                                             |
|   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   |
|   │ CARD 1 │ │ CARD 2 │ │ CARD 3 │ │ CARD 4 │ │ CARD 5 │ │ CARD 6 │ │ CARD 7 │ │ CARD 8 │   |
|   │ [CYAN] │ │ [NEON] │ │ [GLOW] │ │ [BLUE] │ │ [CYAN] │ │ [NEON] │ │ [GLOW] │ │ [BLUE] │   |
|   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   |
|                                                                                             |
+─────────────────────────────────────────────────────────────────────────────────────────────+
|  FOOTER: TEKNOGAME • PLAY. EVOLVE. CONQUER. • 100% Free HTML5 Web Games • No Install Needed |
+─────────────────────────────────────────────────────────────────────────────────────────────+
```

### 5.1 Perombakan Spesifik Tiap Komponen:

#### A. Navbar & Header (Tier 1 & Tier 2)
1. **Logo Baru:**
   - Menampilkan emblem perisai `GT` dari `TeknoGame_Logo.jpeg` yang dipadukan dengan teks tebal `TEKNO GAME`.
   - Menggantikan logo Travelista merah lama.
2. **Kategori Game Baru (Gamer-Centric):**
   - Dari: *Semua, Arcade, Petualangan, Puzzle, Aksi, Olahraga, Santai*
   - Menjadi: *Semua, Aksi (Action), Balap (Racing), Arcade, Puzzle, Strategi, Santai (Casual), Retro*.
3. **Action Badges:**
   - `[ ⚡ Main Acak ]` dengan aksen cyan glow neon.
   - `[ 🏆 Tekno Hall of Fame ]` dengan aksen cobalt blue & trofi emas.
   - `[ 🔍 Cari Game ]` dialog instan bergaya modal command-palette (`Ctrl+K`).
4. **Ticker Bar Tier 2:**
   - Diubah dari warna merah Travelista (`#E53935`) menjadi Dark Blue Glassmorphism (`bg-[#0B1222]/90 border-b border-cyan-500/20`).
   - Badge: `[ ⚡ LIVE RADAR ]` dengan indikator titik hijau neon berkedip (*pulsing green dot*).
   - Teks marquis: Berisi statistik aktivitas game online, rekor terbaru gamer, tips gameplay, dan rilis game baru.

#### B. Hero Section (Cyber Spotlight)
- Menampilkan 1 Game Utama berukuran besar dengan latar belakang efek grid sirkuit gelap dan tombol CTA menyala `"▶ MAIN SEKARANG"` bergradasi cyan-biru.
- 2 Kartu Game Trending di sisi kanan dengan badge rank `#1 TRENDING` dan `#2 POPULAR`.

#### C. Grid Game Friv (The Tekno Matrix Grid)
- Background halaman gelap pekat (`#070B14`) dengan aksen grid futuristik tipis.
- Kartu game memiliki sudut membulat elegan (`rounded-2xl`) dengan border sirkuit gelap (`border-slate-800`).
- **Efek Hover Kartu:**
  - Kartu terangkat lembut (`transform: translateY(-4px) scale(1.03)`).
  - Border menyala menjadi neon cyan terang (`border-[#00F0FF]`).
  - Efek bayangan glow lembut mengelilingi kartu.
  - Overlay gradient instan menampilkan tombol `"MAIN"`.

#### D. Layar Permainan (`/play/[slug]`)
- **Mode Bioskop Gelap (Cyber Theater Mode):** Bingkai iframe dikelilingi border neon tipis yang fokus pada permainan.
- **Dock Kontrol Game:**
  - Tombol Fullscreen, Reload, Simpan Favorit, dan Share dengan gaya HUD kontroler.
- **Sidebar Companion:**
  - Panduan tombol kontrol (Keyboard WASD/Spasi/Panah + Sentuh).
  - Fitur "Tantang Rekormu" (skor tertinggi personal tersimpan).
  - Rekomendasi 4 game serupa.

#### E. Modal Rekor (Tekno Hall of Fame)
- Diperbarui menjadi ruang piala cyberpunk:
  - Header berhiaskan neon badge perisai dan trofi emas.
  - Daftar skor tertinggi pemain per game tersimpan di `LocalStorage` secara instan.
  - Metrik statistik: *Total Game Ditaklukkan*, *Poin Terbesar*, dan *Status Pencapaian*.

---

## 6. Tabel Komparasi: Travelista Games vs. TeknoGame

| Aspek | Travelista Games (Lama) | TeknoGame (Baru) |
| :--- | :--- | :--- |
| **Identitas Brand** | Subdomain pariwisata `game.travelista.id` | Portal khusus gaming independen `TeknoGame` |
| **Slogan Brand** | "Portal Wisata & Game Santai" | *"PLAY. EVOLVE. CONQUER."* |
| **Warna Primer** | Merah Cabai (`#E53935`) & Hijau Turis | Electric Blue (`#2563EB`) & Cyber Cyan (`#00F0FF`) |
| **Latar Belakang** | Terang / Putih keabu-abuan (`#F8FAFC`) | Dark Mode Gamer / Cyber Space (`#070B14` & `#0B1222`) |
| **Aset Logo** | `travelista-logo-light.png` (Teks oranye/ungu) | `TeknoGame_Logo.jpeg` (Shield GT, D-Pad, Lightning) |
| **Vibe Desain** | Casual, ramah keluarga, bertema jalan-jalan | High-tech, Cyberpunk, Esports, Imersif, Berenergi tinggi |
| **Ticker Bar** | Merah solid promo tiket kapal & wisata | Navy glassmorphism cyber radar & rekor game |
| **Efek Kartu Grid** | Bayangan standar abu-abu | Border neon glow cyan interaktif saat di-hover |
| **Koleksi Game** | Menonjolkan tema lokal pariwisata | Game seru universal (Aksi, Balap, Puzzle, Arcade, dll) |
| **Arsitektur Data**| Zero-Database (LocalStorage) | Zero-Database (LocalStorage & Static Catalog) |

---

## 7. Rencana Tahapan Eksekusi (Implementation Roadmap)

Rencana kerja sistematis saat implementasi coding disetujui:

```
[TAHAP 1] Perencanaan & Sistem Warna (newdesign.md) ──► SELESAI
    │
[TAHAP 2] Pemrosesan Aset Logo TeknoGame
    ├─ Ekstraksi Emblem Icon / Favicon (Shield GT)
    └─ Ekstraksi Wordmark Header (TeknoGame Transparent PNG)
    │
[TAHAP 3] Re-Theming Tailwind CSS & Token Warna Baru
    ├─ Konfigurasi variabel tema Tailwind di globals.css
    └─ Pengaturan palet cyan, electric blue, dan cyber dark void
    │
[TAHAP 4] Rebranding Komponen Tampilan (UI Overhaul)
    ├─ Navbar: Logo baru, tombol aksen cyan, kategori game
    ├─ BreakingTicker: Radar pulsa & live feed cyber
    ├─ GameHero: Spotlight banner cyberpunk
    ├─ GameCard & GameGrid: Efek hover neon cyan glow
    ├─ GameFrame: Cyber theater mode play screen
    ├─ LeaderboardModal: Tekno Hall of Fame
    └─ Footer: Branding TeknoGame & slogan PLAY. EVOLVE. CONQUER.
    │
[TAHAP 5] Pembaruan Metadata & SEO
    ├─ Title: "TeknoGame - Play. Evolve. Conquer."
    └─ Favicon baru & OpenGraph banner
    │
[TAHAP 6] Pengujian Responsif & Verifikasi Build Bersih
```

---

> [!IMPORTANT]
> **Status:** Dokumen ini siap untuk ditinjau. Tahap penulisan kode (*coding*) akan dimulai setelah perencanaan dan palet warna ini disetujui oleh pengguna.

