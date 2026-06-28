<?php

namespace App\Http\Controllers\Reservation;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use App\Models\Property\Property;
use App\Models\Reservation\Reservation;
use App\Services\Notification\NotificationService;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Create a new booking/reservation request
     */
    public function store(Request $request)
    {
        $clerkId = $request->input('clerk_id');
        
        if (!$clerkId) {
            return response()->json([
                'success' => false,
                'message' => 'Valid Clerk ID is required'
            ], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
            'message' => 'nullable|string',
        ]);

        $property = Property::find($validated['property_id']);
        
        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Property not found'
            ], 404);
        }

        if ($validated['guests'] > $property->guests) {
            return response()->json([
                'success' => false,
                'message' => 'Number of guests exceeds property capacity'
            ], 400);
        }

        $existingReservation = Reservation::where('property_id', $validated['property_id'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('check_in', [$validated['check_in'], $validated['check_out']])
                      ->orWhereBetween('check_out', [$validated['check_in'], $validated['check_out']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('check_in', '<=', $validated['check_in'])
                            ->where('check_out', '>=', $validated['check_out']);
                      });
            })
            ->exists();

        if ($existingReservation) {
            return response()->json([
                'success' => false,
                'message' => 'Property is not available for the selected dates'
            ], 400);
        }

        $reservation = Reservation::create([
            'property_id' => $validated['property_id'],
            'guest_id' => $user->id,
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'guests' => $validated['guests'],
            'total' => $validated['total'],
            'status' => 'pending',
            'payment_status' => 'pending',
            'message' => $validated['message'] ?? null,
        ]);

        // Load relationships for notification
        $reservation->load(['guest', 'property.host']);

        // Notify host about new reservation
        $this->notificationService->notifyHostNewReservation($reservation);

        // Notify guest about reservation request
        $this->notificationService->sendToUser(
            $reservation->guest_id,
            'Booking Request Sent',
            "Your booking request for '{$reservation->property->title}' has been sent to the host.",
            'reservation_requested',
            [
                'reservation_id' => $reservation->id,
                'property_id' => $reservation->property_id,
                'property_title' => $reservation->property->title,
                'check_in' => $reservation->check_in,
                'check_out' => $reservation->check_out,
            ]
        );

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

        $reservation = Reservation::with(['guest', 'property.host', 'property.images'])->find($id);

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

        $images = $reservation->property->images ?? [];
        $firstImage = $images[0] ?? null;

        $data = [
            'id' => $reservation->id,
            'check_in' => $reservation->check_in,
            'check_out' => $reservation->check_out,
            'checkIn' => $reservation->check_in,
            'checkOut' => $reservation->check_out,
            'guests' => $reservation->guests,
            'total' => (float) $reservation->total,
            'status' => $reservation->status,
            'payment_status' => $reservation->payment_status,
            'message' => $reservation->message,
            'created_at' => $reservation->created_at,
            'guest' => $reservation->guest ? [
                'id' => $reservation->guest->id,
                'name' => $reservation->guest->name,
                'email' => $reservation->guest->email,
                'avatar' => $reservation->guest->profile_image,
            ] : null,
            'property' => $reservation->property ? [
                'id' => $reservation->property->id,
                'title' => $reservation->property->title,
                'location' => $reservation->property->location,
                'address' => $reservation->property->address,
                'type' => $reservation->property->type,
                'price' => (float) $reservation->property->price,
                'guests' => $reservation->property->guests,
                'bedrooms' => $reservation->property->bedrooms,
                'bathrooms' => $reservation->property->bathrooms,
                'rating' => (float) ($reservation->property->rating ?? 0),
                'images' => $images,
                'image' => $firstImage,
                'host' => $reservation->property->host ? [
                    'id' => $reservation->property->host->id,
                    'name' => $reservation->property->host->name,
                    'avatar' => $reservation->property->host->profile_image,
                ] : null,
            ] : null,
        ];

        return response()->json([
            'success' => true,
            'data' => $data
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

        $trips = Reservation::with(['property.host', 'property.images'])
            ->where('guest_id', $user->id)
            ->orderBy('check_in', 'desc')
            ->get()
            ->map(function ($r) {
                $images = $r->property->images ?? [];
                $firstImage = $images[0] ?? null;
                
                return [
                    'id' => $r->id,
                    'check_in' => $r->check_in,
                    'check_out' => $r->check_out,
                    'checkIn' => $r->check_in,
                    'checkOut' => $r->check_out,
                    'guests' => $r->guests,
                    'total' => (float) $r->total,
                    'status' => $r->status,
                    'payment_status' => $r->payment_status,
                    'message' => $r->message,
                    'property' => $r->property ? [
                        'id' => $r->property->id,
                        'title' => $r->property->title,
                        'location' => $r->property->location,
                        'address' => $r->property->address,
                        'type' => $r->property->type,
                        'price' => (float) $r->property->price,
                        'guests' => $r->property->guests,
                        'bedrooms' => $r->property->bedrooms,
                        'bathrooms' => $r->property->bathrooms,
                        'rating' => (float) ($r->property->rating ?? 0),
                        'images' => $images,
                        'image' => $firstImage,
                        'host' => $r->property->host ? [
                            'id' => $r->property->host->id,
                            'name' => $r->property->host->name,
                            'avatar' => $r->property->host->profile_image,
                        ] : null,
                    ] : null,
                ];
            })->values();

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
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'clerk_id' => 'required'
        ]);

        $user = User::getOrCreateFromClerkId($validated['clerk_id']);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Check authorization: only host can update status (except guest can cancel their own)
        $isHost = $reservation->property->host_id === $user->id;
        $isGuest = $reservation->guest_id === $user->id;
        $newStatus = $validated['status'];

        if (!$isHost && !($isGuest && $newStatus === 'cancelled')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $oldStatus = $reservation->status;

        // If guest is cancelling, store cancellation reason
        $cancellationReason = $request->input('cancellation_reason');
        $updateData = ['status' => $newStatus];
        
        if ($newStatus === 'cancelled') {
            $updateData['payment_status'] = 'refunded';
            if ($cancellationReason) {
                $updateData['cancellation_reason'] = $cancellationReason;
            }
        }

        $reservation->update($updateData);

        // Reload relationships for notifications
        $reservation->load(['guest', 'property.host']);

        // If status changed to confirmed, update property stats and notify guest
        if ($newStatus === 'confirmed' && $oldStatus !== 'confirmed') {
            $property = $reservation->property;
            if ($property) {
                $property->increment('bookings');
                $property->increment('earnings', $reservation->total);
            }
            $this->notificationService->notifyGuestReservationConfirmed($reservation);
        }

        // If status changed to completed, notify both host and guest
        if ($newStatus === 'completed' && $oldStatus !== 'completed') {
            $this->notificationService->notifyHostReservationCompleted($reservation);
            $this->notificationService->notifyGuestReservationCompleted($reservation);
        }

        // If status changed to cancelled, notify both host and guest
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            if ($isGuest) {
                // Guest cancelled - notify host
                $this->notificationService->notifyHostGuestCancelled($reservation, $cancellationReason);
            } else {
                // Host cancelled - notify guest
                $this->notificationService->notifyGuestReservationCancelled($reservation, $cancellationReason);
            }
        }

        // If status changed from confirmed to cancelled, decrement property stats
        if ($oldStatus === 'confirmed' && $newStatus === 'cancelled') {
            $property = $reservation->property;
            if ($property) {
                $property->decrement('bookings');
                $property->decrement('earnings', $reservation->total);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }

    /**
     * Cancel reservation (guest action)
     */
    public function cancel(Request $request, $id)
    {
        $validated = $request->validate([
            'clerk_id' => 'required',
            'cancellation_reason' => 'nullable|string'
        ]);

        $user = User::getOrCreateFromClerkId($validated['clerk_id']);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $reservation = Reservation::with('property')->find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        // Only the guest can cancel their own reservation
        if ($reservation->guest_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Only the guest can cancel this reservation'
            ], 403);
        }

        // Cannot cancel if already cancelled or completed
        if (in_array($reservation->status, ['cancelled', 'completed'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel a ' . $reservation->status . ' reservation'
            ], 400);
        }

        $oldStatus = $reservation->status;
        $cancellationReason = $validated['cancellation_reason'] ?? null;
        $reservation->update([
            'status' => 'cancelled',
            'payment_status' => 'refunded',
            'cancellation_reason' => $cancellationReason
        ]);

        // Reload for notifications
        $reservation->load(['guest', 'property.host']);

        // Notify guest about cancellation
        $this->notificationService->notifyGuestReservationCancelled($reservation, $cancellationReason);

        // Notify host about guest cancellation
        $this->notificationService->notifyHostGuestCancelled($reservation, $cancellationReason);

        // If it was confirmed, decrement property stats
        if ($oldStatus === 'confirmed') {
            $property = $reservation->property;
            if ($property) {
                $property->decrement('bookings');
                $property->decrement('earnings', $reservation->total);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }
}
