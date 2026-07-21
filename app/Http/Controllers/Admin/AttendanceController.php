<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Kelas;
use App\Models\Semester;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
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
            'classes'        => $classes,
            'activeSemester' => $activeSemester,
        ]);
    }

    public function classAttendance(Request $request, Kelas $kelas)
    {
        $kelas->load(['waliKelas', 'semester']);
        $kelas->loadCount('siswas');

        $activeSemester = Semester::where('is_active', true)->first();

        $month  = $request->input('month');
        $year   = $request->input('year', now()->year);
        $status = $request->input('status');
        $tipe   = $request->input('tipe'); // filter baru: masuk / pulang

        $baseQuery = Attendance::query()
            ->where('attendances.kelas_id', $kelas->id)
            ->when($activeSemester, function ($query) use ($activeSemester) {
                $query->where('attendances.semester_id', $activeSemester->id);
            })
            ->when($month, function ($query) use ($month) {
                $query->whereMonth('attendances.tanggal', $month);
            })
            ->when($year, function ($query) use ($year) {
                $query->whereYear('attendances.tanggal', $year);
            })
            ->when($tipe, function ($query) use ($tipe) {
                $query->where('attendances.tipe', $tipe);
            });

        if ($request->filled('student_id')) {
            $baseQuery->where('attendances.siswa_id', $request->input('student_id'));
        }

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
            ->orderBy('attendances.tanggal', 'desc')
            ->orderBy('attendances.tipe', 'asc')
            ->paginate(15)
            ->withQueryString();

        $props = [
            'classData'      => $kelas,
            'activeSemester' => $activeSemester,
            'attendances'    => $attendances,
            'statusCounts'   => $statusCounts,
            'filters'        => [
                'month'  => $month,
                'year'   => $year,
                'status' => $status,
                'tipe'   => $tipe,
            ],
        ];

        $view = $request->input('view', 'weekly');

        if ($view === 'weekly') {
            $m = (int) ($month ?: now()->month);
            $y = (int) ($year ?: now()->year);

            $first = \Carbon\Carbon::createFromDate($y, $m, 1)->startOfMonth();
            $last = \Carbon\Carbon::createFromDate($y, $m, 1)->endOfMonth();

            $cursor = $first->copy()->startOfWeek(\Carbon\Carbon::MONDAY);
            $weeks = [];

            while ($cursor->lte($last)) {
                $days = [];
                for ($i = 0; $i < 5; $i++) {
                    $days[] = $cursor->copy()->addDays($i);
                }

                $weeks[] = ['start' => $cursor->copy(), 'days' => $days];
                $cursor->addWeek();
            }

            $students = $kelas->siswas()->orderBy('nama')->get();

            $attRecords = Attendance::where('kelas_id', $kelas->id)
                ->when($activeSemester, fn($q) => $q->where('semester_id', $activeSemester->id))
                ->whereMonth('tanggal', $m)
                ->whereYear('tanggal', $y)
                ->get()
                ->groupBy(function ($a) {
                    return $a->siswa_id . '|' . $a->tanggal->toDateString();
                });

            $matrix = [];
            foreach ($students as $stu) {
                $row = ['student' => $stu, 'weeks' => []];
                foreach ($weeks as $w) {
                    $weekRow = [];
                    foreach ($w['days'] as $day) {
                        if ($day->month !== $m) { $weekRow[] = null; continue; }
                        $key = $stu->id . '|' . $day->toDateString();
                        $status = null;
                        if (isset($attRecords[$key])) {
                            $group = $attRecords[$key];
                            $manual = $group->firstWhere('is_manual', true);
                            if ($manual) $status = $manual->status;
                            else if ($group->where('status', 'hadir')->count() > 0) $status = 'hadir';
                            else $status = $group->first()->status;
                        }
                        if ($day->isAfter(now()->startOfDay())) $weekRow[] = null;
                        else $weekRow[] = $status ?? 'alfa';
                    }
                    $row['weeks'][] = $weekRow;
                }
                $matrix[] = $row;
            }

            $props['weeklyMatrix'] = [
                'weeks' => array_map(function ($w) { return array_map(fn($d) => $d->toDateString(), $w['days']); }, $weeks),
                'matrix' => $matrix,
            ];

            if ($request->filled('student_id')) {
                $sid = $request->input('student_id');
                $props['studentDetails'] = Attendance::with(['rfidReader', 'semester'])
                    ->where('kelas_id', $kelas->id)
                    ->where('siswa_id', $sid)
                    ->whereMonth('tanggal', $m)
                    ->whereYear('tanggal', $y)
                    ->orderByDesc('waktu_absen')
                    ->get();
            }
        }

        // monthly matrix view
        if ($view === 'monthly') {
            $m = (int) ($month ?: now()->month);
            $y = (int) ($year ?: now()->year);

            $daysInMonth = \Carbon\Carbon::createFromDate($y, $m, 1)->daysInMonth;
            $students = $kelas->siswas()->orderBy('nama')->get();

            $attRecords = Attendance::where('kelas_id', $kelas->id)
                ->when($activeSemester, fn($q) => $q->where('semester_id', $activeSemester->id))
                ->whereMonth('tanggal', $m)
                ->whereYear('tanggal', $y)
                ->get()
                ->groupBy(function ($a) {
                    return $a->siswa_id . '|' . $a->tanggal->toDateString();
                });

            $dates = [];
            for ($d = 1; $d <= $daysInMonth; $d++) $dates[] = \Carbon\Carbon::createFromDate($y, $m, $d);

            $matrix = [];
            foreach ($students as $stu) {
                $row = ['student' => $stu, 'days' => []];
                foreach ($dates as $date) {
                    $key = $stu->id . '|' . $date->toDateString();
                    $cellStatus = null;
                    if (isset($attRecords[$key])) {
                        $group = $attRecords[$key];
                        $manual = $group->firstWhere('is_manual', true);
                        if ($manual) $cellStatus = $manual->status;
                        else if ($group->where('status', 'hadir')->count() > 0) $cellStatus = 'hadir';
                        else $cellStatus = $group->first()->status;
                    }

                    if ($date->isAfter(now()->startOfDay())) $row['days'][] = null;
                    else $row['days'][] = $cellStatus ?? 'alfa';
                }
                $matrix[] = $row;
            }

            $props['monthlyMatrix'] = [
                'dates' => array_map(fn($d) => $d->toDateString(), $dates),
                'matrix' => $matrix,
            ];
        }

        return Inertia::render('Admin/Attendances/ClassAttendance', $props);
    }

    public function updateStatus(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['hadir', 'izin', 'sakit', 'alfa'])],
        ]);

        $attendance->update([
            'status' => $validated['status'],
            'is_manual' => true,
        ]);

        return back()->with('success', 'Status absensi berhasil diperbarui.');
    }

    public function exportMatrix(Request $request, Kelas $kelas)
    {
        $month = (int) ($request->input('month') ?? $request->input('bulan') ?? now()->month);
        $year = (int) ($request->input('year') ?? $request->input('tahun') ?? now()->year);

        $weekIndex = $request->filled('week') ? (int) $request->input('week') : null;

        $semester = Semester::where('is_active', true)->first();

        $daysInMonth = \Carbon\Carbon::createFromDate($year, $month, 1)->daysInMonth;

        $students = $kelas->siswas()->orderBy('nama')->get();

        $attendances = Attendance::where('kelas_id', $kelas->id)
            ->when($semester, fn($q) => $q->where('semester_id', $semester->id))
            ->whereMonth('tanggal', $month)
            ->whereYear('tanggal', $year)
            ->get()
            ->groupBy(function ($a) {
                return $a->siswa_id . '|' . $a->tanggal->toDateString();
            });

        $fileName = 'recap_' . str_replace(' ', '_', strtolower($kelas->nama_kelas)) . "_{$month}_{$year}.csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        $callback = function () use ($students, $attendances, $daysInMonth, $year, $month, $weekIndex) {
            $out = fopen('php://output', 'w');
            // BOM and separator
            fprintf($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputs($out, "sep=;\n");

            $dates = [];
            if (is_int($weekIndex)) {
                $firstOfMonth = \Carbon\Carbon::createFromDate($year, $month, 1)->startOfMonth();
                $cursor = $firstOfMonth->copy()->startOfWeek(\Carbon\Carbon::MONDAY)->addWeeks($weekIndex);
                for ($i = 0; $i < 5; $i++) $dates[] = $cursor->copy()->addDays($i);
            } else {
                for ($d = 1; $d <= $daysInMonth; $d++) $dates[] = \Carbon\Carbon::createFromDate($year, $month, $d);
            }

            // Header
            $header = ['No', 'Nama Siswa', 'NIS'];
            foreach ($dates as $dt) $header[] = $dt->format('d');
            $header = array_merge($header, ['Hadir', 'Izin', 'Sakit', 'Alfa']);
            fputcsv($out, $header, ';');

            foreach ($students as $i => $siswa) {
                $row = [];
                $row[] = $i + 1;
                $row[] = $siswa->nama;
                $row[] = $siswa->nis;

                $hadir = $izin = $sakit = $alfa = 0;

                foreach ($dates as $date) {
                    $dateStr = $date->toDateString();
                    $key = $siswa->id . '|' . $dateStr;
                    $cellStatus = null;

                    if (isset($attendances[$key])) {
                        $group = $attendances[$key];
                        $manual = $group->firstWhere('is_manual', true);
                        if ($manual) $cellStatus = $manual->status;
                        else if ($group->where('status', 'hadir')->count() > 0) $cellStatus = 'hadir';
                        else $cellStatus = $group->first()->status;
                    }

                    if ($date->isAfter(now()->startOfDay())) {
                        $row[] = '';
                    } else {
                        if (is_null($cellStatus)) $cellStatus = 'alfa';
                        $label = strtoupper(substr($cellStatus ?? 'alfa', 0, 1));
                        $row[] = $label;

                        if ($cellStatus === 'hadir') $hadir++;
                        if ($cellStatus === 'izin') $izin++;
                        if ($cellStatus === 'sakit') $sakit++;
                        if ($cellStatus === 'alfa') $alfa++;
                    }
                }

                $row[] = $hadir;
                $row[] = $izin;
                $row[] = $sakit;
                $row[] = $alfa;

                fputcsv($out, $row, ';');
            }

            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }
}