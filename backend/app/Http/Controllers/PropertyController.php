<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::query()->with('host');
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
        $clerkId = $request->input('clerk_id');
        $user = \App\Models\User::getOrCreateFromClerkId($clerkId);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Valid Host Clerk ID is required'
            ], 400);
        }

        $data = $request->all();
        $data['host_id'] = $user->id;

        // Support form file uploads for images
        if ($request->hasFile('images')) {
            $uploadedImages = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('properties', 'public');
                $uploadedImages[] = $path;
            }
            $data['images'] = $uploadedImages;
        }

        $property = Property::create($data);
        
        return response()->json([
            'success' => true,
            'data' => $property
        ], 201);
    }

    public function show(string $id)
    {
        $property = Property::with('host')->find($id);

        if (!$property) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $property
        ]);
    }

    public function update(Request $request, string $id)
    {
        $clerkId = $request->input('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);
        
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $property = Property::find($id);

        if (!$property) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        if ($property->host_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Support form file uploads for images
        if ($request->hasFile('images')) {
            $uploadedImages = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('properties', 'public');
                $uploadedImages[] = $path;
            }
            $request->merge(['images' => $uploadedImages]);
        }

        $property->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $property
        ]);
    }

    public function destroy(string $id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        $property->delete();

        return response()->json([
            'success' => true,
            'message' => 'Property deleted'
        ]);
    }

    public function destinations()
    {
        $locations = Property::distinct()->pluck('location');
        return response()->json([
            'success' => true,
            'data' => $locations->all()
        ]);
    }
}
