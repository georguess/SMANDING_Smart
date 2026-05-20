<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rules\Unique;

use function Laravel\Prompts\table;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('rfid_card_id')->nullable()->constrained('rfid_cards')->onDelete('cascade');
            $table->foreignId('rfid_reader_id')->nullable()->constrained('rfid_readers')->onDelete('set null');
            $table->foreignId('guru_id')->nullable()->constrained('gurus')->onDelete('set null');
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null');
            $table->foreignId('semester_id')->nullable()->constrained('semesters')->onDelete('set null');
            $table->foreignId('siswa_id')->nullable()->constrained('siswas')->onDelete('set null');
            $table->dateTime('waktu_absen');
            $table->enum('status', ['hadir', 'sakit', 'izin', 'alpa']);
            $table->string('foto')->nullable();
            $table->timestamps();
            
            $table->unique(['siswa_id', 'waktu_absen']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
