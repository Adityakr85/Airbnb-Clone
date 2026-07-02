<?php

namespace App\Models\Property;

use App\Models\User\User;
use App\Models\Property\PropertyImage;
use App\Models\Category\Category;
use App\Models\Amenity\Amenity;
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
        'price',
        'guests',
        'bedrooms',
        'bathrooms',
        'category_id',
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

    public function category()
{
    return $this->belongsTo(Category::class, 'category_id');
}

public function amenities()
{
    return $this->belongsToMany(
        Amenity::class,
        'property_amenity',
        'property_id',
        'amenity_id'
    );
}

}