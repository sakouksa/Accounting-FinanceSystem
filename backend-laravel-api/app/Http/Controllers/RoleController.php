<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class RoleController extends Controller implements HasMiddleware
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:roles.read', only: ['index', 'show', 'stats', 'getAllPermissionsList']),
            new Middleware('permission:roles.create', only: ['store']),
            new Middleware('permission:roles.update', only: ['update', 'changeStatus']),
            new Middleware('permission:roles.delete', only: ['destroy']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->roleService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total()
        );
    }

    // GET ALL PERMISSIONS
    public function getAllPermissionsList()
    {
        $permissions = $this->roleService->getAllPermissionsList();

        return response()->json([
            'list' => $permissions,
        ]);
    }

    // STATS
    public function stats()
    {
        $stats = $this->roleService->getStats();
        return response()->json([
            'stats' => $stats,
        ]);
    }

    // STORE
    public function store(RoleRequest $request)
    {
        $role = $this->roleService->createRole($request->validated());

        return $this->successResponse($role, 'បានបង្កើតតួនាទីថ្មីដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show(string $id)
    {
        $role = $this->roleService->findById($id);
        return $this->successResponse($role);
    }

    // UPDATE
    public function update(RoleRequest $request, string $id)
    {
        $role = $this->roleService->updateRole($request->validated(), $id);

        return $this->successResponse($role, 'បានកែប្រែទិន្នន័យដោយជោគជ័យ');
    }

    // DELETE
    public function destroy(string $id)
    {
        try {
            $role = $this->roleService->deleteRole($id);
            return $this->successResponse($role, 'បានលុបទិន្នន័យដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $role = $this->roleService->changeStatus($id, $request->input('status'));

        return $this->successResponse($role, 'ស្ថានភាពត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ');
    }
}
