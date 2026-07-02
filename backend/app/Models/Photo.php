<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Photo extends Model
{
    protected $fillable = ['cat_en', 'cat_ar', 'title_en', 'title_ar', 'filename', 'sort_order'];

    public function getUrlAttribute(): string
    {
        return Storage::url($this->filename);
    }

    protected $appends = ['url'];
}
