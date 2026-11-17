# 🎮 Game Idea (Ponytail Minimalist Edition)

> **Filosofi Ponytail:** 1 file `index.html` per game, 0 library eksternal, 0 aset file (gambar/audio), gunakan kapabilitas native browser (Canvas 2D / CSS Grid / Web Audio Synth), dan kirim `postMessage({ type: "GAME_OVER", score })`.

---

## 1. Flappy Bird (Progressive Speed)
* **Konsep:** Endless 1-tap flyer. Skor bertambah saat lolos pipa. Kecepatan horizontal bertambah setiap kelipatan poin tertentu.
* **Core Logic (The Minimum):**
  * **Input:** Space / Tap layar -> `velocity = -jumpForce`.
  * **Update:** `velocity += gravity`; `player.y += velocity`.
  * **Progressive Speed:** `speed = baseSpeed + Math.floor(score / 5) * 0.4`.
  * **Pipa:** Array objek `{ x, topHeight, gap }` bergerak ke kiri dengan `speed`.
  * **Collision:** AABB sederhana (lingkaran/kotak vs pipa atas & pipa bawah) atau jatuh ke tanah -> Game Over.
* **Visual & Audio (Native):**
  * Burung = lingkaran kuning / emoji `🐦`.
  * Pipa = `fillRect` hijau.
  * SFX = Web Audio API sine wave (lompat: beep 150->400Hz, game over: noise burst 0.2s).
* **Yang Dibuang (YAGNI):** Skin kustom, sistem koin shop, animasi sayap sprite sheet, multi-background rumit.

---

## 2. Memory (Pou-Style Level Scaling & Timer)
* **Konsep:** Cocokkan pasangan kartu tertutup di dalam grid. Setiap level, jumlah kartu bertambah dan waktu hitung mundur berjalan.
* **Core Logic (The Minimum):**
  * **Level Scaling:**
    * Level 1: Grid 2x2 (4 kartu, 2 pasang) — Waktu 15s.
    * Level 2: Grid 2x3 (6 kartu, 3 pasang) — Waktu 20s.
    * Level 3: Grid 2x4 (8 kartu, 4 pasang) — Waktu 25s.
    * Level 4: Grid 3x4 (12 kartu, 6 pasang) — Waktu 30s.
    * Level 5+: Grid 4x4 (16 kartu, 8 pasang) — Waktu 35s.
  * **Mekanik:**
    1. Klik kartu 1, lalu klik kartu 2.
    2. Jika cocok: beri tanda `matched = true`, score `+10`.
    3. Jika beda: balik lagi setelah jeda 400ms.
    4. Jika semua matched sebelum timer habis: naik ke level berikutnya (sisa timer di-reset + bonus score).
    5. Jika timer `00:00`: Game Over.
* **Visual & Audio (Native):**
  * Render: CSS Grid HTML murni (`display: grid; grid-template-columns: repeat(...)`).
  * Simbol kartu: Emoji bawaan OS (`⚡`, `🎮`, `💎`, `🚀`, `🤖`, `🔥`, `⭐`, `🍎`).
  * SFX: Audio synth 2 nada saat kartu dibuka dan saat match sukses.
* **Yang Dibuang (YAGNI):** Animasi flip 3D CSS berat, efek partikel konfeti berlebih, kartu item bantuan (hint/shuffle).

---

## 3. Connect Line (Color Flow - 3 Level Scale)
* **Konsep:** Hubungkan sepasang titik warna yang sama dengan garis tanpa menyilang garis warna lain.
* **Core Logic (The Minimum):**
  * **Grid Matrix:** Array 2D (misal `grid[y][x] = colorId`).
  * **Level Scaling (Per 3 Level):**
    * Level 1–3: Grid 4x4 (3 pasang titik warna).
    * Level 4–6: Grid 5x5 (4 pasang titik warna).
    * Level 7–9: Grid 6x6 (5 pasang titik warna).
  * **Input:** Drag / Touch move antar petak tetangga (atas, bawah, kiri, kanan) yang belum terisi.
  * **Win Condition:** Semua titik berpasangan terhubung & petak kosong terisi -> Naik Level.
* **Visual & Audio (Native):**
  * Render: Canvas 2D menggambar lingkaran titik terminal dan `lineTo` untuk jalur warna (`#ef4444`, `#3b82f6`, `#10b981`, `#f59e0b`, `#8b5cf6`).
  * SFX: Sine wave klik nada naik setiap kotak yang dilewati garis.
* **Yang Dibuang (YAGNI):** Generator level prosedural dinamis yang rumit (cukup hardcode array pola level 1–9 langsung di file), sistem hint berbayar, time attack mode.

---

## 4. Standar Eksekusi (TeknoGame Compliance)
1. **Lokasi File:**
   * `/public/games/cyber-bird/index.html`
   * `/public/games/tekno-memory/index.html`
   * `/public/games/circuit-flow/index.html`
2. **Kirim Skor:**
   ```javascript
   window.parent.postMessage({ type: "GAME_OVER", score: Math.floor(finalScore) }, "*");
   ```
3. **Ukuran File:** Masing-masing file ditargetkan `< 15 KB` tanpa dependensi luar.

