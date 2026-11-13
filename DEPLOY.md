# PANDUAN DEPLOYMENT TEKNOGAME
## Apache XAMPP / cPanel / DirectAdmin via FileZilla

Dokumen ini adalah panduan resmi langkah demi langkah untuk melakukan deployment portal **TeknoGame** ke server web (seperti Apache XAMPP, cPanel, atau DirectAdmin) menggunakan **FileZilla FTP/SFTP**.

---

## 1. Pertanyaan Kunci: Deploy File Mentah atau Hasil Build?

> [!IMPORTANT]
> **Yang di-deploy ke server HANYA HASIL BUILD di dalam folder `out/`!**  
> **JANGAN PERNAH** meng-upload folder mentah project seperti `src/`, `node_modules/`, `package.json`, atau file `.ts` ke dalam `htdocs`.

### Mengapa?
1. **Arsitektur Apache / XAMPP:** Web server Apache hanya melayani file web statis (`.html`, `.css`, `.js`, gambar, dan audio). Apache tidak bisa mengeksekusi langsung file TypeScript/Next.js mentah.
2. **Efisiensi & Kecepatan:** Folder `out/` adalah hasil kompilasi bersih (Static Export / SSG). Ukurannya jauh lebih ringan, tidak memerlukan instalasi Node.js di remote server, dan langsung bekerja 100% dengan kecepatan tinggi.

---

## 2. Struktur URL Deployment

Pilih salah satu dari 2 skenario deployment di bawah ini:

### Skenario A: Subfolder `http://<IP_atau_Domain>/games` (AKTIF SAAT INI)
Gunakan skenario ini jika web diletakkan di dalam subfolder `public_html/games/` atau `htdocs/games/`.
* Pengaturan di `next.config.ts`:
  ```ts
  const nextConfig: NextConfig = {
    output: "export",
    basePath: "/games",
    reactStrictMode: true,
    images: { unoptimized: true },
  };
  ```
* Target folder di remote server: **`/public_html/games/`** atau **`htdocs/games/`**
* URL akses: **`http://<IP_atau_Domain>/games`**

---

### Skenario B: Root Domain / Subdomain `http://game.domain.com` atau `http://localhost/`
Gunakan skenario ini jika folder `htdocs/` (atau DocumentRoot VirtualHost) langsung menjadi domain utama.
* Ubah `next.config.ts` (hapus baris `basePath`):
  ```ts
  const nextConfig: NextConfig = {
    output: "export",
    reactStrictMode: true,
    images: { unoptimized: true },
  };
  ```
* Lalu build ulang: `npm run build`
* Target folder di remote server: **`htdocs/`** (langsung di root)
* URL akses: **`http://game.domain.com/`**

---

## 3. Langkah Demi Langkah: Build & Upload via FileZilla

### Langkah 1: Jalankan Build di Komputer Lokal
Buka terminal di komputer Anda, lalu jalankan:
```bash
cd e:\Coding\travelista-game\game
npm run build
```
Pastikan build selesai dengan status sukses (`exited with code 0`). Seluruh file siap pakai akan otomatis terbuat di folder:
📂 **`e:\Coding\travelista-game\game\out\`**

---

### Langkah 2: Buka FileZilla dan Hubungkan ke Server
1. Buka aplikasi **FileZilla Client**.
2. Masukkan koneksi server Anda:
   * **Host:** Alamat IP atau hostname remote server Anda (misal: `103.xxx.xxx.xxx` atau `sftp://hostdata.id`)
   * **Username:** Username FTP / cPanel / SSH Anda
   * **Password:** Password akun Anda
   * **Port:** `21` (untuk FTP) atau `22` (untuk SFTP)
3. Klik **Quickconnect**.

---

### Langkah 3: Siapkan Folder Target di Server (Sisi Kanan FileZilla)
1. Di panel kanan (Remote Site), cari dan buka folder **`public_html/`** atau **`htdocs/`**.
2. *Untuk skenario subfolder:*  
   Folder target adalah **`games`** (seperti yang sudah Anda buat: `/public_html/games/`).
3. Masuk ke dalam folder **`games/`** tersebut.

---

### Langkah 4: Upload Seluruh Isi Folder `out/` (Sisi Kiri FileZilla)
1. Di panel kiri (Local Site), buka folder:  
   📂 **`e:\Coding\travelista-game\game\out\`**
2. **Pilih SEMUA file dan folder di dalamnya** (klik salah satu file lalu tekan `Ctrl + A`):
   * Folder: `_next`, `category`, `play`, `games`, `_not-found`
   * File: `index.html`, `404.html`, `favicon.ico`, `teknogame-*.png`, `apple-icon.png`, dll.
3. **PENTING:** Pastikan Anda meng-upload **ISI** dari folder `out/`, bukan meng-upload folder `out` itu sendiri!
4. Klik kanan -> pilih **Upload** (timpa file yang ada / *Overwrite*).
5. Tunggu hingga status antrean transfer (Queued files) di bagian bawah FileZilla menjadi `0` dan pindah ke tab *Successful transfers*.

---

## 4. Konfigurasi Apache `.htaccess` (Rekomendasi)

Untuk memastikan URL rute halaman (seperti `/games/category/arcade` atau `/games/play/nusantara-runner`) dapat di-refresh di browser tanpa memicu pesan error 404 dari Apache, buat file bernama **`.htaccess`** di dalam folder **`public_html/games/`** di remote server dengan isi berikut:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /games/

  # Jika ada request ke file fisik atau direktori yang ada, layani langsung
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Jika mengakses /games/play/slug, arahkan ke file statis slug.html jika ada
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # Fallback ke index.html untuk client-side routing
  RewriteRule ^ index.html [L]
</IfModule>
```

---

## 5. Checklist Troubleshooting

| Gejala Masalah | Penyebab Umum | Solusi Cepat |
| :--- | :--- | :--- |
| **CSS atau styling hitam polos tidak muncul** | Path `basePath` tidak sesuai dengan nama folder di server. | Karena folder di server bernama `games`, pastikan `basePath` di `next.config.ts` adalah `/games` dan buka URL lewat `http://.../games`. |
| **Game HTML5 di iframe tidak mau jalan** | Izin file (file permissions) di Linux/Apache belum dapat dibaca. | Di FileZilla, klik kanan folder `games/` di server -> pilih **File permissions** -> ubah menjadi `755` dan centang *Recurse into subdirectories*. |
| **Halaman 404 Not Found saat pertama dibuka** | File `index.html` berada di dalam subfolder `out/` di server. | Pastikan `index.html` berada langsung di `/public_html/games/index.html`. |
| **Tab icon / favicon masih gambar lama** | Browser menyimpan cache favicon lama secara agresif. | Tekan `Ctrl + F5` atau `Ctrl + Shift + R` (Hard Reload) di browser Anda, atau buka via jendela *Incognito / Private Window*. |

---

## 6. Prosedur Update Kode di Masa Depan

Setiap kali Anda meminta AI atau melakukan perubahan fitur baru:
1. Jalankan build di lokal: `npm run build`
2. Buka FileZilla -> upload ulang file-file di folder `e:\Coding\travelista-game\game\out\` ke `htdocs/game/`.
3. Website di server langsung ter-update secara instan tanpa perlu restart server!

