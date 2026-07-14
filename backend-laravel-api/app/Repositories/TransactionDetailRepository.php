<?php

namespace App\Repositories;

use App\Models\TransactionDetail;
use App\Models\Transaction;
use App\Models\ChartOfAccount;

class TransactionDetailRepository
{
    public function getAll($request)
    {
        $query = TransactionDetail::query();

        if ($request->filled('transaction_id')) {
            $query->where('transaction_id', $request->transaction_id);
        }

        if ($request->filled('account_id')) {
            $query->where('account_id', $request->account_id);
        }

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('limit', 20);

        return $query->with(['transaction', 'account'])
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'សរុប',
                'value' => TransactionDetail::count(),
                'color' => '#6366f1',
                'icon' => 'DatabaseOutlined',
            ],
            [
                'title' => 'សរុប Debit',
                'value' => TransactionDetail::sum('debit_amount'),
                'color' => '#10b981',
                'icon' => 'ArrowDownOutlined',
            ],
            [
                'title' => 'សរុប Credit',
                'value' => TransactionDetail::sum('credit_amount'),
                'color' => '#f59e0b',
                'icon' => 'ArrowUpOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => TransactionDetail::whereDate('created_at', today())->count(),
                'color' => '#3b82f6',
                'icon' => 'CalendarOutlined',
            ]
        ];
    }

    public function getTransactionsLookup()
    {
        return Transaction::select('id', 'transaction_no')->get();
    }

    public function getAccountsLookup()
    {
        return ChartOfAccount::select('id', 'account_name', 'account_code')->get();
    }

    public function findById($id)
    {
        return TransactionDetail::with(['transaction', 'account'])->findOrFail($id);
    }

    public function createTransactionDetail(array $data)
    {
        return TransactionDetail::create($data);
    }

    public function updateTransactionDetail(array $data, $id)
    {
        $detail = TransactionDetail::findOrFail($id);
        $detail->update($data);
        return $detail;
    }

    public function deleteTransactionDetail($id)
    {
        $detail = TransactionDetail::findOrFail($id);
        $detail->delete();
        return $detail;
    }

    public function bulkDelete(array $ids)
    {
        return TransactionDetail::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return TransactionDetail::query()->delete();
    }
}
