<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Siswa;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $totalSiswa     = Siswa::count();
        $activeSemester = Semester::where('is_active', true)->first();

        $weeklyAttendance = collect(range(6, 0))->map(function ($day) use ($totalSiswa) {
            $date    = Carbon::now()->subDays($day);
            $summary = AttendanceService::buildDailySummary($date, $totalSiswa);

            return [
                'date'       => $date->format('Y-m-d'),
                'day'        => $date->translatedFormat('D'),
                'label'      => $date->translatedFormat('d M'),
                'hadir'      => $summary['hadir'],
                'izin'       => $summary['izin'],
                'sakit'      => $summary['sakit'],
                'alfa'       => $summary['alfa'],
                'percentage' => $summary['percentage'],
            ];
        });

        return Inertia::render('Home', [
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'totalGuru'  => Guru::count(),
                'totalKelas' => Kelas::count(),
            ],
            'activeSemester'   => $activeSemester,
            'weeklyAttendance' => $weeklyAttendance,
        ]);
    }
}