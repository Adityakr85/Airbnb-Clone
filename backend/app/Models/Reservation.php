<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

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
        'message',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'total' => 'decimal:2',
    ];

    protected $appends = [
        'checkIn',
        'checkOut',
        'realtime_status',
    ];

    public function getCheckInAttribute()
    {
        return $this->attributes['check_in'] ?? null;
    }

    public function getCheckOutAttribute()
    {
        return $this->attributes['check_out'] ?? null;
    }

    public function getRealtimeStatusAttribute()
    {
        if ($this->status === 'cancelled') {
            return 'cancelled';
        }

        if (Carbon::parse($this->check_out)->lt(Carbon::today())) {
            return 'completed';
        }

        return 'pending';
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