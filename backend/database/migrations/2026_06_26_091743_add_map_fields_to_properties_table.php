<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'address')) {
                $table->string('address')->nullable()->after('location');
            }

            if (!Schema::hasColumn('properties', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('address');
            }

            if (!Schema::hasColumn('properties', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }

            if (!Schema::hasColumn('properties', 'beds')) {
                $table->integer('beds')->default(0)->after('bedrooms');
            }
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (Schema::hasColumn('properties', 'address')) {
                $table->dropColumn('address');
            }

            if (Schema::hasColumn('properties', 'latitude')) {
                $table->dropColumn('latitude');
            }

            if (Schema::hasColumn('properties', 'longitude')) {
                $table->dropColumn('longitude');
            }

            if (Schema::hasColumn('properties', 'beds')) {
                $table->dropColumn('beds');
            }
        });
    }
};