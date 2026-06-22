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
        $properties = Property::where('host_id', $user->id)->get()->map(function ($property) {
            $images = is_array($property->images) ? $property->images : [];
            $firstImage = $images[0] ?? null;

            return [
                'id' => $property->id,
                'title' => (string) ($property->title ?? ''),
                'location' => (string) ($property->location ?? ''),
                'rating' => (float) ($property->rating ?? 0),
                'views' => (int) ($property->views ?? 0),
                'bookings' => (int) ($property->bookings ?? 0),
                // HostDashboard uses price.toLocaleString("en-IN")
                'price' => (float) ($property->price ?? 0),
                'earnings' => (float) ($property->earnings ?? 0),
                'image' => $firstImage,
            ];
        })->values();

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
                    'email' => $r->guest->email ?? '',
                    'phone' => $r->guest->phone ?? '',
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
