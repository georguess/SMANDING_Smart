<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user  = auth()->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(404, 'Data siswa tidak ditemukan untuk akun ini.');
        }

        // Data absensi 7 hari terakhir dengan detail per sesi
        $weeklyAttendance = collect(range(6, 0))->map(function ($day) use ($siswa) {
            $date   = Carbon::now()->subDays($day);
            $detail = AttendanceService::getStudentDayDetail($date, $siswa->id);

            return [
                'date'          => $date->format('Y-m-d'),
                'day'           => $date->translatedFormat('D'),
                'label'         => $date->translatedFormat('d M'),
                'masuk'         => $detail['masuk'],         // { status, waktu } atau null
                'pulang'        => $detail['pulang'],        // { status, waktu } atau null
                'status_harian' => $detail['status_harian'], // hadir / izin / sakit / alfa
                'percentage'    => $detail['status_harian'] === 'hadir' ? 100 : 0,
            ];
        });

        // Riwayat absen 7 hari terakhir untuk tabel
        $sepekanLalu = Carbon::today()->subDays(7);
        $attendances = $siswa->attendances()
            ->with('kelas')
            ->where('waktu_absen', '>=', $sepekanLalu)
            ->orderBy('waktu_absen', 'desc')
            ->get();

        // Hitung statistik
        $totalHariHadir = $weeklyAttendance->where('status_harian', 'hadir')->count();

        return Inertia::render('Siswa/Dashboard', [
            'siswa'             => $siswa,
            'attendances'       => $attendances,
            'weeklyAttendance'  => $weeklyAttendance,
            'stats'             => [
                'total_hadir' => $totalHariHadir,
                'total_hari'  => 7,
            ],
        ]);
    }
}