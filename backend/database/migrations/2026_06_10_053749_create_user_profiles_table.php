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
            $table->string('clerk_id')->unique()->nullable();
            $table->string('photo_url')->nullable();
            $table->string('decade')->nullable();
            $table->string('work')->nullable();
            $table->string('school')->nullable();
            $table->string('travel')->nullable();
            $table->string('pets')->nullable();
            $table->string('skill')->nullable();
            $table->string('song')->nullable();
            $table->string('fun_fact')->nullable();
            $table->string('time')->nullable();
            $table->string('obsessed')->nullable();
            $table->string('bio_title')->nullable();
            $table->string('languages')->nullable();
            $table->string('live')->nullable();
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
