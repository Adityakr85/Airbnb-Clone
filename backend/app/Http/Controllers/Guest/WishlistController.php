<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Wishlist\Wishlist;
use App\Models\User\User;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $clerkId = $request->query('clerk_id');

        if (!$clerkId) {
            return response()->json([
                'success' => false,
                'message' => 'clerk_id required',
            ], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);

        $items = Wishlist::with([
                'property.images',
                'property.category',
                'property.host',
            ])
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($wishlist) {
                $property = $wishlist->property;

                if (!$property) return null;

                $images = $property->images->pluck('image_path')->toArray();
                $cover = $property->images->where('is_cover', true)->first();
                $firstImage = $cover ? $cover->image_path : ($images[0] ?? null);

                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'description' => $property->description,
                    'location' => $property->location,
                    'address' => $property->address,
                    'latitude' => $property->latitude,
                    'longitude' => $property->longitude,
                    'price' => (float) $property->price,
                    'guests' => (int) $property->guests,
                    'bedrooms' => (int) $property->bedrooms,
                    'bathrooms' => (int) $property->bathrooms,
                    'rating' => $property->rating ? (float) $property->rating : null,
                    'category_id' => $property->category_id,
                    'category' => $property->category,
                    'host' => $property->host,
                    'images' => $images,
                    'image_urls' => $images,
                    'image' => $firstImage ?: '/placeholder.jpg',
                    'wishlisted' => true,
                ];
            })
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }

    public function toggle(Request $request)
    {
        $clerkId = $request->input('clerk_id');
        $propertyId = $request->input('property_id');

        if (!$clerkId || !$propertyId) {
            return response()->json([
                'success' => false,
                'message' => 'clerk_id and property_id required',
            ], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);

        $existing = Wishlist::where('user_id', $user->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            $existing->delete();

            return response()->json([
                'success' => true,
                'wishlisted' => false,
            ]);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'property_id' => $propertyId,
        ]);

        return response()->json([
            'success' => true,
            'wishlisted' => true,
        ]);
    }

    public function check(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $propertyId = $request->query('property_id');

        if (!$clerkId || !$propertyId) {
            return response()->json([
                'success' => false,
                'wishlisted' => false,
            ]);
        }

        $user = User::where('clerk_id', $clerkId)->first();

        if (!$user) {
            return response()->json([
                'success' => true,
                'wishlisted' => false,
            ]);
        }

        $wishlisted = Wishlist::where('user_id', $user->id)
            ->where('property_id', $propertyId)
            ->exists();

        return response()->json([
            'success' => true,
            'wishlisted' => $wishlisted,
        ]);
    }
}