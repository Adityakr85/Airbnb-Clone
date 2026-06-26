<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::query()->with(['host', 'images']);
        

        $query->where('moderation_status', 'approved');

        $search = $request->input('search');

        if ($search && trim($search) !== '') {
            $searchTerm = trim($search);

            $query->where(function ($q) use ($searchTerm) {
                $q->where('location', 'like', '%' . $searchTerm . '%')
                    ->orWhere('title', 'like', '%' . $searchTerm . '%');
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'clerk_id' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'price' => 'required|numeric',
            'type' => 'required|string|max:255',
            'guests' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:0',
            'beds' => 'nullable|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $user = User::getOrCreateFromClerkId($request->clerk_id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Valid Host Clerk ID is required',
            ], 400);
        }

        $property = Property::create([
            'host_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'location' => $request->location,
            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'price' => $request->price,
            'type' => $request->type,
            'guests' => $request->guests,
            'bedrooms' => $request->bedrooms,
            'beds' => $request->beds ?? 0,
            'bathrooms' => $request->bathrooms,
            'category' => $request->category,
            'status' => 'active',
            'moderation_status' => 'pending',
            'views' => 0,
            'bookings' => 0,
            'earnings' => 0,
        ]);

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('properties', 'public');

            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $path,
                'is_cover' => $index === 0,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Property created successfully',
            'data' => $property->load(['host', 'images']),
        ], 201);
    }

    public function show(string $id)
    {
        $property = Property::with(['host', 'images'])->find($id);

        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $property,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'clerk_id' => 'required|string',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'location' => 'sometimes|string|max:255',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'price' => 'sometimes|numeric',
            'type' => 'sometimes|string|max:255',
            'guests' => 'sometimes|integer|min:1',
            'bedrooms' => 'sometimes|integer|min:0',
            'beds' => 'nullable|integer|min:0',
            'bathrooms' => 'sometimes|integer|min:0',
            'category' => 'nullable|string|max:255',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $user = User::getOrCreateFromClerkId($request->clerk_id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $property = Property::find($id);

        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Not found',
            ], 404);
        }

        if ($property->host_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $property->update($request->only([
            'title',
            'description',
            'location',
            'address',
            'latitude',
            'longitude',
            'price',
            'type',
            'guests',
            'bedrooms',
            'beds',
            'bathrooms',
            'category',
            'status',
        ]));

        if ($request->hasFile('images')) {
            $hasCover = $property->images()->where('is_cover', true)->exists();

            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('properties', 'public');

                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $path,
                    'is_cover' => !$hasCover && $index === 0,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Property updated successfully',
            'data' => $property->load(['host', 'images']),
        ]);
    }

    public function destroy(string $id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Not found',
            ], 404);
        }

        $property->delete();

        return response()->json([
            'success' => true,
            'message' => 'Property deleted',
        ]);
    }

    public function destinations()
    {
        $locations = Property::where('moderation_status', 'approved')
            ->distinct()
            ->pluck('location');

        return response()->json([
            'success' => true,
            'data' => $locations->all(),
        ]);
    }
}