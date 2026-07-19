<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\RfidCard;
use App\Models\RfidReader;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AttendanceController extends Controller
{
    /**
     * Jam absensi (format H:i, timezone Asia/Jakarta)
     */
    private const MASUK_START  = '05:30';
    private const MASUK_END   = '07:15';
    private const PULANG_START = '15:30';
    private const PULANG_END  = '18:30';

    public function tap(Request $request)
    {
        // CEK KEAMANAN: Pastikan yang mengirim data benar-benar mesin ESP32 sekolah
        if ($request->header('X-Device-Token') !== env('ESP32_SECRET_KEY')) {
            return response()->json(['message' => 'Akses Ditolak! Token tidak valid.'], 403);
        }
        $validated = $request->validate([
            'uid_card'       => ['required', 'string', 'max:100'],
            'device_id'         => ['nullable', 'string', 'exists:rfid_readers,device_id'],
            'foto'           => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'image'          => ['nullable', 'string', 'max:2000000'], // Batas ~2MB
        ]);

        // ── Validasi kartu RFID ──────────────────────────────
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

        // ── Validasi RFID Reader ─────────────────────────────
        $reader = null;

        if (!empty($validated['device_id'])) {
            $reader = RfidReader::where('device_id', $validated['device_id'])->first();

            if ($reader && $reader->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'RFID Reader sedang tidak aktif.',
                ], 422);
            }

            // Catat waktu terakhir reader ini melapor (buat monitoring online/mati)
            $reader?->update(['last_seen_at' => now()]);
        }

        // ── Validasi semester aktif ──────────────────────────
        $activeSemester = Semester::where('is_active', true)->first();

        if (!$activeSemester) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada semester aktif.',
            ], 422);
        }

        // ── Tentukan sesi berdasarkan waktu ──────────────────
        $now   = now()->setTimezone('Asia/Jakarta');
        $waktu = $now->format('H:i');

        if ($waktu >= self::MASUK_START && $waktu <= self::MASUK_END) {
            $tipe = 'masuk';
        } elseif ($waktu >= self::PULANG_START && $waktu <= self::PULANG_END) {
            $tipe = 'pulang';
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Di luar jam absensi. '
                    . 'Absen pagi: ' . self::MASUK_START . ' - ' . self::MASUK_END
                    . ', Absen pulang: ' . self::PULANG_START . ' - ' . self::PULANG_END . '.',
            ], 422);
        }

        $tanggal = $now->toDateString();

        // ── Cek apakah sudah absen di sesi ini ───────────────
        $existingAttendance = Attendance::with(['siswa.kelas', 'rfidReader', 'semester'])
            ->where('siswa_id', $siswa->id)
            ->where('semester_id', $activeSemester->id)
            ->where('tanggal', $tanggal)
            ->where('tipe', $tipe)
            ->first();

        if ($existingAttendance) {
            $label = $tipe === 'masuk' ? 'pagi (masuk)' : 'sore (pulang)';

            return response()->json([
                'success' => true,
                'message' => "Siswa sudah melakukan absensi {$label} hari ini.",
                'status'  => 'already_checked_in',
                'data'    => [
                    'id'             => $existingAttendance->id,
                    'nama'           => $siswa->nama,
                    'nis'            => $siswa->nis,
                    'kelas'          => $siswa->kelas?->nama_kelas,
                    'tipe'           => $existingAttendance->tipe,
                    'semester'       => $existingAttendance->semester
                        ? $existingAttendance->semester->semester . ' - ' . $existingAttendance->semester->tahun_akademik
                        : null,
                    'waktu_absen'    => $existingAttendance->waktu_absen
                        ->setTimezone('Asia/Jakarta')
                        ->format('Y-m-d H:i:s'),
                    'status_absensi' => $existingAttendance->status,
                    'foto'           => $existingAttendance->foto
                        ? asset('storage/' . $existingAttendance->foto)
                        : null,
                ],
            ]);
        }

        // ── Proses foto ──────────────────────────────────────
        $fotoPath = null;

        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('attendance-photos', 'public');
        } elseif ($request->filled('image')) {
            Log::info('Image diterima, panjang: ' . strlen($request->input('image')));
            $imageData = base64_decode($request->input('image'));
            Log::info('Decode size: ' . strlen($imageData));
            $filename = 'attendance-photos/' . $validated['uid_card'] . '_' . $tipe . '_' . time() . '.jpg';
            $result   = Storage::disk('public')->put($filename, $imageData);
            Log::info('Storage result: ' . ($result ? 'OK' : 'GAGAL'));
            $fotoPath = $filename;
        }

        // ── Simpan record absensi ────────────────────────────
        $attendance = Attendance::create([
            'user_id'        => $siswa->user_id,
            'siswa_id'       => $siswa->id,
            'kelas_id'       => $siswa->kelas_id,
            'semester_id'    => $activeSemester->id,
            'rfid_card_id'   => $rfidCard->id,
            'rfid_reader_id' => $reader?->id,
            'guru_id'        => $siswa->kelas?->guru_id,
            'waktu_absen'    => now(),
            'tanggal'        => $tanggal,
            'tipe'           => $tipe,
            'status'         => 'hadir',
            'foto'           => $fotoPath,
        ]);

        $attendance->load(['siswa', 'kelas', 'semester', 'rfidReader']);

        $label = $tipe === 'masuk' ? 'Masuk (Pagi)' : 'Pulang (Sore)';

        return response()->json([
            'success' => true,
            'message' => "Absensi {$label} berhasil disimpan.",
            'status'  => 'checked_in',
            'data'    => [
                'id'             => $attendance->id,
                'nama'           => $attendance->siswa?->nama,
                'nis'            => $attendance->siswa?->nis,
                'kelas'          => $attendance->kelas?->nama_kelas,
                'tipe'           => $attendance->tipe,
                'reader'         => $attendance->rfidReader?->lokasi,
                'semester'       => $attendance->semester
                    ? $attendance->semester->semester . ' - ' . $attendance->semester->tahun_akademik
                    : null,
                'waktu_absen'    => $attendance->waktu_absen
                    ->setTimezone('Asia/Jakarta')
                    ->format('Y-m-d H:i:s'),
                'status_absensi' => $attendance->status,
                'foto'           => $attendance->foto
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
                    'id'          => $attendance->id,
                    'nama'        => $attendance->siswa?->nama,
                    'nis'         => $attendance->siswa?->nis,
                    'kelas'       => $attendance->kelas?->nama_kelas,
                    'tipe'        => $attendance->tipe,
                    'reader'      => $attendance->rfidReader?->lokasi,
                    'waktu_absen' => $attendance->waktu_absen
                        ->setTimezone('Asia/Jakarta')
                        ->format('Y-m-d H:i:s'),
                    'status'      => $attendance->status,
                    'foto'        => $attendance->foto
                        ? asset('storage/' . $attendance->foto)
                        : null,
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Data absensi terbaru berhasil diambil.',
            'data'    => $attendances,
        ]);
    }
}