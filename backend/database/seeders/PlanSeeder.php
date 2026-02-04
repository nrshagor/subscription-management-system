<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Vendor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run()
    {
        $netflix = Vendor::where('name', 'Netflix')->first();
        $spotify = Vendor::where('name', 'Spotify')->first();

        Plan::create([
            'vendor_id' => $netflix->id,
            'name' => 'Basic',
            'price' => 10,
            'features' => ['720p', '1 device']
        ]);

        Plan::create([
            'vendor_id' => $netflix->id,
            'name' => 'Premium',
            'price' => 20,
            'features' => ['4K', '4 devices']
        ]);

        Plan::create([
            'vendor_id' => $spotify->id,
            'name' => 'Free',
            'price' => 0,
            'features' => ['Ads', 'Shuffle']
        ]);

        Plan::create([
            'vendor_id' => $spotify->id,
            'name' => 'Premium',
            'price' => 9.99,
            'features' => ['No ads', 'Offline']
        ]);
    }
}
