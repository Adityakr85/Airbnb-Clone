<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service\Service;

class ServiceSeeder extends Seeder
{
    public function run()
    {
        $services = [
            [
                'title' => 'Cinematic Wedding & Portrait Photography',
                'type' => 'Photography',
                'location' => 'Mumbai',
                'price' => 7500.00,
                'description' => 'Professional photo session for couples, families, or solo travelers. Includes 50 edited digital high-resolution photos.',
                'images' => [
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Private Chef for Evening Dining',
                'type' => 'Chefs',
                'location' => 'Goa',
                'price' => 4500.00,
                'description' => 'A curated 5-course coastal dining experience prepared right in your Airbnb kitchen by a gourmet chef.',
                'images' => [
                    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Deep Tissue & Ayurvedic Massage',
                'type' => 'Massage',
                'location' => 'Rishikesh',
                'price' => 2500.00,
                'description' => 'Relaxing 90-minute in-room massage therapy using traditional oils to melt away travel stress.',
                'images' => [
                    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Daily Prepared Healthy Meals',
                'type' => 'Prepared meals',
                'location' => 'Bangalore',
                'price' => 1200.00,
                'description' => 'Fresh, organic breakfast and lunch boxes delivered to your door every morning.',
                'images' => [
                    'https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                ]
            ],
            [
                'title' => 'Personal Yoga & Fitness Training',
                'type' => 'Training',
                'location' => 'Manali',
                'price' => 1500.00,
                'description' => 'Morning mountain-view yoga sessions or high-intensity interval training tailored to your level.',
                'images' => [
                    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                ]
            ]
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}