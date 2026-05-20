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
        $classes = Kelas::with('waliKelas')
            ->withCount('siswas')
            ->orderBy('nama_kelas')
            ->get();

        return Inertia::render('Admin/Attendances/Index', [
            'classes' => $classes,
        ]);
    }

    public function classAttendance(Request $request, Kelas $kelas)
    {
        $kelas->load('waliKelas');
        $kelas->loadCount('siswas');

        $semesters = Semester::orderByDesc('id')->get();

        $semesterId = $request->input('semester_id');
        $month = $request->input('month');
        $year = $request->input('year', now()->year);
        $status = $request->input('status');

        $summaryQuery = Attendance::query()
            ->where('kelas_id', $kelas->id)
            ->when($semesterId, function ($query) use ($semesterId) {
                $query->where('semester_id', $semesterId);
            })
            ->when($month, function ($query) use ($month) {
                $query->whereMonth('waktu_absen', $month);
            })
            ->when($year, function ($query) use ($year) {
                $query->whereYear('waktu_absen', $year);
            });

        $statusCounts = [
            'hadir' => (clone $summaryQuery)->where('status', 'hadir')->count(),
            'izin' => (clone $summaryQuery)->where('status', 'izin')->count(),
            'sakit' => (clone $summaryQuery)->where('status', 'sakit')->count(),
            'alfa' => (clone $summaryQuery)->where('status', 'alfa')->count(),
        ];

        $attendances = Attendance::with([
                'siswa.user',
                'kelas',
                'semester',
                'rfidReader',
                'markedBy',
            ])
            ->where('kelas_id', $kelas->id)
            ->when($semesterId, function ($query) use ($semesterId) {
                $query->where('semester_id', $semesterId);
            })
            ->when($month, function ($query) use ($month) {
                $query->whereMonth('waktu_absen', $month);
            })
            ->when($year, function ($query) use ($year) {
                $query->whereYear('waktu_absen', $year);
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('waktu_absen', 'asc')
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