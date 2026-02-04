<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run()
    {
        Product::create([
            'name' => 'Free Article',
            'description' => 'Public content',
            'is_premium' => false
        ]);

        Product::create([
            'name' => 'Premium Video',
            'description' => 'Only for premium users',
            'is_premium' => true
        ]);

        Product::create([
            'name' => 'Premium Course',
            'description' => 'Advanced training',
            'is_premium' => true
        ]);
    }
}
