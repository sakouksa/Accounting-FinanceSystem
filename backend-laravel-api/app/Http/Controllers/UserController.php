<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:users.read', only: ['index', 'getBranches', 'getDefaultRoles', 'getAllPermissions']),
            new Middleware('permission:users.create', only: ['store']),
            new Middleware('permission:users.update', only: ['update', 'restore', 'changeStatus', 'changePassword']),
            new Middleware('permission:users.delete', only: ['destroy', 'forceDelete']),
        ];
    }

    public function index(Request $request)
    {
        $paginator = $this->userService->getUsers($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total()
        );
    }

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

        try {
            $user = $this->userService->createUser($validated);

            return $this->successResponse($user, 'User created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create user: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'full_name'   => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email,' . $id,
            'phone'       => 'nullable|string',
            'gender'      => 'nullable|string',
            'username'    => 'required|string|unique:users,username,' . $id,
            'password'    => 'nullable|string|min:6',
            'branch_id'   => 'nullable|integer',
            'role_type'   => 'required|in:default,custom',
            'role_id'     => 'required_if:role_type,default|exists:roles,id',
            'permissions' => 'required_if:role_type,custom|array',
        ]);

        try {
            $user = $this->userService->updateUser($validated, $id);

            return $this->successResponse($user, 'User updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update user: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->userService->deleteUser($id);
            return $this->successResponse(null, 'User deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete user: ' . $e->getMessage(), 500);
        }
    }

    public function restore($id)
    {
        try {
            $this->userService->restoreUser($id);
            return $this->successResponse(null, 'User restored successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to restore user: ' . $e->getMessage(), 500);
        }
    }

    public function forceDelete($id)
    {
        try {
            $this->userService->forceDeleteUser($id);
            return $this->successResponse(null, 'User permanently deleted');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to permanently delete user: ' . $e->getMessage(), 500);
        }
    }

    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive'
        ]);

        try {
            $this->userService->changeStatus($id, $request->status);
            return $this->successResponse(null, 'User status updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update status: ' . $e->getMessage(), 500);
        }
    }

    public function changePassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:6'
        ]);

        try {
            $this->userService->changePassword($id, $request->password);
            return $this->successResponse(null, 'Password updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to change password: ' . $e->getMessage(), 500);
        }
    }
}