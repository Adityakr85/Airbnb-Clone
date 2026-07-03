<?php

namespace App\Models\Category;

use App\Models\Property\Property;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category_for',
        'icon',
        'image',
        'is_active',
        'sort_order',
    ];

    public function properties()
    {
        return $this->hasMany(Property::class);
    }
}