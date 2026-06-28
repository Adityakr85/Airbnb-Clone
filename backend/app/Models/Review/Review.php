<?php

namespace App\Models\Review;

use App\Models\User\User;
use App\Models\Property\Property;
use App\Models\Reservation\Reservation;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'reservation_id',
        'reviewer_id',
        'property_id',
        'rating',
        'comment',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
