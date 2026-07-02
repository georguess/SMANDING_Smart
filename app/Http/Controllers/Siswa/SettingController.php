<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Siswa/Settings');
    }

    public function edit()
    {
        return Inertia::render("Siswa/Settings", [
            "user" => auth()->user()->load('siswa'),
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            "photo_profile" => ["required", "image", "mimes:jpg,jpeg,png", "max:2048"],
        ]);

        $user = User::findOrFail(auth()->id());

        if ($request->hasFile("photo_profile")) {
            if ($user->photo_profile) {
                Storage::disk("public")->delete($user->photo_profile);
            }

            $photoPath = $request->file("photo_profile")->store("profile/siswa", "public");

            $user->update([
                "photo_profile" => $photoPath,
            ]);
        }

        return back()->with("success", "Foto profil berhasil diperbarui.");
    }

    public function updateProfile(Request $request)
    {
        $user = User::with('siswa')->findOrFail(auth()->id());

        $validated = $request->validate([
            "nama" => ["required", "string", "max:100"],
            "email" => ["required", "email", "max:150", Rule::unique('users', 'email')->ignore($user->id)],
            "birth_date" => ["required", "date"],
            "alamat" => ["nullable", "string"],
        ]);

        if (!$user->siswa) {
            return back()->withErrors([
                "nama" => "Data siswa tidak ditemukan.",
            ]);
        }

        DB::transaction(function () use ($user, $validated) {
            $user->update([
                "email" => $validated["email"],
                "birth_date" => $validated["birth_date"],
            ]);

            $user->siswa->update([
                "nama" => $validated["nama"],
                "alamat" => $validated["alamat"] ?? null,
            ]);
        });

        return back()->with("success", "Profil siswa berhasil diperbarui.");
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            "current_password" => ["required"],
            "password" => ["required", "confirmed", Password::min(8)],
        ]);

        $user = User::findOrFail(auth()->id());

        if (!Hash::check($validated["current_password"], $user->password)) {
            return back()->withErrors([
                "current_password" => "Password lama tidak sesuai.",
            ]);
        }

        $user->update([
            "password" => Hash::make($validated["password"]),
        ]);

        return back()->with("success", "Password berhasil diperbarui.");
    }
}

