<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Semester;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $activeSemester = Semester::orderByDesc('id')->first();
        $totalSiswa = Siswa::count();

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

            $alphaMissing = max($totalSiswa - $recordedStudents, 0);
            $alfa = $alphaRecorded + $alphaMissing;

            return [
                'hadir' => $hadir,
                'izin' => $izin,
                'sakit' => $sakit,
                'alfa' => $alfa,
                'total' => $totalSiswa,
                'percentage' => $totalSiswa > 0
                    ? round(($hadir / $totalSiswa) * 100, 2)
                    : 0,
            ];
        };

        $weeklyAttendance = collect(range(6, 0))->map(function ($day) use ($totalSiswa, $buildDailySummary) {
            $date = Carbon::now()->subDays($day);
            $summary = $buildDailySummary($date);

            return [
                'date' => $date->format('Y-m-d'),
                'day' => $date->translatedFormat('D'),
                'label' => $date->translatedFormat('d M'),
                'hadir' => $summary['hadir'],
                'izin' => $summary['izin'],
                'sakit' => $summary['sakit'],
                'alfa' => $summary['alfa'],
                'total' => $summary['total'],
                'percentage' => $summary['percentage'],
            ];
        });

        $todaySummary = $buildDailySummary(today());

        return Inertia::render('Admin/Dashboard',  [
            'totalStudents' => Siswa::count(),
            'totalTeachers' => Guru::count(),
            'totalClasses' => Kelas::count(),
            'totalAdmins' => User::where('role', 'admin')->count(),

            'todayAttendance' => [
                'hadir' => $todaySummary['hadir'],
                'izin' => $todaySummary['izin'],
                'sakit' => $todaySummary['sakit'],
                'alfa' => $todaySummary['alfa'],
                'percentage' => $todaySummary['percentage'],
            ],
            'activeSemester' => $activeSemester,
            'weeklyAttendance' => $weeklyAttendance,

            'liveAttendances' => Attendance::with(['siswa.user', 'kelas', 'rfidReader'])
                ->latest('waktu_absen')
                ->limit(30)
                ->get(),
        ]);
    }
}
