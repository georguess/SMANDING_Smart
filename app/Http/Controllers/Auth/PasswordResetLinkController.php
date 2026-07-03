<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\ResetToDefaultPasswordNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Email tidak terdaftar di sistem.',
        ]);

        $user = User::where('email', $request->email)->first();

        // Hapus token lama jika ada
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Buat token baru
        $token = Str::random(64);

        DB::table('password_reset_tokens')->insert([
            'email'      => $request->email,
            'token'      => hash('sha256', $token),
            'created_at' => now(),
        ]);

        // Kirim email notifikasi
        $user->notify(new ResetToDefaultPasswordNotification($token));

        return back()->with('status', 'Link konfirmasi reset password telah dikirim ke email Anda.');
    }
}