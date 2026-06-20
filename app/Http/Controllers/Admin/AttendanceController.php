<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Kelas;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $classes = Kelas::with(['waliKelas', 'semester'])
            ->withCount('siswas')
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $activeSemester = Semester::where('is_active', true)->first();

        return Inertia::render('Admin/Attendances/Index', [
            'classes' => $classes,
            'activeSemester' => $activeSemester,
        ]);
    }

    public function classAttendance(Request $request, Kelas $kelas)
    {
        $kelas->load(['waliKelas', 'semester']);
        $kelas->loadCount('siswas');

        $activeSemester = Semester::where('is_active', true)->first();

        $month = $request->input('month');
        $year = $request->input('year', now()->year);
        $status = $request->input('status');

        $baseQuery = Attendance::query()
        ->where('attendances.kelas_id', $kelas->id)
        ->when($activeSemester, function ($query) use ($activeSemester) {
            $query->where('attendances.semester_id', $activeSemester->id);
        })
        ->when($month, function ($query) use ($month) {
            $query->whereMonth('attendances.waktu_absen', $month);
        })
        ->when($year, function ($query) use ($year) {
            $query->whereYear('attendances.waktu_absen', $year);
        });

        $statusCounts = [
            'hadir' => (clone $baseQuery)
                ->where('attendances.status', 'hadir')
                ->count(),

            'izin' => (clone $baseQuery)
                ->where('attendances.status', 'izin')
                ->count(),

            'sakit' => (clone $baseQuery)
                ->where('attendances.status', 'sakit')
                ->count(),

            'alfa' => (clone $baseQuery)
                ->where('attendances.status', 'alfa')
                ->count(),
        ];

        $attendances = (clone $baseQuery)
            ->select('attendances.*')
            ->join('siswas', 'attendances.siswa_id', '=', 'siswas.id')
            ->with([
                'siswa.user',
                'kelas.semester',
                'semester',
                'rfidReader',
            ])
            ->when($status, function ($query) use ($status) {
                $query->where('attendances.status', $status);
            })
            ->orderBy('siswas.nama', 'asc')
            ->orderBy('attendances.waktu_absen', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Attendances/ClassAttendance', [
            'classData' => $kelas,
            'activeSemester' => $activeSemester,
            'attendances' => $attendances,
            'statusCounts' => $statusCounts,
            'filters' => [
                'month' => $month,
                'year' => $year,
                'status' => $status,
            ],
        ]);
    }

    public function updateStatus(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['hadir', 'izin', 'sakit', 'alfa'])],
        ]);

        $attendance->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Status absensi berhasil diperbarui.');
    }
}