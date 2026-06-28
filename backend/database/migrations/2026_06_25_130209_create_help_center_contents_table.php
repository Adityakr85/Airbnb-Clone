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
       Schema::create('help_center_contents', function (Blueprint $table) {
            $table->id();
            
            // NEW: Links articles to their master topic
            $table->foreignId('parent_id')->nullable()->constrained('help_center_contents')->cascadeOnDelete();
            
            // 1. Structural Identity
            $table->string('content_type'); 
            $table->string('category')->default('Global');
            $table->json('breadcrumbs')->nullable();
            $table->string('section')->nullable();
            
            // 2. Universal Display Data
            $table->string('title');
            $table->text('summary')->nullable();
            $table->string('image')->nullable();
            $table->string('url')->nullable();
            
            // 3. Deep Content (For actual article pages)
            $table->longText('body_content')->nullable();
            
            // 4. Admin Toggles
            $table->boolean('is_published')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('help_center_contents');
    }
};
