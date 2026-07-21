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
                    'id'               => $kelas->id,
                    'nama_kelas'       => $kelas->nama_kelas,
                    'tahun_ajaran'     => $kelas->tahun_ajaran,
                    'jumlah_siswa'     => $kelas->siswas()->count(),
                    'absensi_hari_ini' => Attendance::where('kelas_id', $kelas->id)
                        ->where('tanggal', today()->toDateString())
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

        $search     = $request->input('search');
        $status     = $request->input('status');
        $tipe       = $request->input('tipe');
        $bulan      = $request->input('bulan', now()->month);
        $tahun      = $request->input('tahun', now()->year);
        $semesterId = $request->input('semester_id');

        $query = Attendance::with(['siswa', 'kelas', 'semester'])
            ->where('kelas_id', $kelas->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        if ($request->filled('student_id')) {
            $query->where('siswa_id', $request->input('student_id'));
        }

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($tipe) {
            $query->where('tipe', $tipe);
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

        $baseCount = Attendance::where('kelas_id', $kelas->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        $summary = [
            'hadir' => (clone $baseCount)->where('status', 'hadir')->count(),
            'izin'  => (clone $baseCount)->where('status', 'izin')->count(),
            'sakit' => (clone $baseCount)->where('status', 'sakit')->count(),
            'alfa'  => (clone $baseCount)->where('status', 'alfa')->count(),
        ];

        $semesters = Semester::orderBy('id', 'desc')->get();

        $props = [
            'kelas'       => $kelas,
            'attendances' => $attendances,
            'semesters'   => $semesters,
            'summary'     => $summary,
            'filters'     => [
                'search'      => $search,
                'status'      => $status,
                'tipe'        => $tipe,
                'bulan'       => $bulan,
                'tahun'       => $tahun,
                'semester_id' => $semesterId,
            ],
        ];

        // Default to weekly dashboard unless explicit view specified
        $view = $request->input('view', 'weekly');

        // If weekly view requested, build weekly matrix data
        if ($view === 'weekly') {
            $month = (int) ($bulan ?: now()->month);
            $year = (int) ($tahun ?: now()->year);

            $first = \Carbon\Carbon::createFromDate($year, $month, 1)->startOfMonth();
            $last = \Carbon\Carbon::createFromDate($year, $month, 1)->endOfMonth();

            // build weeks starting Monday, each week contains Mon-Fri
            $cursor = $first->copy()->startOfWeek(\Carbon\Carbon::MONDAY);
            $weeks = [];

            while ($cursor->lte($last)) {
                $days = [];
                for ($i = 0; $i < 5; $i++) {
                    $d = $cursor->copy()->addDays($i);
                    $days[] = $d->copy();
                }

                $weeks[] = [
                    'start' => $cursor->copy(),
                    'days' => $days,
                ];

                $cursor->addWeek();
            }

            $students = $kelas->siswas()->orderBy('nama')->get();

            $attRecords = Attendance::where('kelas_id', $kelas->id)
                ->when($semesterId, fn($q) => $q->where('semester_id', $semesterId))
                ->whereMonth('tanggal', $month)
                ->whereYear('tanggal', $year)
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
                        // only include if day in the same month
                        if ($day->month !== $month) {
                            $weekRow[] = null;
                            continue;
                        }

                        $key = $stu->id . '|' . $day->toDateString();
                        $status = null;
                        if (isset($attRecords[$key])) {
                            $group = $attRecords[$key];
                            $manual = $group->firstWhere('is_manual', true);
                            if ($manual) {
                                $status = $manual->status;
                            } else {
                                if ($group->where('status', 'hadir')->count() > 0) {
                                    $status = 'hadir';
                                } else {
                                    $status = $group->first()->status;
                                }
                            }
                        }

                        // future date -> null (blank)
                        if ($day->isAfter(now()->startOfDay())) {
                            $weekRow[] = null;
                        } else {
                            $weekRow[] = $status ?? 'alfa';
                        }
                    }
                    $row['weeks'][] = $weekRow;
                }
                $matrix[] = $row;
            }

            $props['weeklyMatrix'] = [
                'weeks' => array_map(function ($w) { return array_map(fn($d) => $d->toDateString(), $w['days']); }, $weeks),
                'matrix' => $matrix,
            ];

            // optionally include student specific details if requested
            if ($request->filled('student_id')) {
                $sid = $request->input('student_id');
                $props['studentDetails'] = Attendance::with(['rfidReader', 'semester'])
                    ->where('kelas_id', $kelas->id)
                    ->where('siswa_id', $sid)
                    ->whereMonth('tanggal', $month)
                    ->whereYear('tanggal', $year)
                    ->orderByDesc('waktu_absen')
                    ->get();
            }
        }

        // If monthly matrix requested, build flat monthly matrix
        if ($view === 'monthly') {
            $month = (int) ($bulan ?: now()->month);
            $year = (int) ($tahun ?: now()->year);

            $daysInMonth = \Carbon\Carbon::createFromDate($year, $month, 1)->daysInMonth;

            $students = $kelas->siswas()->orderBy('nama')->get();

            $attRecords = Attendance::where('kelas_id', $kelas->id)
                ->when($semesterId, fn($q) => $q->where('semester_id', $semesterId))
                ->whereMonth('tanggal', $month)
                ->whereYear('tanggal', $year)
                ->get()
                ->groupBy(function ($a) {
                    return $a->siswa_id . '|' . $a->tanggal->toDateString();
                });

            $dates = [];
            for ($d = 1; $d <= $daysInMonth; $d++) $dates[] = \Carbon\Carbon::createFromDate($year, $month, $d);

            $matrix = [];
            foreach ($students as $stu) {
                $row = ['student' => $stu, 'days' => []];
                $hadir = $izin = $sakit = $alfa = 0;
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

                    if ($date->isAfter(now()->startOfDay())) {
                        $row['days'][] = null;
                    } else {
                        if (is_null($cellStatus)) $cellStatus = 'alfa';
                        $row['days'][] = $cellStatus;
                    }
                }

                $matrix[] = $row;
            }

            $props['monthlyMatrix'] = [
                'dates' => array_map(fn($d) => $d->toDateString(), $dates),
                'matrix' => $matrix,
            ];
        }

        return Inertia::render('Guru/Attendances/ClassAttendance', $props);
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
            'is_manual' => true,
        ]);

        return back()->with('success', 'Status absensi berhasil diperbarui.');
    }

    public function exportMatrix(Request $request, Kelas $kelas)
    {
        $bulan = (int) ($request->input('bulan') ?? $request->input('month') ?? now()->month);
        $tahun = (int) ($request->input('tahun') ?? $request->input('year') ?? now()->year);

        $weekIndex = $request->filled('week') ? (int) $request->input('week') : null;

        $semester = Semester::where('is_active', true)->first();

        $daysInMonth = \Carbon\Carbon::createFromDate($tahun, $bulan, 1)->daysInMonth;

        $students = $kelas->siswas()->orderBy('nama')->get();

        $attendances = Attendance::where('kelas_id', $kelas->id)
            ->when($semester, fn($q) => $q->where('semester_id', $semester->id))
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->get()
            ->groupBy(function ($a) {
                return $a->siswa_id . '|' . $a->tanggal->toDateString();
            });

        $fileName = 'recap_' . str_replace(' ', '_', strtolower($kelas->nama_kelas)) . "_{$bulan}_{$tahun}.csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        $callback = function () use ($students, $attendances, $daysInMonth, $tahun, $bulan, $weekIndex) {
            $out = fopen('php://output', 'w');
            fprintf($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputs($out, "sep=;\n");
            // Build list of dates to include (either whole month or specific week)
            $dates = [];
            if (is_int($weekIndex)) {
                // compute week start monday of that index
                $firstOfMonth = \Carbon\Carbon::createFromDate($tahun, $bulan, 1)->startOfMonth();
                $cursor = $firstOfMonth->copy()->startOfWeek(\Carbon\Carbon::MONDAY)->addWeeks($weekIndex);
                for ($i = 0; $i < 5; $i++) {
                    $dates[] = $cursor->copy()->addDays($i);
                }
            } else {
                for ($d = 1; $d <= $daysInMonth; $d++) $dates[] = \Carbon\Carbon::createFromDate($tahun, $bulan, $d);
            }

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

                foreach ($dates as $dateObj) {
                    $dateStr = $dateObj->toDateString();
                    $key = $siswa->id . '|' . $dateStr;
                    $cellStatus = null;

                    if (isset($attendances[$key])) {
                        $group = $attendances[$key];
                        $manual = $group->firstWhere('is_manual', true);
                        if ($manual) {
                            $cellStatus = $manual->status;
                        } else {
                            if ($group->where('status', 'hadir')->count() > 0) {
                                $cellStatus = 'hadir';
                            } else {
                                $cellStatus = $group->first()->status;
                            }
                        }
                    }

                    if ($dateObj->isAfter(now()->startOfDay())) {
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

    public function exportCsv(Request $request, Kelas $kelas)
    {
        $guru = auth()->user()->guru;

        if (!$guru) {
            abort(403, 'Data guru tidak ditemukan untuk akun ini.');
        }

        if ($kelas->guru_id !== $guru->id) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        $search     = $request->input('search');
        $status     = $request->input('status');
        $tipe       = $request->input('tipe');
        $bulan      = $request->input('bulan', now()->month);
        $tahun      = $request->input('tahun', now()->year);
        $semesterId = $request->input('semester_id');

        $query = Attendance::with(['siswa', 'kelas', 'semester'])
            ->where('kelas_id', $kelas->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($tipe) {
            $query->where('tipe', $tipe);
        }

        if ($search) {
            $query->whereHas('siswa', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        $attendances = $query->orderBy('tanggal')->orderBy('tipe')->get();

        $fileName = 'absensi_'
            . str_replace(' ', '_', strtolower($kelas->nama_kelas))
            . '_' . $bulan
            . '_' . $tahun
            . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        $callback = function () use ($attendances) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputs($file, "sep=;\n");

            fputcsv($file, [
                'No', 'Nama Siswa', 'NIS', 'Kelas',
                'Tanggal', 'Sesi', 'Jam Absen', 'Status', 'Foto',
            ], ';');

            foreach ($attendances as $index => $attendance) {
                fputcsv($file, [
                    $index + 1,
                    $attendance->siswa?->nama ?? '-',
                    $attendance->siswa?->nis ?? '-',
                    $attendance->kelas?->nama_kelas ?? '-',
                    $attendance->tanggal
                        ? $attendance->tanggal->format('d/m/Y')
                        : '-',
                    ucfirst($attendance->tipe),
                    $attendance->waktu_absen
                        ? Carbon::parse($attendance->waktu_absen)->format('H:i')
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