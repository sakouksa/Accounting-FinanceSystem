<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    public function createUser(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'full_name' => $data['full_name'],
                'email'     => $data['email'],
                'phone'     => $data['phone'] ?? null,
                'gender'    => $data['gender'] ?? null,
                'username'  => $data['username'],
                'password'  => Hash::make($data['password']),
                'branch_id' => $data['branch_id'] ?? null,
                'status'    => 'active',
                'role_id'   => $data['role_type'] === 'default' ? $data['role_id'] : null,
            ]);

            if ($data['role_type'] === 'custom' && !empty($data['permissions'])) {
                $this->syncCustomPermissions($user, $data['permissions']);
            }

            return $user;
        });
    }

    public function updateUser(array $data, $id)
    {
        return DB::transaction(function () use ($data, $id) {
            $user = User::findOrFail($id);

            $updateData = [
                'full_name' => $data['full_name'],
                'email'     => $data['email'],
                'phone'     => $data['phone'] ?? null,
                'gender'    => $data['gender'] ?? null,
                'username'  => $data['username'],
                'branch_id' => $data['branch_id'] ?? null,
            ];

            if (!empty($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }

            if (isset($data['role_type'])) {
                $updateData['role_id'] = $data['role_type'] === 'default' ? ($data['role_id'] ?? null) : null;
            }

            $user->update($updateData);

            if (isset($data['role_type']) && $data['role_type'] === 'custom' && !empty($data['permissions'])) {
                $this->syncCustomPermissions($user, $data['permissions']);
            } else {
                $user->permissions()->detach();
            }

            return $user;
        });
    }

    public function syncCustomPermissions(User $user, array $permissions)
    {
        $modules = [];
        $actions = [];

        foreach ($permissions as $mod) {
            $moduleName = $mod['module'] ?? $mod['key'] ?? null;
            if (!$moduleName) continue;

            if (isset($mod['actions']) && is_array($mod['actions'])) {
                foreach ($mod['actions'] as $key => $val) {
                    // Scenario A: ["create", "read"]
                    if (is_int($key) && is_string($val)) {
                        $actionName = $val === 'read' ? 'view' : $val;
                        $modules[] = $moduleName;
                        $actions[] = $actionName;
                    }
                    // Scenario B: { create: true, read: false }
                    elseif (is_string($key) && $val === true) {
                        $actionName = $key === 'read' ? 'view' : $key;
                        $modules[] = $moduleName;
                        $actions[] = $actionName;
                    }
                }
            }
        }

        if (empty($modules)) {
            $user->permissions()->sync([]);
            return;
        }

        // Query permissions in bulk to solve N+1 issue
        $permIds = Permission::whereIn('module', array_unique($modules))
            ->whereIn('action', array_unique($actions))
            ->get()
            ->filter(function ($perm) use ($permissions) {
                foreach ($permissions as $mod) {
                    $moduleName = $mod['module'] ?? $mod['key'] ?? null;
                    if ($moduleName !== $perm->module) continue;

                    if (isset($mod['actions']) && is_array($mod['actions'])) {
                        foreach ($mod['actions'] as $key => $val) {
                            $actionName = is_int($key) ? $val : $key;
                            if ($actionName === 'read') $actionName = 'view';

                            if ($actionName === $perm->action) {
                                if (is_int($key)) {
                                    return true;
                                } elseif ($val === true) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            })
            ->pluck('id')
            ->toArray();

        $user->permissions()->sync($permIds);
    }

    public function getUsers($request)
    {
        $query = User::with(['role', 'branch'])->withTrashed();

        // Search
        if ($search = $request->get('txt_search')) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($roleId = $request->get('role_id')) {
            $query->where('role_id', $roleId);
        }

        if ($branchId = $request->get('branch_id')) {
            $query->where('branch_id', $branchId);
        }

        $status = $request->get('status');
        if ($status) {
            if ($status === 'deleted') {
                $query->onlyTrashed();
            } else {
                $query->where('status', $status);
            }
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        if (in_array($sortBy, ['id', 'full_name', 'username', 'email', 'phone', 'status', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $limit = $request->get('limit', 10);
        return $query->paginate($limit);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        return $user->delete();
    }

    public function restoreUser($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        return $user->restore();
    }

    public function forceDeleteUser($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->permissions()->detach();
        return $user->forceDelete();
    }

    public function changeStatus($id, $status)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->status = $status;
        return $user->save();
    }

    public function changePassword($id, $password)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->password = Hash::make($password);
        return $user->save();
    }
}
