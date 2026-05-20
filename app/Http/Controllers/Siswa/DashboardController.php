<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Attendance;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $siswa = $user->siswa;
        
        if (!$siswa) {
            abort(404, "Data siswa tidak ditemukan untuk akun ini.");
        }

        // Ambil data absensi 1 minggu terakhir untuk Siswa
        $weeklyAttendance = collect(range(6, 0))->map(function ($day) use ($siswa) {
            $date = Carbon::now()->subDays($day);

            $hadir = Attendance::where('siswa_id', $siswa->id)
                ->whereDate('waktu_absen', $date)
                ->where('status', 'hadir')
                ->count();

            $izin = Attendance::where('siswa_id', $siswa->id)
                ->whereDate('waktu_absen', $date)
                ->where('status', 'izin')
                ->count();

            $sakit = Attendance::where('siswa_id', $siswa->id)
                ->whereDate('waktu_absen', $date)
                ->where('status', 'sakit')
                ->count();

            $alfa = Attendance::where('siswa_id', $siswa->id)
                ->whereDate('waktu_absen', $date)
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
                'percentage' => $hadir > 0 ? 100 : 0,
            ];
        });

        // Ambil riwayat absen lengkap descending (7 hari) untuk table jika mau
        $sepekanLalu = Carbon::today()->subDays(7);
        $attendances = $siswa->attendances()
            ->with("kelas")
            ->where("waktu_absen", ">=", $sepekanLalu)
            ->orderBy("waktu_absen", "desc")
            ->get();
            
        // Hitung total hadir selama sepekan
        $hadirCount = $attendances->where("status", "hadir")->count();
        
        return Inertia::render("Siswa/Dashboard", [
            "siswa" => $siswa,
            "attendances" => $attendances,
            "weeklyAttendance" => $weeklyAttendance,
            "stats" => [
                "total_hadir" => $hadirCount,
                "total_hari" => $attendances->count(),
            ]
        ]);
    }
}

