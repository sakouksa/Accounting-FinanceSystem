<?php

namespace App\Repositories;

use App\Models\Transaction;
use App\Models\Branch;
use App\Models\TransactionType;

class TransactionRepository
{
    public function getAll($request)
    {
        $query = Transaction::query();

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);
            $query->where(function ($q) use ($search) {
                $q->where('transaction_no', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhereHas('transactionType', function ($qq) use ($search) {
                      $qq->where('name', 'LIKE', "%{$search}%")
                         ->orWhere('code', 'LIKE', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('currency_code')) {
            $query->where('currency_code', $request->currency_code);
        }

        if ($request->filled('transaction_type_id')) {
            $query->where('transaction_type_id', $request->transaction_type_id);
        }

        $perPage = $request->get('limit', 20);

        return $query->with([
            'branch',
            'details',
            'transactionType',
        ])
        ->orderBy('id', 'desc')
        ->paginate($perPage);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'ប្រតិបត្តិការសរុប',
                'value' => Transaction::count(),
                'color' => '#6366f1',
                'icon' => 'DatabaseOutlined',
            ],
            [
                'title' => 'រង់ចាំ',
                'value' => Transaction::where('status', 'Pending')->count(),
                'color' => '#f59e0b',
                'icon' => 'ClockCircleOutlined',
            ],
            [
                'title' => 'អនុម័ត',
                'value' => Transaction::where('status', 'Approved')->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => Transaction::whereDate('created_at', today())->count(),
                'color' => '#3b82f6',
                'icon' => 'CalendarOutlined',
            ],
        ];
    }

    public function getBranchesLookup()
    {
        return Branch::select('id', 'name')->get();
    }

    public function getTransactionTypesLookup()
    {
        return TransactionType::select('id', 'name', 'code')->get();
    }

    public function findById($id)
    {
        return Transaction::with([
            'branch',
            'details',
            'transactionType',
        ])->findOrFail($id);
    }

    public function createTransaction(array $data)
    {
        return Transaction::create($data);
    }

    public function updateTransaction(array $data, $id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->update($data);
        return $transaction;
    }

    public function deleteTransaction($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();
        return $transaction;
    }

    public function bulkDelete(array $ids)
    {
        return Transaction::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return Transaction::query()->delete();
    }
}
