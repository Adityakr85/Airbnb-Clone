<?php

namespace App\Models\Message;

use App\Models\User\User;
use App\Models\Reservation\Reservation;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'reservation_id',
        'body',
        'type',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
