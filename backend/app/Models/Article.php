<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    protected $fillable = [
        'pub', 'title_en', 'title_ar', 'excerpt_en', 'excerpt_ar',
        'content_en', 'content_ar', 'cover_image', 'sort_order',
    ];

    public function links()
    {
        return $this->hasMany(ArticleLink::class)->orderBy('sort_order');
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? Storage::url($this->cover_image) : null;
    }

    protected $appends = ['cover_image_url'];
}
