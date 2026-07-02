<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coverage extends Model
{
    protected $fillable = ['name_en', 'name_ar', 'year', 'desc_en', 'desc_ar', 'sort_order'];

    public function links()
    {
        return $this->hasMany(CoverageLink::class)->orderBy('sort_order');
    }
}
