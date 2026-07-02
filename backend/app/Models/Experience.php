<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'years', 'org', 'role_en', 'role_ar',
        'bullets_en', 'bullets_ar', 'links', 'sort_order',
    ];

    protected $casts = [
        'bullets_en' => 'array',
        'bullets_ar' => 'array',
        'links'      => 'array',
    ];
}
