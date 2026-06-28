<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'clerk_id',
        'photo_url',
        'decade',
        'travel',
        'work',
        'pets',
        'school',
        'skill',
        'song',
        'fun_fact',
        'time',
        'obsessed',
        'bio_title',
        'languages',
        'live',
        'intro',
        'interests',
    ];
}
