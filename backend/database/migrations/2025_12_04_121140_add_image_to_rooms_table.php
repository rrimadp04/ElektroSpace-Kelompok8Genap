<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::table('rooms', function (Blueprint $table) {
        // Cek dulu biar tidak error kalau sudah ada
        if (!Schema::hasColumn('rooms', 'image')) {
            $table->string('image')->nullable()->after('is_active');
        }
    });
}

public function down()
{
    Schema::table('rooms', function (Blueprint $table) {
        $table->dropColumn('image');
    });
}
};
