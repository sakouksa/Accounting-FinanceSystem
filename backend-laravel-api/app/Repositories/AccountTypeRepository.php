<?php

namespace App\Repositories;

use App\Models\AccountType;

class AccountTypeRepository
{
    public function getAll($request)
    {
        $query = AccountType::query();

        if ($request->filled('id')) {
            $query->where('id', $request->id);
        }

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('code', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $limit = $request->get('limit', 10);
        return $query->orderBy('id', 'desc')->paginate($limit);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'ប្រភេទគណនីសរុប',
                'value' => AccountType::count(),
                'color' => '#6366f1',
                'icon' => 'BankOutlined',
            ],
            [
                'title' => 'Debit',
                'value' => AccountType::where('normal_balance', 'debit')->count(),
                'color' => '#10b981',
                'icon' => 'ArrowDownOutlined',
            ],
            [
                'title' => 'Credit',
                'value' => AccountType::where('normal_balance', 'credit')->count(),
                'color' => '#f59e0b',
                'icon' => 'ArrowUpOutlined',
            ],
            [
                'title' => 'Today',
                'value' => AccountType::whereDate('created_at', today())->count(),
                'color' => '#ef4444',
                'icon' => 'CalendarOutlined',
            ],
        ];
    }

    public function findById($id)
    {
        return AccountType::findOrFail($id);
    }

    public function createAccountType(array $data)
    {
        return AccountType::create($data);
    }

    public function updateAccountType(array $data, $id)
    {
        $accountType = AccountType::findOrFail($id);
        $accountType->update($data);
        return $accountType;
    }

    public function deleteAccountType($id)
    {
        $accountType = AccountType::findOrFail($id);
        $accountType->delete();
        return $accountType;
    }

    public function bulkDelete(array $ids)
    {
        return AccountType::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return AccountType::query()->delete();
    }
}
