<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:permissions.read', only: ['index', 'show']),
            new Middleware('permission:permissions.create', only: ['store']),
            new Middleware('permission:permissions.update', only: ['update']),
            new Middleware('permission:permissions.delete', only: ['destroy']),
        ];
    }

    // LIST with pagination & search
    public function index(Request $request)
    {
        $query = Permission::query();

        if ($request->filled('txt_search')) {
            $search = $request->txt_search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('code', 'LIKE', "%{$search}%")
                  ->orWhere('module', 'LIKE', "%{$search}%")
                  ->orWhere('route_key', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('module')) {
            $query->where('module', $request->module);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('is_menu')) {
            $query->where('is_menu', $request->is_menu);
        }

        $limit = $request->get('limit', 20);
        $paginator = $query->orderBy('module')->orderBy('code')->paginate($limit);

        // Get distinct modules for filter dropdown
        $modules = Permission::distinct()->pluck('module')->sort()->values();

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total(),
            200,
            'Success',
            ['modules' => $modules]
        );
    }

    // STORE
    public function store(Request $request)
    {
        $validated = $request->validate([
            'module'    => 'required|string|max:100',
            'name'      => 'required|string|max:150',
            'code'      => 'required|string|max:150|unique:permissions,code',
            'action'    => 'required|string|max:50',
            'is_menu'   => 'required|boolean',
            'route_key' => 'nullable|string|max:150',
        ]);

        $permission = Permission::create($validated);

        return $this->successResponse($permission, 'បានបង្កើតសិទ្ធិដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show($id)
    {
        $permission = Permission::findOrFail($id);

        return $this->successResponse($permission);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $validated = $request->validate([
            'module'    => 'required|string|max:100',
            'name'      => 'required|string|max:150',
            'code'      => 'required|string|max:150|unique:permissions,code,' . $id,
            'action'    => 'required|string|max:50',
            'is_menu'   => 'required|boolean',
            'route_key' => 'nullable|string|max:150',
        ]);

        $permission->update($validated);

        return $this->successResponse($permission, 'បានកែប្រែសិទ្ធិដោយជោគជ័យ');
    }

    // DELETE
    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);

        // Check if permission is assigned to any role before deletion
        if ($permission->roles()->count() > 0) {
            return $this->errorResponse('សិទ្ធិនេះកំពុងប្រើប្រាស់ដោយតួនាទី។ មិនអាចលុបបានទេ!', 422);
        }

        $permission->delete();

        return $this->successResponse(null, 'បានលុបសិទ្ធិដោយជោគជ័យ');
    }
}
