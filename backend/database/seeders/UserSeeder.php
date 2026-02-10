<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $superadmin = User::firstOrCreate(
            ['email' => 'steven_e@ski.sch.id'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('Zur20382'),
            ]
        );

        $superadmin->assignRole('superadmin');
    }
}

