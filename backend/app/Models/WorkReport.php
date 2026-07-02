<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class WorkReport extends Model
{
    protected $fillable = [
        'src', 'title_en', 'title_ar', 'desc_en', 'desc_ar',
        'link', 'link_label_en', 'link_label_ar', 'cover_image', 'sort_order',
    ];

    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? Storage::url($this->cover_image) : null;
    }

    protected $appends = ['cover_image_url'];
}
