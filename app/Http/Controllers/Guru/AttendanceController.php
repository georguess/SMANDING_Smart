<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Kelas;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $guru = auth()->user()->guru;

        if (!$guru) {
            abort(403, 'Data guru tidak ditemukan untuk akun ini.');
        }

        $kelasWali = Kelas::where('guru_id', $guru->id)
            ->orderBy('nama_kelas')
            ->get()
            ->map(function ($kelas) {
                return [
                    'id' => $kelas->id,
                    'nama_kelas' => $kelas->nama_kelas,
                    'tahun_ajaran' => $kelas->tahun_ajaran,
                    'jumlah_siswa' => $kelas->siswas()->count(),
                    'absensi_hari_ini' => Attendance::where('kelas_id', $kelas->id)
                        ->whereDate('waktu_absen', today())
                        ->count(),
                ];
            });

        return Inertia::render('Guru/Attendances/Index', [
            'kelasWali' => $kelasWali,
        ]);
    }

    public function classAttendance(Request $request, Kelas $kelas)
    {
        $guru = auth()->user()->guru;

        if (!$guru) {
            abort(403, 'Data guru tidak ditemukan untuk akun ini.');
        }

        if ($kelas->guru_id !== $guru->id) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        $search = $request->input('search');
        $status = $request->input('status');
        $bulan = $request->input('bulan', now()->month);
        $tahun = $request->input('tahun', now()->year);
        $semesterId = $request->input('semester_id');

        $query = Attendance::with(['siswa', 'kelas', 'semester'])
            ->where('kelas_id', $kelas->id)
            ->whereMonth('waktu_absen', $bulan)
            ->whereYear('waktu_absen', $tahun);

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->whereHas('siswa', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        $attendances = $query
            ->latest('waktu_absen')
            ->paginate(10)
            ->withQueryString();

        $summary = [
            'hadir' => Attendance::where('kelas_id', $kelas->id)
                ->whereMonth('waktu_absen', $bulan)
                ->whereYear('waktu_absen', $tahun)
                ->where('status', 'hadir')
                ->count(),

            'izin' => Attendance::where('kelas_id', $kelas->id)
                ->whereMonth('waktu_absen', $bulan)
                ->whereYear('waktu_absen', $tahun)
                ->where('status', 'izin')
                ->count(),

            'sakit' => Attendance::where('kelas_id', $kelas->id)
                ->whereMonth('waktu_absen', $bulan)
                ->whereYear('waktu_absen', $tahun)
                ->where('status', 'sakit')
                ->count(),

            'alfa' => Attendance::where('kelas_id', $kelas->id)
                ->whereMonth('waktu_absen', $bulan)
                ->whereYear('waktu_absen', $tahun)
                ->where('status', 'alfa')
                ->count(),
        ];

        $semesters = Semester::orderBy('id', 'desc')->get();

        return Inertia::render('Guru/Attendances/ClassAttendance', [
            'kelas' => $kelas,
            'attendances' => $attendances,
            'semesters' => $semesters,
            'summary' => $summary,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'bulan' => $bulan,
                'tahun' => $tahun,
                'semester_id' => $semesterId,
            ],
        ]);
    }

    public function updateStatus(Request $request, Attendance $attendance)
    {
        $request->validate([
            'status' => ['required', 'in:hadir,izin,sakit,alfa'],
        ]);

        $guru = auth()->user()->guru;

        if (!$guru) {
            abort(403, 'Data guru tidak ditemukan untuk akun ini.');
        }

        $kelasIds = Kelas::where('guru_id', $guru->id)->pluck('id');

        if (!$kelasIds->contains($attendance->kelas_id)) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah absensi ini.');
        }

        $attendance->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Status absensi berhasil diperbarui.');
    }

    public function exportCsv(Request $request, Kelas $kelas)
    {
        $guru = auth()->user()->guru;

        if (!$guru) {
            abort(403, 'Data guru tidak ditemukan untuk akun ini.');
        }

        if ($kelas->guru_id !== $guru->id) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        $search = $request->input('search');
        $status = $request->input('status');
        $bulan = $request->input('bulan', now()->month);
        $tahun = $request->input('tahun', now()->year);
        $semesterId = $request->input('semester_id');

        $query = Attendance::with(['siswa', 'kelas', 'semester'])
            ->where('kelas_id', $kelas->id)
            ->whereMonth('waktu_absen', $bulan)
            ->whereYear('waktu_absen', $tahun);

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->whereHas('siswa', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        $attendances = $query->orderBy('waktu_absen')->get();

        $fileName = 'absensi_' .
            str_replace(' ', '_', strtolower($kelas->nama_kelas)) .
            '_' . $bulan .
            '_' . $tahun .
            '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        $callback = function () use ($attendances) {
            $file = fopen('php://output', 'w');

            // Supaya Excel membaca UTF-8 dan delimiter titik koma
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputs($file, "sep=;\n");

            fputcsv($file, [
                'No',
                'Nama Siswa',
                'NIS',
                'Kelas',
                'Tanggal Absensi',
                'Status',
                'Foto',
            ], ';');

            foreach ($attendances as $index => $attendance) {
                fputcsv($file, [
                    $index + 1,
                    $attendance->siswa?->nama ?? '-',
                    $attendance->siswa?->nis ?? '-',
                    $attendance->kelas?->nama_kelas ?? '-',
                    $attendance->waktu_absen
                        ? Carbon::parse($attendance->waktu_absen)->format('d/m/Y H:i')
                        : '-',
                    ucfirst($attendance->status),
                    $attendance->foto ?? '-',
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}