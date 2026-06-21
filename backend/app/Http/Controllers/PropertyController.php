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
        $property = Property::create($request->all());
        
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
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
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
}
