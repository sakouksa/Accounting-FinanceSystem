<?php

namespace App\Repositories;

use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleRepository
{
    public function getAll($request)
    {
        $query = Role::query();

        if ($request->filled('txt_search')) {
            $query->where('name', 'LIKE', '%'.$request->txt_search.'%');
        }

        if ($request->filled('status')) {
            $query->where('status', '=', $request->status);
        }

        $limit = $request->get('limit', 10);
        return $query->orderBy('id', 'desc')->paginate($limit);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'តួនាទីសរុប',
                'value' => Role::count(),
                'percent' => '+12%',
                'isUp' => true,
                'color' => '#6366f1',
                'icon' => 'SafetyOutlined',
            ],
            [
                'title' => 'តួនាទីសកម្ម',
                'value' => Role::where('status', 'active')->count(),
                'percent' => '+5%',
                'isUp' => true,
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'តួនាទីអសកម្ម',
                'value' => Role::where('status', 'inactive')->count(),
                'percent' => '-2%',
                'isUp' => false,
                'color' => '#ef4444',
                'icon' => 'CloseCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => Role::whereDate('created_at', today())->count(),
                'percent' => '+8%',
                'isUp' => true,
                'color' => '#f59e0b',
                'icon' => 'CalendarOutlined',
            ],
        ];
    }

    public function getAllPermissionsList()
    {
        return DB::table('permissions')->get();
    }

    public function findById($id)
    {
        return Role::findOrFail($id);
    }

    public function createRole(array $data)
    {
        return Role::create($data);
    }

    public function updateRole(array $data, $id)
    {
        $role = Role::findOrFail($id);
        $role->update($data);
        return $role;
    }

    public function deleteRole($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return $role;
    }

    public function changeStatus($id, $status)
    {
        $role = Role::findOrFail($id);
        $role->status = $status;
        $role->save();
        return $role;
    }
}
