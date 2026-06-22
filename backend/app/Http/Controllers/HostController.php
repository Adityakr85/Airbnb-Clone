<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Reservation;
use Illuminate\Http\Request;

class HostController extends Controller
{
    public function dashboard(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        if (!$clerkId) {
            return response()->json(['success' => false, 'message' => 'clerk_id required'], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        // Get properties
        $properties = Property::where('host_id', $user->id)->get();

        // Get reservations for these properties
        $propertyIds = $properties->pluck('id');
        $reservations = Reservation::with(['guest', 'property'])
            ->whereIn('property_id', $propertyIds)
            ->get();

        // Map reservations for frontend expectations
        $mappedReservations = $reservations->map(function ($r) {
            return [
                'id' => $r->id,
                'guest' => [
                    'name' => $r->guest->name ?? 'Guest',
                    'avatar' => strtoupper(substr($r->guest->name ?? 'G', 0, 1)),
                ],
                'propertyTitle' => $r->property->title ?? 'Property',
                'checkIn' => $r->check_in,
                'checkOut' => $r->check_out,
                'guests' => $r->guests,
                'total' => (float)$r->total,
                'status' => $r->status,
                'message' => $r->message,
            ];
        });

        $totalRevenue = $properties->sum('earnings');
        $totalBookings = $properties->sum('bookings');

        return response()->json([
            'success' => true,
            'data' => [
                'properties' => $properties,
                'reservations' => $mappedReservations,
                'totalRevenue' => $totalRevenue,
                'totalBookings' => $totalBookings,
            ]
        ]);
    }
}
