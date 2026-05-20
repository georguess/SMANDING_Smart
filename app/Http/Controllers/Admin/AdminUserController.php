<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $admins = Admin::with('user')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nip', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('username', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('nama', 'asc')
            ->paginate(10)
            ->appends($request->only('search'));

        return Inertia::render('Admin/Admins/Index', [
            'admins' => $admins,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Admins/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'max:100', 'unique:users,username'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'birth_date' => ['required', 'date'],
            'photo_profile' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            'nip' => ['nullable', 'string', 'max:50', 'unique:admins,nip'],
            'is_active' => ['required', 'in:0,1'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $photoPath = null;

            if ($request->hasFile('photo_profile')) {
                $photoPath = $request->file('photo_profile')->store('profile/admin', 'public');
            }

            $defaultPassword = Carbon::parse($validated['birth_date'])->format('dmY');

            $user = User::create([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => Hash::make($defaultPassword),
                'role' => 'admin',
                'birth_date' => $validated['birth_date'],
                'photo_profile' => $photoPath,
                'is_active' => $validated['is_active'] === '1',
            ]);

            Admin::create([
                'user_id' => $user->id,
                'nama' => $validated['nama'],
                'nip' => $validated['nip'] ?? null,
            ]);
        });

        return redirect()
            ->route('admin.admins.index')
            ->with('success', 'Data admin berhasil ditambahkan.');
    }

    public function edit(Admin $admin)
    {
        $admin->load('user');

        return Inertia::render('Admin/Admins/Edit', [
            'adminData' => $admin,
        ]);
    }

    public function update(Request $request, Admin $admin)
    {
        $admin->load('user');

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'username' => [
                'required',
                'string',
                'max:100',
                Rule::unique('users', 'username')->ignore($admin->user_id),
            ],
            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('users', 'email')->ignore($admin->user_id),
            ],
            'birth_date' => ['required', 'date'],
            'photo_profile' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            'nip' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('admins', 'nip')->ignore($admin->id),
            ],
            'is_active' => ['required', 'in:0,1'],
        ]);

        DB::transaction(function () use ($request, $validated, $admin) {
            $photoPath = $admin->user?->photo_profile;

            if ($request->hasFile('photo_profile')) {
                if ($photoPath) {
                    Storage::disk('public')->delete($photoPath);
                }

                $photoPath = $request->file('photo_profile')->store('profile/admin', 'public');
            }

            $admin->user->update([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'birth_date' => $validated['birth_date'],
                'photo_profile' => $photoPath,
                'is_active' => $validated['is_active'] === '1',
            ]);

            $admin->update([
                'nama' => $validated['nama'],
                'nip' => $validated['nip'] ?? null,
            ]);
        });

        return redirect()
            ->route('admin.admins.index')
            ->with('success', 'Data admin berhasil diperbarui.');
    }

    public function destroy(Admin $admin)
    {
        $admin->load('user');

        if ($admin->user_id === auth()->id()) {
            return back()->with('error', 'Kamu tidak bisa menghapus akun admin yang sedang digunakan.');
        }

        DB::transaction(function () use ($admin) {
            if ($admin->user && $admin->user->photo_profile) {
                Storage::disk('public')->delete($admin->user->photo_profile);
            }

            if ($admin->user) {
                $admin->user->delete();
            } else {
                $admin->delete();
            }
        });

        return redirect()
            ->route('admin.admins.index')
            ->with('success', 'Data admin berhasil dihapus.');
    }

    public function resetPassword(Admin $admin)
    {
        $admin->load('user');

        if (!$admin->user || !$admin->user->birth_date) {
            return back()->with('error', 'Tanggal lahir admin belum tersedia.');
        }

        $defaultPassword = Carbon::parse($admin->user->birth_date)->format('dmY');

        $admin->user->update([
            'password' => Hash::make($defaultPassword),
        ]);

        return back()->with('success', 'Password admin berhasil direset ke tanggal lahir.');
    }
}