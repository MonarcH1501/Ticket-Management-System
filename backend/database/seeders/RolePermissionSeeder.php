<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'manage_users',
            'manage_master_data',
            'create_ticket',
            'approve_ticket',
            'assign_pic',
            'view_all_ticket',
            'force_ticket_update',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $roles = [
            'superadmin',
            'admin',
            'user',
            'kepala_unit',
            'kepala_department',
            'pic',
            'koordinator',
            'asv',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        Role::findByName('admin')->givePermissionTo([
            'manage_users',
            'manage_master_data',
            'view_all_ticket',
        ]);

        Role::findByName('superadmin')->givePermissionTo(Permission::all());
    }
}
