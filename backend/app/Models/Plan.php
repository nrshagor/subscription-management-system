<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = ['vendor_id', 'name', 'price', 'features'];

    protected $casts = ['features' => 'array'];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}

