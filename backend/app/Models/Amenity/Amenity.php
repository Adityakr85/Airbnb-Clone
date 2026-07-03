<?php

namespace App\Models\Amenity;

use Illuminate\Database\Eloquent\Model;
use App\Models\Property;

class Amenity extends Model
{
    protected $table = 'amenities';

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'is_active',
        'sort_order',
    ];

    public function properties()
    {
        return $this->belongsToMany(
            Property::class,
            'property_amenity',
            'amenity_id',
            'property_id'
        );
    }
}