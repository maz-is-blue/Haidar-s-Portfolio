<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AboutContent extends Model
{
    protected $table = 'about_content';

    protected $fillable = ['bio_en', 'bio_ar', 'skills_en', 'skills_ar', 'portrait_image'];

    protected $casts = [
        'bio_en'    => 'array',
        'bio_ar'    => 'array',
        'skills_en' => 'array',
        'skills_ar' => 'array',
    ];

    public function getPortraitUrlAttribute(): ?string
    {
        return $this->portrait_image ? Storage::url($this->portrait_image) : null;
    }

    protected $appends = ['portrait_url'];
}
