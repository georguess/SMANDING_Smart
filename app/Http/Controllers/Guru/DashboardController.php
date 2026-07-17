<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Services\AttendanceService;
use Carbon\Carbon;
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

        $kelasIds   = Kelas::where('guru_id', $guru->id)->pluck('id');
        $totalKelas = $kelasIds->count();
        $totalSiswa = Siswa::whereIn('kelas_id', $kelasIds)->count();

        $kelasIdsArray = $kelasIds->toArray();

        // Ringkasan hari ini menggunakan service
        $todaySummary = AttendanceService::buildDailySummary(
            today(), $totalSiswa, $kelasIdsArray
        );

        // Total record absensi hari ini (masuk + pulang)
        $absensiHariIni = Attendance::whereIn('kelas_id', $kelasIds)
            ->where('tanggal', today()->toDateString())
            ->count();

        $persentaseHadir = $todaySummary['percentage'];

        // Daftar kelas perwalian
        $kelasWali = Kelas::where('guru_id', $guru->id)
            ->withCount(['siswas as jumlah_siswa'])
            ->withCount(['attendances as absensi_hari_ini' => function ($query) {
                $query->where('tanggal', today()->toDateString());
            }])
            ->orderBy('nama_kelas')
            ->get()
            ->map(function ($kelas) {
                return [
                    'id'                => $kelas->id,
                    'nama_kelas'        => $kelas->nama_kelas,
                    'tahun_ajaran'      => $kelas->tahun_ajaran,
                    'jumlah_siswa'      => $kelas->jumlah_siswa ?? 0,
                    'absensi_hari_ini'  => $kelas->absensi_hari_ini ?? 0,
                ];
            });

        // Grafik 7 hari terakhir
        $weeklyAttendance = collect(range(6, 0))->map(function ($day) use ($kelasIdsArray, $totalSiswa) {
            $date    = Carbon::now()->subDays($day);
            $summary = AttendanceService::buildDailySummary($date, $totalSiswa, $kelasIdsArray);

            return [
                'tanggal'    => $date->format('Y-m-d'),
                'label'      => $date->format('d M'),
                'hadir'      => $summary['hadir'],
                'izin'       => $summary['izin'],
                'sakit'      => $summary['sakit'],
                'alfa'       => $summary['alfa'],
                'total'      => $summary['total'],
            ];
        });

        // 30 absensi terbaru
        $latestAttendances = Attendance::with(['siswa', 'kelas'])
            ->whereIn('kelas_id', $kelasIds)
            ->latest('waktu_absen')
            ->limit(30)
            ->get()
            ->map(function ($attendance) {
                return [
                    'id'          => $attendance->id,
                    'nama_siswa'  => $attendance->siswa?->nama ?? '-',
                    'kelas'       => $attendance->kelas?->nama_kelas ?? '-',
                    'tipe'        => $attendance->tipe,
                    'status'      => $attendance->status,
                    'waktu_absen' => $attendance->waktu_absen
                        ? $attendance->waktu_absen->format('d M Y H:i')
                        : '-',
                    'foto'        => $attendance->foto,
                ];
            });

        return Inertia::render('Guru/Dashboard', [
            'summary' => [
                'total_kelas'       => $totalKelas,
                'total_siswa'       => $totalSiswa,
                'absensi_hari_ini'  => $absensiHariIni,
                'hadir_hari_ini'    => $todaySummary['hadir'],
                'izin_hari_ini'     => $todaySummary['izin'],
                'sakit_hari_ini'    => $todaySummary['sakit'],
                'alfa_hari_ini'     => $todaySummary['alfa'],
                'persentase_hadir'  => $persentaseHadir,
            ],
            'kelasWali'         => $kelasWali,
            'weeklyAttendance'  => $weeklyAttendance,
            'latestAttendances' => $latestAttendances,
        ]);
    }
}