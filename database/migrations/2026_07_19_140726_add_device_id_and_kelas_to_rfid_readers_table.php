<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rfid_readers', function (Blueprint $table) {
            $table->string('device_id')->unique()->after('id');
            $table->foreignId('kelas_id')->nullable()->after('lokasi')->constrained('kelas')->nullOnDelete();
            $table->timestamp('last_seen_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('rfid_readers', function (Blueprint $table) {
            $table->dropForeign(['kelas_id']);
            $table->dropColumn(['device_id', 'kelas_id', 'last_seen_at']);
        });
    }
};