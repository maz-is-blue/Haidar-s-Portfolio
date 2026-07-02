<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coverage;
use App\Models\CoverageLink;
use Illuminate\Http\Request;

class CoverageController extends Controller
{
    public function index()
    {
        return response()->json(Coverage::with('links')->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $coverage = Coverage::create($request->except('links'));
        $this->syncLinks($coverage, $request->input('links', []));
        return response()->json($coverage->load('links'), 201);
    }

    public function update(Request $request, Coverage $coverage)
    {
        $coverage->update($request->except('links', '_method'));
        $this->syncLinks($coverage, $request->input('links', []));
        return response()->json($coverage->load('links'));
    }

    public function destroy(Coverage $coverage)
    {
        $coverage->delete();
        return response()->json(['message' => 'Deleted']);
    }

    private function syncLinks(Coverage $coverage, array $links): void
    {
        $coverage->links()->delete();
        foreach ($links as $i => $link) {
            CoverageLink::create([
                'coverage_id' => $coverage->id,
                'label'       => $link['label'] ?? null,
                'url'         => $link['url'] ?? '',
                'sort_order'  => $i,
            ]);
        }
    }
}
