<?php

namespace App\Repositories;

use App\Models\Currency;

class CurrencyRepository
{
    public function getAll($request)
    {
        $query = Currency::query();

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
                "title" => "រូបិយប័ណ្ណសរុប",
                "value" => Currency::count(),
                "color" => "#6366f1",
                "icon" => "DollarOutlined"
            ],
            [
                "title" => "សកម្ម",
                "value" => Currency::where('status', 'active')->count(),
                "color" => "#10b981",
                "icon" => "CheckCircleOutlined"
            ],
            [
                "title" => "អសកម្ម",
                "value" => Currency::where('status', 'inactive')->count(),
                "color" => "#ef4444",
                "icon" => "CloseCircleOutlined"
            ],
            [
                "title" => "បង្កើតថ្ងៃនេះ",
                "value" => Currency::whereDate('created_at', today())->count(),
                "color" => "#f59e0b",
                "icon" => "CalendarOutlined"
            ]
        ];
    }

    public function findById($id)
    {
        return Currency::findOrFail($id);
    }

    public function createCurrency(array $data)
    {
        return Currency::create($data);
    }

    public function updateCurrency(array $data, $id)
    {
        $currency = Currency::findOrFail($id);
        $currency->update($data);
        return $currency;
    }

    public function deleteCurrency($id)
    {
        $currency = Currency::findOrFail($id);
        $currency->delete();
        return $currency;
    }

    public function changeStatus($id, $status)
    {
        $currency = Currency::findOrFail($id);
        $currency->status = $status;
        $currency->save();
        return $currency;
    }

    public function bulkDelete(array $ids)
    {
        return Currency::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return Currency::query()->delete();
    }
}
