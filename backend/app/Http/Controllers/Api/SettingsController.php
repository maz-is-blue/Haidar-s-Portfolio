<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    private array $keys = [
        'hero_kicker_en', 'hero_kicker_ar', 'hero_tagline_en', 'hero_tagline_ar',
        'showreel_url', 'showreel_caption_en', 'showreel_caption_ar',
        'stats_json', 'orgs_json', 'ticker_en', 'ticker_ar',
        'contact_email', 'contact_phone', 'contact_whatsapp',
        'contact_linkedin', 'contact_location_en', 'contact_location_ar',
    ];

    public function index()
    {
        $settings = [];
        foreach ($this->keys as $key) {
            $settings[$key] = Setting::get($key);
        }
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        foreach ($this->keys as $key) {
            if ($request->has($key)) {
                Setting::set($key, $request->input($key));
            }
        }
        return response()->json(['message' => 'Settings updated']);
    }

    public function uploadShowreel(Request $request)
    {
        $request->validate(['video' => 'required|file|mimes:mp4,webm,mov,avi|max:512000']);
        $old = Setting::get('showreel_url');
        if ($old && str_contains($old, '/storage/showreel/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', parse_url($old, PHP_URL_PATH)));
        }
        $path = $request->file('video')->store('showreel', 'public');
        $url = url('storage/' . $path);
        Setting::set('showreel_url', $url);
        return response()->json(['url' => $url]);
    }
}
