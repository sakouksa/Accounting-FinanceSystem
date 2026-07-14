<?php

namespace App\Repositories;

use App\Models\Branch;

class BranchRepository
{
    public function getAll($request)
    {
        $query = Branch::query();

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $limit = $request->get('limit', 10);
        return $query->orderBy('id', 'desc')->paginate($limit);
    }

    public function getStats()
    {
        return [
            [
                "title" => "សាខាសរុប",
                "value" => Branch::count(),
                "color" => "#6366f1",
                "icon" => "ApartmentOutlined"
            ],
            [
                "title" => "សាខាសកម្ម",
                "value" => Branch::where('status', 'active')->count(),
                "color" => "#10b981",
                "icon" => "CheckCircleOutlined"
            ],
            [
                "title" => "សាខាអសកម្ម",
                "value" => Branch::where('status', 'inactive')->count(),
                "color" => "#ef4444",
                "icon" => "CloseCircleOutlined"
            ],
            [
                "title" => "បង្កើតថ្ងៃនេះ",
                "value" => Branch::whereDate('created_at', today())->count(),
                "color" => "#f59e0b",
                "icon" => "CalendarOutlined"
            ]
        ];
    }

    public function findById($id)
    {
        return Branch::findOrFail($id);
    }

    public function createBranch(array $data)
    {
        return Branch::create($data);
    }

    public function updateBranch(array $data, $id)
    {
        $branch = Branch::findOrFail($id);
        $branch->update($data);
        return $branch;
    }

    public function deleteBranch($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();
        return $branch;
    }

    public function changeStatus($id, $status)
    {
        $branch = Branch::findOrFail($id);
        $branch->status = $status;
        $branch->save();
        return $branch;
    }

    public function bulkDelete(array $ids)
    {
        return Branch::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return Branch::query()->delete();
    }
}
