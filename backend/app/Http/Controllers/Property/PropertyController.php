<?php

namespace App\Http\Controllers\Property;

use App\Http\Controllers\Controller;
use App\Models\Property\Property;
use App\Models\Property\PropertyImage;
use App\Models\User\User;
use App\Services\CloudinaryService;
use App\Services\Notification\NotificationService;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    protected $notificationService;
    protected $cloudinaryService;

    public function __construct(
        NotificationService $notificationService,
        CloudinaryService $cloudinaryService
    ) {
        $this->notificationService = $notificationService;
        $this->cloudinaryService = $cloudinaryService;
    }

    private function formatProperty($property)
    {
        $images = $property->images->pluck('image_path')->toArray();
        $coverImage = $property->images->where('is_cover', true)->first();
        $firstImage = $coverImage ? $coverImage->image_path : ($images[0] ?? null);

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
            'guests' => (int) $property->guests,
            'bedrooms' => (int) $property->bedrooms,
            'bathrooms' => (int) $property->bathrooms,

            'category_id' => $property->category_id,
            'category' => $property->category,

            'amenities' => $property->amenities,

            'status' => $property->status,
            'moderation_status' => $property->moderation_status,
            'rating' => $property->rating ? (float) $property->rating : null,
            'views' => (int) $property->views,
            'bookings' => (int) $property->bookings,
            'earnings' => (float) $property->earnings,

            'images' => $images,
            'image' => $firstImage ?: '/placeholder.jpg',
            'image_urls' => $images,

            'host' => $property->host,
        ];
    }

    public function index(Request $request)
    {
        $query = Property::query()->with([
            'host',
            'images',
            'category',
            'amenities',
        ]);

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
            return $this->formatProperty($property);
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
            'guests' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',

            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,id',

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
            'guests' => $request->guests,
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'category_id' => $request->category_id,
            'status' => 'active',
            'moderation_status' => 'pending',
            'views' => 0,
            'bookings' => 0,
            'earnings' => 0,
        ]);

        if ($request->has('amenities')) {
            $property->amenities()->sync($request->amenities);
        }

        foreach ($request->file('images') as $index => $image) {
            $uploadResult = $this->cloudinaryService->upload($image, 'properties');

            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $uploadResult['url'] ?? $uploadResult['secure_url'] ?? $uploadResult,
                'is_cover' => $index === 0,
            ]);
        }

        $property->load(['host', 'images', 'category', 'amenities']);

        $this->notificationService->notifyHostNewProperty($property);
        $this->notificationService->notifyAdminNewProperty($property);

        return response()->json([
            'success' => true,
            'message' => 'Property created successfully',
            'data' => $this->formatProperty($property),
        ], 201);
    }

    public function show(string $id)
    {
        $property = Property::with([
            'host',
            'images',
            'category',
            'amenities',
        ])->find($id);

        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatProperty($property),
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
            'guests' => 'sometimes|integer|min:1',
            'bedrooms' => 'sometimes|integer|min:0',
            'bathrooms' => 'sometimes|integer|min:0',
            'category_id' => 'sometimes|exists:categories,id',

            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,id',

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
            'guests',
            'bedrooms',
            'bathrooms',
            'category_id',
            'status',
        ]));

        if ($request->has('amenities')) {
            $property->amenities()->sync($request->amenities);
        }

        if ($request->hasFile('images')) {
            $hasCover = $property->images()->where('is_cover', true)->exists();

            foreach ($request->file('images') as $index => $image) {
                $uploadResult = $this->cloudinaryService->upload($image, 'properties');

                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $uploadResult['url'] ?? $uploadResult['secure_url'] ?? $uploadResult,
                    'is_cover' => !$hasCover && $index === 0,
                ]);
            }
        }

        $property->load(['host', 'images', 'category', 'amenities']);

        return response()->json([
            'success' => true,
            'message' => 'Property updated successfully',
            'data' => $this->formatProperty($property),
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $clerkId = $request->input('clerk_id');

        if (!$clerkId) {
            return response()->json([
                'success' => false,
                'message' => 'clerk_id required',
            ], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $property = Property::with('images')->find($id);

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

        foreach ($property->images as $image) {
            if (preg_match('/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|webp)/i', $image->image_path, $matches)) {
                $this->cloudinaryService->delete($matches[1]);
            }
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