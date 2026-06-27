<?php

namespace Database\Seeders;

use App\Models\Property\Property;
use App\Models\Property\PropertyImage;
use App\Models\User\User;
use Illuminate\Database\Seeder;

class PropertiesSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure we have at least one host to satisfy properties.host_id
        $host = User::query()->first();
        if (!$host) {
            $host = User::query()->create([
                'name' => 'Demo Host',
                'email' => 'demo-host@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        $properties = [
            [
                'title' => 'Luxury Beach Villa',
                'description' => 'A stunning beachfront villa with panoramic ocean views, private pool, and lush tropical gardens.',
                'location' => 'Goa, India',
                'type' => 'Villa',
                'price' => 4500,
                'guests' => 6,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'images' => ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.9,
                'views' => 342,
                'bookings' => 18,
                'earnings' => 81000,
            ],
            [
                'title' => 'Modern City Apartment',
                'description' => 'Sleek, modern apartment in the heart of Mumbai with city skyline views.',
                'location' => 'Mumbai, India',
                'type' => 'Apartment',
                'price' => 3200,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'images' => ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.7,
                'views' => 178,
                'bookings' => 9,
                'earnings' => 28800,
            ],
            [
                'title' => 'Mountain View Cabin',
                'description' => 'Cozy wooden cabin nestled in the mountains with breathtaking views and a fireplace.',
                'location' => 'Manali, India',
                'type' => 'Cabin',
                'price' => 2800,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'images' => ['https://images.unsplash.com/photo-1518780664697-55e3ad937233'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.8,
                'views' => 215,
                'bookings' => 11,
                'earnings' => 30800,
            ],
            [
                'title' => 'Luxury Penthouse',
                'description' => null,
                'location' => 'Bangalore, India',
                'type' => 'Penthouse',
                'price' => 6200,
                'guests' => 5,
                'bedrooms' => 3,
                'bathrooms' => 3,
                'images' => ['https://images.unsplash.com/photo-1484154218962-a197022b5858'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.9,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Lake Side Cottage',
                'description' => null,
                'location' => 'Nainital, India',
                'type' => 'Cottage',
                'price' => 3500,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'images' => ['https://images.unsplash.com/photo-1448630360428-65456885c650'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.6,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Desert Camp',
                'description' => null,
                'location' => 'Jaisalmer, India',
                'type' => 'Tent',
                'price' => 2200,
                'guests' => 2,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'images' => ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.5,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Beachfront Apartment',
                'description' => null,
                'location' => 'Pondicherry, India',
                'type' => 'Apartment',
                'price' => 3800,
                'guests' => 3,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'images' => ['https://images.unsplash.com/photo-1494526585095-c41746248156'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.7,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Royal Heritage Palace',
                'description' => null,
                'location' => 'Udaipur, India',
                'type' => 'Palace',
                'price' => 8500,
                'guests' => 8,
                'bedrooms' => 4,
                'bathrooms' => 4,
                'images' => ['https://images.unsplash.com/photo-1570129477492-45c003edd2be'],
                'category' => null,
                'status' => 'active',
                'rating' => 5.0,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Tree House Retreat',
                'description' => null,
                'location' => 'Wayanad, India',
                'type' => 'Tree House',
                'price' => 4100,
                'guests' => 2,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'images' => ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.8,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Snow View Chalet',
                'description' => null,
                'location' => 'Shimla, India',
                'type' => 'Chalet',
                'price' => 4700,
                'guests' => 5,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'images' => ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.9,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Luxury Farmhouse',
                'description' => null,
                'location' => 'Pune, India',
                'type' => 'Farmhouse',
                'price' => 5200,
                'guests' => 10,
                'bedrooms' => 5,
                'bathrooms' => 4,
                'images' => ['https://images.unsplash.com/photo-1600585154526-990dced4db0d'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.8,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Riverside Cottage',
                'description' => null,
                'location' => 'Rishikesh, India',
                'type' => 'Cottage',
                'price' => 3000,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'images' => ['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.6,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Riverside Cottage',
                'description' => null,
                'location' => 'Ranchi, India',
                'type' => 'Cottage',
                'price' => 3000,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'images' => ['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.2,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Flat in Ranchi',
                'description' => null,
                'location' => 'Ranchi, India',
                'type' => 'Apartment',
                'price' => 6848,
                'guests' => 0,
                'bedrooms' => 0,
                'bathrooms' => 0,
                'images' => ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.92,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
            [
                'title' => 'Room in Puri',
                'description' => null,
                'location' => 'Puri, India',
                'type' => 'Room',
                'price' => 3538,
                'guests' => 0,
                'bedrooms' => 0,
                'bathrooms' => 0,
                'images' => ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'],
                'category' => null,
                'status' => 'active',
                'rating' => 4.96,
                'views' => 0,
                'bookings' => 0,
                'earnings' => 0,
            ],
        ];

        foreach ($properties as $data) {
            // Map frontend/mock property fields to current DB schema
            // Current DB columns (migration):
            // id, host_id, title, description, price, location,
            // bedrooms, bathrooms, image, created_at, updated_at
            $exists = Property::query()
                ->where('host_id', $host->id)
                ->where('title', $data['title'])
                ->where('location', $data['location'])
                ->where('price', $data['price'] ?? null)
                ->exists();

            if ($exists) {
                continue;
            }

            $property = Property::create([
                'host_id' => $host->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? '',
                'price' => $data['price'],
                'location' => $data['location'],
                'bedrooms' => $data['bedrooms'],
                'bathrooms' => $data['bathrooms'],
                'images' => json_encode($data['images']),
                'type' => $data['type'] ?? null,
                'category' => $data['category'] ?? null,
                'status' => $data['status'] ?? 'active',
                'moderation_status' => 'approved',
                'rating' => $data['rating'] ?? null,
                'views' => $data['views'] ?? 0,
                'bookings' => $data['bookings'] ?? 0,
                'earnings' => $data['earnings'] ?? 0,
            ]);

            // Create PropertyImage records for the images
            foreach ($data['images'] as $index => $imageUrl) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $imageUrl,
                    'is_cover' => $index === 0,
                ]);
            }
        }

    }
}

