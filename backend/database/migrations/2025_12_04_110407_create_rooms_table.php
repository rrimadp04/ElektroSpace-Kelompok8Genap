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
    Schema::create('rooms', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // Contoh: Lab Komputer A
        $table->text('description')->nullable();
        $table->integer('capacity');
        // Status ketersediaan global (Misal: Sedang renovasi = false)
        $table->boolean('is_active')->default(true); 
        $table->string('image')->nullable(); // Foto ruangan
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
