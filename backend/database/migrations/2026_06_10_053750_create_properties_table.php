<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location');
            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('type');
            $table->decimal('price', 10, 2);
            $table->integer('guests')->default(1);
            $table->integer('bedrooms');
            $table->integer('beds')->default(0);
            $table->integer('bathrooms');
            $table->string('category')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->enum('moderation_status', ['approved', 'pending', 'rejected'])->default('pending');
            $table->decimal('rating', 3, 2)->nullable();
            $table->integer('views')->default(0);
            $table->integer('bookings')->default(0);
            $table->decimal('earnings', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
