<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class SiswaExcelSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = storage_path('app/imports/GURU_TU_SISWA.xlsx');

        if (!file_exists($filePath)) {
            $this->command->error("File tidak ditemukan: {$filePath}");
            $this->command->warn("Letakkan file Excel di storage/app/imports/GURU_TU_SISWA.xlsx");
            return;
        }

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getSheetByName('data peserta didik');

        if (!$sheet) {
            $this->command->error("Sheet 'data peserta didik' tidak ditemukan.");
            $this->command->warn("Cek nama sheet di file Excel kamu.");
            return;
        }

        $highestRow = $sheet->getHighestRow();

        $berhasil = 0;
        $dilewati = 0;

        for ($row = 16; $row <= $highestRow; $row++) {
            $nisn = $this->cleanValue($sheet->getCell("B{$row}")->getValue());
            $nipd = $this->cleanValue($sheet->getCell("C{$row}")->getValue());
            $nama = $this->cleanValue($sheet->getCell("D{$row}")->getValue());
            $kelasExcel = $this->cleanValue($sheet->getCell("G{$row}")->getValue());
            $ttl = $sheet->getCell("H{$row}")->getValue();
            $agama = $this->cleanValue($sheet->getCell("J{$row}")->getValue());
            $alamat = $this->cleanValue($sheet->getCell("K{$row}")->getValue());
            $namaAyah = $this->cleanValue($sheet->getCell("L{$row}")->getValue());
            $namaIbu = $this->cleanValue($sheet->getCell("M{$row}")->getValue());

            if (empty($nama) || empty($kelasExcel)) {
                $dilewati++;
                continue;
            }

            $namaKelas = $this->normalisasiKelas($kelasExcel);

            $kelas = Kelas::where('nama_kelas', $namaKelas)->first();

            if (!$kelas) {
                $this->command->warn("Baris {$row} dilewati: kelas '{$kelasExcel}' menjadi '{$namaKelas}', tetapi tidak ditemukan di tabel kelas.");
                $dilewati++;
                continue;
            }

            $nis = $nipd ?: $nisn;

            if (empty($nis)) {
                $nis = 'SISWA-' . $row;
            }

            $username = 'siswa_' . Str::slug((string) $nis, '_');
            $email = $username . '@siswa.smanding.sch.id';

            $tanggalLahir = $this->parseTanggalLahir($ttl);

            // Jika tanggal lahir ada, password = YYYYMMDD.
            // Jika tanggal lahir kosong, password = NIPD/NIS.
            $defaultPassword = $tanggalLahir
                ? $tanggalLahir->format('Ymd')
                : (string) $nis;

            /*
            |--------------------------------------------------------------------------
            | 1. Buat / update akun user siswa
            |--------------------------------------------------------------------------
            */
            $userData = [
                'username' => $username,
                'email' => $email,
                'password' => Hash::make($defaultPassword),
                'role' => 'siswa',
            ];

            if (Schema::hasColumn('users', 'birth_date')) {
                $userData['birth_date'] = $tanggalLahir
                    ? $tanggalLahir->format('Y-m-d')
                    : '2000-01-01';
            }

            if (Schema::hasColumn('users', 'is_active')) {
                $userData['is_active'] = true;
            }

            $user = User::updateOrCreate(
                ['username' => $username],
                $userData
            );

            /*
            |--------------------------------------------------------------------------
            | 2. Buat / update data siswa
            |--------------------------------------------------------------------------
            */
            if (Schema::hasColumn('siswas', 'nis')) {
                $siswa = Siswa::firstOrNew(['nis' => $nis]);
            } else {
                $siswa = Siswa::firstOrNew(['user_id' => $user->id]);
            }

            if (Schema::hasColumn('siswas', 'user_id')) {
                $siswa->user_id = $user->id;
            }

            if (Schema::hasColumn('siswas', 'kelas_id')) {
                $siswa->kelas_id = $kelas->id;
            }

            if (Schema::hasColumn('siswas', 'nama')) {
                $siswa->nama = $nama;
            }

            if (Schema::hasColumn('siswas', 'nis')) {
                $siswa->nis = $nis;
            }

            if (Schema::hasColumn('siswas', 'nisn')) {
                $siswa->nisn = $nisn ?: '-';
            }

            if (Schema::hasColumn('siswas', 'nipd')) {
                $siswa->nipd = $nipd ?: '-';
            }

            if (Schema::hasColumn('siswas', 'alamat')) {
                $siswa->alamat = $alamat ?: '-';
            }

            if (Schema::hasColumn('siswas', 'agama')) {
                $siswa->agama = $agama ?: '-';
            }

            if (Schema::hasColumn('siswas', 'tanggal_lahir')) {
                $siswa->tanggal_lahir = $tanggalLahir
                    ? $tanggalLahir->format('Y-m-d')
                    : '2000-01-01';
            }

            if (Schema::hasColumn('siswas', 'jenis_kelamin')) {
                // File sheet data peserta didik tidak punya kolom L/P,
                // jadi sementara diisi default agar tidak error.
                $siswa->jenis_kelamin = 'L';
            }

            if (Schema::hasColumn('siswas', 'nama_ayah')) {
                $siswa->nama_ayah = $namaAyah ?: '-';
            }

            if (Schema::hasColumn('siswas', 'nama_ibu')) {
                $siswa->nama_ibu = $namaIbu ?: '-';
            }

            if (Schema::hasColumn('siswas', 'no_telp')) {
                $siswa->no_telp = '-';
            }

            if (Schema::hasColumn('siswas', 'status')) {
                $siswa->status = 'aktif';
            }

            $siswa->save();

            $berhasil++;
        }

        $this->command->info("Import siswa selesai.");
        $this->command->info("Berhasil: {$berhasil} data.");
        $this->command->warn("Dilewati: {$dilewati} baris.");
    }

    private function cleanValue($value): ?string
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        $value = trim((string) $value);

        if ($value === '' || $value === '#N/A') {
            return null;
        }

        return $value;
    }

    private function normalisasiKelas(?string $kelas): ?string
    {
        if (!$kelas) {
            return null;
        }

        $kelas = strtoupper(trim($kelas));
        $kelas = str_replace('.', ' ', $kelas);
        $kelas = preg_replace('/\s+/', ' ', $kelas);

        // X MIPA 1 -> X 1
        // X IPS 1  -> X 9
        if (preg_match('/^(X)\s+(MIPA|IPA)\s+(\d+)/', $kelas, $match)) {
            return 'X ' . (int) $match[3];
        }

        if (preg_match('/^(X)\s+IPS\s+(\d+)/', $kelas, $match)) {
            return 'X ' . ((int) $match[2] + 8);
        }

        // XI MIPA 1 -> XI 1
        // XI IPS 1  -> XI 9
        if (preg_match('/^(XI)\s+(MIPA|IPA)\s+(\d+)/', $kelas, $match)) {
            return 'XI ' . (int) $match[3];
        }

        if (preg_match('/^(XI)\s+IPS\s+(\d+)/', $kelas, $match)) {
            return 'XI ' . ((int) $match[2] + 8);
        }

        // XII MIPA 1 -> XII 1
        // XII IPS 1  -> XII 7
        if (preg_match('/^(XII)\s+(MIPA|IPA)\s+(\d+)/', $kelas, $match)) {
            return 'XII ' . (int) $match[3];
        }

        if (preg_match('/^(XII)\s+IPS\s+(\d+)/', $kelas, $match)) {
            return 'XII ' . ((int) $match[2] + 6);
        }

        // Kalau formatnya sudah X 1, XI 2, XII 7
        if (preg_match('/^(X|XI|XII)\s+(\d+)/', $kelas, $match)) {
            return $match[1] . ' ' . (int) $match[2];
        }

        return $kelas;
    }

    private function parseTanggalLahir($value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return Carbon::instance(ExcelDate::excelToDateTimeObject($value));
            }

            if ($value instanceof \DateTimeInterface) {
                return Carbon::instance($value);
            }

            $value = trim((string) $value);

            if ($value === '' || $value === '0') {
                return null;
            }

            // Contoh: Bandar Lampung, 12 Mei 2008
            if (str_contains($value, ',')) {
                $parts = explode(',', $value);
                $value = trim(end($parts));
            }

            $bulanIndonesia = [
                'januari' => 'January',
                'februari' => 'February',
                'maret' => 'March',
                'april' => 'April',
                'mei' => 'May',
                'juni' => 'June',
                'juli' => 'July',
                'agustus' => 'August',
                'september' => 'September',
                'oktober' => 'October',
                'november' => 'November',
                'desember' => 'December',
            ];

            $lower = strtolower($value);

            foreach ($bulanIndonesia as $indo => $english) {
                $lower = str_replace($indo, $english, $lower);
            }

            return Carbon::parse($lower);
        } catch (\Throwable $e) {
            return null;
        }
    }
}