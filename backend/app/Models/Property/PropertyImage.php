<?php

namespace App\Models\Property;

use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    protected $fillable = [
        'property_id',
        'image_path',
        'is_cover',
    ];

    protected $appends = ['url'];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function getUrlAttribute()
    {
        // If it's already a full URL (external), return as-is
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }
        // Otherwise treat as local storage path
        return asset('storage/' . ltrim($this->image_path, '/'));
    }
}