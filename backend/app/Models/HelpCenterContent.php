<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HelpCenterContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'content_type',
        'category',
        'section',
        'breadcrumbs',
        'title',
        'summary',
        'image',
        'url',
        'body_content',
        'is_published'
    ];

    protected $casts = [
        'breadcrumbs' => 'array',
    ];
}