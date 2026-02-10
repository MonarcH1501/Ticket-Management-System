<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TicketCategory;
use App\Models\Department;

class TicketCategorySeeder extends Seeder
{
    public function run(): void
    {

        TicketCategory::create([
            'code'        => 'UMUM',
            'name'        => 'Pengajuan Umum',
            'description' => 'Pengajuan umum lintas department',
            'is_active'   => true,
        ]);


        $ti = Department::where('name', 'TI')->first();

        if ($ti) {
            TicketCategory::insert([
                [
                    'code'          => 'POS-TIK-002',
                    'name'          => 'Form Perbaikan Jaringan dan Perangkat TI',
                    'department_id'=> $ti->id,
                    'description'   => 'Perbaikan perangkat komputer dan laptop',
                    'is_active'     => true,
                ],
                [
                    'code'          => 'POS-TIK-003',
                    'name'          => 'Form Permintaan Desain Grafis',
                    'department_id'=> $ti->id,
                    'description'   => 'Permintaan desain grafis untuk kebutuhan internal',
                    'is_active'     => true,
                ],
            ]);
        }
    }
}
