<?php

namespace App\Models\Property;

use App\Models\User\User;
use App\Models\Property\PropertyImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'title',
        'description',
        'location',
        'address',
        'latitude',
        'longitude',
        'type',
        'price',
        'guests',
        'bedrooms',
        'beds',
        'bathrooms',
        'category',
        'status',
        'moderation_status',
        'rating',
        'views',
        'bookings',
        'earnings',
    ];

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function coverImage()
    {
        return $this->hasOne(PropertyImage::class)->where('is_cover', true);
    }
}