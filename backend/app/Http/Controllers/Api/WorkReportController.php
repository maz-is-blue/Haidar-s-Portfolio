<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WorkReportController extends Controller
{
    public function index()
    {
        return response()->json(WorkReport::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->except('cover_image');
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('work-reports', 'public');
        }
        return response()->json(WorkReport::create($data), 201);
    }

    public function update(Request $request, WorkReport $workReport)
    {
        $data = $request->except('cover_image', '_method');
        if ($request->hasFile('cover_image')) {
            if ($workReport->cover_image) Storage::disk('public')->delete($workReport->cover_image);
            $data['cover_image'] = $request->file('cover_image')->store('work-reports', 'public');
        }
        $workReport->update($data);
        return response()->json($workReport->fresh());
    }

    public function destroy(WorkReport $workReport)
    {
        if ($workReport->cover_image) Storage::disk('public')->delete($workReport->cover_image);
        $workReport->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
