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

            $total = $hadir + $izin + $sakit + $alfa;

            return [
                'date' => $date->format('Y-m-d'),
                'day' => $date->translatedFormat('D'),
                'label' => $date->translatedFormat('d M'),
                'hadir' => $hadir,
                'izin' => $izin,
                'sakit' => $sakit,
                'alfa' => $alfa,
                'total' => $total,
                'percentage' => $totalSiswa > 0
                    ? round(($hadir / $totalSiswa) * 100, 2)
                    : 0,
            ];
        });

        return Inertia::render('Admin/Dashboard',  [
            'totalStudents' => Siswa::count(),
            'totalTeachers' => Guru::count(),
            'totalClasses' => Kelas::count(),
            'totalAdmins' => User::where('role', 'admin')->count(),

            'todayAttendance' => [
                'hadir' => Attendance::whereDate('waktu_absen', today())
                    ->where('status', 'hadir')
                    ->count(),

                'izin' => Attendance::whereDate('waktu_absen', today())
                    ->where('status', 'izin')
                    ->count(),

                'sakit' => Attendance::whereDate('waktu_absen', today())
                    ->where('status', 'sakit')
                    ->count(),

                'alfa' => Attendance::whereDate('waktu_absen', today())
                    ->where('status', 'alfa')
                    ->count(),
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
