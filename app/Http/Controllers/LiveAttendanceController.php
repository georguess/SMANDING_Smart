<?php

namespace App\Http\Controllers;

use App\Models\Attendance;

class LiveAttendanceController extends Controller
{
    public function latest()
    {
        $attendances = Attendance::with(['siswa.kelas', 'rfidReader', 'semester'])
            ->orderByDesc('waktu_absen', 'asc')
            ->limit(30)
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'nama' => $attendance->siswa?->nama,
                    'nis' => $attendance->siswa?->nis,
                    'kelas' => $attendance->siswa?->kelas?->nama_kelas,
                    // 'semester' => $attendance->semester?->semester
                    //     ?? $attendance->semester?->semester
                    //     ?? '-',
                    // 'tahun_ajaran' => $attendance->semester?->tahun_akademik
                    //     ?? $attendance->semester?->tahun_akademik
                    //     ?? '-',
                    'reader' => $attendance->rfidReader?->lokasi,
                    'waktu_absen' => $attendance->waktu_absen,
                    'status' => $attendance->status,
                    'foto' => $attendance->foto
                        ? asset('storage/' . $attendance->foto)
                        : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $attendances,
        ]);
    }
}