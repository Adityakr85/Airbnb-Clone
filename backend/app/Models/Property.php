<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 
        'description', 
        'location', 
        'price', 
        'price_per_night',
        'base_price',
        'rating',
        'host_id', 
        'images',
        'type',
        'guests',
        'bedrooms',
        'bathrooms',
        'category',
        'status',
        'views',
        'bookings',
        'earnings'
    ];

    protected $casts = ['images' => 'array'];

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

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