<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        return response()->json(Article::with('links')->orderBy('sort_order')->get());
    }

    public function show(Article $article)
    {
        return response()->json($article->load('links'));
    }

    public function store(Request $request)
    {
        $data = $request->except('cover_image', 'links');
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('articles', 'public');
        }
        $article = Article::create($data);
        $this->syncLinks($article, json_decode($request->input('links', '[]'), true));
        return response()->json($article->load('links'), 201);
    }

    public function update(Request $request, Article $article)
    {
        $data = $request->except('cover_image', 'links', '_method');
        if ($request->hasFile('cover_image')) {
            if ($article->cover_image) Storage::disk('public')->delete($article->cover_image);
            $data['cover_image'] = $request->file('cover_image')->store('articles', 'public');
        }
        $article->update($data);
        $links = json_decode($request->input('links', '[]'), true);
        if (is_array($links)) $this->syncLinks($article, $links);
        return response()->json($article->load('links'));
    }

    public function destroy(Article $article)
    {
        if ($article->cover_image) Storage::disk('public')->delete($article->cover_image);
        $article->delete();
        return response()->json(['message' => 'Deleted']);
    }

    private function syncLinks(Article $article, array $links): void
    {
        $article->links()->delete();
        foreach ($links as $i => $link) {
            ArticleLink::create([
                'article_id' => $article->id,
                'label'      => $link['label'] ?? null,
                'url'        => $link['url'] ?? '',
                'sort_order' => $i,
            ]);
        }
    }
}
