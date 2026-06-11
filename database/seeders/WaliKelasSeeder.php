<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class WaliKelasSeeder extends Seeder
{
    public function run(): void
    {
        $tahunAjaran = '2025/2026';

        $dataWaliKelas = [
            ['kelas' => 'X 1', 'wali_kelas' => 'Isnantara, S.Pd.'],
            ['kelas' => 'X 2', 'wali_kelas' => 'Edi Purnomo, M.Pd.'],
            ['kelas' => 'X 3', 'wali_kelas' => 'Viktaria Yuliana Putri, S.Kom.'],
            ['kelas' => 'X 4', 'wali_kelas' => 'Siti Rahmawati, S.Pd.'],
            ['kelas' => 'X 5', 'wali_kelas' => 'Hendri Fauzan, S.Pd.'],
            ['kelas' => 'X 6', 'wali_kelas' => 'Bagus Efras Sudarno, S.Pd.'],
            ['kelas' => 'X 7', 'wali_kelas' => 'Adis Dwi Handayani, S.Kom'],
            ['kelas' => 'X 8', 'wali_kelas' => 'Fitnita, S.H.'],
            ['kelas' => 'X 9', 'wali_kelas' => 'Perliana, S.Pd'],
            ['kelas' => 'X 10', 'wali_kelas' => 'Nimas Aulia Ramadanti, S.Pd.'],
            ['kelas' => 'X 11', 'wali_kelas' => 'Panji Ketawang, S.Pd.'],

            ['kelas' => 'XI 1', 'wali_kelas' => 'Safei Soleh, S.Pd., M.Pd.'],
            ['kelas' => 'XI 2', 'wali_kelas' => 'Darmini, S.Kom'],
            ['kelas' => 'XI 3', 'wali_kelas' => 'Putri Pertiwi, S.Pd.'],
            ['kelas' => 'XI 4', 'wali_kelas' => 'Eko Rian Aryanto, M.Pd.'],
            ['kelas' => 'XI 5', 'wali_kelas' => 'Bagus Suryo Laksono, S.Pd.'],
            ['kelas' => 'XI 6', 'wali_kelas' => 'Afri Ritanti, S.Kom'],
            ['kelas' => 'XI 7', 'wali_kelas' => 'Ika Kurnia Retnowati, S.E'],
            ['kelas' => 'XI 8', 'wali_kelas' => 'Agustina Indasari, S.Kom'],
            ['kelas' => 'XI 9', 'wali_kelas' => 'Wahyu Dermawan, S.Pd.'],
            ['kelas' => 'XI 10', 'wali_kelas' => 'Novia Purnamasari, S.Pd.'],
            ['kelas' => 'XI 11', 'wali_kelas' => 'Sri Rahmaning Tiyas, S.Si'],

            ['kelas' => 'XII 1', 'wali_kelas' => 'Bella Kusumawati, S.Pd'],
            ['kelas' => 'XII 2', 'wali_kelas' => 'Tiara Gardenia Resmita, S.S'],
            ['kelas' => 'XII 3', 'wali_kelas' => 'Endang Sulastri, S.Pd.'],
            ['kelas' => 'XII 4', 'wali_kelas' => 'Eka Mardiyanti, S.Kom'],
            ['kelas' => 'XII 5', 'wali_kelas' => 'Yunita Riyani, M.Pd.'],
            ['kelas' => 'XII 6', 'wali_kelas' => 'Saison Damanik, S.Pd.'],
            ['kelas' => 'XII 7', 'wali_kelas' => 'Ika Mei Kurniawati, S.Pd'],
            ['kelas' => 'XII 8', 'wali_kelas' => 'Lesman Pandiangan, S.Pd.'],
            ['kelas' => 'XII 9', 'wali_kelas' => 'Ferra Luxitya, S.Pd.'],
            ['kelas' => 'XII 10', 'wali_kelas' => 'Woro Tri Rahayu, S.Pd.'],
            ['kelas' => 'XII 11', 'wali_kelas' => 'Rahmatsyah, S.Pd., M.Kes'],
        ];

        foreach ($dataWaliKelas as $index => $data) {
            $namaGuru = trim($data['wali_kelas']);
            $namaKelas = trim($data['kelas']);

            // Contoh:
            // Ika Mei Kurniawati, S.Pd -> ika_mei_kurniawati_spd
            $username = Str::slug($namaGuru, '_');
            $email = $username . '@smanding.sch.id';

            // NIP dummy agar tidak error karena kolom nip tidak boleh null
            $nipDummy = '2026' . str_pad($index + 1, 6, '0', STR_PAD_LEFT);

            /*
            |--------------------------------------------------------------------------
            | 1. Buat / update akun user untuk login guru
            |--------------------------------------------------------------------------
            */
            $user = User::updateOrCreate(
                [
                    'username' => $username,
                ],
                [
                    'username' => $username,
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'role' => 'guru',
                    'is_active' => true,
                ]
            );

            /*
            |--------------------------------------------------------------------------
            | 2. Buat / update data guru
            |--------------------------------------------------------------------------
            */
            $guru = Guru::firstOrNew([
                'user_id' => $user->id,
            ]);

            $guru->user_id = $user->id;

            if (Schema::hasColumn('gurus', 'nama')) {
                $guru->nama = $namaGuru;
            }

            if (Schema::hasColumn('gurus', 'nip')) {
                $guru->nip = $nipDummy;
            }

            if (Schema::hasColumn('gurus', 'alamat')) {
                $guru->alamat = '-';
            }

            if (Schema::hasColumn('gurus', 'jenis_kelamin')) {
                $guru->jenis_kelamin = '-';
            }

            if (Schema::hasColumn('gurus', 'no_telp')) {
                $guru->no_telp = '-';
            }

            if (Schema::hasColumn('gurus', 'telepon')) {
                $guru->telepon = '-';
            }

            if (Schema::hasColumn('gurus', 'mapel')) {
                $guru->mapel = '-';
            }

            if (Schema::hasColumn('gurus', 'mata_pelajaran')) {
                $guru->mata_pelajaran = '-';
            }

            $guru->save();

            /*
            |--------------------------------------------------------------------------
            | 3. Buat / update kelas dan hubungkan dengan wali kelas
            |--------------------------------------------------------------------------
            */
            $kelas = Kelas::firstOrNew([
                'nama_kelas' => $namaKelas,
            ]);

            $kelas->nama_kelas = $namaKelas;

            if (Schema::hasColumn('kelas', 'tahun_ajaran')) {
                $kelas->tahun_ajaran = $tahunAjaran;
            }

            if (Schema::hasColumn('kelas', 'guru_id')) {
                $kelas->guru_id = $guru->id;
            }

            $kelas->save();
        }
    }
}