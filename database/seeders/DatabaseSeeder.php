<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;
use App\Models\Guru;
use App\Models\Siswa;
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
            'role' => 'admin'
        ]);
        Admin::create([
            'user_id' => $userAdmin->id,
            'nama' => 'Administrator Sistem',
            'nip' => '198001012005011001'
        ]);

        // 2. Buat Data Akun dan Profil Guru
        $userGuru = User::create([
            'username' => 'guru_budi',
            'email' => 'budi@sekolah.com',
            'password' => bcrypt('password123'),
            'role' => 'guru'
        ]);
        $guru = Guru::create([
            'user_id' => $userGuru->id,
            'nama' => 'Budi Santoso, S.Pd',
            'nip' => '198502022010011002'
        ]);

        // 3. Buat Data Akun dan Profil Siswa
        $userSiswa = User::create([
            'username' => 'siswa_andi',
            'email' => 'andi@siswa.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa'
        ]);
        $siswa = Siswa::create([
            'user_id' => $userSiswa->id,
            'nama' => 'Andi Darmawan',
            'nisn' => '0051234567',
            'kelas' => 'XII',
            'jurusan' => 'RPL'
        ]);

        // 4. Buat Data Mesin RFID Reader
        $reader = RfidReader::create([
            'lokasi' => 'Gerbang Utama Sekolah'
        ]);

        // 5. Buat Data Kartu RFID (Dimiliki oleh Siswa Andi)
        $card = RfidCard::create([
            'siswa_id' => $siswa->id,
            'uid_card' => 'A1B2C3D4E5'
        ]);

        // 6. Buat Data Simulasi Kehadiran (Presensi)
        Attendance::create([
            'user_id' => $userSiswa->id, // User yang absen (Andi)
            'rfid_card_id' => $card->id, // Memakai kartu A1B...
            'rfid_reader_id' => $reader->id, // Di Gerbang Utama
            'guru_id' => $guru->id, // Diawasi oleh Pak Budi
            'waktu' => now()->subHours(2), // Absen 2 jam yang lalu
            'status' => 'hadir'
        ]);
    }
}
