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

            // Buat base query untuk 1 siswa pada tanggal ini
            $dateQuery = Attendance::where('siswa_id', $siswa->id)
                ->whereDate('waktu_absen', $date);

            $hadir = (clone $dateQuery)->where('status', 'hadir')->count();
            $izin = (clone $dateQuery)->where('status', 'izin')->count();
            $sakit = (clone $dateQuery)->where('status', 'sakit')->count();
            $alfaTercatat = (clone $dateQuery)->where('status', 'alfa')->count();

            // Hitung apakah hari ini siswa tersebut ada history absen (Hadir/Sakit/Izin/Alfa Manual)
            $recorded = $hadir + $izin + $sakit + $alfaTercatat;
            
            // Jika tidak ada history sama sekali (0), maka dia Alfa
            $alfaTidakTap = max(1 - $recorded, 0);
            $alfa = $alfaTercatat + $alfaTidakTap;

            return [
                'date' => $date->format('Y-m-d'),
                'day' => $date->translatedFormat('D'),
                'label' => $date->translatedFormat('d M'),
                'hadir' => $hadir,
                'izin' => $izin,
                'sakit' => $sakit,
                'alfa' => $alfa,
                'total' => 1,
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

