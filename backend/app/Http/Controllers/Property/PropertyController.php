<?php

namespace App\Http\Controllers\Property;

use App\Http\Controllers\Controller;
use App\Models\Property\Property;
use App\Models\Property\PropertyImage;
use App\Models\User\User;
use App\Services\Notification\NotificationService;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

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

        $properties = $query->get()->map(function ($property) {
            $images = $property->images->pluck('image_path')->toArray();
            $coverImage = $property->images->where('is_cover', true)->first();
            $firstImage = $coverImage ? $coverImage->image_path : ($images[0] ?? null);
            
            $imageUrl = $firstImage ? 
                (filter_var($firstImage, FILTER_VALIDATE_URL) ? $firstImage : asset('storage/' . ltrim($firstImage, '/'))) :
                '/placeholder.jpg';

            return [
                'id' => $property->id,
                'host_id' => $property->host_id,
                'title' => $property->title,
                'description' => $property->description,
                'location' => $property->location,
                'address' => $property->address,
                'latitude' => $property->latitude,
                'longitude' => $property->longitude,
                'price' => (float) $property->price,
                'type' => $property->type,
                'guests' => (int) $property->guests,
                'bedrooms' => (int) $property->bedrooms,
                'beds' => (int) $property->beds,
                'bathrooms' => (int) $property->bathrooms,
                'category' => $property->category,
                'status' => $property->status,
                'moderation_status' => $property->moderation_status,
                'rating' => $property->rating ? (float) $property->rating : null,
                'views' => (int) $property->views,
                'bookings' => (int) $property->bookings,
                'earnings' => (float) $property->earnings,
                'images' => $images,
                'image' => $imageUrl,
                'image_urls' => $images,
                'host' => $property->host,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $properties,
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

        // Send notifications
        $property->load('host');
        $this->notificationService->notifyHostNewProperty($property);
        $this->notificationService->notifyAdminNewProperty($property);

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

        $images = $property->images->pluck('image_path')->toArray();
        $coverImage = $property->images->where('is_cover', true)->first();
        $firstImage = $coverImage ? $coverImage->image_path : ($images[0] ?? null);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $property->id,
                'title' => $property->title,
                'description' => $property->description,
                'location' => $property->location,
                'address' => $property->address,
                'latitude' => $property->latitude,
                'longitude' => $property->longitude,
                'price' => (float) $property->price,
                'type' => $property->type,
                'guests' => $property->guests,
                'bedrooms' => $property->bedrooms,
                'beds' => $property->beds,
                'bathrooms' => $property->bathrooms,
                'category' => $property->category,
                'status' => $property->status,
                'moderation_status' => $property->moderation_status,
                'rating' => $property->rating ? (float) $property->rating : null,
                'views' => $property->views,
                'bookings' => $property->bookings,
                'earnings' => (float) $property->earnings,
                'images' => $images,
                'image' => $firstImage,
                'image_urls' => $images,
                'host' => $property->host ? [
                    'id' => $property->host->id,
                    'name' => $property->host->name,
                    'email' => $property->host->email,
                ] : null,
            ],
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