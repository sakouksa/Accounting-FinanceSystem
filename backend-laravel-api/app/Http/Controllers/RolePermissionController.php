<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:role_permissions.read', only: ['index', 'getRolePermissions']),
            new Middleware('permission:role_permissions.update', only: ['syncPermissions']),
        ];
    }

    // LIST: All roles with their permission counts
    public function index(Request $request)
    {
        $query = Role::withCount('permissions');

        if ($request->filled('txt_search')) {
            $query->where('name', 'LIKE', "%{$request->txt_search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $limit = $request->get('limit', 20);
        $paginator = $query->orderBy('id', 'desc')->paginate($limit);

        // Get all permissions grouped by module for the assignment UI
        $allPermissions = Permission::orderBy('module')
            ->orderBy('code')
            ->get()
            ->groupBy('module');

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total(),
            200,
            'Success',
            ['grouped_permissions' => $allPermissions]
        );
    }

    // GET: Permissions for a specific role
    public function getRolePermissions($roleId)
    {
        $role = Role::with('permissions')->findOrFail($roleId);

        return response()->json([
            'data' => $role->permissions,
            'role' => $role,
        ]);
    }

    // POST: Sync (assign/revoke) permissions for a role
    public function syncPermissions(Request $request, $roleId)
    {
        $request->validate([
            'permissions'   => 'required|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::findOrFail($roleId);

        // Use sync to replace all current permissions with the new set
        $role->permissions()->sync($request->permissions);

        return $this->successResponse(
            $role->load('permissions'),
            'បានកំណត់សិទ្ធិតាមតួនាទីដោយជោគជ័យ'
        );
    }
}
