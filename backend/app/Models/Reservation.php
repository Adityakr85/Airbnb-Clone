<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'property_id',
        'guest_id',
        'check_in',
        'check_out',
        'guests',
        'total',
        'status',
        'payment_status',
        'message'
    ];

    protected $appends = ['checkIn', 'checkOut'];

    public function getCheckInAttribute()
    {
        return $this->attributes['check_in'] ?? null;
    }

    public function getCheckOutAttribute()
    {
        return $this->attributes['check_out'] ?? null;
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function guest()
    {
        return $this->belongsTo(User::class, 'guest_id');
    }
}
