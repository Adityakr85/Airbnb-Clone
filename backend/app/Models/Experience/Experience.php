<?php

namespace App\Models\Experience;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'location', 'category', 'price', 
        'duration', 'groupSize', 'rating', 'reviews', 'hostName', 
        'level', 'images'
    ];

    protected $casts = [
        'images' => 'array',
    ];
   public function getImagesAttribute($value)
    {
        $images = is_string($value) ? json_decode($value, true) : $value;
        
        if (!is_array($images)) {
            $images = [];
        }

        return array_map(function ($imagePath) {
            if (filter_var($imagePath, FILTER_VALIDATE_URL)) return $imagePath;
            return asset('storage/' . ltrim($imagePath, '/'));
        }, $images);
    }
}
