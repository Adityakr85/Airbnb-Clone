<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\User\UserProfile;
use App\Models\Reservation\Reservation;
use App\Models\Property\Property;

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
        'last_login_at',
        'status',
    ];

    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'clerk_id', 'clerk_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'guest_id');
    }

    public function hostedProperties()
    {
        return $this->hasMany(Property::class, 'host_id');
    }

    public static function getOrCreateFromClerkId($clerkId, $name = 'User', $email = null, $defaultRole = 'guest', $role = null)
    {
        if (!$clerkId) return null;
        $role = $role ?: 'guest';

        $user = self::firstOrCreate(
            ['clerk_id' => $clerkId],
            [
                'name' => $name,
                'email' => $email ?? ($clerkId . '@clerk.com'),
                'password' => bcrypt(\Illuminate\Support\Str::random(16)),
                'role' => $defaultRole,
            ]
        );

        // If a specific role is provided, update the role if it's different
        if ($role !== null && $user->role !== $role) {
            $user->role = $role;
            $user->save();
        }

        return $user;
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
