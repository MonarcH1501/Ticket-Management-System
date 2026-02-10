<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Unit;
use App\Models\Position;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        Unit::insert([
            ['name' => 'TK1'],
            ['name' => 'TK2'],
            ['name' => 'SD1'],
            ['name' => 'SD2'],
            ['name' => 'SMP1'],
            ['name' => 'SMP2'],
            ['name' => 'SMK1'],
            ['name' => 'SMK2'],
            ['name' => 'SMA Reguler'],
            ['name' => 'SD IBC'],
            ['name' => 'SMP IBC'],
            ['name' => 'SMA IBC'],
        ]);

        Department::insert([
            ['name' => 'SDM'],
            ['name' => 'Akademik'],
            ['name' => 'TI'],
            ['name' => 'Sarpras'],
            ['name' => 'Keuangan'],
            ['name' => 'Penggembalaan'],
            ['name' => 'Umum'],
        ]);

        Position::insert([
            ['name' => 'Staff'],
            ['name' => 'Guru'],
            ['name' => 'Kepala Unit'],
            ['name' => 'Kepala Department'],
            ['name' => 'Koordinator'],
            ['name' => 'PIC'],
            ['name' => 'ASV'],
        ]);
    }
}

