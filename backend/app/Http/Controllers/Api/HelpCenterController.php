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
            ->where('tab_category', $category) 
            ->where('is_published', true)
            ->latest()
            ->take(6)
            ->get();

        return response()->json($articles);
    }

    public function getGuides(Request $request)
    {
        $category = $request->query('category', 'Guest');

        $guides = HelpCenterContent::where('content_type', 'guide')
            ->where('tab_category', $category)
            ->where('is_published', true)
            ->latest()
            ->get();

        return response()->json($guides);
    }

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
            ->where('tab_category', $requestedTab)
            ->where('is_published', true)
            ->get();
        $groupedTopics = $links->groupBy('section_heading');
        return response()->json($groupedTopics);
    }

    public function show($id)
    {
        $article = HelpCenterContent::findOrFail($id);
        $article->append('tag');
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

        $groupedArticles = $articles->groupBy('section_heading');

        $sectionsFormatted = [];
        foreach ($groupedArticles as $sectionName => $sectionArticles) {
            
            $articlesArray = $sectionArticles->map(function($article) {
                return [
                    'id' => $article->id,
                    'tag' => $article->tag, 
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
        return response()->json([
            'data' => [
                'pageTitle' => $topic->title,
                'pageSummary' => $topic->summary,
                'breadcrumbs' => $topic->breadcrumbs,
                'sections' => $sectionsFormatted,
                'relatedTopics' => $topic->related_topics ?? [] 
            ]
        ]);
    }
    public function search(Request $request)
    {
        $searchTerm = $request->input('q');

        if (empty($searchTerm)) {
            return response()->json(['data' => []], 200);
        }

        $results = HelpCenterContent::where(function($query) use ($searchTerm) {
                $query->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('summary', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('intro', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('body_content', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('content_sections', 'LIKE', "%{$searchTerm}%") 
                      ->orWhere('tab_category', 'LIKE', "%{$searchTerm}%");
            })
            ->whereIn('content_type', ['article', 'top_article', 'guide'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $results
        ], 200);
    }
}
