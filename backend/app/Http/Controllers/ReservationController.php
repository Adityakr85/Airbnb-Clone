<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Create a new booking/reservation request
     */
    public function store(Request $request)
    {
        $clerkId = $request->input('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Valid Clerk ID is required'
            ], 400);
        }

        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
            'message' => 'nullable|string',
        ]);

        $reservation = Reservation::create([
            'property_id' => $validated['property_id'],
            'guest_id' => $user->id,
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'guests' => $validated['guests'],
            'total' => $validated['total'],
            'status' => 'pending',
            'message' => $validated['message'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $reservation
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $clerkId = $request->query('clerk_id');
        if (!$clerkId) {
            return response()->json([
                'success' => false,
                'message' => 'clerk_id required'
            ], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $reservation = Reservation::with(['property.guest', 'property.host'])->find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        // Check if the authenticated user is either the guest or the host of the property
        if ($reservation->guest_id !== $user->id && $reservation->property->host_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }

    /**
     * Get the authenticated guest's trip/booking history
     */
    public function guestTrips(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        if (!$clerkId) {
            return response()->json([
                'success' => false,
                'message' => 'clerk_id required'
            ], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $trips = Reservation::with('property')
            ->where('guest_id', $user->id)
            ->orderBy('check_in', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $trips
        ]);
    }

    /**
     * Update reservation status (host action)
     */
    public function updateStatus(Request $request, $id)
    {
        $reservation = Reservation::with('property')->find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled'
        ]);

        $oldStatus = $reservation->status;
        $newStatus = $validated['status'];

        $reservation->update(['status' => $newStatus]);

        // If status changed to confirmed, update property stats
        if ($newStatus === 'confirmed' && $oldStatus !== 'confirmed') {
            $property = $reservation->property;
            if ($property) {
                $property->increment('bookings');
                $property->increment('earnings', $reservation->total);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }
}
