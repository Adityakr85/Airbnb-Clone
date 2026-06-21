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
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location');
            $table->string('category');
            $table->integer('price');
            $table->string('duration')->nullable();
            $table->string('groupSize')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews')->default(0);
            $table->string('hostName')->nullable();
            $table->string('level')->nullable();
            $table->json('images')->nullable(); // Stores the array of image URLs
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
