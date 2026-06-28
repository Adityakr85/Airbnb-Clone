<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Review\Review;
use App\Models\User\User;
use App\Models\Reservation\Reservation;
use App\Models\Property\Property;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get all reviews for a property
     */
    public function index(Request $request, $propertyId)
    {
        $reviews = Review::with('reviewer')
            ->where('property_id', $propertyId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at,
                    'reviewer' => [
                        'name' => $review->reviewer->name ?? 'Guest',
                        'avatar' => strtoupper(substr($review->reviewer->name ?? 'G', 0, 1)),
                    ],
                ];
            });

        $avgRating = $reviews->count() > 0
            ? round($reviews->avg('rating'), 1)
            : null;

        return response()->json([
            'success' => true,
            'data' => $reviews,
            'average_rating' => $avgRating,
            'total' => $reviews->count(),
        ]);
    }

    /**
     * Submit a review for a property
     */
    public function store(Request $request, $propertyId)
    {
        $clerkId = $request->input('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Valid Clerk ID required'], 400);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'reservation_id' => 'nullable|exists:reservations,id',
        ]);

        // Check for duplicate review
        $existing = Review::where('reviewer_id', $user->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            // Update existing review
            $existing->update([
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? $existing->comment,
            ]);
            return response()->json(['success' => true, 'data' => $existing]);
        }

        $review = Review::create([
            'property_id' => $propertyId,
            'reviewer_id' => $user->id,
            'reservation_id' => $validated['reservation_id'] ?? null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        // Update property average rating
        $avgRating = Review::where('property_id', $propertyId)->avg('rating');
        \App\Models\Property\Property::where('id', $propertyId)->update(['rating' => round($avgRating, 2)]);

        return response()->json(['success' => true, 'data' => $review], 201);
    }
}
