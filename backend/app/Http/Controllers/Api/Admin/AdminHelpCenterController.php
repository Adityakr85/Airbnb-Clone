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

        if ($request->has('content_type')) {
            $query->where('content_type', $request->query('content_type'));
        }

        if ($request->has('tab_category')) {
            $query->where('tab_category', $request->query('tab_category'));
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
       $validated = $request->validate([
            'content_type'     => 'required|string', 
            'parent_id'        => 'nullable|exists:help_center_contents,id',
            'tab_category'     => 'required|string|max:100', 
            'section_heading'  => 'nullable|string|max:255', 
            'title'            => 'required|string|max:255',
            'summary'          => 'nullable|string',
            'intro'            => 'nullable|string',         
            'image'            => 'nullable|string', 
            'url'              => 'nullable|string',
            'breadcrumbs'      => 'nullable|array',          
            'content_sections' => 'nullable|array',          
            'related_articles' => 'nullable|array',          
            'related_topics'   => 'nullable|array',          
            'is_published'     => 'boolean',
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
            'content_type'     => 'sometimes|required|string',
            'parent_id'        => 'nullable|exists:help_center_contents,id',
            'tab_category'     => 'sometimes|required|string|max:100', 
            'section_heading'  => 'nullable|string|max:255', 
            'title'            => 'sometimes|required|string|max:255',
            'summary'          => 'nullable|string',
            'intro'            => 'nullable|string',         
            'image'            => 'nullable|string',
            'url'              => 'nullable|string',
            'breadcrumbs'      => 'nullable|array',          
            'content_sections' => 'nullable|array',          
            'related_articles' => 'nullable|array',         
            'related_topics'   => 'nullable|array',          
            'is_published'     => 'boolean',
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
