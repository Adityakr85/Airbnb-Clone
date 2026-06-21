<?php

namespace App\Http\Controllers;

use App\Models\Service;
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

        return response()->json([
            'success' => true,
            'data' => $query->get(),
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
            'data' => $service
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