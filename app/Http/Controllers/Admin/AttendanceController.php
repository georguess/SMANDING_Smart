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
        $classes = Kelas::with('waliKelas', 'semester')
            ->withCount('siswas')
            ->orderBy('nama_kelas')
            ->get();

        return Inertia::render('Admin/Attendances/Index', [
            'classes' => $classes,
        ]);
    }

    public function classAttendance(Request $request, Kelas $kelas)
{
    $kelas->load(['waliKelas', 'semester']);
    $kelas->loadCount('siswas');

    $semesters = Semester::orderByDesc('tahun_akademik')
        ->orderBy('semester')
        ->get();

    $semesterId = $request->input('semester_id');
    $month = $request->input('month');
    $year = $request->input('year', now()->year);
    $status = $request->input('status');

    $baseQuery = Attendance::query()
        ->where('attendances.kelas_id', $kelas->id)
        ->when($semesterId, function ($query) use ($semesterId) {
            $query->where('attendances.semester_id', $semesterId);
        })
        ->when($month, function ($query) use ($month) {
            $query->whereMonth('attendances.waktu_absen', $month);
        })
        ->when($year, function ($query) use ($year) {
            $query->whereYear('attendances.waktu_absen', $year);
        });

    $statusCounts = [
        'hadir' => (clone $baseQuery)->where('attendances.status', 'hadir')->count(),
        'izin' => (clone $baseQuery)->where('attendances.status', 'izin')->count(),
        'sakit' => (clone $baseQuery)->where('attendances.status', 'sakit')->count(),
        'alfa' => (clone $baseQuery)->where('attendances.status', 'alfa')->count(),
    ];

    $attendances = (clone $baseQuery)
        ->select('attendances.*')
        ->join('siswas', 'attendances.siswa_id', '=', 'siswas.id')
        ->with([
            'siswa.user',
            'kelas',
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
        'semesters' => $semesters,
        'attendances' => $attendances,
        'statusCounts' => $statusCounts,
        'filters' => [
            'semester_id' => $semesterId,
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
            'marked_by' => auth()->id(),
        ]);

        return back()->with('success', 'Status absensi berhasil diperbarui.');
    }
}