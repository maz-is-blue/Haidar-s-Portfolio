<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Video extends Model
{
    protected $fillable = ['title_en', 'title_ar', 'embed_url', 'filename', 'sort_order'];

    public function getUrlAttribute(): ?string
    {
        return $this->filename ? Storage::url($this->filename) : null;
    }

    protected $appends = ['url'];
}
