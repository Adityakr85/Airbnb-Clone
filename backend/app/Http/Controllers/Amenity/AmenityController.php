<?php

namespace App\Http\Controllers\Amenity;

use App\Http\Controllers\Controller;
use App\Models\Amenity\Amenity;

class AmenityController extends Controller
{
    public function index()
    {
        $amenities = Amenity::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $amenities,
        ]);
    }
}