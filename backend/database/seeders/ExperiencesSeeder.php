<?php

namespace Database\Seeders;

use App\Models\Experience\Experience;
use Illuminate\Database\Seeder;

class ExperiencesSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            [
                'title' => 'Night Street Food Tour',
                'description' => 'Taste the best local delicacies hidden in the city streets.',
                'location' => 'Mumbai, India',
                'category' => 'Culinary',
                'price' => 1500,
                'duration' => '3 hours',
                'groupSize' => 'Up to 10', 
                'rating' => 4.95,
                'reviews' => 124,
                'hostName' => 'Rahul',
                'level' => 'Beginner',
                'images' => [
                    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Sunrise Yoga by the Ganges',
                'description' => 'Find inner peace with a guided yoga session at dawn.',
                'location' => 'Rishikesh, India',
                'category' => 'Wellness',
                'price' => 800,
                'duration' => '1.5 hours',
                'groupSize' => 'Up to 15',
                'rating' => 4.98,
                'reviews' => 312,
                'hostName' => 'Priya',
                'level' => 'All levels',
                'images' => [
                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Desert Safari & Stargazing',
                'description' => 'Ride through the dunes and camp under a blanket of stars.',
                'location' => 'Jaisalmer, India',
                'category' => 'Adventure',
                'price' => 3500,
                'duration' => '6 hours',
                'groupSize' => 'Up to 8',
                'rating' => 4.85,
                'reviews' => 89,
                'hostName' => 'Vikram',
                'level' => 'Moderate',
                'images' => [
                    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Heritage Walk & Photography',
                'description' => 'Capture the stunning architecture of the pink city.',
                'location' => 'Jaipur, India',
                'category' => 'Culture',
                'price' => 1200,
                'duration' => '4 hours',
                'groupSize' => 'Up to 6',
                'rating' => 4.90,
                'reviews' => 156,
                'hostName' => 'Ananya',
                'level' => 'Beginner',
                'images' => [
                    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Backwaters Boat Tour',
                'description' => 'Glide through serene waters on a traditional wooden boat.',
                'location' => 'Alleppey, India',
                'category' => 'Sightseeing',
                'price' => 2500,
                'duration' => '5 hours',
                'groupSize' => 'Up to 4',
                'rating' => 4.75,
                'reviews' => 201,
                'hostName' => 'Karthik',
                'level' => 'Easy',
                'images' => [
                    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Himalayan Trekking Expedition',
                'description' => 'A guided hike through breathtaking mountain trails.',
                'location' => 'Manali, India',
                'category' => 'Nature',
                'price' => 4000,
                'duration' => '8 hours',
                'groupSize' => 'Up to 12',
                'rating' => 4.88,
                'reviews' => 67,
                'hostName' => 'Tenzing',
                'level' => 'Advanced',
                'images' => [
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
                ]
            ]
        ];

        foreach ($experiences as $data) {
            Experience::updateOrCreate(
                [
                    'title' => $data['title'],
                    'location' => $data['location']
                ],
                $data
            );
        }
    }
}