<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller
{
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
            'data' => $reservation->load(['property.host'])
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

        $reservation = Reservation::with(['guest', 'property.host'])->find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        if (
            $reservation->guest_id !== $user->id &&
            $reservation->property->host_id !== $user->id
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $reservation->status = $this->getRealtimeStatus($reservation);
        $reservation->save();

        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }

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
            ->get()
            ->map(function ($reservation) {
                $reservation->status = $this->getRealtimeStatus($reservation);
                $reservation->save();

                return $reservation;
            });

        return response()->json([
            'success' => true,
            'data' => $trips
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $clerkId = $request->input('clerk_id');

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

        $reservation = Reservation::with('property')
            ->where('id', $id)
            ->where('guest_id', $user->id)
            ->first();

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        $currentStatus = $this->getRealtimeStatus($reservation);

        if ($currentStatus === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Completed booking cannot be cancelled'
            ], 422);
        }

        if ($currentStatus === 'cancelled') {
            return response()->json([
                'success' => true,
                'message' => 'Reservation already cancelled',
                'data' => $reservation
            ]);
        }

        $reservation->update([
            'status' => 'cancelled'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reservation cancelled successfully',
            'data' => $reservation->fresh()->load('property')
        ]);
    }

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

    private function getRealtimeStatus($reservation)
    {
        if ($reservation->status === 'cancelled') {
            return 'cancelled';
        }

        if (Carbon::parse($reservation->check_out)->lt(Carbon::today())) {
            return 'completed';
        }

        return 'pending';
    }
}