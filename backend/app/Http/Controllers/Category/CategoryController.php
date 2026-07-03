<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Models\Category\Category;

class CategoryController extends Controller
{
    public function property()
    {
        return response()->json([
            'success' => true,
            'data' => Category::where('category_for', 'property')
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function experience()
    {
        return response()->json([
            'success' => true,
            'data' => Category::where('category_for', 'experience')
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get(),
        ]);
    }
}