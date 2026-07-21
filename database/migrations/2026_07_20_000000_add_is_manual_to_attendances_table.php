<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (!Schema::hasColumn('attendances', 'is_manual')) {
                $table->boolean('is_manual')->default(false)->after('status');
            }
        });

        // Defensive backfill for DBs that may have null values
        if (Schema::hasTable('attendances')) {
            \Illuminate\Support\Facades\DB::table('attendances')
                ->whereNull('is_manual')
                ->update(['is_manual' => false]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (Schema::hasColumn('attendances', 'is_manual')) {
                $table->dropColumn('is_manual');
            }
        });
    }
};
