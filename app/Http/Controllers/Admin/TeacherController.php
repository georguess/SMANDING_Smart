<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


class TeacherController extends Controller
{
    
    public function index(Request $request)
    {
        $search = $request->input('search');
        $teachers = Guru::with(['user', 'waliKelas'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nip', 'like', "%{$search}%")
                        ->orWhere('alamat', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('username', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('waliKelas', function ($kelasQuery) use ($search) {
                            $kelasQuery->where('nama_kelas', 'like', "%{$search}%")
                                ->orWhere('tahun_ajaran', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('Nama', 'asc')
            ->paginate(10)
            ->appends($request->query());
        
        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Teachers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'max:100', 'unique:users,username'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'birth_date' => ['required', 'date'],
            'photo_profile' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            'nip' => ['required', 'string', 'max:50', 'unique:gurus,nip'],
            'alamat' => ['nullable', 'string'],
            'is_active' => ['required', 'in:0,1'],
        ]);

         DB::transaction(function () use ($request, $validated) {
            $photoPath = null;

            if ($request->hasFile('photo_profile')) {
                $photoPath = $request->file('photo_profile')->store('profile/guru', 'public');
            }

            $defaultPassword = Carbon::parse($validated['birth_date'])->format('dmY');

            $user = User::create([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => Hash::make($defaultPassword),
                'role' => 'guru',
                'photo_profile' => $photoPath,
                'birth_date' => $validated['birth_date'],
                'is_active' => $validated['is_active'] === '1',
            ]);

            Guru::create([
                'user_id' => $user->id,
                'nama' => $validated['nama'],
                'nip' => $validated['nip'],
                'alamat' => $validated['alamat'] ?? null,
            ]);
        });

         return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'Data guru berhasil ditambahkan.');
    }

    
    public function edit(Guru $teacher)
    {
        $teacher->load(['user', 'waliKelas']);

        return Inertia::render('Admin/Teachers/Edit', [
            'teacher' => $teacher,
        ]);
    }

    
    public function update(Request $request, Guru $teacher)
    {
        $teacher->load('user');

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'username' => [
                'required',
                'string',
                'max:100',
                Rule::unique('users', 'username')->ignore($teacher->user_id),
            ],
            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('users', 'email')->ignore($teacher->user_id),
            ],
            'birth_date' => ['required', 'date'],
            'photo_profile' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            'nip' => [
                'required',
                'string',
                'max:50',
                Rule::unique('gurus', 'nip')->ignore($teacher->id),
            ],
            'alamat' => ['nullable', 'string'],
            'is_active' => ['required', 'in:0,1'],
        ]);

        DB::transaction(function () use ($request, $validated, $teacher) {
            $photoPath = $teacher->user?->photo_profile;

            if ($request->hasFile('photo_profile')) {
                if ($photoPath) {
                    Storage::disk('public')->delete($photoPath);
                }

                $photoPath = $request->file('photo_profile')->store('profile/guru', 'public');
            }

            $teacher->user->update([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'photo_profile' => $photoPath,
                'birth_date' => $validated['birth_date'],
                'is_active' => $validated['is_active'] === '1',
            ]);

            $teacher->update([
                'nama' => $validated['nama'],
                'nip' => $validated['nip'],
                'alamat' => $validated['alamat'] ?? null,
            ]);
        });

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'Data guru berhasil diperbarui.');
    }

    
    public function destroy(Guru $teacher)
    {
        $teacher->load(['user', 'waliKelas']);

        if ($teacher->waliKelas()->exists()) {
            return back()->with('error', 'Guru tidak bisa dihapus karena masih menjadi wali kelas.');
        }

        DB::transaction(function () use ($teacher) {
            if ($teacher->user && $teacher->user->photo_profile) {
                Storage::disk('public')->delete($teacher->user->photo_profile);
            }

            if ($teacher->user) {
                $teacher->user->delete();
            } else {
                $teacher->delete();
            }
        });

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'Data guru berhasil dihapus.');
    }

    public function resetPassword(Guru $teacher)
    {
        $teacher->load('user');

        if (!$teacher->user || !$teacher->user->birth_date) {
            return back()->with('error', 'Tanggal lahir guru belum tersedia.');
        }

        $defaultPassword = Carbon::parse($teacher->user->birth_date)->format('dmY');

        $teacher->user->update([
            'password' => Hash::make($defaultPassword),
        ]);

        return back()->with('success', 'Password guru berhasil direset ke tanggal lahir.');
    }
}
