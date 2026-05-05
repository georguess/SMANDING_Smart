<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RfidCard;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Endpoint untuk menerima ketukan (tap) dari mesin RFID (ESP32/NodeMCU)
     */
    public function tap(Request $request)
    {
        // 1. Validasi input dari mesin (harus ada UID Kartu dan ID Mesin Pembaca)
        $request->validate([
            'uid_card' => 'required|string',
            'rfid_reader_id' => 'required|exists:rfid_readers,id',
        ]);

        // 2. Cari kartu di database dan ambil data siswa/user yang memilikinya
        $card = RfidCard::with('siswa')->where('uid_card', $request->uid_card)->first();

        if (!$card) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kartu tidak terdaftar di sistem!'
            ], 404);
        }

        $userId = $card->siswa->user_id;
        $today = Carbon::today();

        // 3. Cek apakah siswa ini sudah absen hari ini
        $alreadyTapped = Attendance::where('user_id', $userId)
            ->whereDate('waktu', $today)
            ->first();

        if ($alreadyTapped) {
            return response()->json([
                'status' => 'warning',
                'message' => 'Siswa sudah melakukan presensi hari ini.',
                'data' => [
                    'nama' => $card->siswa->nama,
                    'waktu' => $alreadyTapped->waktu->format('H:i:s')
                ]
            ], 400);
        }

        // 4. Rekam presensi ke database (Asumsi jam masuk sebelum jam 7 = Hadir)
        // Di sistem yang lebih kompleks, ini bisa dicek apakah terlambat atau tidak
        $attendance = Attendance::create([
            'user_id' => $userId,
            'rfid_card_id' => $card->id,
            'rfid_reader_id' => $request->rfid_reader_id,
            'guru_id' => null, // Karena dari mesin otomatis, tanpa pengawas spesifik
            'waktu' => now(),
            'status' => 'hadir' // Otomatis hadir karena nge-tap
        ]);

        // 5. Kembalikan balasan sukses ke mesin RFID (Mesin bisa membunyikan buzzer "Bip Bip")
        return response()->json([
            'status' => 'success',
            'message' => 'Presensi berhasil direkam!',
            'data' => [
                'nama' => $card->siswa->nama,
                'status' => $attendance->status,
                'waktu' => $attendance->waktu->format('H:i:s')
            ]
        ], 201);
    }
}
