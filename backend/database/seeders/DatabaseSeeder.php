<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('123456'),
            'role' => 'admin',
        ]);

        // Normal User
        User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => bcrypt('123456'),
            'role' => 'user',
        ]);

        $this->call([
            VendorSeeder::class,
            PlanSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
