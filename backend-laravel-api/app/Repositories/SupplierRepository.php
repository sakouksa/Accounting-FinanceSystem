<?php

namespace App\Repositories;

use App\Models\Supplier;

class SupplierRepository
{
    public function getAll($request)
    {
        $query = Supplier::query();

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);
            $query->where(function ($q) use ($search) {
                $q->where('supplier_code', 'LIKE', "%{$search}%")
                  ->orWhere('supplier_name', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $limit = $request->get('limit', 10);
        return $query->latest()->paginate($limit);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'អ្នកផ្គត់ផ្គង់សរុប',
                'value' => Supplier::count(),
                'color' => '#6366f1',
                'icon' => 'UserOutlined',
            ],
            [
                'title' => 'សកម្ម',
                'value' => Supplier::where('status', 'active')->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'អសកម្ម',
                'value' => Supplier::where('status', 'inactive')->count(),
                'color' => '#ef4444',
                'icon' => 'CloseCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => Supplier::whereDate('created_at', today())->count(),
                'color' => '#f59e0b',
                'icon' => 'CalendarOutlined',
            ],
        ];
    }

    public function findById($id)
    {
        return Supplier::findOrFail($id);
    }

    public function createSupplier(array $data)
    {
        return Supplier::create($data);
    }

    public function updateSupplier(array $data, $id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->update($data);
        return $supplier;
    }

    public function deleteSupplier($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
        return $supplier;
    }

    public function changeStatus($id, $status)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->status = $status;
        $supplier->save();
        return $supplier;
    }

    public function bulkDelete(array $ids)
    {
        return Supplier::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return Supplier::query()->delete();
    }
}
