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
        // Add fields to users table for enhanced admin functionality
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_login_at')->nullable()->after('remember_token');
            $table->string('status')->default('active')->after('role'); // active/blocked/suspended
        });
        
        // Add payment status to reservations table
        Schema::table('reservations', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'paid', 'refunded', 'failed'])
                  ->default('pending')
                  ->after('status');
        });
        
        // Add moderation status to properties table for proper approval workflow
        Schema::table('properties', function (Blueprint $table) {
            $table->enum('moderation_status', ['approved', 'pending', 'rejected'])
                  ->default('pending')
                  ->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove fields from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['last_login_at', 'status']);
        });
        
        // Remove payment status from reservations table
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });
        
        // Remove moderation status from properties table
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('moderation_status');
        });
    }
};