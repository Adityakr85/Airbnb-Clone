<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create a demo user without relying on factory/migration defaults.
        // This avoids seeding failures when the existing DB users table schema
        // does not match the current Laravel migration (e.g., missing email_verified_at).
        User::query()->firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        $this->call(PropertiesSeeder::class);
        $this->call(ExperiencesSeeder::class);
        $this->call(ServiceSeeder::class);
        $this->call(HelpCenterSeeder::class);
    }
}

