<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $students = Siswa::with(['user', 'kelas.semester'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('username', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('kelas', function ($kelasQuery) use ($search) {
                            $kelasQuery->where('nama_kelas', 'like', "%{$search}%");
                        })
                        ->orWhereHas('kelas.semester', function ($semesterQuery) use ($search) {
                            $semesterQuery->where('semester', 'like', "%{$search}%")
                                ->orWhere('tahun_akademik', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('nama', 'asc')
            ->paginate(10)
            ->appends($request->query());

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $classes = Kelas::orderBy('nama_kelas')
        ->get(['id', 'nama_kelas', 'tahun_ajaran']);

        return Inertia::render('Admin/Students/Create', [
            'classes' => $classes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'birth_date' => ['required', 'date'],
            'photo_profile' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'nis' => ['required', 'string', 'max:30', 'unique:siswas,nis'],
            'nisn' => ['nullable', 'string', 'max:30', 'unique:siswas,nisn'],
            'alamat' => ['nullable', 'string'],
            'kelas_id' => ['required', 'exists:kelas,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $photoPath = null;

            if ($request->hasFile('photo_profile')) {
                $photoPath = $request->file('photo_profile')->store('profile/siswa', 'public');
            }

            $user = User::create([
                'username'             => $validated['nama'],
                'email'                => $validated['email'],
                'password'             => Hash::make('Smanding@26'),
                'role'                 => 'siswa',
                'photo_profile'        => $photoPath,
                'birth_date'           => $validated['birth_date'],
                'is_active'            => $validated['is_active'],
                'must_change_password' => true,
            ]);

            Siswa::create([
                'user_id'  => $user->id,
                'kelas_id' => $validated['kelas_id'],
                'nama'     => $validated['nama'],
                'nis'      => $validated['nis'],
                'nisn'     => $validated['nisn'] ?? null,
                'alamat'   => $validated['alamat'] ?? null,
            ]);
        });

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'Data siswa berhasil ditambahkan.');
    }

    public function edit(Siswa $student)
    {
        $student->load(['user', 'kelas']);

        $classes = Kelas::orderBy('nama_kelas')
        ->get(['id', 'nama_kelas', 'tahun_ajaran']);

        return Inertia::render('Admin/Students/Edit', [
            'student' => $student,
            'classes' => $classes,
        ]);
    }

    public function update(Request $request, Siswa $student)
    {
        $student->load('user');

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('users', 'email')->ignore($student->user_id),
            ],
            'birth_date' => ['required', 'date'],
            'photo_profile' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'nis' => [
                'required',
                'string',
                'max:30',
                Rule::unique('siswas', 'nis')->ignore($student->id),
            ],
            'nisn' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique('siswas', 'nisn')->ignore($student->id),
            ],
            'alamat' => ['nullable', 'string'],
            'kelas_id' => ['required', 'exists:kelas,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        DB::transaction(function () use ($request, $validated, $student) {
            $photoPath = $student->user?->photo_profile;

            if ($request->hasFile('photo_profile')) {
                if ($photoPath) {
                    Storage::disk('public')->delete($photoPath);
                }

                $photoPath = $request->file('photo_profile')->store('profile/siswa', 'public');
            }

            $student->user->update([
                'username' => $validated['nama'],
                'email' => $validated['email'],
                'photo_profile' => $photoPath,
                'birth_date' => $validated['birth_date'],
                'is_active' => $validated['is_active'],
            ]);

            $student->update([
                'kelas_id' => $validated['kelas_id'],
                'nama' => $validated['nama'],
                'nis' => $validated['nis'],
                'nisn' => $validated['nisn'] ?? null,
                'alamat' => $validated['alamat'] ?? null,
            ]);
        });

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function destroy(Siswa $student)
    {
        DB::transaction(function () use ($student) {
            $student->load('user');

            if ($student->user && $student->user->photo_profile) {
                Storage::disk('public')->delete($student->user->photo_profile);
            }

            if ($student->user) {
                $student->user->delete();
            } else {
                $student->delete();
            }
        });

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'Data siswa berhasil dihapus.');
    }

    public function resetPassword(Siswa $student)
    {
        $student->load('user');

        if (!$student->user) {
            return back()->with('error', 'Data user siswa tidak ditemukan.');
        }

        $student->user->update([
            'password'             => Hash::make('Smanding@26'),
            'must_change_password' => true,
        ]);

        return back()->with('success', 'Password siswa berhasil direset ke password default.');
    }
}