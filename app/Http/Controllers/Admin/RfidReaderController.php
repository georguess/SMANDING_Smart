<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RfidReader;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RfidReaderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $rfidReaders = RfidReader::withCount('attendances')
            ->when($search, function ($query) use ($search) {
                $query->where('lokasi', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/RfidReaders/Index', [
            'rfidReaders' => $rfidReaders,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/RfidReaders/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lokasi' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active', 'inactive', 'maintenance'])],
        ]);

        RfidReader::create($validated);

        return redirect()
            ->route('admin.rfid-readers.index')
            ->with('success', 'RFID Reader berhasil ditambahkan.');
    }

    public function edit(RfidReader $rfidReader)
    {
        return Inertia::render('Admin/RfidReaders/Edit', [
            'rfidReader' => $rfidReader,
        ]);
    }

    public function update(Request $request, RfidReader $rfidReader)
    {
        $validated = $request->validate([
            'lokasi' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active', 'inactive', 'maintenance'])],
        ]);

        $rfidReader->update($validated);

        return redirect()
            ->route('admin.rfid-readers.index')
            ->with('success', 'RFID Reader berhasil diperbarui.');
    }

    public function destroy(RfidReader $rfidReader)
    {
        if ($rfidReader->attendances()->exists()) {
            return back()->with('error', 'RFID Reader tidak bisa dihapus karena sudah digunakan pada data absensi.');
        }

        $rfidReader->delete();

        return redirect()
            ->route('admin.rfid-readers.index')
            ->with('success', 'RFID Reader berhasil dihapus.');
    }
}