<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutContent;
use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function show()
    {
        $about = AboutContent::first();
        return response()->json($about);
    }

    public function update(Request $request)
    {
        $about = AboutContent::firstOrNew([]);
        $data  = [
            'bio_en'    => json_decode($request->input('bio_en', '[]'), true),
            'bio_ar'    => json_decode($request->input('bio_ar', '[]'), true),
            'skills_en' => json_decode($request->input('skills_en', '[]'), true),
            'skills_ar' => json_decode($request->input('skills_ar', '[]'), true),
        ];
        if ($request->hasFile('portrait')) {
            if ($about->portrait_image) Storage::disk('public')->delete($about->portrait_image);
            $data['portrait_image'] = $request->file('portrait')->store('about', 'public');
        }
        $about->fill($data)->save();
        return response()->json($about->fresh());
    }

    // Certifications
    public function certs()
    {
        return response()->json(Certification::orderBy('sort_order')->get());
    }

    public function storeCert(Request $request)
    {
        return response()->json(Certification::create($request->all()), 201);
    }

    public function updateCert(Request $request, Certification $certification)
    {
        $certification->update($request->all());
        return response()->json($certification->fresh());
    }

    public function destroyCert(Certification $certification)
    {
        $certification->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
