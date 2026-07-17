<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Siswa;
use App\Models\User;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeSemester = Semester::where('is_active', true)->first();
        $totalSiswa     = Siswa::count();

        // Ringkasan 7 hari terakhir (chart)
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
                'total'      => $summary['total'],
                'percentage' => $summary['percentage'],
            ];
        });

        // Ringkasan hari ini
        $todaySummary = AttendanceService::buildDailySummary(today(), $totalSiswa);

        return Inertia::render('Admin/Dashboard', [
            'totalStudents' => $totalSiswa,
            'totalTeachers' => Guru::count(),
            'totalClasses'  => Kelas::count(),
            'totalAdmins'   => User::where('role', 'admin')->count(),

            'todayAttendance' => [
                'hadir'      => $todaySummary['hadir'],
                'izin'       => $todaySummary['izin'],
                'sakit'      => $todaySummary['sakit'],
                'alfa'       => $todaySummary['alfa'],
                'percentage' => $todaySummary['percentage'],
            ],

            'activeSemester'   => $activeSemester,
            'weeklyAttendance' => $weeklyAttendance,

            'liveAttendances' => Attendance::with(['siswa.user', 'kelas', 'rfidReader'])
                ->latest('waktu_absen')
                ->limit(30)
                ->get(),
        ]);
    }
}