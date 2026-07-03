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
        $activeSemester = Semester::orderByDesc('id')->first();

        $buildDailySummary = function (Carbon $date) use ($totalSiswa) {
            $dateQuery = Attendance::whereDate('waktu_absen', $date);

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

            $alphaRecorded = (clone $dateQuery)
                ->where('status', 'alfa')
                ->distinct('siswa_id')
                ->count('siswa_id');

            $recordedStudents = (clone $dateQuery)
                ->distinct('siswa_id')
                ->count('siswa_id');

            // Hitung siswa yang tidak tap sama sekali sebagai Alfa
            $alphaMissing = max($totalSiswa - $recordedStudents, 0);
            $alfa = $alphaRecorded + $alphaMissing;

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
        };

        $weeklyAttendance = collect(range(6, 0))->map(function ($day) use ($buildDailySummary) {
            $date = Carbon::now()->subDays($day);
            return $buildDailySummary($date);
        });

        return Inertia::render('Home', [
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'totalGuru' => Guru::count(),
                'totalKelas' => Kelas::count(),
            ],
            'activeSemester' => $activeSemester,
            'weeklyAttendance' => $weeklyAttendance,
        ]);
    }
}