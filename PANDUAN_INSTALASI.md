# Panduan Instalasi & Pengembangan — Smart Attendance (SMANDING)

Sistem absensi sekolah berbasis RFID: ESP32 + RFID reader di gerbang/kelas → backend **Laravel 10** → frontend **React 18 (Inertia.js)**. Dokumen ini untuk siapa pun yang baru pegang project ini, baik untuk pakai sehari-hari maupun untuk lanjut develop.

---

## 1. Yang Harus Sudah Terpasang di Komputer

| Kebutuhan | Versi | Catatan |
|---|---|---|
| PHP | 8.1 atau lebih baru | via Laragon sudah otomatis ada |
| Composer | terbaru | package manager PHP |
| Node.js + npm | 18+ disarankan | untuk build frontend React |
| MySQL / MariaDB | 5.7+ / 10.x | via Laragon sudah otomatis ada |
| Laragon | — | web server lokal (Apache/Nginx + PHP + MySQL sudah satu paket) |

Kalau pakai Laragon, PHP/MySQL/Composer biasanya sudah tersedia otomatis. Cek dengan buka terminal (klik kanan di Laragon → Terminal) lalu jalankan:

```bash
php -v
composer -V
node -v
npm -v
```

---

## 2. Setup Project dari Nol (Local Development)

Semua perintah di bawah dijalankan dari folder root project, contoh: `C:\laragon\www\Smart-Attendance`.

### 2.1 Install dependency PHP & JavaScript

```bash
composer install
npm install
```

### 2.2 Siapkan file `.env`

Kalau belum ada file `.env`, salin dari `.env.example`:

```bash
copy .env.example .env
```

Lalu generate application key (wajib, dipakai Laravel untuk enkripsi session/cookie):

```bash
php artisan key:generate
```

Buka `.env`, pastikan bagian koneksi database seperti ini (sesuaikan kalau MySQL kamu pakai password root):

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_attendance
DB_USERNAME=root
DB_PASSWORD=
```

Kalau nanti mau dites dari HP/ESP32 di jaringan yang sama, isi juga:

```
APP_URL=http://<IP-lokal-komputer-kamu>:8000
VITE_DEV_SERVER_URL=http://<IP-lokal-komputer-kamu>:5173
ESP32_SECRET_KEY="<kunci-rahasia-buat-otentikasi-alat-ESP32>"
```

`ESP32_SECRET_KEY` ini dipakai untuk memverifikasi bahwa request absensi yang masuk memang datang dari alat RFID reader, bukan sembarang orang yang hit API. Cari nilai ini juga harus sama persis dengan yang di-flash ke firmware ESP32.

### 2.3 Buat Database

Ada **2 opsi**, pilih salah satu:

#### Opsi A — Cara Laravel (disarankan untuk development sehari-hari)

Ini cara paling "benar" karena riwayat migration tetap tercatat rapi dan gampang di-*rollback* kalau ada perubahan struktur tabel di masa depan.

```bash
php artisan migrate --seed
```

Perintah ini otomatis:
1. Membuat semua tabel lewat file-file di `database/migrations/`
2. Mengisi data contoh lewat `database/seeders/DatabaseSeeder.php` (1 admin, 1 guru, 1 siswa, 1 kelas, 1 kartu RFID, 1 alat reader, 1 contoh absensi)

> Kalau database `smart_attendance` belum ada, buat dulu database kosongnya lewat phpMyAdmin atau `mysql -u root -e "CREATE DATABASE smart_attendance"`, baru jalankan perintah di atas.

#### Opsi B — Cara SQL langsung (paling cepat untuk demo / serah terima)

Kalau kamu (atau orang yang menerima project ini nanti) tidak familiar dengan `artisan` dan cuma mau database-nya langsung jadi, tinggal import file **`database/install.sql`** yang sudah disertakan di project ini. File ini membuat database `smart_attendance` beserta seluruh tabel dan sedikit data contoh dalam satu kali jalan — tidak perlu `php artisan migrate` sama sekali.

Cara import:

- **Lewat phpMyAdmin**: buka phpMyAdmin di Laragon → tab **Import** → pilih file `database/install.sql` → klik **Go**.
- **Lewat terminal**:
  ```bash
  mysql -u root -p < database/install.sql
  ```
  (kosongkan password kalau root tanpa password, tinggal Enter saat diminta)

Setelah itu tinggal pastikan `.env` mengarah ke database `smart_attendance` seperti di langkah 2.2, tidak perlu jalankan `migrate` lagi (file SQL ini sudah otomatis menandai semua migration sebagai "selesai" di tabel `migrations`, jadi Laravel tidak akan coba bikin ulang tabel yang sama).

Kalau ke depannya ada migration baru yang ditambahkan developer, tinggal jalankan `php artisan migrate` seperti biasa — Laravel akan otomatis skip migration lama yang sudah tercatat dan hanya menjalankan yang baru.

### 2.4 Buat symbolic link storage (untuk upload foto)

Tabel `users` (kolom `photo_profile`) dan `attendances` (kolom `foto`) menyimpan path file. Supaya file yang diupload bisa diakses lewat browser:

```bash
php artisan storage:link
```

### 2.5 Build frontend (React + Vite)

Untuk development (auto-reload saat file diubah):

```bash
npm run dev
```

Untuk build production (menghasilkan file statis di `public/build`):

```bash
npm run build
```

### 2.6 Jalankan server Laravel

```bash
php artisan serve
```

Atau kalau pakai Laragon, cukup arahkan browser ke `http://smart-attendance.test` (Laragon otomatis membuat virtual host dari nama folder) — pastikan `npm run dev` tetap jalan di terminal terpisah selama development.

### 2.7 Akun login default (dari data contoh / seeder)

| Role | Username | Password |
|---|---|---|
| Admin | `admin_utama` | `password123` |
| Guru | `guru_budi` | `password123` |
| Siswa | `siswa_andi` | `password123` |

**Ganti password ini setelah instalasi**, terutama kalau project akan dipakai di sekolah sungguhan (bukan sekadar demo).

---

## 3. Struktur Database (Ringkasan)

```
users (akun login: admin/guru/siswa)
 ├── admins        (profil admin, 1-ke-1 dengan users)
 ├── gurus         (profil guru, 1-ke-1 dengan users)
 │    └── kelas    (kelas yang diwalikan oleh seorang guru, per semester)
 └── siswas        (profil siswa, terhubung ke kelas)
      └── rfid_cards   (1 siswa bisa punya 1+ kartu RFID)

semesters          (Ganjil/Genap per tahun ajaran, ada status "aktif")
rfid_readers       (alat ESP32 di lapangan, punya device_id unik)
attendances        (log kehadiran — hasil tap kartu di rfid_reader)
```

Poin penting soal `attendances`:
- 1 siswa hanya boleh punya **1 catatan per (siswa, tipe, tanggal)** — jadi maksimal 1x "masuk" dan 1x "pulang" per hari (constraint unique `attendance_unique_per_session`).
- Status kehadiran: `hadir`, `sakit`, `izin`, `alfa`.
- Kalau guru/kelas/reader dihapus, catatan absensi lama **tidak ikut terhapus** (foreign key-nya `SET NULL`, bukan `CASCADE`) — supaya riwayat data tidak hilang.

Kalau butuh melihat definisi kolom lebih detail, buka file-file di `database/migrations/` (urut berdasarkan nama file/tanggal) atau langsung baca `database/install.sql` yang sudah merangkum semuanya jadi satu.

---

## 4. Alur Kerja Sehari-hari (untuk Developer)

- **Ubah struktur tabel** → buat migration baru: `php artisan make:migration nama_perubahan`, isi logikanya, lalu `php artisan migrate`. Jangan mengedit migration lama yang sudah pernah dijalankan di server produksi.
- **Tambah data contoh** → tambahkan di `database/seeders/`, lalu jalankan `php artisan db:seed --class=NamaSeeder`.
- **Reset database dari nol saat development** (hapus semua data & bikin ulang tabel):
  ```bash
  php artisan migrate:fresh --seed
  ```
  ⚠️ Perintah ini **menghapus semua data** di database, jangan pernah dijalankan di server produksi.
- **Kalau pakai `install.sql` lagi untuk reset cepat**, tinggal import ulang filenya — script sudah otomatis `DROP TABLE IF EXISTS` dulu sebelum membuat ulang, jadi aman dijalankan berkali-kali.

---

## 5. Menyambungkan Alat RFID (ESP32)

- Alat didaftarkan lebih dulu di tabel `rfid_readers` (field `device_id` harus unik, dan dicocokkan dengan ID yang di-hardcode di firmware ESP32).
- Setiap request dari ESP32 ke API absensi harus menyertakan `ESP32_SECRET_KEY` yang sama dengan yang ada di `.env` — kalau tidak cocok, request akan ditolak.
- Endpoint API terkait ada di `routes/api.php`. Cek isi file itu untuk tahu persis format request yang diharapkan alat (UID kartu, device_id, dsb).

---

## 6. Deploy ke Server / Hosting (Produksi)

Ringkasan langkah kalau project ini mau dipasang di server sungguhan (VPS, shared hosting yang mendukung Laravel, dsb):

1. Upload seluruh kode (kecuali `node_modules`, `vendor`, `.env` — biasanya sudah otomatis dikecualikan lewat `.gitignore` kalau pakai Git).
2. Di server, jalankan:
   ```bash
   composer install --optimize-autoloader --no-dev
   npm install && npm run build
   ```
3. Salin `.env.example` → `.env`, isi kredensial database & `APP_URL` sesuai domain asli, lalu `php artisan key:generate`.
4. Set `APP_ENV=production` dan `APP_DEBUG=false` di `.env` (supaya pesan error teknis tidak terlihat pengguna).
5. Buat database di server, lalu jalankan **salah satu**:
   - `php artisan migrate --force` (kalau mau cara migration), atau
   - import `database/install.sql` lewat phpMyAdmin/cPanel/`mysql` seperti di langkah 2.3 Opsi B (bisa hapus dulu bagian INSERT data contoh di file itu kalau tidak mau ada akun demo di server produksi).
6. `php artisan storage:link`
7. Pastikan folder `storage/` dan `bootstrap/cache/` bisa ditulis oleh web server (`chmod -R 775` di Linux, atau setara di panel hosting).
8. Arahkan document root domain ke folder `public/`, bukan ke root project.

---

## 7. Dokumen Lain di Project Ini

Sudah ada beberapa file bantuan lain di root project yang juga layak dibaca:
- `README.md` — README bawaan Laravel + sedikit catatan
- `DESIGN_SYSTEM.md` — panduan desain UI (warna, komponen, dsb)
- `QUICK_REFERENCE.md` — referensi cepat
- `IMPLEMENTATION_SUMMARY.md` — ringkasan implementasi fitur

Dokumen ini (`PANDUAN_INSTALASI.md`) fokus khusus di bagian **instalasi & database**, sebagai pelengkap dokumen-dokumen tersebut.
