<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();
        $search = $request->input('search');
        if ($search && trim($search) !== '' && strtolower(trim($search)) !== 'nearby') {
            $searchTerm = trim($search);
            $query->where(function ($q) use ($searchTerm) {
                $q->where('location', 'like', '%' . $searchTerm . '%')
                  ->orWhere('title', 'like', '%' . $searchTerm . '%');
            });
        }

        $type = $request->input('type');
        if ($type && trim($type) !== '') {
            $query->where('type', trim($type));
        }

        $services = $query->get()->map(function ($service) {
            return [
                'id' => $service->id,
                'title' => $service->title,
                'type' => $service->type,
                'location' => $service->location,
                'price' => (float) $service->price,
                'description' => $service->description,
                'images' => $service->images ?? [],
                'image' => ($service->images && count($service->images) > 0) ? $service->images[0] : '/placeholder.jpg',
                'image_urls' => $service->images ?? [],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }
    
    public function store(Request $request)
    {
        $service = Service::create($request->all());
        
        return response()->json([
            'success' => true,
            'data' => $service
        ], 201);
    }

    public function show($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $service->id,
                'title' => $service->title,
                'type' => $service->type,
                'location' => $service->location,
                'price' => (float) $service->price,
                'description' => $service->description,
                'images' => $service->images ?? [],
                'image' => ($service->images && count($service->images) > 0) ? $service->images[0] : '/placeholder.jpg',
                'image_urls' => $service->images ?? [],
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        $service->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted'
        ]);
    }
}