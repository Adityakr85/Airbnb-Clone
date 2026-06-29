<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\HelpCenterContent;
use Illuminate\Http\Request;

class AdminHelpCenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = HelpCenterContent::latest();

        // Allow the admin table to filter by type (e.g., /api/admin/help-content?content_type=guide)
        if ($request->has('content_type')) {
            $query->where('content_type', $request->query('content_type'));
        }

        // Allow filtering by category/tab
        if ($request->has('category')) {
            $query->where('category', $request->query('category'));
        }

        // Use pagination instead of get() so your admin panel doesn't crash when you have 1,000 articles
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content_type' => 'required|string|in:top_article,guide,explore_promo',
            'parent_id' => 'nullable|exists:help_center_contents,id',
            'category'     => 'required|string|max:100',
            'title'        => 'required|string|max:255',
            'summary'      => 'nullable|string',
            'image'        => 'nullable|string', 
            'url'          => 'nullable|string',
            'body_content' => 'nullable|string',
            'is_published' => 'boolean',
        ]);
        $validated['is_published'] = $request->has('is_published') ? $request->is_published : true;

        $content = HelpCenterContent::create($validated);

        return response()->json([
            'message' => 'Content successfully created.',
            'data'    => $content
        ], 201);
    }

    public function show($id)
    {
        $content = HelpCenterContent::findOrFail($id);

        return response()->json($content);
    }

    public function update(Request $request, $id)
    {
        $content = HelpCenterContent::findOrFail($id);
        $validated = $request->validate([
            'content_type' => 'sometimes|required|string|in:top_article,guide,explore_promo',
            'parent_id' => 'nullable|exists:help_center_contents,id',
            'category'     => 'sometimes|required|string|max:100',
            'title'        => 'sometimes|required|string|max:255',
            'summary'      => 'nullable|string',
            'image'        => 'nullable|string',
            'url'          => 'nullable|string',
            'body_content' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $content->update($validated);
        return response()->json([
            'message' => 'Content successfully updated.',
            'data'    => $content
        ]);
    }

    public function destroy($id)
    {
        $content = HelpCenterContent::findOrFail($id);
        
        $content->delete();

        return response()->json([
            'message' => 'Content successfully deleted.'
        ], 200);
    }
}
