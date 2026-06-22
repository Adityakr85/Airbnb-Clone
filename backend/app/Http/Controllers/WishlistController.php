<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\User;
use App\Models\Property;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Get all wishlisted properties for a user
     */
    public function index(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        if (!$clerkId) {
            return response()->json(['success' => false, 'message' => 'clerk_id required'], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);

        $items = Wishlist::with('property')
            ->where('user_id', $user->id)
            ->get()
            ->map(fn($w) => $w->property)
            ->filter()
            ->values();

        return response()->json(['success' => true, 'data' => $items]);
    }

    /**
     * Toggle a property in/out of wishlist
     */
    public function toggle(Request $request)
    {
        $clerkId = $request->input('clerk_id');
        $propertyId = $request->input('property_id');

        if (!$clerkId || !$propertyId) {
            return response()->json(['success' => false, 'message' => 'clerk_id and property_id required'], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);

        $existing = Wishlist::where('user_id', $user->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['success' => true, 'wishlisted' => false]);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'property_id' => $propertyId,
        ]);

        return response()->json(['success' => true, 'wishlisted' => true]);
    }

    /**
     * Check if a single property is wishlisted
     */
    public function check(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $propertyId = $request->query('property_id');

        if (!$clerkId || !$propertyId) {
            return response()->json(['success' => false, 'wishlisted' => false]);
        }

        $user = User::where('clerk_id', $clerkId)->first();
        if (!$user) {
            return response()->json(['success' => true, 'wishlisted' => false]);
        }

        $wishlisted = Wishlist::where('user_id', $user->id)
            ->where('property_id', $propertyId)
            ->exists();

        return response()->json(['success' => true, 'wishlisted' => $wishlisted]);
    }
}
