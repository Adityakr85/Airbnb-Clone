<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HelpCenterContent;

class HelpCenterController extends Controller
{
    public function getTopArticles(Request $request)
    {
        $category = $request->query('category', 'Guest');

        $articles = HelpCenterContent::where('content_type', 'top_article')
            ->where('category', $category)
            ->where('is_published', true)
            ->latest()
            ->take(6)
            ->get();

        return response()->json($articles);
    }

    /**
     * 2. DYNAMIC GUIDES
     * Listens to the activeTab category sent by React
     */
    public function getGuides(Request $request)
    {
        $category = $request->query('category', 'Guest');

        $guides = HelpCenterContent::where('content_type', 'guide')
            ->where('category', $category)
            ->where('is_published', true)
            ->latest()
            ->get();

        return response()->json($guides);
    }

    /**
     * 3. EXPLORE MORE PROMOTIONS
     * Global promos (category agnostic)
     */
    public function getExploreMore()
    {
        $promotions = HelpCenterContent::where('content_type', 'explore_promo')
            ->where('is_published', true)
            ->latest()
            ->take(2)
            ->get();
            
        return response()->json($promotions);
    }
    
    public function getAllTopics(Request $request)
    {
        $requestedTab = $request->query('tab', 'Guest');
        $links = HelpCenterContent::where('content_type', 'topic_link')
            ->where('category', $requestedTab)
            ->where('is_published', true)
            ->get();
        $groupedTopics = $links->groupBy('section');
        return response()->json($groupedTopics);
    }

    public function show($id)
    {
        $article = HelpCenterContent::findOrFail($id);
        return response()->json($article);
    }

    public function showTopic($id)
    {
        $topic = HelpCenterContent::where('id', $id)
            ->where('content_type', 'topic')
            ->firstOrFail();

        $articles = HelpCenterContent::where('parent_id', $id)
            ->where('content_type', 'article')
            ->where('is_published', true)
            ->get();

        // 3. Group the articles by your 'section' column
        $groupedArticles = $articles->groupBy('section');
        $sectionsFormatted = [];
        foreach ($groupedArticles as $sectionName => $sectionArticles) {
            
            $articlesArray = $sectionArticles->map(function($article) {
                return [
                    'id' => $article->id,
                    'tag' => $article->category, 
                    'title' => $article->title,
                    'summary' => $article->summary,
                    'url' => $article->url ?? '/help/article/' . $article->id, 
                ];
            });

            $sectionsFormatted[] = [
                'id' => 'sec-' . md5($sectionName), 
                'title' => $sectionName, 
                'articles' => $articlesArray
            ];
        }

        // 5. Return the final nested JSON contract
        return response()->json([
            'data' => [
                'pageTitle' => $topic->title,
                'pageSummary' => $topic->summary,
                
                'breadcrumbs' => is_string($topic->breadcrumbs) 
                    ? json_decode($topic->breadcrumbs) 
                    : $topic->breadcrumbs,
                    
                'sections' => $sectionsFormatted,
                'relatedTopics' => [] 
            ]
        ]);
    }
}
