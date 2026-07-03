<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Kelas;
use App\Models\Siswa;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $guru = $user->guru;

        if (!$guru) {
            abort(403, 'Data guru tidak ditemukan untuk akun ini.');
        }

        $kelasIds = Kelas::where('guru_id', $guru->id)->pluck('id');

        $totalKelas = $kelasIds->count();

        $totalSiswa = Siswa::whereIn('kelas_id', $kelasIds)->count();

        $absensiHariIni = Attendance::whereIn('kelas_id', $kelasIds)
            ->whereDate('waktu_absen', today())
            ->count();

        $hadirHariIni = Attendance::whereIn('kelas_id', $kelasIds)
            ->whereDate('waktu_absen', today())
            ->where('status', 'hadir')
            ->count();

        $izinHariIni = Attendance::whereIn('kelas_id', $kelasIds)
            ->whereDate('waktu_absen', today())
            ->where('status', 'izin')
            ->count();

        $sakitHariIni = Attendance::whereIn('kelas_id', $kelasIds)
            ->whereDate('waktu_absen', today())
            ->where('status', 'sakit')
            ->count();

        // Hitung alfa yang masuk database (manual)
        $alfaTercatat = Attendance::whereIn('kelas_id', $kelasIds)
            ->whereDate('waktu_absen', today())
            ->where('status', 'alfa')
            ->count();

        // Hitung total siswa yang sudah absen (Hadir + Sakit + Izin + Alfa Manual)
        $siswaSudahAbsen = Attendance::whereIn('kelas_id', $kelasIds)
            ->whereDate('waktu_absen', today())
            ->distinct('siswa_id')
            ->count('siswa_id');

        // Hitung yang tidak absen sama sekali, lalu tambahkan ke Alfa
        $alfaTidakTap = max($totalSiswa - $siswaSudahAbsen, 0);
        $alfaHariIni = $alfaTercatat + $alfaTidakTap;

        $persentaseHadir = $totalSiswa > 0
            ? round(($hadirHariIni / $totalSiswa) * 100, 1)
            : 0;

        $kelasWali = Kelas::where('guru_id', $guru->id)
            ->orderBy('nama_kelas')
            ->get()
            ->map(function ($kelas) {
                return [
                    'id' => $kelas->id,
                    'nama_kelas' => $kelas->nama_kelas,
                    'tahun_ajaran' => $kelas->tahun_ajaran,
                    'jumlah_siswa' => Siswa::where('kelas_id', $kelas->id)->count(),
                ];
            });

        $weeklyAttendance = collect(range(6, 0))->map(function ($day) use ($kelasIds, $totalSiswa) {
            $date = now()->subDays($day);

            // Buat query dasar untuk kelas-kelas guru ini pada tanggal tersebut
            $dateQuery = Attendance::whereIn('kelas_id', $kelasIds)
                ->whereDate('waktu_absen', $date);

            $hadir = (clone $dateQuery)
                ->where('status', 'hadir')
                ->distinct('siswa_id')
                ->count('siswa_id');

            $izin = (clone $dateQuery)
                ->where('status', 'izin')
                ->distinct('siswa_id')
                ->count('siswa_id');

            $sakit = (clone $dateQuery)
                ->where('status', 'sakit')
                ->distinct('siswa_id')
                ->count('siswa_id');

            $alfaTercatat = (clone $dateQuery)
                ->where('status', 'alfa')
                ->distinct('siswa_id')
                ->count('siswa_id');

            // Menghitung berapa banyak siswa yang punya data absen hari itu
            $siswaSudahAbsen = (clone $dateQuery)
                ->distinct('siswa_id')
                ->count('siswa_id');

            // Siswa yang hilang/tidak tap dihitung sebagai Alfa
            $alfaTidakTap = max($totalSiswa - $siswaSudahAbsen, 0);
            $alfa = $alfaTercatat + $alfaTidakTap;

            return [
                'tanggal' => $date->format('Y-m-d'),
                'label'   => $date->format('d M'),
                'hadir'   => $hadir,
                'izin'    => $izin,
                'sakit'   => $sakit,
                'alfa'    => $alfa,
                'total'   => $totalSiswa,
            ];
        });

        $latestAttendances = Attendance::with(['siswa', 'kelas'])
            ->whereIn('kelas_id', $kelasIds)
            ->latest('waktu_absen')
            ->limit(30)
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'nama_siswa' => $attendance->siswa?->nama ?? '-',
                    'kelas' => $attendance->kelas?->nama_kelas ?? '-',
                    'status' => $attendance->status,
                    'waktu_absen' => $attendance->waktu_absen
                        ? $attendance->waktu_absen->format('d M Y H:i')
                        : '-',
                    'foto' => $attendance->foto,
                ];
            });

        return Inertia::render('Guru/Dashboard', [
            'summary' => [
                'total_kelas' => $totalKelas,
                'total_siswa' => $totalSiswa,
                'absensi_hari_ini' => $absensiHariIni,
                'hadir_hari_ini' => $hadirHariIni,
                'izin_hari_ini' => $izinHariIni,
                'sakit_hari_ini' => $sakitHariIni,
                'alfa_hari_ini' => $alfaHariIni,
                'persentase_hadir' => $persentaseHadir,
            ],
            'kelasWali' => $kelasWali,
            'weeklyAttendance' => $weeklyAttendance,
            'latestAttendances' => $latestAttendances,
        ]);
    }
}