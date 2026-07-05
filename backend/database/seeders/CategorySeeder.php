<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['Cooking', 'experience', '👨‍🍳', 101],
            ['Food & Drink', 'experience', '🍽️', 102],
            ['Photography', 'experience', '📸', 103],
            ['Art & Culture', 'experience', '🎨', 104],
            ['Music', 'experience', '🎵', 105],
            ['Dance', 'experience', '💃', 106],
            ['Hiking', 'experience', '🥾', 107],
            ['Camping', 'experience', '🏕️', 108],
            ['Cycling', 'experience', '🚴', 109],
            ['Surfing', 'experience', '🏄', 110],
            ['Kayaking', 'experience', '🛶', 111],
            ['Fishing', 'experience', '🎣', 112],
            ['Wildlife', 'experience', '🦁', 113],
            ['Wellness', 'experience', '🧘', 114],
            ['Yoga', 'experience', '🧎', 115],
            ['Fitness', 'experience', '🏋️', 116],
            ['Nightlife', 'experience', '🌃', 117],
            ['Shopping', 'experience', '🛍️', 118],
            ['History', 'experience', '🏛️', 119],
            ['Architecture', 'experience', '🏗️', 120],
            ['Nature', 'experience', '🌿', 121],
            ['Adventure', 'experience', '🧗', 122],
            ['Wine Tasting', 'experience', '🍷', 123],
            ['Coffee Experience', 'experience', '☕', 124],

            ['House', 'property', '🏠', 1],
            ['Flat/apartment', 'property', '🏢', 2],
            ['Barn', 'property', '🏚️', 3],
            ['Bed & breakfast', 'property', '☕', 4],
            ['Boat', 'property', '⛵', 5],
            ['Cabin', 'property', '🏡', 6],
            ['Campervan/motorhome', 'property', '🚐', 7],
            ['Casa particular', 'property', '🏘️', 8],
            ['Castle', 'property', '🏰', 9],
            ['Cave', 'property', '🪨', 10],
            ['Container', 'property', '📦', 11],
            ['Cycladic home', 'property', '🏛️', 12],
            ['Farm', 'property', '🌾', 13],
            ['Guesthouse', 'property', '🛎️', 14],
            ['Hotel', 'property', '🏨', 15],
            ['Tent', 'property', '⛺', 16],
            ['Treehouse', 'property', '🌳', 17],
            ['Villa', 'property', '🏖️', 18],
        ];

        foreach ($categories as [$name, $type, $icon, $order]) {
            DB::table('categories')->updateOrInsert(
                [
                    'slug' => Str::slug($name),
                    'category_for' => $type,
                ],
                [
                    'name' => $name,
                    'icon' => $icon,
                    'image' => null,
                    'is_active' => true,
                    'sort_order' => $order,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}