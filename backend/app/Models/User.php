<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'clerk_id',
        'role',
        'profile_image',
    ];

    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'clerk_id', 'clerk_id');
    }

    public static function getOrCreateFromClerkId($clerkId, $name = 'User', $email = null)
    {
        if (!$clerkId) return null;
        
        return self::firstOrCreate(
            ['clerk_id' => $clerkId],
            [
                'name' => $name,
                'email' => $email ?? ($clerkId . '@clerk.com'),
                'password' => bcrypt(\Illuminate\Support\Str::random(16)),
                'role' => 'guest',
            ]
        );
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
