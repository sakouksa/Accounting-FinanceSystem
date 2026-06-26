<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getBranches()
    {
        $branches = Branch::select('id', 'name')->get();
        return response()->json($branches);
    }
    public function getDefaultRoles()
    {
        $roles = Role::where('status', 'active')
            ->select('id', 'name', 'description')
            ->get();

        return response()->json([
            'roles' => $roles
        ]);
    }

    public function getAllPermissions()
    {
        $permissions = Permission::all()->groupBy('module');

        return response()->json([
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'   => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'phone'       => 'nullable|string',
            'gender'      => 'nullable|string',
            'username'    => 'required|string|unique:users,username',
            'password'    => 'required|string|min:6',
            'branch_id'   => 'nullable|integer',
            'role_type'   => 'required|in:default,custom',
            'role_id'     => 'required_if:role_type,default|exists:roles,id',
            'permissions' => 'required_if:role_type,custom|array',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'full_name' => $validated['full_name'],
                'email'     => $validated['email'],
                'phone'     => $validated['phone'],
                'gender'    => $validated['gender'],
                'username'  => $validated['username'],
                'password'  => Hash::make($validated['password']),
                'branch_id' => $validated['branch_id'],
                'status'    => 'active',
                'role_id'   => $validated['role_type'] === 'default' ? $validated['role_id'] : null,
            ]);

            if ($validated['role_type'] === 'custom' && !empty($validated['permissions'])) {
                $this->syncCustomPermissions($user, $validated['permissions']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User created successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function syncCustomPermissions(User $user, $permissions)
    {
        $ids = [];
        foreach ($permissions as $mod) {
            foreach ($mod['actions'] ?? [] as $action => $val) {
                if ($val === true) {
                    $perm = Permission::where('module', $mod['key'])
                        ->where('action', $action)
                        ->first();
                    if ($perm) $ids[] = $perm->id;
                }
            }
        }
        $user->permissions()->sync($ids);
    }
    
}