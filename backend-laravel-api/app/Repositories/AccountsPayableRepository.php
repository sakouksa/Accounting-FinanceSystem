<?php

namespace App\Repositories;

use App\Models\AccountsPayable;
use Exception;

class AccountsPayableRepository
{
    public function getAll($request)
    {
        $query = AccountsPayable::with('supplier');

        if ($request->filled('txt_search')) {
            $search = $request->txt_search;

            $query->where(function ($q) use ($search) {
                $q->where('bill_no', 'LIKE', "%{$search}%")
                    ->orWhereHas('supplier', function ($sq) use ($search) {
                        $sq->where('supplier_name', 'LIKE', "%{$search}%");
                    });
            });
        }

        if ($request->filled('from_date') && $request->filled('to_date')) {
            $query->whereBetween('bill_date', [
                $request->from_date,
                $request->to_date,
            ]);
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
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
            'total_unpaid' => AccountsPayable::where('status', 'unpaid')->count(),
            'total_partial' => AccountsPayable::where('status', 'partial')->count(),
            'total_paid' => AccountsPayable::where('status', 'paid')->count(),
            'sum_balance' => AccountsPayable::sum('balance_amount'),
        ];
    }

    public function findById($id)
    {
        return AccountsPayable::with('supplier')->findOrFail($id);
    }

    public function createAccountsPayable(array $data)
    {
        return AccountsPayable::create($data);
    }

    public function updateAccountsPayable(array $data, $id)
    {
        $accountsPayable = AccountsPayable::findOrFail($id);
        $accountsPayable->update($data);

        return $accountsPayable;
    }

    public function deleteAccountsPayable($id)
    {
        $accountsPayable = AccountsPayable::findOrFail($id);

        if ($accountsPayable->paid_amount > 0) {
            throw new Exception(
                'មិនអាចលុបវិក្កយបត្រនេះបានទេ ព្រោះវិក្កយបត្រនេះមានទិន្នន័យទូទាត់ប្រាក់រួចខ្លះហើយ។'
            );
        }

        $accountsPayable->delete();

        return $accountsPayable;
    }

    public function changeStatus($id, $status)
    {
        $accountsPayable = AccountsPayable::findOrFail($id);
        $accountsPayable->status = $status;
        $accountsPayable->save();

        return $accountsPayable;
    }

    public function bulkDelete(array $ids)
    {
        return AccountsPayable::whereIn('id', $ids)
            ->where('paid_amount', 0)
            ->delete();
    }

    public function deleteAll()
    {
        return AccountsPayable::where('paid_amount', 0)->delete();
    }
}
