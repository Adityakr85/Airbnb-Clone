<?php

namespace App\Http\Controllers;

use App\Models\Experience;
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

        return response()->json([
            'success' => true,
            'data' => $query->get(),
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
            'data' => $experience
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