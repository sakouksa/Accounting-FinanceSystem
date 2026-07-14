<?php

namespace App\Repositories;

use App\Models\TransactionType;

class TransactionTypeRepository
{
    public function getAll($request)
    {
        $query = TransactionType::query();

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);
            $query->where(function ($q) use ($search) {
                $q->where('code', 'LIKE', "%{$search}%")
                  ->orWhere('name', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $limit = $request->get('limit', 20);
        return $query->orderBy('id', 'desc')->paginate($limit);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'សរុប',
                'value' => TransactionType::count(),
                'color' => '#6366f1',
                'icon' => 'DatabaseOutlined',
            ],
            [
                'title' => 'សកម្ម',
                'value' => TransactionType::where('is_active', 1)->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'មិនសកម្ម',
                'value' => TransactionType::where('is_active', 0)->count(),
                'color' => '#ef4444',
                'icon' => 'CloseCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្មីថ្ងៃនេះ',
                'value' => TransactionType::whereDate('created_at', today())->count(),
                'color' => '#3b82f6',
                'icon' => 'CalendarOutlined',
            ],
        ];
    }

    public function findById($id)
    {
        return TransactionType::findOrFail($id);
    }

    public function createTransactionType(array $data)
    {
        return TransactionType::create($data);
    }

    public function updateTransactionType(array $data, $id)
    {
        $type = TransactionType::findOrFail($id);
        $type->update($data);
        return $type;
    }

    public function deleteTransactionType($id)
    {
        $type = TransactionType::findOrFail($id);
        $type->delete();
        return $type;
    }

    public function changeStatus($id, $isActive)
    {
        $type = TransactionType::findOrFail($id);
        $type->is_active = $isActive;
        $type->save();
        return $type;
    }

    public function bulkDelete(array $ids)
    {
        return TransactionType::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return TransactionType::query()->delete();
    }
}
