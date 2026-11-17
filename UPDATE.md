
# CHANGELOG & UPDATE LOG (teknotama.com/games)

Dokumen ini mencatat seluruh riwayat pembaruan, perbaikan bug, penambahan fitur, dan audit pembersihan visual pada project **Tekno Game** (`https://teknotama.com/games/`) dengan format standar **Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`)**:

- **MAJOR (`X.0.0`):** Perubahan besar pada arsitektur sistem, desain/redesign total, struktur URL/SEO, atau breaking changes.
- **MINOR (`0.X.0`):** Penambahan fitur baru, halaman baru, atau pembaruan fungsionalitas yang backward-compatible.
- **PATCH (`0.0.X`):** Perbaikan bug, hotfix styling, optimasi performa, atau perbaikan minor.

---

## [3.1.0] - 2026-11-17
### Changed & Refined (Natural Gradient, Clean UI/UX, Zero AI Slop & Layout Collision Fix)
- **Implementasi Gradient Halus Sesuai Referensi Pengguna ([globals.css](src/app/globals.css)):**
  - Mengganti latar belakang dengan gradasi diagonal halus dari Navy/Indigo (`#18225e` - `#242e75`) melewati Purple/Violet (`#4c1b54`) menuju Burgundy/Magenta (`#7a1240` - `#961250`).
- **Eliminasi Total AI Slop & Elemen Buatan:**
  - Menghapus seluruh badge buatan: "HOT", "BARU", "POPULER", "TRENDING", "GAME UTAMA PEKAN INI", "ARENA PILIHAN".
  - Menghapus rating bintang ("4.9/5.0") pada seluruh kartu game, hero, dan modal pencarian.
  - Menghapus ornamen sirkuit garis/lingkaran SVG dan pola cyber grid yang membuat UI terasa tidak alami.
  - Kartu game ([GameCard.tsx](src/components/game/GameCard.tsx)) dibuat senatural mungkin: hanya menampilkan thumbnail/ikon, kategori, dan judul game dengan tombol play yang bersih.
- **Penghapusan Marquee / Ticker Bergeser di Bawah Navbar ([ClientLayout.tsx](src/components/layout/ClientLayout.tsx)):**
  - Menghapus komponen `BreakingTicker` ("RADAR TEKNO") sehingga area di bawah navbar bersih, tenang, dan langsung mengalir ke konten utama.
- **Perbaikan Bentrokan Tata Letak (Layout Collision Fix) ([LayoutWrapper.tsx](src/components/layout/LayoutWrapper.tsx) & [AdSkyscraper.tsx](src/components/ads/AdSkyscraper.tsx)):**
  - Memperbaiki posisi iklan samping yang sebelumnya menabrak dan menutupi kontainer konten pada layar laptop/desktop 1366px - 1536px. Iklan skyscraper kini hanya aktif di margin luar layar ultra-lebar (`>= 1680px`), menjamin nol tumpang tindih (*zero overlap*) pada seluruh perangkat kerja.

---


## [3.0.0] - 2026-11-17

### Major Redesign Total Frontend (UI/UX) & Technical SEO Sub-Direktori (`teknotama.com/games/`)


#### 1. Audit & Pembersihan Visual Usang (Visual Cleanup)

Daftar lengkap elemen visual lama yang dihapus dari antarmuka:

| No | Elemen Visual / Teks yang Dihapus | Lokasi File Asal | Alasan Penghapusan | Solusi & Elemen Pengganti Baru |
|---|---|---|---|---|
| 1 | **Slogan / Motto Lama:** `"PLAY. EVOLVE. CONQUER."` | `src/app/layout.tsx`<br>`src/app/page.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx` | Dihapus total sesuai panduan resmi identitas baru brand Tekno Game. | Dihapus 100% dari UI, teks, komentar, dan metadata `<head>`. Fokus pada identitas resmi sub-portal PT Teknotama Prakarsa Mulia. |
| 2 | **Logo Lama & Ikon Usang:** `teknogame-icon.png`, `teknogame-banner.png`, `teknogame-logo.png` | `src/app/layout.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx`<br>`src/app/icon.png`<br>`src/app/apple-icon.png` | Logo lama tidak menggunakan perisai monogram GT modern. | Diganti dengan ikon perisai monogram GT baru `/Teknogame_logo_only.png` berdampingan horizontal dengan teks modern "Tekno Game". |
| 3 | **Penulisan Nama Brand Tanpa Spasi:** `"TeknoGame"` | Seluruh file di `src/app/` dan `src/components/` | Menyeragamkan identitas resmi menjadi **"Tekno Game"** (dengan spasi). | Diubah 100% konsisten menjadi **"Tekno Game"** di Navbar, Footer, Hero, Title Tag, Metadata, dan Schema JSON-LD. |
| 4 | **Karakter Emoji Unicode (Strict No-Emoji Policy):** `🎮`, `🕹️`, `🧭`, `🧩`, `⚡`, `☕`, `⚽`, `🏃‍♂️`, `🚢`, `🧳`, `🛺`, `🛕`, `🎨`, `🪁`, `🪂`, `🛶`, `🗺️`, `🐺`, `🐦`, `🧠`, `🌐`, `🏆`, `🏎️`, `🚀`, `💻`, `⭐` | `src/lib/games-data.ts`<br>`src/components/game/`<br>`src/components/layout/`<br>`src/components/ads/`<br>`src/app/` | Kebijakan ketat bebas emoji untuk estetika modern, profesional, dan konsisten di seluruh browser/OS. | 0 emoji di seluruh kode. Digantikan sepenuhnya dengan ikon vektor presisi dari **Lucide React** (`Gamepad2`, `Compass`, `Puzzle`, `Zap`, `Coffee`, `Trophy`, `Star`, `ShieldCheck`, `Network`, `Cpu`, dll.) dan ornamen SVG murni. |
| 5 | **Palet Warna Neon Cyan Lama:** (`#00F0FF`, `#070B14`, `#0B1222`) | `src/app/globals.css`<br>Seluruh komponen UI | Desain warna lama digantikan sistem warna proporsional dinamis 60-30-10. | Diperbarui menjadi palet Midnight Navy (`#18225e`), Cobalt/Indigo (`#242e75`), Purple (`#4c1b54`), dan Burgundy/Magenta (`#7a1240` - `#961250`). |
| 6 | **Tipografi Lama (Geist / Geist Mono):** | `src/app/layout.tsx`<br>`src/app/globals.css` | Mengoptimalkan keterbacaan (*legibility*) dan identitas modern futuristik. | Menggunakan self-hosted Google Fonts (`next/font/google`) dengan `display: 'swap'`:<br>- Heading: **`Space Grotesk`** (600, 700)<br>- Body/UI: **`Plus Jakarta Sans`** (400, 500, 600, 700). |
| 7 | **Pengalih Bahasa (`ID/EN`):** | `src/components/layout/Navbar.tsx` | Seluruh antarmuka diarahkan 100% Bahasa Indonesia baku. | Dihapus agar Navbar tepat memuat 8 elemen wajib. |
| 8 | **Grid Kolom Lama (6-8 Kolom Rapat di Desktop & 3 Kolom di HP):** | `src/components/game/GameGrid.tsx`<br>`src/app/play/[slug]/page.tsx` | Mencegah salah klik (*accidental click*) pada Google Ads di layar HP dan menjaga proporsi kartu. | Menerapkan layout responsif 3 ukuran layar:<br>- Mobile (`< 768px`): 2 kolom proporsional (touch target > 44px)<br>- Tablet (`768px - 1023px`): 3 kolom proporsional<br>- Desktop (`>= 1024px`): 4 kolom proporsional dengan zona aman Floating Side Ads. |
| 9 | **Iklan Samping & Bawah Tanpa Kunci Wadah Anti-CLS:** | `src/components/ads/AdSkyscraper.tsx`<br>`src/components/ads/AdBottomAnchor.tsx` | Menghilangkan risiko pergeseran tata letak (CLS > 0). | Mengunci dimensi wadah iklan via komponen baru `<GoogleAdSlot />`, membuat floating side ads aman di desktop, dan menambahkan tombol "Sembunyikan Iklan" di mobile. |

---


## [2.6.3] - 2026-11-17

### Changed & Deployed (Include `out/` Build Folder in Git Tracking)

- **Mengaktifkan Git Tracking untuk Folder `out/` ([.gitignore](.gitignore)):**
  - Menghapus `/out/` dari `.gitignore` agar artefak hasil build produksi Next.js tersimpan langsung di branch GitHub `games`.
