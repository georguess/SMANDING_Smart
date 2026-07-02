<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\RfidCard;
use App\Models\RfidReader;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AttendanceController extends Controller
{
    public function tap(Request $request)
    {
        $validated = $request->validate([
            'uid_card' => ['required', 'string', 'max:100'],
            'rfid_reader_id' => ['nullable', 'exists:rfid_readers,id'],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'image' => ['nullable', 'string'], // Base64 encoded image
        ]);

        $rfidCard = RfidCard::with(['siswa.kelas'])
            ->where('uid_card', $validated['uid_card'])
            ->where('status', 'active')
            ->first();

        if (!$rfidCard) {
            return response()->json([
                'success' => false,
                'message' => 'Kartu RFID tidak terdaftar atau tidak aktif.',
            ], 404);
        }

        $siswa = $rfidCard->siswa;

        if (!$siswa) {
            return response()->json([
                'success' => false,
                'message' => 'Kartu RFID tidak terhubung dengan siswa.',
            ], 404);
        }

        if (!$siswa->kelas_id) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa belum memiliki kelas.',
            ], 422);
        }

        $reader = null;

        if (!empty($validated['rfid_reader_id'])) {
            $reader = RfidReader::find($validated['rfid_reader_id']);

            if ($reader && $reader->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'RFID Reader sedang tidak aktif.',
                ], 422);
            }
        }
        $activeSemester = Semester::where('is_active', true)->first();

        if (!$activeSemester) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada semester aktif.',
            ], 422);
        }

        $fotoPath = null;

        if ($request->hasFile('foto')) {
        $fotoPath = $request->file('foto')->store('attendance-photos', 'public');
    }   elseif ($request->filled('image')) {
        \Log::info('Image diterima, panjang: ' . strlen($request->input('image')));
        $imageData = base64_decode($request->input('image'));
        \Log::info('Decode size: ' . strlen($imageData));
        $filename = 'attendance-photos/' . $validated['uid_card'] . '_' . time() . '.jpg';
        $result = Storage::disk('public')->put($filename, $imageData);
        \Log::info('Storage result: ' . ($result ? 'OK' : 'GAGAL'));
        $fotoPath = $filename;
    }

        $today = now()->toDateString();

        $existingAttendance = Attendance::with(['siswa.kelas', 'rfidReader', 'semester'])
        ->where('siswa_id', $siswa->id)
        ->where('semester_id', $activeSemester->id)
        ->whereDate('waktu_absen', $today)
        ->first();

        if ($existingAttendance) {
            return response()->json([
                'success' => true,
                'message' => 'Siswa sudah melakukan absensi hari ini.',
                'status' => 'already_checked_in',
                'data' => [
                    'id' => $existingAttendance->id,
                    'nama' => $siswa->nama,
                    'nis' => $siswa->nis,
                    'kelas' => $siswa->kelas?->nama_kelas,
                    'semester' => $existingAttendance->semester
                    ? $existingAttendance->semester->semester . ' - ' . $existingAttendance->semester->tahun_akademik
                    : null,
                    'waktu_absen' => $existingAttendance->waktu_absen,
                    'status_absensi' => $existingAttendance->status,
                    'foto' => $existingAttendance->foto
                        ? asset('storage/' . $existingAttendance->foto)
                        : null,
                ],
            ]);
        }

        $attendance = Attendance::create([
            'user_id' => $siswa->user_id,
            'siswa_id' => $siswa->id,
            'kelas_id' => $siswa->kelas_id,
            'semester_id' => $activeSemester->id,
            'rfid_card_id' => $rfidCard->id,
            'rfid_reader_id' => $validated['rfid_reader_id'] ?? null,
            'guru_id' => $siswa->kelas?->guru_id,
            'waktu_absen' => now(),
            'status' => 'hadir',
            'foto' => $fotoPath,
        ]);

        $attendance->load(['siswa.kelas', 'rfidReader', 'semester']);

        return response()->json([
            'success' => true,
            'message' => 'Absensi berhasil disimpan.',
            'status' => 'checked_in',
            'data' => [
                'id' => $attendance->id,
                'nama' => $attendance->siswa?->nama,
                'nis' => $attendance->siswa?->nis,
                'kelas' => $attendance->kelas?->nama_kelas,
                'reader' => $attendance->rfidReader?->lokasi,
                'semester' => $attendance->semester
                ? $attendance->semester->semester . ' - ' . $attendance->semester->tahun_akademik
                : null,
                'waktu_absen' => $attendance->waktu_absen,
                'status_absensi' => $attendance->status,
                'foto' => $attendance->foto
                    ? asset('storage/' . $attendance->foto)
                    : null,
            ],
        ], 201);
    }

    public function latest()
    {
        $attendances = Attendance::with(['siswa.kelas', 'rfidReader'])
            ->orderByDesc('waktu_absen')
            ->limit(30)
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'nama' => $attendance->siswa?->nama,
                    'nis' => $attendance->siswa?->nis,
                    'kelas' => $attendance->siswa?->kelas?->nama_kelas,
                    'reader' => $attendance->rfidReader?->lokasi,
                    'waktu_absen' => $attendance->waktu_absen,
                    'status' => $attendance->status,
                    'foto' => $attendance->foto
                        ? asset('storage/' . $attendance->foto)
                        : null,
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Data absensi terbaru berhasil diambil.',
            'data' => $attendances,
        ]);
    }
}