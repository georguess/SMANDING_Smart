<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tambah kolom hanya jika belum ada
        Schema::table('attendances', function (Blueprint $table) {
            if (!Schema::hasColumn('attendances', 'tipe')) {
                $table->enum('tipe', ['masuk', 'pulang'])->default('masuk')->after('status');
            }
            if (!Schema::hasColumn('attendances', 'tanggal')) {
                $table->date('tanggal')->nullable()->after('waktu_absen');
            }
        });

        // Isi kolom tanggal dari waktu_absen untuk data lama
        DB::statement('UPDATE attendances SET tanggal = DATE(waktu_absen) WHERE tanggal IS NULL');

        // Tambah index dan constraint
        Schema::table('attendances', function (Blueprint $table) {
            // Ubah tanggal jadi NOT NULL
            $table->date('tanggal')->nullable(false)->change();

        });

        // Hapus unique constraint lama — perlu matikan FK check dulu
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        try {
            Schema::table('attendances', function (Blueprint $table) {
                $table->dropUnique(['siswa_id', 'waktu_absen']);
            });
        } catch (\Exception $e) {
            // Constraint sudah tidak ada, lanjut
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        Schema::table('attendances', function (Blueprint $table) {

            // Tambah unique constraint baru (1 siswa, 1 tipe per hari)
            $table->unique(['siswa_id', 'tipe', 'tanggal'], 'attendance_unique_per_session');

            // Index untuk query dashboard
            $table->index(['tanggal', 'kelas_id', 'status', 'tipe'], 'attendance_daily_summary');

            // Index untuk live attendance
            $table->index(['waktu_absen'], 'attendance_latest');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropIndex('attendance_daily_summary');
            $table->dropIndex('attendance_latest');
            $table->dropUnique('attendance_unique_per_session');

            $table->unique(['siswa_id', 'waktu_absen']);
            $table->dropColumn(['tipe', 'tanggal']);
        });
    }
};
