<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SemesterController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $semesters = Semester::withCount('attendances')
            ->when($search, function ($query) use ($search) {
                $query->where('semester', 'like', "%{$search}%")
                    ->orWhere('tahun_akademik', 'like', "%{$search}%");
            })
            ->orderByDesc('is_active')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Semesters/Index', [
            'semesters' => $semesters,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Semesters/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'semester' => [
                'required',
                'string',
                'max:20',
                Rule::in(['Ganjil', 'Genap']),
                Rule::unique('semesters', 'semester')
                    ->where(function ($query) use ($request) {
                        return $query->where('tahun_akademik', $request->tahun_akademik);
                    }),
            ],
            'tahun_akademik' => [
                'required',
                'string',
                'max:20',
            ],
            'is_active' => [
                'required',
                'in:0,1',
            ],
        ], [
            'semester.required' => 'Semester wajib dipilih.',
            'semester.in' => 'Semester hanya boleh Ganjil atau Genap.',
            'semester.unique' => 'Semester tersebut sudah ada pada tahun akademik yang sama.',
            'tahun_akademik.required' => 'Tahun akademik wajib diisi.',
        ]);

        DB::transaction(function () use ($validated) {
            if ($validated['is_active'] === '1') {
                Semester::query()->update([
                    'is_active' => false,
                ]);
            }

            Semester::create([
                'semester' => $validated['semester'],
                'tahun_akademik' => $validated['tahun_akademik'],
                'is_active' => $validated['is_active'] === '1',
            ]);
        });

        return redirect()
            ->route('admin.semesters.index')
            ->with('success', 'Data semester berhasil ditambahkan.');
    }

    public function edit(Semester $semester)
    {
        return Inertia::render('Admin/Semesters/Edit', [
            'semesterData' => $semester,
        ]);
    }

    public function update(Request $request, Semester $semester)
    {
        $validated = $request->validate([
            'semester' => [
                'required',
                'string',
                'max:20',
                Rule::in(['Ganjil', 'Genap']),
            ],
            'tahun_akademik' => [
                'required',
                'string',
                'max:20',
            ],
            'is_active' => [
                'required',
                'in:0,1',
            ],
        ], [
            'semester.in' => 'Nilai semester harus Ganjil atau Genap',
        ]);

        DB::transaction(function () use ($validated, $semester) {
            if ($validated['is_active'] === '1') {
                Semester::where('id', '!=', $semester->id)->update([
                    'is_active' => false,
                ]);
            }

            $semester->update([
                'semester' => $validated['semester'],
                'tahun_akademik' => $validated['tahun_akademik'],
                'is_active' => $validated['is_active'] === '1',
            ]);
        });

        return redirect()
            ->route('admin.semesters.index')
            ->with('success', 'Data semester berhasil diperbarui.');
    }

    public function destroy(Semester $semester)
    {
        if ($semester->attendances()->exists()) {
            return back()->with('error', 'Semester tidak bisa dihapus karena sudah digunakan pada data absensi.');
        }

        $semester->delete();

        return redirect()
            ->route('admin.semesters.index')
            ->with('success', 'Data semester berhasil dihapus.');
    }

    public function setActive(Semester $semester)
    {
        DB::transaction(function () use ($semester) {
            Semester::query()->update([
                'is_active' => false,
            ]);

            $semester->update([
                'is_active' => true,
            ]);
        });

        return back()->with('success', 'Semester aktif berhasil diperbarui.');
    }
}