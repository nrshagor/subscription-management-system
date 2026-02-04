<?php

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Vendor::create([
            'name' => 'Netflix',
            'description' => 'Streaming service',
            'logo' => 'https://logo.com/netflix.png'
        ]);

        Vendor::create([
            'name' => 'Spotify',
            'description' => 'Music streaming service',
            'logo' => 'https://logo.com/spotify.png'
        ]);
    }
}
