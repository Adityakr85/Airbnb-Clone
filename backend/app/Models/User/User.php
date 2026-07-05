<?php

namespace App\Models\User;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\User\UserProfile;
use App\Models\Reservation\Reservation;
use App\Models\Property\Property;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'clerk_id',
        'name',
        'username',
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'status',
        'profile_image',
        'clerk_image_url',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

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

    public static function getOrCreateFromClerkData(array $data)
    {
        $clerkId = $data['clerk_id'] ?? null;

        if (!$clerkId) {
            return null;
        }

        $name = $data['name'] ?? trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
        $name = $name ?: 'User';

        $email = $data['email'] ?? ($clerkId . '@clerk.com');
        $image = $data['image_url'] ?? null;

        $user = self::firstOrCreate(
            ['clerk_id' => $clerkId],
            [
                'name' => $name,
                'username' => $data['username'] ?? null,
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'email' => $email,
                'password' => bcrypt(Str::random(32)),
                'role' => 'guest',
                'status' => 'active',
                'profile_image' => $image,
                'clerk_image_url' => $image,
                'last_login_at' => now(),
            ]
        );

        $user->update([
            'name' => $name,
            'username' => $data['username'] ?? $user->username,
            'first_name' => $data['first_name'] ?? $user->first_name,
            'last_name' => $data['last_name'] ?? $user->last_name,
            'email' => $email,
            'profile_image' => $image ?? $user->profile_image,
            'clerk_image_url' => $image ?? $user->clerk_image_url,
            'last_login_at' => now(),
        ]);

        return $user;
    }

   public static function getOrCreateFromClerkId(
    $clerkId,
    $name = null,
    $email = null,
    $defaultRole = 'guest',
    $role = null
) {
    if (!$clerkId) {
        return null;
    }

    $user = self::firstOrCreate(
        ['clerk_id' => $clerkId],
        [
            'name' => $name ?: 'User',
            'email' => $email ?: ($clerkId . '@clerk.com'),
            'password' => bcrypt(Str::random(32)),
            'role' => $role ?? $defaultRole,
            'status' => 'active',
            'last_login_at' => now(),
        ]
    );

    // Never overwrite existing data with placeholder values
    if ($name && $name !== 'User') {
        $user->name = $name;
    }

    if (
        $email &&
        $email !== 'host' &&
        $email !== ($clerkId . '@clerk.com')
    ) {
        $user->email = $email;
    }

    $user->last_login_at = now();
    $user->save();

    return $user;
}
}