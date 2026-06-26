<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Display a listing of the resource.
    public function index(Request $req)
    {
        $role = Role::query();

        if ($req->filled('txt_search')) {
            $role->where('name', 'LIKE', '%'.$req->input('txt_search').'%');
        }

        if ($req->filled('status')) {
            $role->where('status', '=', $req->input('status'));
        }

        $limit = $req->input('limit', 10);
        $paginated = $role->orderBy('id', 'desc')->paginate($limit);

        return response()->json([
            'list' => $paginated->items(),
            'total' => $paginated->total(),
        ]);
    }

    public function getAllPermissionsList()
    {
        $permissions = \DB::table('permissions')->get();

        return response()->json([
            'list' => $permissions,
        ]);
    }

    public function stats()
    {
        $stats = [
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

        return response()->json([
            'stats' => $stats,
        ]);
    }

    // Store a newly created resource in storage.
    public function store(RoleRequest $request)
    {
        $role = Role::create($request->validated());

        return response()->json([
            'data' => $role,
            'message' => 'បានបង្កើតតួនាទីថ្មីដោយជោគជ័យ',
        ], 200);
    }

    // Display the specified resource.
    public function show(string $id)
    {
        return Role::find($id);
    }

    // Update the specified resource in storage.
    public function update(RoleRequest $request, string $id)
    {
        $role = Role::findOrFail($id);
        $role->update($request->validated());

        return response()->json([
            'data' => $role,
            'message' => 'បានកែប្រែទិន្នន័យដោយជោគជ័យ',
        ]);
    }

    // Remove the specified resource from storage.
    public function destroy(string $id)
    {
        $role = Role::find($id);
        if (! $role) {
            return [
                'error' => false,
                'message' => 'រកមិនឃើញទិន្នន័យឡើយ',
            ];
        } else {
            $role->delete();

            return [
                'data' => $role,
                'message' => 'បានលុបទិន្នន័យដោយជោគជ័យ',
            ];
        }
    }

    public function changeStatus(Request $request, $id)
    {
        $role = Role::find($id);
        if (! $role) {
            return [
                'error' => true,
                'message' => 'រកមិនឃើញតួនាទីឡើយ',
            ];
        } else {
            $role->status = $request->input('status');
            $role->update();

            return [
                'data' => $role,
                'message' => 'ស្ថានភាពត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ',
            ];
        }
    }
}
