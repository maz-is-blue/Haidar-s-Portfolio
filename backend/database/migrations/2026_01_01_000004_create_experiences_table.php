<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('years')->nullable();
            $table->string('org')->nullable();
            $table->string('role_en')->nullable();
            $table->string('role_ar')->nullable();
            $table->json('bullets_en')->nullable();
            $table->json('bullets_ar')->nullable();
            $table->json('links')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
