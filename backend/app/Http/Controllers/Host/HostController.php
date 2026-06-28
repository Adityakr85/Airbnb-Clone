<?php

namespace App\Http\Controllers\Host;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use App\Models\Property\Property;
use App\Models\Reservation\Reservation;
use Illuminate\Http\Request;

class HostController extends Controller
{
    public function dashboard(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        if (!$clerkId) {
            return response()->json(['success' => false, 'message' => 'clerk_id required'], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'host', $role);
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
            $images = $r->property->images ?? [];
            $firstImage = $images[0] ?? null;
            
            return [
                'id' => $r->id,
                'property_id' => $r->property_id,
                'property_title' => $r->property ? $r->property->title : '',
                'propertyTitle' => $r->property ? $r->property->title : '',
                'guest' => $r->guest ? [
                    'name' => $r->guest->name,
                    'email' => $r->guest->email,
                    'phone' => $r->guest->phone ?? null,
                    'avatar' => $r->guest->profile_image 
                        ? (filter_var($r->guest->profile_image, FILTER_VALIDATE_URL) 
                            ? $r->guest->profile_image 
                            : asset('storage/' . ltrim($r->guest->profile_image, '/'))) 
                        : null,
                ] : [
                    'name' => 'Guest',
                    'email' => null,
                    'phone' => null,
                    'avatar' => null,
                ],
                'check_in' => $r->check_in,
                'check_out' => $r->check_out,
                'checkIn' => $r->check_in,
                'checkOut' => $r->check_out,
                'status' => $r->status,
                'payment_status' => $r->payment_status,
                'total' => (float) $r->total,
                'guests' => $r->guests,
                'message' => $r->message,
                'created_at' => $r->created_at,
                'property' => $r->property ? [
                    'id' => $r->property->id,
                    'title' => $r->property->title,
                    'location' => $r->property->location,
                    'images' => $images,
                    'image' => $firstImage,
                    'price' => (float) $r->property->price,
                ] : null,
            ];
        })->values();

        // Calculate stats
        $totalProperties = $properties->count();
        $totalReservations = $reservations->count();
        $totalEarnings = $properties->sum('earnings');
        $pendingReservations = $reservations->where('status', 'pending')->count();
        $confirmedReservations = $reservations->where('status', 'confirmed')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'properties' => $properties,
                'reservations' => $mappedReservations,
                'stats' => [
                    'totalProperties' => $totalProperties,
                    'totalReservations' => $totalReservations,
                    'totalEarnings' => $totalEarnings,
                    'pendingReservations' => $pendingReservations,
                    'confirmedReservations' => $confirmedReservations,
                ]
            ]
        ]);
    }
}