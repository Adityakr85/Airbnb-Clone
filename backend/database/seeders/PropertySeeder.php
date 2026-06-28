<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property\Property;
use App\Models\User\User;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'host@example.com'],
            ['name' => 'Admin Host', 'password' => bcrypt('password'), 'role' => 'host']
        );

        $properties = [
            [
                'title' => 'Luxury Beach Villa',
                'location' => 'Goa, India',
                'price' => 4500,
                'rating' => 4.9,
                'guests' => 6,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'type' => 'Entire Villa',
                'image' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
            ],
            [
                'title' => 'Modern City Apartment',
                'location' => 'Mumbai, India',
                'price' => 3200,
                'rating' => 4.7,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'type' => 'Apartment',
                'image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
            ],
            [
                'title' => 'Mountain View Cabin',
                'location' => 'Manali, India',
                'price' => 2800,
                'rating' => 4.8,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'type' => 'Cabin',
                'image' => 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
            ],
        ];

        foreach ($properties as $prop) {
            $prop['host_id'] = $user->id;
            Property::create($prop);
        }
    }
}
