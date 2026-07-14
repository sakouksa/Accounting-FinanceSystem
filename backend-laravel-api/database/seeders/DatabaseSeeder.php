<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = [
            // Cash Flows
            [
                'module' => 'Finance',
                'name' => 'លំហូរសាច់ប្រាក់',
                'code' => 'cash_flows_view',
                'action' => 'view',
                'is_menu' => 1,
                'route_key' => '/cash-flows',
            ],
            [
                'module' => 'Finance',
                'name' => 'លំហូរសាច់ប្រាក់',
                'code' => 'cash_flows_create',
                'action' => 'create',
                'is_menu' => 0,
                'route_key' => '/cash-flows',
            ],
            [
                'module' => 'Finance',
                'name' => 'លំហូរសាច់ប្រាក់',
                'code' => 'cash_flows_update',
                'action' => 'update',
                'is_menu' => 0,
                'route_key' => '/cash-flows',
            ],
            [
                'module' => 'Finance',
                'name' => 'លំហូរសាច់ប្រាក់',
                'code' => 'cash_flows_delete',
                'action' => 'delete',
                'is_menu' => 0,
                'route_key' => '/cash-flows',
            ],
            [
                'module' => 'Finance',
                'name' => 'លំហូរសាច់ប្រាក់',
                'code' => 'cash_flows_export',
                'action' => 'export',
                'is_menu' => 0,
                'route_key' => '/cash-flows',
            ],
            // Budgets
            [
                'module' => 'Finance',
                'name' => 'ថវិកា',
                'code' => 'budgets_view',
                'action' => 'view',
                'is_menu' => 1,
                'route_key' => '/budgets',
            ],
            [
                'module' => 'Finance',
                'name' => 'ថវិកា',
                'code' => 'budgets_create',
                'action' => 'create',
                'is_menu' => 0,
                'route_key' => '/budgets',
            ],
            [
                'module' => 'Finance',
                'name' => 'ថវិកា',
                'code' => 'budgets_update',
                'action' => 'update',
                'is_menu' => 0,
                'route_key' => '/budgets',
            ],
            [
                'module' => 'Finance',
                'name' => 'ថវិកា',
                'code' => 'budgets_delete',
                'action' => 'delete',
                'is_menu' => 0,
                'route_key' => '/budgets',
            ],
            [
                'module' => 'Finance',
                'name' => 'ថវិកា',
                'code' => 'budgets_export',
                'action' => 'export',
                'is_menu' => 0,
                'route_key' => '/budgets',
            ],
        ];

        // Find Admin Role
        $adminRole = Role::where('code', 'admin')->first();

        foreach ($permissions as $permData) {
            $perm = Permission::where('code', $permData['code'])->first();
            if (!$perm) {
                $perm = Permission::create($permData);
            } else {
                $perm->update($permData);
            }

            if ($adminRole) {
                $exists = DB::table('role_permissions')
                    ->where('role_id', $adminRole->id)
                    ->where('permission_id', $perm->id)
                    ->exists();
                if (!$exists) {
                    DB::table('role_permissions')->insert([
                        'role_id' => $adminRole->id,
                        'permission_id' => $perm->id
                    ]);
                }
            }
        }
    }
}
