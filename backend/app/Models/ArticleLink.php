<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleLink extends Model
{
    protected $fillable = ['article_id', 'label', 'url', 'sort_order'];
}
