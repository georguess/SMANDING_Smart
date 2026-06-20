<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\RfidReader;
use App\Models\RfidCard;
use App\Models\Attendance;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Data Akun dan Profil Admin
        $userAdmin = User::create([
            'username' => 'admin_utama',
            'email' => 'admin@sekolah.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        Admin::create([
            'user_id' => $userAdmin->id,
            'nama' => 'Administrator Sistem',
            'nip' => '198001012005011001',
        ]);

        // 2. Buat Data Akun dan Profil Guru
        $userGuru = User::create([
            'username' => 'guru_budi',
            'email' => 'budi@sekolah.com',
            'password' => bcrypt('password123'),
            'role' => 'guru',
            'is_active' => true,
        ]);

        $guru = Guru::create([
            'user_id' => $userGuru->id,
            'nama' => 'Budi Santoso, S.Pd',
            'nip' => '198502022010011002',
        ]);

        // 3. Buat Data Semester
        $semesterGanjil = Semester::create([
            'semester' => 'Ganjil',
            'tahun_akademik' => '2025/2026',
            'is_active' => true,
        ]);

        $semesterGenap = Semester::create([
            'semester' => 'Genap',
            'tahun_akademik' => '2025/2026',
            'is_active' => false,
        ]);

        // 4. Buat Data Kelas
        $kelas = Kelas::create([
            'nama_kelas' => 'X7',
            'guru_id' => $guru->id,
            'semester_id' => $semesterGanjil->id,
            'tahun_ajaran' => $semesterGanjil->tahun_akademik,
        ]);

        // 5. Buat Data Akun dan Profil Siswa
        $userSiswa = User::create([
            'username' => 'siswa_andi',
            'email' => 'andi@siswa.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);

        $siswa = Siswa::create([
            'user_id' => $userSiswa->id,
            'nama' => 'Andi Darmawan',
            'nis' => '1123',
            'nisn' => '0051234567',
            'kelas_id' => $kelas->id,
            'alamat' => 'Lampung',
        ]);

        // 6. Buat Data Mesin RFID Reader
        $reader = RfidReader::create([
            'lokasi' => 'Gerbang Utama Sekolah',
        ]);

        // 7. Buat Data Kartu RFID
        $card = RfidCard::create([
            'siswa_id' => $siswa->id,
            'uid_card' => 'A1B2C3D4E5',
            'status' => 'active',
        ]);

        // 8. Buat Data Simulasi Kehadiran
        Attendance::create([
            'user_id' => $userSiswa->id,
            'siswa_id' => $siswa->id,
            'kelas_id' => $kelas->id,
            'semester_id' => $semesterGanjil->id,
            'rfid_card_id' => $card->id,
            'rfid_reader_id' => $reader->id,
            'guru_id' => $guru->id,
            'waktu_absen' => now()->subHours(2),
            'status' => 'hadir',
            'foto' => null,
        ]);
    }
}