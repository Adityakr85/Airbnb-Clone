<?php

namespace Database\Seeders;

use App\Models\Amenity\Amenity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            ['name' => 'Wifi', 'icon' => '📶'],
            ['name' => 'TV', 'icon' => '📺'],
            ['name' => 'Kitchen', 'icon' => '🍳'],
            ['name' => 'Washing machine', 'icon' => '🧺'],
            ['name' => 'Free parking', 'icon' => '🚗'],
            ['name' => 'Paid parking', 'icon' => '🅿️'],
            ['name' => 'Air conditioning', 'icon' => '❄️'],
            ['name' => 'Dedicated workspace', 'icon' => '💻'],
            ['name' => 'Pool', 'icon' => '🏊'],
            ['name' => 'Hot tub', 'icon' => '🛁'],
            ['name' => 'Patio', 'icon' => '🌿'],
            ['name' => 'BBQ grill', 'icon' => '🍖'],
            ['name' => 'Outdoor dining', 'icon' => '🍽️'],
            ['name' => 'Fire pit', 'icon' => '🔥'],
            ['name' => 'Gym', 'icon' => '💪'],
            ['name' => 'Breakfast', 'icon' => '🥐'],
            ['name' => 'Indoor fireplace', 'icon' => '🪵'],
            ['name' => 'Smoking allowed', 'icon' => '🚬'],
            ['name' => 'Pets allowed', 'icon' => '🐾'],
            ['name' => 'Piano', 'icon' => '🎹'],
        ];

        foreach ($amenities as $index => $amenity) {
            Amenity::updateOrCreate(
                ['slug' => Str::slug($amenity['name'])],
                [
                    'name' => $amenity['name'],
                    'icon' => $amenity['icon'],
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}