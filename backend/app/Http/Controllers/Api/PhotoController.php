<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function index()
    {
        return response()->json(Photo::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:10240']);
        $path = $request->file('photo')->store('photos', 'public');
        $photo = Photo::create([
            'cat_en'    => $request->cat_en,
            'cat_ar'    => $request->cat_ar,
            'title_en'  => $request->title_en,
            'title_ar'  => $request->title_ar,
            'filename'  => $path,
            'sort_order'=> Photo::count(),
        ]);
        return response()->json($photo, 201);
    }

    public function update(Request $request, Photo $photo)
    {
        $data = $request->except('photo', '_method');
        if ($request->hasFile('photo')) {
            Storage::disk('public')->delete($photo->filename);
            $data['filename'] = $request->file('photo')->store('photos', 'public');
        }
        $photo->update($data);
        return response()->json($photo->fresh());
    }

    public function destroy(Photo $photo)
    {
        Storage::disk('public')->delete($photo->filename);
        $photo->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
