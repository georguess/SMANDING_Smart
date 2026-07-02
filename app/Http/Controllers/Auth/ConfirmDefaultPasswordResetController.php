<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ConfirmDefaultPasswordResetController extends Controller
{
    public function confirm(Request $request, string $token)
    {
        // Cari token di database
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->query('email'))
            ->first();

        // Validasi token & kedaluwarsa (60 menit)
        if (!$record || !hash_equals($record->token, hash('sha256', $token))) {
            return redirect()->route('login')
                ->with('error', 'Link tidak valid atau sudah kedaluwarsa.');
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')
                ->where('email', $request->query('email'))
                ->delete();

            return redirect()->route('login')
                ->with('error', 'Link sudah kedaluwarsa. Silakan minta reset password kembali.');
        }

        // Reset password ke default
        $user = User::where('email', $request->query('email'))->first();

        if (!$user) {
            return redirect()->route('login')
                ->with('error', 'User tidak ditemukan.');
        }

        $user->update([
            'password'             => Hash::make('Smanding@26'),
            'must_change_password' => true,
        ]);

        // Hapus token setelah dipakai
        DB::table('password_reset_tokens')
            ->where('email', $request->query('email'))
            ->delete();

        return redirect()->route('login')
            ->with('status', 'Password berhasil direset ke password default. Silakan login.');
    }
}