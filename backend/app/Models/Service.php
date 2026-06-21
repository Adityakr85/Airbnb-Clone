<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'location',
        'price',
        'description',
        'images',
    ];
    protected $casts = [
        'images' => 'array',
    ];
}