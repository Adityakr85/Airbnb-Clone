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
            
            // Hierarchy Links
            $table->foreignId('parent_id')->nullable()->constrained('help_center_contents')->cascadeOnDelete();
            
            // 1. Structural Identity
            $table->string('content_type'); 
            $table->string('tab_category')->default('Guest');
            $table->string('tag')->nullable();
            $table->string('section_heading')->nullable();
            $table->json('breadcrumbs')->nullable();
            
            // 2. Universal Display Data
            $table->string('title');
            $table->text('summary')->nullable();
            $table->text('intro')->nullable();
            $table->string('image')->nullable();
            $table->string('url')->nullable();
            
            // 3. Deep Content 
            $table->json('content_sections')->nullable();
            $table->longText('body_content')->nullable();

            // 4. Relationships
            $table->json('related_articles')->nullable(); 
            $table->json('related_topics')->nullable();
            
            // 5. Admin Toggles & Protection
            $table->boolean('is_published')->default(true);
            $table->softDeletes();
            
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
