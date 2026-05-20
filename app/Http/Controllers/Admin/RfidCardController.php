<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RfidCard;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RfidCardController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $rfidCards = RfidCard::query()
        ->select('rfid_cards.*')
        ->join('siswas', 'rfid_cards.siswa_id', '=', 'siswas.id')
        ->join('kelas', 'siswas.kelas_id', '=', 'kelas.id')
        ->with(['siswa.user', 'siswa.kelas'])
        ->when($search, function ($query) use ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('rfid_cards.uid_card', 'like', "%{$search}%")
                ->orWhere('rfid_cards.status', 'like', "%{$search}%")
                ->orWhere('siswas.nama', 'like', "%{$search}%")
                ->orWhere('siswas.nis', 'like', "%{$search}%")
                ->orWhere('siswas.nisn', 'like', "%{$search}%")
                ->orWhere('kelas.nama_kelas', 'like', "%{$search}%");
        });
    })
        ->orderBy('kelas.nama_kelas', 'asc')
        ->orderBy('siswas.nama', 'asc')
        ->paginate(10)
        ->appends($request->only('search'));

        $siswas = Siswa::with(['kelas', 'activeRfidCard'])
            ->orderBy('nama')
            ->get();

        return Inertia::render('Admin/RfidCards/Index', [
            'rfidCards' => $rfidCards,
            'siswas' => $siswas,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => ['required', 'exists:siswas,id'],
            'uid_card' => [
                'required',
                'string',
                'max:100',
                Rule::unique('rfid_cards', 'uid_card'),
            ],
        ]);

        DB::transaction(function () use ($validated) {
            RfidCard::where('siswa_id', $validated['siswa_id'])
                ->where('status', 'active')
                ->update([
                    'status' => 'inactive',
                ]);

            RfidCard::create([
                'siswa_id' => $validated['siswa_id'],
                'uid_card' => $validated['uid_card'],
                'status' => 'active',
            ]);
        });

        return redirect()
            ->route('admin.rfid-cards.index')
            ->with('success', 'Kartu RFID berhasil didaftarkan.');
    }

    public function reset(RfidCard $rfidCard)
    {
        $rfidCard->update([
            'status' => 'inactive',
        ]);

        return back()->with('success', 'Kartu RFID berhasil dinonaktifkan.');
    }
}