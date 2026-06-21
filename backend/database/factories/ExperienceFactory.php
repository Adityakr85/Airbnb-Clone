<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExperienceFactory extends Factory
{
    public function definition(): array
    {
        // Arrays of realistic categories and levels to randomly pick from
        $categories = ['culinary', 'culture', 'wellness', 'adventure', 'nature', 'workshops'];
        $levels = ['Beginner friendly', 'All levels', 'Moderate', 'Strenuous'];

        return [
            // Generate a random 3-word title like "Mountain Cooking Class"
            'title' => fake()->words(3, true), 
            'description' => fake()->paragraph(2),
            // Generate a random city (e.g., "Mumbai, India")
            'location' => fake()->city() . ', India', 
            'category' => fake()->randomElement($categories),
            // Random price between $30 and $200
            'price' => fake()->numberBetween(30, 200),
            // E.g., "3 hours"
            'duration' => fake()->numberBetween(1, 6) . ' hours',
            // E.g., "Up to 8"
            'groupSize' => 'Up to ' . fake()->numberBetween(4, 15),
            // Random rating between 4.00 and 5.00
            'rating' => fake()->randomFloat(2, 4, 5),
            // Random review count
            'reviews' => fake()->numberBetween(10, 600),
            'hostName' => fake()->name(),
            'level' => fake()->randomElement($levels),
            // Generate an array of 2 random Unsplash travel placeholder images
            'images' => [
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=400&fit=crop',
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=400&fit=crop'
            ],
        ];
    }
}
