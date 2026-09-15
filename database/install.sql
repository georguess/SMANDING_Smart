-- =========================================================================
--  SMART ATTENDANCE (SMANDING) - INSTALL SCRIPT
--  Sistem Absensi RFID (ESP32 + Laravel + React/Inertia)
--
--  File ini membuat DATABASE BARU dari nol dengan seluruh struktur tabel
--  final (hasil gabungan semua migration Laravel di database/migrations).
--
--  CARA PAKAI (pilih salah satu):
--
--  1) Lewat phpMyAdmin (Laragon):
--     - Buka phpMyAdmin -> tab "Import" -> pilih file ini -> Go.
--       (Tidak perlu buat database dulu, file ini sudah membuatnya)
--
--  2) Lewat terminal / CMD:
--     mysql -u root -p < install.sql
--
--  Setelah database jadi, di file .env set:
--     DB_DATABASE=smart_attendance
--     DB_USERNAME=root
--     DB_PASSWORD=
--
--  Lalu tandai migration sebagai sudah jalan (supaya Laravel tidak coba
--  membuat ulang tabel yang sama) dengan salah satu cara di panduan
--  instalasi (lihat PANDUAN_INSTALASI.md, bagian "Opsi B").
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
SET time_zone = '+07:00';

-- -------------------------------------------------------------------------
-- 1. Buat database
-- -------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `smart_attendance`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `smart_attendance`;

-- -------------------------------------------------------------------------
-- 2. Hapus tabel lama jika ada (supaya script ini bisa dijalankan ulang
--    dengan aman / idempotent)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `attendances`;
DROP TABLE IF EXISTS `rfid_cards`;
DROP TABLE IF EXISTS `rfid_readers`;
DROP TABLE IF EXISTS `siswas`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `kelas`;
DROP TABLE IF EXISTS `semesters`;
DROP TABLE IF EXISTS `gurus`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `migrations`;

-- -------------------------------------------------------------------------
-- 3. Tabel bawaan Laravel
-- -------------------------------------------------------------------------

CREATE TABLE `migrations` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin','guru','siswa') NOT NULL DEFAULT 'siswa',
    `photo_profile` VARCHAR(255) NULL DEFAULT NULL,
    `birth_date` DATE NULL DEFAULT NULL,
    `is_active` TINYINT(1) NULL DEFAULT NULL,
    `must_change_password` TINYINT(1) NOT NULL DEFAULT 0,
    `remember_token` VARCHAR(100) NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_username_unique` (`username`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT NULL DEFAULT NULL,
    `last_used_at` TIMESTAMP NULL DEFAULT NULL,
    `expires_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
    KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 4. Tabel inti aplikasi
-- -------------------------------------------------------------------------

CREATE TABLE `gurus` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `nip` VARCHAR(50) NOT NULL,
    `alamat` TEXT NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `gurus_nip_unique` (`nip`),
    KEY `gurus_user_id_foreign` (`user_id`),
    CONSTRAINT `gurus_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `semesters` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `semester` VARCHAR(20) NOT NULL,
    `tahun_akademik` VARCHAR(20) NOT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `semesters_semester_tahun_akademik_unique` (`semester`, `tahun_akademik`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `kelas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_kelas` VARCHAR(50) NOT NULL,
    `guru_id` BIGINT UNSIGNED NOT NULL,
    `semester_id` BIGINT UNSIGNED NOT NULL,
    `tahun_ajaran` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `kelas_nama_kelas_semester_id_unique` (`nama_kelas`, `semester_id`),
    KEY `kelas_guru_id_foreign` (`guru_id`),
    KEY `kelas_semester_id_foreign` (`semester_id`),
    CONSTRAINT `kelas_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `gurus` (`id`) ON DELETE CASCADE,
    CONSTRAINT `kelas_semester_id_foreign` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `admins` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `nip` VARCHAR(50) NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `admins_nip_unique` (`nip`),
    KEY `admins_user_id_foreign` (`user_id`),
    CONSTRAINT `admins_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `siswas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `kelas_id` BIGINT UNSIGNED NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `nis` VARCHAR(20) NOT NULL,
    `nisn` VARCHAR(20) NULL DEFAULT NULL,
    `alamat` TEXT NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `siswas_nis_unique` (`nis`),
    KEY `siswas_user_id_foreign` (`user_id`),
    KEY `siswas_kelas_id_foreign` (`kelas_id`),
    CONSTRAINT `siswas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `siswas_kelas_id_foreign` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `rfid_cards` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `siswa_id` BIGINT UNSIGNED NOT NULL,
    `uid_card` VARCHAR(100) NOT NULL,
    `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `rfid_cards_uid_card_unique` (`uid_card`),
    KEY `rfid_cards_siswa_id_foreign` (`siswa_id`),
    CONSTRAINT `rfid_cards_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `rfid_readers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `device_id` VARCHAR(255) NOT NULL,
    `lokasi` VARCHAR(255) NOT NULL,
    `kelas_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `status` ENUM('active','inactive','maintenance') NOT NULL,
    `last_seen_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `rfid_readers_device_id_unique` (`device_id`),
    KEY `rfid_readers_kelas_id_foreign` (`kelas_id`),
    CONSTRAINT `rfid_readers_kelas_id_foreign` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `attendances` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `rfid_card_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `rfid_reader_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `guru_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `kelas_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `semester_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `siswa_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `waktu_absen` DATETIME NOT NULL,
    `tanggal` DATE NOT NULL,
    `status` ENUM('hadir','izin','sakit','alfa') NOT NULL,
    `tipe` ENUM('masuk','pulang') NOT NULL DEFAULT 'masuk',
    `foto` VARCHAR(255) NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `attendance_unique_per_session` (`siswa_id`, `tipe`, `tanggal`),
    KEY `attendance_daily_summary` (`tanggal`, `kelas_id`, `status`, `tipe`),
    KEY `attendance_latest` (`waktu_absen`),
    KEY `attendances_user_id_foreign` (`user_id`),
    KEY `attendances_rfid_card_id_foreign` (`rfid_card_id`),
    KEY `attendances_rfid_reader_id_foreign` (`rfid_reader_id`),
    KEY `attendances_guru_id_foreign` (`guru_id`),
    KEY `attendances_semester_id_foreign` (`semester_id`),
    CONSTRAINT `attendances_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `attendances_rfid_card_id_foreign` FOREIGN KEY (`rfid_card_id`) REFERENCES `rfid_cards` (`id`) ON DELETE CASCADE,
    CONSTRAINT `attendances_rfid_reader_id_foreign` FOREIGN KEY (`rfid_reader_id`) REFERENCES `rfid_readers` (`id`) ON DELETE SET NULL,
    CONSTRAINT `attendances_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `gurus` (`id`) ON DELETE SET NULL,
    CONSTRAINT `attendances_kelas_id_foreign` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE SET NULL,
    CONSTRAINT `attendances_semester_id_foreign` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE SET NULL,
    CONSTRAINT `attendances_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 5. Tandai semua migration sudah "jalan" supaya `php artisan migrate`
--    tidak mencoba membuat ulang tabel-tabel di atas.
--    (Laravel cuma cek nama file & batch, isinya tidak divalidasi ulang)
-- -------------------------------------------------------------------------
INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2014_10_12_000000_create_users_table', 1),
('2014_10_12_100000_create_password_reset_tokens_table', 1),
('2019_08_19_000000_create_failed_jobs_table', 1),
('2019_12_14_000001_create_personal_access_tokens_table', 1),
('2026_05_04_0000002_create_gurus_table', 1),
('2026_05_04_0000003_create_semesters_table', 1),
('2026_05_04_0000004_create_kelas_table', 1),
('2026_05_04_090259_create_admins_table', 1),
('2026_05_04_090259_z_create_siswas_table', 1),
('2026_05_04_090300_create_rfid_cards_table', 1),
('2026_05_04_090300_create_rfid_readers_table', 1),
('2026_05_04_090302_create_attendances_table', 1),
('2026_05_12_155228_add_is_active_to_semesters_table', 1),
('2026_07_02_035826_add_must_change_password_to_users_table', 1),
('2026_07_17_162240_add_tipe_and_tanggal_to_attendances_table', 1),
('2026_07_19_132615_fix_status_enum_typo_in_attendances_table', 1),
('2026_07_19_140726_add_device_id_and_kelas_to_rfid_readers_table', 1);

-- -------------------------------------------------------------------------
-- 6. Data awal (contoh) - password login semuanya sudah di-hash bcrypt
--    dan cocok dipakai untuk login langsung setelah import.
--
--    admin_utama  / password123   (role: admin)
--    guru_budi    / password123   (role: guru)
--    siswa_andi   / password123   (role: siswa)
--
--    NB: hash di bawah ini valid untuk PASSWORD "password123"
--    (dibuat dengan password_hash(..., PASSWORD_BCRYPT), sama seperti
--    fungsi bcrypt() bawaan Laravel).
-- -------------------------------------------------------------------------

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `is_active`, `must_change_password`, `created_at`, `updated_at`) VALUES
(1, 'admin_utama', 'admin@sekolah.com', '$2y$10$1kJ/kVt8FOhnMZvBz/RE1O9m7ALAY3fzXVnVI7rHldM.6Xmc8H4sa', 'admin', 1, 0, NOW(), NOW()),
(2, 'guru_budi', 'budi@sekolah.com', '$2y$10$1kJ/kVt8FOhnMZvBz/RE1O9m7ALAY3fzXVnVI7rHldM.6Xmc8H4sa', 'guru', 1, 0, NOW(), NOW()),
(3, 'siswa_andi', 'andi@siswa.com', '$2y$10$1kJ/kVt8FOhnMZvBz/RE1O9m7ALAY3fzXVnVI7rHldM.6Xmc8H4sa', 'siswa', 1, 0, NOW(), NOW());

INSERT INTO `admins` (`user_id`, `nama`, `nip`, `created_at`, `updated_at`) VALUES
(1, 'Administrator Sistem', '198001012005011001', NOW(), NOW());

INSERT INTO `gurus` (`id`, `user_id`, `nama`, `nip`, `alamat`, `created_at`, `updated_at`) VALUES
(1, 2, 'Budi Santoso, S.Pd', '198502022010011002', NULL, NOW(), NOW());

INSERT INTO `semesters` (`id`, `semester`, `tahun_akademik`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Ganjil', '2025/2026', 1, NOW(), NOW()),
(2, 'Genap', '2025/2026', 0, NOW(), NOW());

INSERT INTO `kelas` (`id`, `nama_kelas`, `guru_id`, `semester_id`, `tahun_ajaran`, `created_at`, `updated_at`) VALUES
(1, 'X7', 1, 1, '2025/2026', NOW(), NOW());

INSERT INTO `siswas` (`id`, `user_id`, `kelas_id`, `nama`, `nis`, `nisn`, `alamat`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 'Andi Darmawan', '1123', '0051234567', 'Lampung', NOW(), NOW());

INSERT INTO `rfid_readers` (`id`, `device_id`, `lokasi`, `kelas_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'READER-GERBANG-UTAMA', 'Gerbang Utama Sekolah', NULL, 'active', NOW(), NOW());

INSERT INTO `rfid_cards` (`id`, `siswa_id`, `uid_card`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'A1B2C3D4E5', 'active', NOW(), NOW());

INSERT INTO `attendances` (`user_id`, `rfid_card_id`, `rfid_reader_id`, `guru_id`, `kelas_id`, `semester_id`, `siswa_id`, `waktu_absen`, `tanggal`, `status`, `tipe`, `created_at`, `updated_at`) VALUES
(3, 1, 1, 1, 1, 1, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), CURDATE(), 'hadir', 'masuk', NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- SELESAI. Database "smart_attendance" siap dipakai.
-- =========================================================================
