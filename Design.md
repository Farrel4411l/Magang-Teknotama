# Panduan Desain Tekno Game

Dokumen ini mencatat sistem visual portal Tekno Game pada `teknotama.com/games`. Hierarki halaman mengikuti referensi: hero editorial, permainan sorotan, katalog, ringkasan skor, informasi portal, layanan mitra, lalu ajakan kemitraan. Nama, isi, dan fitur permainan tetap milik Tekno Game.

## Identitas visual

- Latar utama: Obsidian `#0B0E17`.
- Kedalaman dan bayangan: Midnight Navy `#021861`.
- Aksen interaksi: Cobalt Blue `#255dce`.
- Energi hangat dan CTA: Burgundy `#660033` dan `#8A0045`.
- Teks: Off-white `#F1F5F9`, sekunder `#94A3B8`.
- Judul: Space Grotesk; teks antarmuka: Plus Jakarta Sans.
- Logo: `public/Teknogame_logo_only.png`, berdampingan dengan nama Tekno Game.

Gunakan cahaya sebagai penekanan, bukan ornamen berulang. Hindari motto, ticker, angka aktivitas langsung yang tidak bersumber, peringkat hiasan, dan lencana promosi buatan.

## Susunan halaman

1. Navigasi tetap dengan beranda, kategori, acak, papan skor, favorit, pencarian, dan tautan mitra.
2. Hero dengan permainan pilihan, ajakan bermain, serta logo statis.
3. Ringkasan jumlah permainan, total permainan, akses gratis, dan penyimpanan skor.
4. Filter kategori dan katalog responsif.
5. Rekor skor lokal.
6. Informasi portal, empat layanan Teknotama, dan ajakan kemitraan.
7. Footer berisi identitas, navigasi, dan informasi mitra.

Kartu katalog menampilkan ilustrasi vektor, kategori, judul, deskripsi, jumlah permainan, dan tautan. Papan skor dan favorit tetap tersimpan lokal di peramban. Iklan mempertahankan slot serta kontrol yang telah tersedia.

## Gerak dan aksesibilitas

- Hero menggunakan logo statis tanpa canvas 3D, loop render, aura kursor, kemiringan kartu, atau tarikan tombol.
- Hindari animasi dekoratif berulang; interaksi inti tetap jelas tanpa efek gerak.
- Tombol penting memakai sasaran sentuh sedikitnya 44 piksel. Fokus papan ketik tetap terlihat.
- Gerak dan cahaya tidak boleh menghalangi interaksi, navigasi, atau isi permainan.

## SEO dan rute

- Bahasa dokumen dan metadata: Indonesia.
- Jalur publik memakai `NEXT_PUBLIC_BASE_PATH`, dengan nilai bawaan `/games`.
- Metadata kanonis, ikon, Open Graph, WebSite, VideoGame, dan BreadcrumbList mengarah ke jalur portal yang sama.
- Rute kategori dan permainan dibuat statis; konten utamanya tersedia dalam HTML hasil render server.

## Batas perubahan

Perubahan visual tidak mengubah struktur data inti, API, penyimpanan skor/favorit, atau mesin permainan. Isi di `public/games/` tidak boleh diubah sebagai bagian dari pembaruan desain.
