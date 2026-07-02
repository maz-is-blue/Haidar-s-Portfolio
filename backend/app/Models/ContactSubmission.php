<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    protected $fillable = ['name', 'email', 'org', 'message', 'read_at'];

    protected $casts = ['read_at' => 'datetime'];
}
