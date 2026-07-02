<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoverageLink extends Model
{
    protected $fillable = ['coverage_id', 'label', 'url', 'sort_order'];
}
