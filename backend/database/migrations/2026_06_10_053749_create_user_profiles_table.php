<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('decade')->nullable();
            $table->string('work')->nullable();
            $table->string('school')->nullable();
            $table->string('travel')->nullable();
            $table->string('pets')->nullable();
            $table->string('skill')->nullable();
            $table->string('song')->nullable();
            $table->string('fun_fact')->nullable();
            $table->string('time_spent')->nullable();
            $table->string('obsessed_with')->nullable();
            $table->string('bio_title')->nullable();
            $table->string('languages')->nullable();
            $table->string('lives_in')->nullable();
            $table->text('intro')->nullable();
            $table->string('interests')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
