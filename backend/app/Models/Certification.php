<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    protected $fillable = ['name_en', 'name_ar', 'org_en', 'org_ar', 'sort_order'];
}
