<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $classes = Kelas::with(['waliKelas.user', 'semester'])
            ->withCount('siswas')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_kelas', 'like', "%{$search}%")
                        ->orWhereHas('waliKelas', function ($guruQuery) use ($search) {
                            $guruQuery->where('nama', 'like', "%{$search}%")
                                ->orWhere('nip', 'like', "%{$search}%");
                        })
                        ->orWhereHas('waliKelas.user', function ($userQuery) use ($search) {
                            $userQuery->where('username', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('semester', function ($semesterQuery) use ($search) {
                            $semesterQuery->where('semester', 'like', "%{$search}%")
                                ->orWhere('tahun_akademik', 'like', "%{$search}%");
                        });
                });
            })
            ->orderByRaw("
                CASE
                    WHEN nama_kelas LIKE 'XII%' THEN 3
                    WHEN nama_kelas LIKE 'XI%' THEN 2
                    WHEN nama_kelas LIKE 'X%' THEN 1
                    ELSE 4
                END ASC
            ")
            ->orderByRaw("CAST(NULLIF(REGEXP_REPLACE(nama_kelas, '[^0-9]', ''), '') AS UNSIGNED) ASC")
            ->paginate(10)
            ->appends($request->query());

        return Inertia::render('Admin/Classes/Index', [
            'classes' => $classes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $teachers = Guru::with('user')
            ->orderBy('nama')
            ->get();

        $semesters = Semester::orderByDesc('tahun_akademik')
            ->orderBy('semester')
            ->get();

        return Inertia::render('Admin/Classes/Create', [
            'teachers' => $teachers,
            'semesters' => $semesters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => [
                'required',
                'string',
                'max:50',
                Rule::unique('kelas', 'nama_kelas')
                    ->where(fn ($query) => $query->where('tahun_ajaran', $request->tahun_ajaran)),
            ],
            'guru_id' => ['required', 'exists:gurus,id'],
            'tahun_ajaran' => ['required', 'string', 'max:20'],
        ],[
            'nama_kelas.unique' => 'Kombinasi nama kelas dan tahun akademik tersebut sudah ada',
        ]);

        Kelas::create($validated);

        return redirect()
            ->route('admin.classes.index')
            ->with('success', 'Data kelas berhasil ditambahkan.');
    }

    public function edit(Kelas $class)
    {
        $class->load(['waliKelas.user', 'semester']);

        $teachers = Guru::with('user')
            ->orderBy('nama')
            ->get();

        $semesters = Semester::orderByDesc('tahun_akademik')
            ->orderBy('semester')
            ->get();

        return Inertia::render('Admin/Classes/Edit', [
            'classData' => $class,
            'teachers' => $teachers,
            'semesters' => $semesters,
        ]);
    }

    public function update(Request $request, Kelas $class)
    {
        $validated = $request->validate([
            'nama_kelas' => [
                'required',
                'string',
                'max:50',
                Rule::unique('kelas', 'nama_kelas')
                    ->where(fn ($query) => $query->where('tahun_ajaran', $request->tahun_ajaran))
                    ->ignore($class->id),
            ],
            'guru_id' => ['required', 'exists:gurus,id'],
            'tahun_ajaran' => ['required', 'string', 'max:20'],
        ],[
            'nama_kelas.unique' => 'Kombinasi nama kelas dan tahun akademik tersebut sudah ada',
        ]);

        $class->update($validated);

        return redirect()
            ->route('admin.classes.index')
            ->with('success', 'Data kelas berhasil diperbarui.');
    }

    public function destroy(Kelas $class)
    {
        if ($class->siswas()->exists()) {
            return back()->with('error', 'Kelas tidak bisa dihapus karena masih memiliki siswa.');
        }

        if ($class->attendances()->exists()) {
            return back()->with('error', 'Kelas tidak bisa dihapus karena sudah memiliki data absensi.');
        }

        $class->delete();

        return redirect()
            ->route('admin.classes.index')
            ->with('success', 'Data kelas berhasil dihapus.');
    }
}