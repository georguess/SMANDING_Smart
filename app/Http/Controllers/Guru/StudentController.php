<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $guru = auth()->user()->guru;

        if (!$guru) {
            abort(403, 'Data guru tidak ditemukan untuk akun ini.');
        }

        // Ambil semua ID kelas yang diwalikan oleh guru login
        $kelasIds = Kelas::where('guru_id', $guru->id)->pluck('id');

        $search = $request->input('search');

        $siswas = Siswa::with('kelas')
            ->whereIn('kelas_id', $kelasIds)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        $kelasWali = Kelas::where('guru_id', $guru->id)
            ->orderBy('nama_kelas')
            ->get();

        return Inertia::render('Guru/Students/Index', [
            'siswas' => $siswas,
            'kelasWali' => $kelasWali,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}