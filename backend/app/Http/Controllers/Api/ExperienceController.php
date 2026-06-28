<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index(Request $request)
    {
        $query = Experience::query();

        $search = $request->input('search');
        
        if ($search && trim($search) !== '') {
            $searchTerm = trim($search);
            
            $query->where(function ($q) use ($searchTerm) {
                $q->where('location', 'like', '%' . $searchTerm . '%')
                  ->orWhere('title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('category', 'like', '%' . $searchTerm . '%');
            });
        }

        $experiences = $query->get()->map(function ($experience) {
            return [
                'id' => $experience->id,
                'title' => $experience->title,
                'description' => $experience->description,
                'location' => $experience->location,
                'category' => $experience->category,
                'price' => (float) $experience->price,
                'duration' => $experience->duration,
                'groupSize' => $experience->group_size,
                'rating' => $experience->rating ? (float) $experience->rating : null,
                'reviews' => $experience->reviews,
                'hostName' => $experience->host_name,
                'level' => $experience->level,
                'images' => $experience->images ?? [],
                'image' => ($experience->images && count($experience->images) > 0) ? $experience->images[0] : '/placeholder.jpg',
                'image_urls' => $experience->images ?? [],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $experiences,
        ]);
    }

    public function store(Request $request)
    {
        $experience = Experience::create($request->all());
        
        return response()->json([
            'success' => true,
            'data' => $experience
        ], 201);
    }

    public function show($id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return response()->json(['success' => false, 'message' => 'Experience not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $experience->id,
                'title' => $experience->title,
                'description' => $experience->description,
                'location' => $experience->location,
                'category' => $experience->category,
                'price' => (float) $experience->price,
                'duration' => $experience->duration,
                'groupSize' => $experience->group_size,
                'rating' => $experience->rating ? (float) $experience->rating : null,
                'reviews' => $experience->reviews,
                'hostName' => $experience->host_name,
                'level' => $experience->level,
                'images' => $experience->images ?? [],
                'image' => ($experience->images && count($experience->images) > 0) ? $experience->images[0] : '/placeholder.jpg',
                'image_urls' => $experience->images ?? [],
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return response()->json(['success' => false, 'message' => 'Experience not found'], 404);
        }

        $experience->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $experience
        ]);
    }

    public function destroy($id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return response()->json(['success' => false, 'message' => 'Experience not found'], 404);
        }

        $experience->delete();

        return response()->json([
            'success' => true,
            'message' => 'Experience deleted'
        ]);
    }
}