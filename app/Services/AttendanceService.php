<?php

namespace App\Services;

use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceService
{
    /**
     * Logika status harian per siswa (prioritas):
     *   1. Ada record 'izin'  → izin
     *   2. Ada record 'sakit' → sakit
     *   3. Masuk=hadir DAN Pulang=hadir → hadir
     *   4. Sisanya → alfa
     */
    public static function buildDailySummary(
        Carbon $date,
        int $totalSiswa,
        ?array $kelasIds = null
    ): array {
        // 1 query saja per hari — ambil semua record, olah di PHP
        $query = Attendance::where('tanggal', $date->toDateString())
            ->select('siswa_id', 'tipe', 'status');

        if ($kelasIds !== null) {
            $query->whereIn('kelas_id', $kelasIds);
        }

        $records = $query->get()->groupBy('siswa_id');

        $hadir = 0;
        $izin  = 0;
        $sakit = 0;

        foreach ($records as $siswaId => $studentRecords) {
            $statuses = $studentRecords->pluck('status')->unique()->toArray();

            if (in_array('izin', $statuses)) {
                $izin++;
            } elseif (in_array('sakit', $statuses)) {
                $sakit++;
            } elseif (
                $studentRecords->contains(fn ($r) => $r->tipe === 'masuk'  && $r->status === 'hadir') &&
                $studentRecords->contains(fn ($r) => $r->tipe === 'pulang' && $r->status === 'hadir')
            ) {
                $hadir++;
            }
            // sisanya akan dihitung sebagai alfa di bawah
        }

        $alfa = max($totalSiswa - $hadir - $izin - $sakit, 0);

        return [
            'hadir'      => $hadir,
            'izin'       => $izin,
            'sakit'      => $sakit,
            'alfa'       => $alfa,
            'total'      => $totalSiswa,
            'percentage' => $totalSiswa > 0
                ? round(($hadir / $totalSiswa) * 100, 2)
                : 0,
        ];
    }

    /**
     * Detail absensi harian untuk 1 siswa.
     * Mengembalikan status per sesi (masuk/pulang) + status harian gabungan.
     * Digunakan di dashboard siswa sebagai "bukti" kehadiran.
     */
    public static function getStudentDayDetail(Carbon $date, int $siswaId): array
    {
        $records = Attendance::where('tanggal', $date->toDateString())
            ->where('siswa_id', $siswaId)
            ->select('tipe', 'status', 'waktu_absen')
            ->get();

        $masuk  = $records->firstWhere('tipe', 'masuk');
        $pulang = $records->firstWhere('tipe', 'pulang');

        // Tentukan status harian gabungan
        $statuses = $records->pluck('status')->unique()->toArray();

        if (in_array('izin', $statuses)) {
            $statusHarian = 'izin';
        } elseif (in_array('sakit', $statuses)) {
            $statusHarian = 'sakit';
        } elseif (
            $masuk && $pulang &&
            $masuk->status === 'hadir' && $pulang->status === 'hadir'
        ) {
            $statusHarian = 'hadir';
        } else {
            $statusHarian = 'alfa';
        }

        return [
            'masuk' => $masuk ? [
                'status' => $masuk->status,
                'waktu'  => $masuk->waktu_absen
                    ->setTimezone('Asia/Jakarta')
                    ->format('H:i'),
            ] : null,
            'pulang' => $pulang ? [
                'status' => $pulang->status,
                'waktu'  => $pulang->waktu_absen
                    ->setTimezone('Asia/Jakarta')
                    ->format('H:i'),
            ] : null,
            'status_harian' => $statusHarian,
        ];
    }
}