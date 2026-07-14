<?php

namespace App\Repositories;

use App\Models\ChartOfAccount;
use App\Models\AccountType;

class ChartOfAccountRepository
{
    public function getAll($request)
    {
        $query = ChartOfAccount::query();

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);
            $query->where(function ($q) use ($search) {
                $q->where('account_code', 'LIKE', "%{$search}%")
                  ->orWhere('account_name', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('account_type_id')) {
            $query->where('account_type_id', $request->account_type_id);
        }

        if ($request->filled('parent_account_id')) {
            $query->where('parent_account_id', $request->parent_account_id);
        }

        $perPage = $request->get('limit', 20);
        return $query->with(['accountType', 'parent'])
            ->orderBy('account_code', 'asc')
            ->paginate($perPage);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'គណនីសរុប',
                'value' => ChartOfAccount::count(),
                'color' => '#6366f1',
                'icon' => 'AccountBookOutlined',
            ],
            [
                'title' => 'សកម្ម',
                'value' => ChartOfAccount::where('status', 'Active')->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'អសកម្ម',
                'value' => ChartOfAccount::where('status', 'Inactive')->count(),
                'color' => '#ef4444',
                'icon' => 'CloseCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => ChartOfAccount::whereDate('created_at', today())->count(),
                'color' => '#f59e0b',
                'icon' => 'CalendarOutlined',
            ],
        ];
    }

    public function getAccountTypesLookup()
    {
        return AccountType::select('id as account_type_id', 'name', 'code')->get();
    }

    public function getParentAccountsLookup()
    {
        return ChartOfAccount::select('id as parent_account_id', 'account_name')->get();
    }

    public function findById($id)
    {
        return ChartOfAccount::with(['accountType', 'parent'])->findOrFail($id);
    }

    public function createChartOfAccount(array $data)
    {
        return ChartOfAccount::create($data);
    }

    public function updateChartOfAccount(array $data, $id)
    {
        $account = ChartOfAccount::findOrFail($id);
        $account->update($data);
        return $account;
    }

    public function deleteChartOfAccount($id)
    {
        $account = ChartOfAccount::findOrFail($id);
        $account->delete();
        return $account;
    }

    public function changeStatus($id, $status)
    {
        $account = ChartOfAccount::findOrFail($id);
        $account->status = $status;
        $account->save();
        return $account;
    }

    public function bulkDelete(array $ids)
    {
        return ChartOfAccount::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return ChartOfAccount::query()->delete();
    }
}
