<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = ['name','description','logo'];

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }
}
