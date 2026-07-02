<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function index()
    {
        return response()->json(Video::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->except('video', '_method');
        if ($request->hasFile('video')) {
            $data['filename'] = $request->file('video')->store('videos', 'public');
        }
        return response()->json(Video::create($data), 201);
    }

    public function update(Request $request, Video $video)
    {
        $data = $request->except('video', '_method');
        if ($request->hasFile('video')) {
            if ($video->filename) Storage::disk('public')->delete($video->filename);
            $data['filename'] = $request->file('video')->store('videos', 'public');
        }
        $video->update($data);
        return response()->json($video->fresh());
    }

    public function destroy(Video $video)
    {
        if ($video->filename) Storage::disk('public')->delete($video->filename);
        $video->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
