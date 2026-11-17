# Tekno Game

Portal permainan web HTML5 PT Teknotama Prakarsa Mulia. Aplikasi menggunakan Next.js App Router, mendukung jalur `/games`, dan mempertahankan skor serta favorit secara lokal di peramban.

## Fitur

- Katalog permainan dengan kategori, pencarian, dan permainan acak.
- Halaman permainan dengan kendali layar penuh, muat ulang, bagikan, dan favorit.
- Papan skor dan favorit yang disimpan secara lokal.
- Slot iklan yang sudah ada, informasi layanan mitra, dan tata letak responsif.
- Logo statis pada hero tanpa animasi 3D atau efek kursor berat.

## Menjalankan proyek

Pasang dependensi, lalu jalankan:

```bash
npm run dev
```

Server pengembangan tersedia di `http://localhost:3000/games`.

## Pemeriksaan

```bash
npm run lint
npm run build
```

Build memakai ekspor statis dan `basePath` bawaan `/games`. Nilainya dapat diubah melalui `NEXT_PUBLIC_BASE_PATH`.

## Batas aset permainan

Berkas inti permainan berada di `public/games/`. Jangan mengubah direktori tersebut ketika mengerjakan desain antarmuka.
