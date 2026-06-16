<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
    $table->id();

    $table->string('nama_kelas', 50);

    $table->foreignId('guru_id')
        ->constrained('gurus')
        ->cascadeOnDelete();

    $table->foreignId('semester_id')
        ->constrained('semesters')
        ->cascadeOnDelete();

    $table->string('tahun_ajaran', 20);

    $table->unique(['nama_kelas', 'semester_id']);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
