<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Siswa;
use Carbon\Carbon;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $totalSiswa = Siswa::count();

        $weeklyAttendance = collect(range(6, 0))->map(function ($day) use ($totalSiswa) {
            $date = Carbon::now()->subDays($day);

            $hadir = Attendance::whereDate('waktu_absen', $date)
                ->where('status', 'hadir')
                ->count();

            $izin = Attendance::whereDate('waktu_absen', $date)
                ->where('status', 'izin')
                ->count();

            $sakit = Attendance::whereDate('waktu_absen', $date)
                ->where('status', 'sakit')
                ->count();

            $alfa = Attendance::whereDate('waktu_absen', $date)
                ->where('status', 'alfa')
                ->count();

            return [
                'date' => $date->format('Y-m-d'),
                'day' => $date->translatedFormat('D'),
                'label' => $date->translatedFormat('d M'),
                'hadir' => $hadir,
                'izin' => $izin,
                'sakit' => $sakit,
                'alfa' => $alfa,
                'percentage' => $totalSiswa > 0
                    ? round(($hadir / $totalSiswa) * 100, 2)
                    : 0,
            ];
        });

        return Inertia::render('Home', [
            'stats' => [
                'totalSiswa' => Siswa::count(),
                'totalGuru' => Guru::count(),
                'totalKelas' => Kelas::count(),
            ],
            'activeSemester' => Semester::where('id')->first(),
            'weeklyAttendance' => $weeklyAttendance,
        ]);
    }
}